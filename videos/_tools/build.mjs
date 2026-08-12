#!/usr/bin/env node
// Derives every downstream pre-production artifact from a single source of
// truth: <video>/02-script.md.
//
//   node videos/_tools/build.mjs videos/<slug> [options]
//
// Outputs (all regenerated from scratch, safe to delete):
//   03-shot-list.md        human-readable shot list, grouped by chapter
//   build/script.vo.txt    narration only, markers stripped — the mic read
//   build/shots.csv        one row per visual cue
//   build/markers.edl      DaVinci Resolve marker import
//   build/chapters.txt     YouTube chapter block, validated
//   briefs/<ID>.md         stub brief for any MGFX/CHART cue that lacks one
//
// Timecodes: before the VO exists there is no real clock, so positions are
// estimated from cumulative word count at --wpm. Expect drift past ~10 min.
// Once the VO is on the timeline, write the real chapter in-points into
// build/timings.csv and re-run with --from-timings for exact markers.

import fs from "node:fs"
import path from "node:path"

// ---------------------------------------------------------------------------
// Marker taxonomy
// ---------------------------------------------------------------------------

// Cues that become a row in the shot list. `track` is the Resolve video track
// the cue lands on (see references/resolve-free.md for the layout).
// `needsSource` marks cues that pull in material from outside the project —
// those are the ones that can be unsourced. A motion graphic or a text card is
// authored from the script itself, so it has nothing to cite; a chart does,
// because its numbers are a claim.
const VISUAL_CUES = {
  MGFX: { track: "V4", brief: true, needsSource: false, color: "ResolveColorPurple" },
  CHART: { track: "V4", brief: true, needsSource: true, color: "ResolveColorPurple" },
  TEXT: { track: "V4", brief: false, needsSource: false, color: "ResolveColorPurple" },
  BROLL: { track: "V2", brief: false, needsSource: true, color: "ResolveColorYellow" },
  STILL: { track: "V2", brief: false, needsSource: true, color: "ResolveColorYellow" },
  SCREEN: { track: "V3", brief: false, needsSource: true, color: "ResolveColorYellow" },
}

const AUDIO_CUES = {
  SFX: { track: "A3" },
  MUSIC: { track: "A2" },
}

// Annotations: they shape the edit but are not shots.
//   HOLD     — visual-only silence; the only marker that advances the clock
//   SRC      — citation backing the claim above it (argument-audit hook)
//   BEAT     — pacing / open-loop note
//   CALLBACK — pays off an earlier loop
//   INTERRUPT— pattern interrupt, every 60–90s
//   NOTE     — anything else
const ANNOTATIONS = new Set(["HOLD", "SRC", "BEAT", "CALLBACK", "INTERRUPT", "NOTE"])

const ALL_TYPES = new Set([
  ...Object.keys(VISUAL_CUES),
  ...Object.keys(AUDIO_CUES),
  ...ANNOTATIONS,
])

const CHAPTER_COLOR = "ResolveColorCyan"
const UNSOURCED_COLOR = "ResolveColorRed"

// A claim with a number in it that no [SRC:] backs up. Deliberately narrow —
// a noisy check gets ignored, and an ignored check is worse than no check.
const NUMERIC_CLAIM =
  /\d[\d,._]*\s*(%|percent|million|billion|trillion|bn\b|tn\b)|\b(19|20)\d{2}\b/i

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const opts = {
    dir: null,
    wpm: 150,
    fps: 30,
    tcStart: "01:00:00:00",
    fromTimings: false,
    assignIds: false,
    clean: false,
  }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--wpm") opts.wpm = Number(argv[++i])
    else if (a === "--fps") opts.fps = Number(argv[++i])
    else if (a === "--tc-start") opts.tcStart = argv[++i]
    else if (a === "--from-timings") opts.fromTimings = true
    else if (a === "--assign-ids") opts.assignIds = true
    else if (a === "--clean") opts.clean = true
    else if (a === "--estimate") opts.fromTimings = false
    else if (a.startsWith("--")) die(`unknown option: ${a}`)
    else if (!opts.dir) opts.dir = a
    else die(`unexpected argument: ${a}`)
  }
  if (!opts.dir) die("usage: node videos/_tools/build.mjs videos/<slug> [--wpm 150] [--fps 30] [--from-timings] [--assign-ids] [--clean]")
  if (!Number.isFinite(opts.wpm) || opts.wpm <= 0) die("--wpm must be a positive number")
  if (!Number.isFinite(opts.fps) || opts.fps <= 0) die("--fps must be a positive number")
  return opts
}

