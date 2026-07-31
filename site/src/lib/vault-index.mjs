import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

// site/src/lib/vault-index.mjs -> site/src -> site -> vault root
export const VAULT_ROOT = fileURLToPath(new URL("../../../", import.meta.url))

const IGNORE_DIRS = new Set([
  "site",
  ".obsidian",
  ".smart-env",
  ".git",
  ".claude",
  "private",
  "templates",
  "node_modules",
])

const IGNORE_MD_BASENAMES = new Set(["README.md", "CLAUDE.md", "Untitled.md"])

// Folder-blurb files (essays/index.md, essays/dissects/index.md, ...) plus the
// vault's homepage (index.md) — none of these are individually linkable notes.
function isIndexFile(rel) {
  return path.basename(rel) === "index.md"
}

function walk(dir, exts, results) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue
      walk(full, exts, results)
    } else {
      const ext = path.extname(entry.name).slice(1).toLowerCase()
      if (exts.includes(ext)) results.push(path.relative(VAULT_ROOT, full))
    }
  }
}

export function slugify(name) {
  return name
    .toLowerCase()
    .replace(/['’"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function collectionForRel(rel) {
  const segments = rel.split(path.sep)
  if (segments[0] === "essays") return "essays"
  if (segments[0] === "zingers") return "zingers"
  if (segments.length === 1) return "core-theory"
  return null
}

function urlForRel(rel, collection) {
  const segments = rel.split(path.sep)
  const base = path.basename(rel, ".md")
  if (collection === "core-theory") {
    return `/core-theory/${slugify(base)}/`
  }
  if (collection === "zingers") {
    return `/zingers/${slugify(base)}/`
  }
  // essays/<category>/.../<file>.md -> /essays/<category>/.../<slug>/
  const middle = segments.slice(1, -1).map(slugify)
  return `/essays/${[...middle, slugify(base)].join("/")}/`
}

// Obsidian resolves [[wikilinks]] fuzzily against note titles, not just exact
// filenames — e.g. "[[Non-Aggression Principle]]" should hit
// "The Non-aggression Principle.md". Strip a leading "the " and normalize
// curly vs straight quotes/apostrophes so that kind of near-miss still
// resolves; exact matches are still tried first.
function normalizeForFuzzyMatch(s) {
  return s
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/^the\s+/, "")
    .trim()
}

const WIKILINK_TARGET_RE = /(!?)\[\[([^\]|#]+)(?:\|[^\]]+)?\]\]/g

function frontmatterField(raw, field) {
  const fm = raw.match(/^---\n([\s\S]*?)\n---/)?.[1]
  const line = fm?.split("\n").find((l) => l.startsWith(`${field}:`))
  return line?.slice(field.length + 1).trim().replace(/^["']|["']$/g, "")
}

// Plain-text excerpt for link-preview popovers: strip frontmatter and enough
// markdown/wikilink syntax that the result reads like prose, not source.
function makeExcerpt(body) {
  const text = body
    .replace(/!\[\[[^\]]*\]\]/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[\[([^\]|#]+)(?:\|([^\]]+))?\]\]/g, (_m, target, alias) => alias ?? target)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/[*_`>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
  return text.length > 200 ? `${text.slice(0, 200).trimEnd()}…` : text
}

function extractLinkTargets(content) {
  const targets = []
  WIKILINK_TARGET_RE.lastIndex = 0
  let match
  while ((match = WIKILINK_TARGET_RE.exec(content))) {
    if (match[1] === "!") continue // embed (image), not a note-to-note link
    targets.push(match[2].trim())
  }
  return targets
}

function buildIndexes() {
  const mdFiles = []
  walk(VAULT_ROOT, ["md"], mdFiles)

  const notesByKey = new Map() // lowercased filename stem -> entry
  const notesByFuzzyKey = new Map() // normalized (no leading "the ") -> entry
  const notesByRel = new Map() // rel path -> entry

  for (const rel of mdFiles) {
    const basename = path.basename(rel)
    if (IGNORE_MD_BASENAMES.has(basename) || isIndexFile(rel)) continue
    const collection = collectionForRel(rel)
    if (!collection) continue

    const stem = path.basename(rel, ".md")
    const entry = {
      rel,
      title: stem,
      collection,
      url: urlForRel(rel, collection),
    }
    notesByRel.set(rel, entry)
    const key = stem.toLowerCase()
    if (!notesByKey.has(key)) {
      notesByKey.set(key, entry)
    }
    const fuzzyKey = normalizeForFuzzyMatch(stem)
    if (!notesByFuzzyKey.has(fuzzyKey)) {
      notesByFuzzyKey.set(fuzzyKey, entry)
    }
  }

  const imageFiles = []
  walk(VAULT_ROOT, ["png", "jpg", "jpeg", "gif", "svg", "webp"], imageFiles)
  const imagesByBasename = new Map()
  for (const rel of imageFiles) {
    imagesByBasename.set(path.basename(rel).toLowerCase(), rel)
  }

  function resolve(target) {
    return notesByKey.get(target.toLowerCase()) ?? notesByFuzzyKey.get(normalizeForFuzzyMatch(target))
  }

  // Read every note's raw text once here (independent of the remark
  // pipeline's own wikilink pass, which runs in a separate module context
  // during `astro build` and can't share in-memory state with page
  // rendering) so backlinks/graph data is available wherever pages need it.
  const backlinkEdges = new Map() // target url -> Map<from url, {url, title}>
  const linkGraphEdges = [] // {from: {url,title}, to: {url,title}}

  for (const [rel, fromEntry] of notesByRel) {
    const raw = fs.readFileSync(path.join(VAULT_ROOT, rel), "utf8")
    const body = raw.replace(/^---\n[\s\S]*?\n---\n?/, "")
    fromEntry.excerpt = frontmatterField(raw, "description") || makeExcerpt(body)
    for (const target of extractLinkTargets(body)) {
      const toEntry = resolve(target)
      if (!toEntry || toEntry.url === fromEntry.url) continue
      if (!backlinkEdges.has(toEntry.url)) backlinkEdges.set(toEntry.url, new Map())
      backlinkEdges.get(toEntry.url).set(fromEntry.url, { url: fromEntry.url, title: fromEntry.title })
      linkGraphEdges.push({
        from: { url: fromEntry.url, title: fromEntry.title },
        to: { url: toEntry.url, title: toEntry.title },
      })
    }
  }

  const notesByUrl = new Map()
  for (const entry of notesByRel.values()) notesByUrl.set(entry.url, entry)

  // Undirected degree (distinct neighbors, not raw edge count) — used to size
  // graph nodes by how connected they are, the way Obsidian's graph view does.
  const neighborSets = new Map()
  for (const { from, to } of linkGraphEdges) {
    if (!neighborSets.has(from.url)) neighborSets.set(from.url, new Set())
    if (!neighborSets.has(to.url)) neighborSets.set(to.url, new Set())
    neighborSets.get(from.url).add(to.url)
    neighborSets.get(to.url).add(from.url)
  }
  const degreeByUrl = new Map(Array.from(neighborSets, ([url, set]) => [url, set.size]))

  return {
    notesByKey,
    notesByFuzzyKey,
    notesByRel,
    notesByUrl,
    imagesByBasename,
    resolve,
    backlinkEdges,
    linkGraphEdges,
    degreeByUrl,
  }
}

const index = buildIndexes()
export const {
  notesByKey,
  notesByFuzzyKey,
  notesByRel,
  notesByUrl,
  imagesByBasename,
  backlinkEdges,
  linkGraphEdges,
  degreeByUrl,
} = index

export function resolveNote(target) {
  return index.resolve(target)
}

export function getBacklinks(url) {
  const m = backlinkEdges.get(url)
  return m ? Array.from(m.values()) : []
}

export function entryForFilePath(absPath) {
  const rel = path.relative(VAULT_ROOT, absPath)
  return notesByRel.get(rel)
}

function toNode(url, title, self) {
  return {
    id: url,
    title,
    self,
    collection: notesByUrl.get(url)?.collection,
    degree: degreeByUrl.get(url) ?? 0,
  }
}

export function getLocalGraph(url, title) {
  const nodeMap = new Map()
  nodeMap.set(url, toNode(url, title, true))
  const edges = []
  for (const edge of linkGraphEdges) {
    if (edge.from.url === url) {
      if (!nodeMap.has(edge.to.url)) nodeMap.set(edge.to.url, toNode(edge.to.url, edge.to.title, false))
      edges.push({ source: url, target: edge.to.url })
    } else if (edge.to.url === url) {
      if (!nodeMap.has(edge.from.url)) nodeMap.set(edge.from.url, toNode(edge.from.url, edge.from.title, false))
      edges.push({ source: edge.from.url, target: url })
    }
  }
  return { nodes: Array.from(nodeMap.values()), edges }
}

export function getGlobalGraph() {
  const nodeMap = new Map()
  const edges = []
  for (const edge of linkGraphEdges) {
    if (!nodeMap.has(edge.from.url)) nodeMap.set(edge.from.url, toNode(edge.from.url, edge.from.title, false))
    if (!nodeMap.has(edge.to.url)) nodeMap.set(edge.to.url, toNode(edge.to.url, edge.to.title, false))
    edges.push({ source: edge.from.url, target: edge.to.url })
  }
  return { nodes: Array.from(nodeMap.values()), edges }
}