function die(msg) {
  console.error(`error: ${msg}`)
  process.exit(1)
}

const warnings = []
function warn(msg) {
  warnings.push(msg)
}

// ---------------------------------------------------------------------------
// Parse
// ---------------------------------------------------------------------------

// Returns a flat, ordered block list. Order is everything: a cue's position in
// the file is what places it on the timeline.
function parseScript(text) {
  const blocks = []
  const lines = text.split(/\r?\n/)

  let i = 0
  // Skip YAML frontmatter if present.
  if (lines[0]?.trim() === "---") {
    i = 1
    while (i < lines.length && lines[i].trim() !== "---") i++
    i++
  }

  // HTML comments carry instructions to the writer, not words to be spoken.
  // Tracked line by line rather than stripped from the whole string so that
  // reported line numbers still point at the real file.
  let inComment = false

  for (; i < lines.length; i++) {
    const raw = lines[i]
    const line = raw.trim()
    const lineNo = i + 1

    if (inComment) {
      if (line.includes("-->")) inComment = false
      continue
    }
    if (line.startsWith("<!--")) {
      if (!line.includes("-->")) inComment = true
      continue
    }

    if (!line) continue

    // Horizontal rules are visual separators in the markdown, not narration.
    if (/^([-*_])\1{2,}$/.test(line.replace(/\s/g, ""))) continue

    // Chapter heading: `## CH03 — The Calculation Problem` / `## HOOK — ...`
    const heading = line.match(/^##\s+(.*)$/)
    if (heading) {
      const body = heading[1].trim()
      // Split on em dash, en dash, or " - ". Everything before is the id.
      const split = body.match(/^(\S+)\s*[—–-]\s*(.+)$/)
      const id = split ? split[1] : body
      const title = split ? split[2].trim() : body
      blocks.push({ kind: "chapter", id, title, lineNo })
      continue
    }

    // Deeper headings are structural notes inside a chapter — not chapters.
    if (/^#{1,6}\s/.test(line)) continue

    // Marker: a line that is entirely one bracketed cue.
    if (line.startsWith("[") && line.endsWith("]")) {
      const inner = line.slice(1, -1)
      const colon = inner.indexOf(":")
      const type = (colon === -1 ? inner : inner.slice(0, colon)).trim().toUpperCase()
      const rest = colon === -1 ? "" : inner.slice(colon + 1).trim()
      if (!ALL_TYPES.has(type)) {
        warn(`line ${lineNo}: unknown marker type "${type}" — treated as narration`)
        blocks.push({ kind: "vo", text: raw, lineNo })
        continue
      }
      blocks.push({ kind: "marker", type, fields: splitFields(rest), raw: line, lineNo })
      continue
    }

    // Anything that smells like a marker but is malformed is worth flagging —
    // a stray bracket silently becomes narration and gets read aloud.
    if (line.startsWith("[") && /^\[\s*[A-Z]{3,9}\s*:/.test(line)) {
      warn(`line ${lineNo}: looks like a marker but does not close on the same line — treated as narration`)
    }

    blocks.push({ kind: "vo", text: raw, lineNo })
  }

  return blocks
}

function splitFields(rest) {
  return rest
    .split("|")
    .map((f) => f.trim())
    .filter(Boolean)
}

function countWords(text) {
  // Strip markdown emphasis and wikilink pipes so `[[X|y]]` counts as one word.
  const cleaned = text
    .replace(/\[\[([^\]]*)\]\]/g, (_, inner) => inner.split("|").pop())
    .replace(/[*_`]/g, "")
  const m = cleaned.match(/\S+/g)
  return m ? m.length : 0
}

// ---------------------------------------------------------------------------
// Interpret fields
// ---------------------------------------------------------------------------

// Field order is free-form on purpose — `6s`, `src:...`, `license:...` and an
// explicit ID are all self-identifying, so the first unclaimed field is the
// description regardless of where it sits.
function interpretCue(type, fields) {
  const out = { id: null, subtype: null, description: "", duration: null, source: "", license: "" }
  const leftovers = []

  for (const f of fields) {
    let m
    if ((m = f.match(/^(\d+(?:\.\d+)?)\s*s$/i))) out.duration = Number(m[1])
    else if ((m = f.match(/^src\s*:\s*(.*)$/i))) out.source = m[1].trim()
    else if ((m = f.match(/^license\s*:\s*(.*)$/i))) out.license = m[1].trim()
    else if ((m = f.match(/^(MGFX|CHART|BROLL|SCREEN|STILL|TEXT)-[\w-]+$/i))) out.id = m[0].toUpperCase()
    else leftovers.push(f)
  }

  // BROLL/STILL/SCREEN take an optional leading subtype (archival, stock, ...).
  if ((type === "BROLL" || type === "STILL") && leftovers.length > 1) {
    out.subtype = leftovers.shift()
  }
  out.description = leftovers.join(" — ")
  return out
}

// ---------------------------------------------------------------------------
// Timecode
// ---------------------------------------------------------------------------

function tcToSeconds(tc, fps) {
  const m = String(tc).trim().match(/^(\d+):(\d{2}):(\d{2})[:;](\d{1,3})$/)
  if (!m) die(`bad timecode "${tc}" — expected HH:MM:SS:FF`)
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) + Number(m[4]) / fps
}

function secondsToTc(sec, fps) {
  let frames = Math.round(sec * fps)
  const fph = Math.round(fps) * 3600
  const fpm = Math.round(fps) * 60
  const h = Math.floor(frames / fph)
  frames -= h * fph
  const m = Math.floor(frames / fpm)
  frames -= m * fpm
  const s = Math.floor(frames / Math.round(fps))
  const f = frames - s * Math.round(fps)
  const p = (n, w = 2) => String(n).padStart(w, "0")
  return `${p(h)}:${p(m)}:${p(s)}:${p(f)}`
}

function secondsToYouTube(sec) {
  // Floor, not round: a chapter stamp must never land past the start of its
  // own content. The epsilon absorbs float noise from accumulated word-count
  // division, which otherwise shows 217.9999999 as 03:37 while the frame-exact
  // timecode for the same cue reads 03:38.
  const total = Math.floor(sec + 1e-6)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const p = (n) => String(n).padStart(2, "0")
  // YouTube requires the very first stamp to read exactly 00:00.
  if (h > 0) return `${h}:${p(m)}:${p(s)}`
  return `${p(m)}:${p(s)}`
}

// Walks the blocks assigning each an offset in seconds. Narration drives the
// clock at --wpm; [HOLD: Ns] adds silence on top.
function estimateOffsets(blocks, wpm) {
  // The video starts at the first chapter heading. Anything above it is
  // preamble — a note to self, a stray line — and must not push the clock,
  // or every marker in the video lands late by however long it is.
  const start = blocks.findIndex((b) => b.kind === "chapter")
  const strays = blocks.slice(0, start).filter((b) => b.kind === "vo")
  if (strays.length) {
    warn(
      `${strays.length} line(s) of narration sit above the first chapter heading (line ${strays[0].lineNo}) — ` +
        `excluded from the clock. Put them under a chapter or delete them.`,
    )
  }

  let seconds = 0
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i]
    if (i < start) {
      b.offset = 0
      continue
    }
    b.offset = seconds
    if (b.kind === "vo") {
      seconds += (countWords(b.text) / wpm) * 60
    } else if (b.kind === "marker" && b.type === "HOLD") {
      const { duration } = interpretCue("HOLD", b.fields)
      seconds += duration ?? 2
    }
  }
  return seconds
}

// Replaces estimated offsets with measured ones. Chapters that were measured
// get their exact value; everything between two measured chapters is stretched
// proportionally, so cues keep their relative spacing against the real
// narration instead of drifting off the end.
function applyTimings(blocks, timingsPath, fps, tcStart) {
  const rows = readCsv(fs.readFileSync(timingsPath, "utf8"))
  const written = new Map()
  for (const r of rows) {
    const id = (r.chapter ?? r.id ?? "").trim()
    const tc = (r.timecode ?? r.tc ?? r.start ?? "").trim()
    if (id && tc) written.set(id, tcToSeconds(tc, fps))
  }
  if (!written.size) die(`${timingsPath} has no usable rows — expected columns: chapter,timecode`)

  const chapters = blocks.filter((b) => b.kind === "chapter")

  // Timecodes read off a Resolve timeline are absolute and start at --tc-start
  // (1 hour by default), but someone may equally write video-relative ones.
  // Detect which by whether the earliest value sits at or past the start.
  const base = tcToSeconds(tcStart, fps)
  const earliest = Math.min(...written.values())
  const absolute = earliest >= base
  const measured = new Map(
    [...written].map(([id, sec]) => [id, absolute ? sec - base : sec]),
  )
  console.log(
    `  timings.csv read as ${absolute ? `timeline timecodes (minus ${tcStart})` : "video-relative timecodes"}`,
  )

  const unknown = [...measured.keys()].filter((id) => !chapters.some((c) => c.id === id))
  if (unknown.length) warn(`timings.csv names chapters not in the script: ${unknown.join(", ")}`)
  const missing = chapters.filter((c) => !measured.has(c.id)).map((c) => c.id)
  if (missing.length) warn(`timings.csv is missing chapters: ${missing.join(", ")} — those are interpolated`)

  // Anchors: chapters with a real measurement, in script order.
  const anchors = chapters
    .filter((c) => measured.has(c.id))
    .map((c) => ({ est: c.offset, real: measured.get(c.id) }))
  if (!anchors.length) die("timings.csv matched none of the script's chapter ids")

  for (const b of blocks) {
    b.offset = remap(b.offset, anchors)
  }
  // A measured chapter is exact by definition — never interpolated.
  for (const c of chapters) {
    if (measured.has(c.id)) c.offset = measured.get(c.id)
  }
}

function remap(est, anchors) {
  const first = anchors[0]
  const last = anchors[anchors.length - 1]
  // Strict comparisons: when two chapters share an estimated offset (an empty
  // chapter), an inclusive test here would grab every later cue and dump it at
  // the final anchor. Equality belongs to the span loop below.
  if (est < first.est || anchors.length === 1) return first.real + (est - first.est)
  if (est > last.est) return last.real + (est - last.est)
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i]
    const b = anchors[i + 1]
    if (est >= a.est && est <= b.est) {
      const estSpan = b.est - a.est
      // Zero-length in estimate space (an empty chapter) has no ratio to scale
      // by — pin to the anchor rather than dividing by zero.
      if (estSpan <= 0) return a.real
      return a.real + ((est - a.est) / estSpan) * (b.real - a.real)
    }
  }
  return est
}

function readCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim())
  if (!lines.length) return []
  const header = splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase())
  return lines.slice(1).map((l) => {
    const cells = splitCsvLine(l)
    return Object.fromEntries(header.map((h, i) => [h, cells[i] ?? ""]))
  })
}

function splitCsvLine(line) {
  const out = []
  let cur = ""
  let quoted = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (quoted) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++ }
      else if (c === '"') quoted = false
      else cur += c
    } else if (c === '"') quoted = true
    else if (c === ",") { out.push(cur); cur = "" }
    else cur += c
  }
  out.push(cur)
  return out
}

function csvCell(v) {
  const s = String(v ?? "")
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

function main() {
  const opts = parseArgs(process.argv.slice(2))
  const dir = path.resolve(opts.dir)
  const scriptPath = path.join(dir, "02-script.md")
  if (!fs.existsSync(scriptPath)) die(`no 02-script.md in ${opts.dir}`)

  const source = fs.readFileSync(scriptPath, "utf8")
  const blocks = parseScript(source)

  const chapters = blocks.filter((b) => b.kind === "chapter")
  if (!chapters.length) die("no chapters found — 02-script.md needs at least one `## CH01 — Title` heading")

  // --- assign IDs to brief-bearing cues -----------------------------------
  const counters = {}
  const rewrites = []
  for (const b of blocks) {
    if (b.kind !== "marker") continue
    const spec = VISUAL_CUES[b.type]
    if (!spec?.brief) continue
    const cue = interpretCue(b.type, b.fields)
    if (!cue.id) {
      counters[b.type] = (counters[b.type] ?? 0) + 1
      const id = `${b.type}-${String(counters[b.type]).padStart(3, "0")}`
      b.assignedId = id
      rewrites.push({ lineNo: b.lineNo, type: b.type, id })
    } else {
      const n = Number(cue.id.split("-").pop())
      if (Number.isFinite(n)) counters[b.type] = Math.max(counters[b.type] ?? 0, n)
    }
  }

  if (rewrites.length && opts.assignIds) {
    const lines = source.split(/\r?\n/)
    for (const r of rewrites) {
      const idx = r.lineNo - 1
      lines[idx] = lines[idx].replace(
        new RegExp(`^(\\s*\\[${r.type}\\s*:\\s*)`, "i"),
        `$1${r.id} | `,
      )
    }
    fs.writeFileSync(scriptPath, lines.join("\n"))
    console.log(`assigned ${rewrites.length} cue id(s) into 02-script.md — re-run without --assign-ids`)
    return
  }
  if (rewrites.length) {
    warn(
      `${rewrites.length} MGFX/CHART cue(s) have no id; provisional ids assigned in output only. ` +
        `Run with --assign-ids to write them into the script so briefs stay stable.`,
    )
  }

  // --- clock ---------------------------------------------------------------
  const estimatedTotal = estimateOffsets(blocks, opts.wpm)
  let total = estimatedTotal
  let timingSource = `estimated at ${opts.wpm} wpm`
  if (opts.fromTimings) {
    const timingsPath = path.join(dir, "build", "timings.csv")
    if (!fs.existsSync(timingsPath)) {
      die(`--from-timings needs ${path.relative(process.cwd(), timingsPath)} with columns: chapter,timecode`)
    }
    applyTimings(blocks, timingsPath, opts.fps, opts.tcStart)
    total = Math.max(...blocks.map((b) => b.offset), 0)
    timingSource = "measured from build/timings.csv"
  }

  // --- collect cues --------------------------------------------------------
  let currentChapter = null
  let lastVo = ""
  const cues = []
  const chapterStats = new Map()

  for (const b of blocks) {
    if (b.kind === "chapter") {
      currentChapter = b
      lastVo = ""
      chapterStats.set(b.id, { srcs: 0, numericClaims: 0, words: 0, cues: 0 })
      continue
    }
    const stats = currentChapter ? chapterStats.get(currentChapter.id) : null

    if (b.kind === "vo") {
      lastVo = b.text.trim()
      if (stats) {
        stats.words += countWords(b.text)
        if (NUMERIC_CLAIM.test(b.text)) stats.numericClaims++
      }
      continue
    }

    if (b.type === "SRC" && stats) stats.srcs++

    const spec = VISUAL_CUES[b.type] ?? AUDIO_CUES[b.type]
    if (!spec) continue

    const cue = interpretCue(b.type, b.fields)
    const id =
      cue.id ??
      b.assignedId ??
      `${b.type}-${currentChapter?.id ?? "XX"}-${String((stats ? ++stats.cues : cues.length + 1)).padStart(2, "0")}`
    if (stats && (cue.id || b.assignedId)) stats.cues++

    cues.push({
      id,
      chapter: currentChapter?.id ?? "",
      chapterTitle: currentChapter?.title ?? "",
      type: b.type,
      subtype: cue.subtype ?? "",
      anchor: anchorOf(lastVo),
      description: cue.description,
      duration: cue.duration,
      source: cue.source,
      license: cue.license,
      track: spec.track,
      color: VISUAL_CUES[b.type]?.color ?? null,
      offset: b.offset,
      needsBrief: Boolean(VISUAL_CUES[b.type]?.brief),
      needsSource: Boolean(VISUAL_CUES[b.type]?.needsSource),
      lineNo: b.lineNo,
    })
  }

  // --- write ---------------------------------------------------------------
  const buildDir = path.join(dir, "build")
  fs.mkdirSync(buildDir, { recursive: true })

  writeVo(path.join(buildDir, "script.vo.txt"), blocks, opts.clean)
  writeShotsCsv(path.join(buildDir, "shots.csv"), cues, opts.fps)
  writeMarkersEdl(path.join(buildDir, "markers.edl"), chapters, cues, opts)
  const chapterList = writeChapters(path.join(buildDir, "chapters.txt"), chapters, total)
  writeShotList(path.join(dir, "03-shot-list.md"), cues, chapters, total, timingSource, opts)
  const stubbed = writeBriefStubs(path.join(dir, "briefs"), cues)

  // --- report --------------------------------------------------------------
  const words = blocks.filter((b) => b.kind === "vo").reduce((n, b) => n + countWords(b.text), 0)
  console.log(`${path.basename(dir)}`)
  console.log(`  ${chapters.length} chapters · ${cues.length} cues · ${words} words`)
  console.log(`  runtime ${fmtMinutes(total)} (${timingSource})`)
  if (stubbed.length) console.log(`  created ${stubbed.length} brief stub(s): ${stubbed.join(", ")}`)

  const tbd = cues.filter(isUnsourced)
  const noLicense = cues.filter(
    (c) => (c.type === "BROLL" || c.type === "STILL") && (!c.license || /^tbd$/i.test(c.license)),
  )
  if (tbd.length) warn(`${tbd.length} cue(s) have no source: ${tbd.slice(0, 6).map((c) => c.id).join(", ")}${tbd.length > 6 ? ", …" : ""}`)
  if (noLicense.length) warn(`${noLicense.length} footage cue(s) have no license: ${noLicense.map((c) => c.id).join(", ")}`)

  for (const [id, s] of chapterStats) {
    if (s.numericClaims > 0 && s.srcs === 0) {
      warn(`chapter ${id} makes ${s.numericClaims} numeric claim(s) with no [SRC:] anywhere in it`)
    }
  }

  const orphans = findOrphanBriefs(path.join(dir, "briefs"), cues)
  if (orphans.length) warn(`brief file(s) with no matching cue (cut from the script?): ${orphans.join(", ")}`)

  validateChapters(chapterList)

  if (warnings.length) {
    console.log("")
    for (const w of warnings) console.log(`  warn: ${w}`)
  }
}

// Only cues that pull in outside material can be unsourced. TBD counts as
// missing — a placeholder is a promise, not a source.
function isUnsourced(c) {
  return c.needsSource && (!c.source || /^tbd$/i.test(c.source))
}

function anchorOf(vo) {
  if (!vo) return "(chapter start)"
  const cleaned = vo
    .replace(/\[\[([^\]]*)\]\]/g, (_, inner) => inner.split("|").pop())
    .replace(/[*_`>]/g, "")
    .trim()
  const words = cleaned.split(/\s+/).filter(Boolean).slice(0, 8)
  return words.join(" ") + (cleaned.split(/\s+/).length > 8 ? "…" : "")
}

function fmtMinutes(sec) {
  const m = Math.floor(sec / 60)
  const s = Math.round(sec % 60)
  return `${m}m ${String(s).padStart(2, "0")}s`
}

// ---------------------------------------------------------------------------
// Emitters
// ---------------------------------------------------------------------------

// The file you actually read at the mic. Markers are gone so your eye can't
// trip on them; chapter rules stay because you record chapter by chapter.
function writeVo(file, blocks, clean) {
  const out = []
  for (const b of blocks) {
    if (b.kind === "chapter") {
      if (clean) continue
      if (out.length) out.push("")
      out.push(`———— ${b.id}: ${b.title} ————`, "")
    } else if (b.kind === "vo") {
      out.push(b.text.trimEnd())
    }
    // markers dropped entirely
  }
  fs.writeFileSync(file, out.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n")
}

function writeShotsCsv(file, cues, fps) {
  const header = [
    "id", "chapter", "chapter_title", "type", "subtype", "timecode", "offset_s",
    "script_anchor", "description", "duration_s", "source", "license",
    "resolve_track", "status",
  ]
  const rows = cues.map((c) =>
    [
      c.id, c.chapter, c.chapterTitle, c.type, c.subtype,
      secondsToTc(c.offset, fps), c.offset.toFixed(1),
      c.anchor, c.description, c.duration ?? "", c.source, c.license,
      c.track, isUnsourced(c) ? "todo" : c.needsBrief ? "brief" : "ready",
    ].map(csvCell).join(","),
  )
  fs.writeFileSync(file, [header.join(","), ...rows].join("\n") + "\n")
}

// CMX3600-style EDL carrying only markers. Resolve reads the |C:/|M:/|D:
// comment triple: colour, name, duration in frames.
function writeMarkersEdl(file, chapters, cues, opts) {
  const { fps, tcStart } = opts
  const base = tcToSeconds(tcStart, fps)
  const events = []

  for (const ch of chapters) {
    events.push({ offset: ch.offset, color: CHAPTER_COLOR, name: `${ch.id} — ${ch.title}`, frames: 1 })
  }
  for (const c of cues) {
    if (!c.color) continue
    const label = [c.id, c.description || c.subtype].filter(Boolean).join(" — ")
    events.push({
      offset: c.offset,
      color: isUnsourced(c) ? UNSOURCED_COLOR : c.color,
      name: label,
      frames: Math.max(1, Math.round((c.duration ?? 1) * fps)),
    })
  }

  events.sort((a, b) => a.offset - b.offset)

  const lines = ["TITLE: MARKERS", "FCM: NON-DROP FRAME", ""]
  events.forEach((e, i) => {
    const inTc = secondsToTc(base + e.offset, fps)
    const outTc = secondsToTc(base + e.offset + 1 / fps, fps)
    const n = String(i + 1).padStart(3, "0")
    lines.push(`${n}  001      V     C        ${inTc} ${outTc} ${inTc} ${outTc}`)
    // Pipes and newlines would break the comment parse.
    lines.push(`  |C:${e.color} |M:${e.name.replace(/[|\r\n]/g, " ").trim()} |D:${e.frames}`)
    lines.push("")
  })

  fs.writeFileSync(file, lines.join("\n"))
}

function writeChapters(file, chapters, total) {
  const list = chapters.map((c, i) => ({
    id: c.id,
    title: c.title,
    start: i === 0 ? 0 : c.offset,
    end: chapters[i + 1] ? chapters[i + 1].offset : total,
  }))
  const body = list.map((c) => `${secondsToYouTube(c.start)} ${c.title}`).join("\n")
  fs.writeFileSync(file, body + "\n")
  return list
}

// YouTube silently downgrades a malformed block to plain text — no chapters,
// no error. Fail loudly here instead.
function validateChapters(list) {
  const problems = []
  if (list.length < 3) problems.push(`only ${list.length} chapter(s) — YouTube requires at least 3`)
  if (secondsToYouTube(list[0].start) !== "00:00") problems.push("first chapter does not start at 00:00")
  for (let i = 1; i < list.length; i++) {
    if (list[i].start <= list[i - 1].start) problems.push(`${list[i].id} is not after ${list[i - 1].id}`)
  }
  for (const c of list) {
    const len = c.end - c.start
    if (Number.isFinite(len) && len < 10) {
      problems.push(`${c.id} runs ${len.toFixed(1)}s — YouTube requires at least 10s per chapter`)
    }
  }
  if (problems.length) {
    console.log("")
    console.log("  chapters.txt FAILS YouTube validation:")
    for (const p of problems) console.log(`    ✗ ${p}`)
    console.log("    Pasting it as-is gives you plain text, not chapter markers.")
  }
}

function writeShotList(file, cues, chapters, total, timingSource, opts) {
  const out = []
  out.push("<!-- GENERATED by videos/_tools/build.mjs — edit 02-script.md, not this file. -->")
  out.push("")
  out.push(
    `${chapters.length} chapters · ${cues.length} cues · runtime ${fmtMinutes(total)} (${timingSource}) · ${opts.fps}fps`,
  )
  out.push("")

  for (const ch of chapters) {
    const inChapter = cues.filter((c) => c.chapter === ch.id)
    out.push(`## ${ch.id} — ${ch.title}`)
    out.push("")
    out.push(`Starts ${secondsToYouTube(ch.offset)} · ${inChapter.length} cue(s)`)
    out.push("")
    if (!inChapter.length) {
      out.push("_No visual cues. For faceless narration that means a stretch of nothing on screen — intentional, or an oversight?_")
      out.push("")
      continue
    }
    out.push("| ID | TC | Type | Track | On screen | Dur | Source | Status |")
    out.push("| --- | --- | --- | --- | --- | --- | --- | --- |")
    for (const c of inChapter) {
      const status = isUnsourced(c) ? "**todo**" : c.needsBrief ? "brief" : "ready"
      const desc = [c.subtype, c.description].filter(Boolean).join(": ")
      const src = c.needsSource ? escapeCell(c.source || "TBD") : "—"
      out.push(
        `| \`${c.id}\` | ${secondsToYouTube(c.offset)} | ${c.type} | ${c.track} | ${escapeCell(desc)} | ${c.duration ? c.duration + "s" : "—"} | ${src} | ${status} |`,
      )
    }
    out.push("")
  }

  const briefs = cues.filter((c) => c.needsBrief)
  if (briefs.length) {
    out.push("## Briefs to fill")
    out.push("")
    for (const c of briefs) out.push(`- [ ] \`briefs/${c.id}.md\` — ${c.description || "(no description)"}`)
    out.push("")
  }

  fs.writeFileSync(file, out.join("\n"))
}

function escapeCell(s) {
  return String(s ?? "").replace(/\|/g, "\\|")
}

function writeBriefStubs(briefsDir, cues) {
  const wanted = cues.filter((c) => c.needsBrief)
  if (!wanted.length) return []
  fs.mkdirSync(briefsDir, { recursive: true })
  const created = []
  for (const c of wanted) {
    const file = path.join(briefsDir, `${c.id}.md`)
    if (fs.existsSync(file)) continue
    fs.writeFileSync(file, briefStub(c))
    created.push(`${c.id}.md`)
  }
  return created
}

// A brief has to work for a reader with zero conversation context — a
// different agent weeks from now, or an illustrator who has never seen the
// script. Everything it needs is in the file.
function briefStub(c) {
  return `---
id: ${c.id}
chapter: ${c.chapter}
type: ${c.type.toLowerCase()}
duration_s: ${c.duration ?? "TBD"}
status: todo
---

## Where it sits

Chapter ${c.chapter}${c.chapterTitle ? ` — ${c.chapterTitle}` : ""}, under the line:

> ${c.anchor || "TBD"}

## Message

<!-- ONE sentence. What must the viewer understand after this shot? Not what
     is on screen — what lands. If you can't write it in one sentence, the cue
     is doing two jobs and should be two cues. -->

${c.description || "TBD"}

## Spec

- **Format**: 1920×1080, transparent background (PNG sequence or ProRes 4444)
- **Duration**: ${c.duration ?? "TBD"}s
- **Style**: <!-- flat vector / 2-colour / thin line weight / etc. -->
- **On-screen text**: <!-- verbatim, including punctuation — or "none" -->
- **Motion**: <!-- how elements enter, hold, and leave; easing; timing -->

## References

<!-- A reference is worthless unless you name WHAT about it you want.
     "Like this video" bounces back. "The type animation at 0:14, but slower"
     does not. One line each: url — the specific element to take. -->

-

## Avoid

<!-- Failure modes worth naming up front: stock-icon look, drop shadows,
     gratuitous 3D, anything that reads as a corporate explainer. -->

-

## Data

<!-- CHART only: the actual numbers, and where they came from. A chart with no
     cited series is an unsourced claim wearing a costume. -->
`
}

function findOrphanBriefs(briefsDir, cues) {
  if (!fs.existsSync(briefsDir)) return []
  const ids = new Set(cues.map((c) => c.id))
  return fs
    .readdirSync(briefsDir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .filter((f) => !ids.has(path.basename(f, ".md")))
}

main()
