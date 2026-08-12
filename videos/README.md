Pre-production for video. One folder per video. Not published to the site.

This file is written for whoever opens this folder cold — including an AI agent
with no memory of the conversation that created it. Everything needed to pick up
a half-finished video is either here or in that video's own folder.

## What this bin is

The vault's other bins are things to **read**: Core Theory states doctrine,
`essays/` argues positions, `essays/dissects/` rebuts specific claims,
`zingers/` lands single lines. This bin is not writing meant to be read — it is
the blueprint for something to be **watched**, and every file in it exists to
get a video into DaVinci Resolve with nothing left to figure out.

Nothing here reaches the published site. `videos` is in the `IGNORE_DIRS` set in
`site/scripts/copy-assets.mjs`, `site/src/lib/vault-index.mjs`, and
`site/src/lib/canvas.mjs` — the first of those is load-bearing, because without
it every raw `.md` in the vault gets copied to a publicly-fetchable
`/vault-notes/` URL whether or not a page route exists. It is also in
`.dockerignore`. Drafts, unsourced claims, and half-argued scripts stay private.

`[[Wikilinks]]` written in here still resolve in Obsidian, so a video can point
at the essays and Core Theory notes it is built on. Don't link the other way —
a link from a published essay into `videos/` renders as a broken link on the
site.

## Creating a video

Run `/make-video` and give it any starting point: an essay path, a wikilink, a
cluster of Core Theory notes, a loose idea with no source at all, a raw rant or
transcript, or an external URL. The skill figures out which mode it is in and
scaffolds the folder.

Doing it by hand: copy `_template/` to `videos/<slug>/` and work through
`00-brief.md` → `01-outline.md` → `02-script.md`, then run the build tool.

## Folder layout

```
videos/<slug>/
  00-brief.md          thesis, sources, audience, target runtime, status
  01-outline.md        chapter map, hook beats, open loops, callbacks
  02-script.md         ← THE SOURCE OF TRUTH: narration + inline cue markers
  03-shot-list.md      generated — human-readable, grouped by chapter
  briefs/<ID>.md       one per motion graphic or chart, paste-ready
  build/               generated, safe to delete and rebuild
    script.vo.txt        narration only — the file you read at the mic
    shots.csv            one row per cue
    markers.edl          Resolve marker import
    chapters.txt         YouTube chapter block, validated
    timings.csv          you write this after recording (see below)
  assets/              stills and screenshots you drop in — keep it light
```

`02-script.md` is the only file hand-edited after the outline is locked.
`03-shot-list.md` and everything in `build/` derive from it, so a cue can never
drift out of sync with the words it sits under.

## The build tool

```bash
node videos/_tools/build.mjs videos/<slug>
```

Regenerates the shot list, the mic read, `shots.csv`, `markers.edl`, and
`chapters.txt`; creates a stub brief for any `MGFX`/`CHART` cue that lacks one;
and reports every unsourced cue, every unlicensed piece of footage, every
chapter that makes a numeric claim with no `[SRC:]` in it, and any chapter that
would fail YouTube's chapter rules.

| Flag | Effect |
| --- | --- |
| `--wpm 150` | narration speed used to estimate timecodes |
| `--fps 30` | must match the Resolve timeline, or markers land wrong |
| `--tc-start 01:00:00:00` | Resolve timelines start at 1 hour by default; an EDL starting at zero imports nothing |
| `--assign-ids` | writes generated `MGFX-00N` ids back into the script so briefs stay stable |
| `--from-timings` | use real recorded timecodes from `build/timings.csv` instead of estimates |
| `--clean` | drop chapter rules from `script.vo.txt` (for TTS rather than a human read) |

**Timecodes are estimates until you record.** Before there is a voiceover there
is no clock, so positions come from cumulative word count at `--wpm`. That is
close enough to plan against and drifts meaningfully past ten minutes or so.
Once the VO is on the timeline, write the real chapter in-points into
`build/timings.csv`:

```csv
chapter,timecode
HOOK,01:00:00:00
CH01,01:00:38:12
CH02,01:03:11:04
```

then re-run with `--from-timings`. Chapter markers become exact and cues inside
each chapter are rescaled proportionally.

## Marker vocabulary

One marker per line, so each diffs independently. Fields are separated by `|`
and are self-identifying — `6s`, `src:…`, `license:…`, and an explicit ID can
appear in any order; the first unclaimed field is the description.

**Visual cues** (become shot-list rows, land on a Resolve track):

| Marker | Track | Example |
| --- | --- | --- |
| `[MGFX:]` | V4 | `[MGFX: MGFX-007 \| 1,000,000 prices funnelling into one committee window \| 6s]` |
| `[CHART:]` | V4 | `[CHART: CHART-002 \| TT public sector wage bill vs GDP, 2000–2024 \| src:CBTT \| 4s]` |
| `[TEXT:]` | V4 | `[TEXT: "Not hard. Impossible." \| 2s]` |
| `[BROLL:]` | V2 | `[BROLL: archival \| Gosplan office footage \| 4s \| src:TBD \| license:TBD]` |
| `[STILL:]` | V2 | `[STILL: 1970s TT oil boom press photo \| 3s \| src:TBD]` |
| `[SCREEN:]` | V3 | `[SCREEN: Discord quote — "at the end of the day it's about money" \| 3s]` |

`MGFX` and `CHART` carry an explicit ID and get a file in `briefs/`. The others
are described in place.

**Audio cues:** `[SFX: paper shuffle]` → A3, `[MUSIC: drop out entirely]` → A2.

**Annotations** (shape the edit, are not shots):

- `[HOLD: 3s]` — visual-only silence. The only marker that advances the clock.
- `[SRC: Mises 1920, *Economic Calculation in the Socialist Commonwealth*]` — the citation backing the claim above it.
- `[BEAT: open loop — "so why does every planner think he's the exception?"]`
- `[CALLBACK: cold-open bakery line]`
- `[INTERRUPT: hard cut to black, single line of text]`
- `[NOTE: …]`

Chapters are `##` headings shaped `## CH03 — The Calculation Problem`. The part
before the dash is the ID (used for markers and timings); the part after is the
title that appears as the YouTube chapter.

## Conventions that matter

- **One sentence per line** in narration. It cues read-rhythm at the mic and
  keeps git diffs line-level.
- **`**bold**` means vocal stress.** It survives into `script.vo.txt`.
- **Write it to be spoken.** Full sentences, no bullet-list cadence. Read it
  aloud while writing, not just while recording.
- **Every number needs a `[SRC:]`.** The build tool flags chapters that make
  numeric claims without one. Unsourced statistics get deleted, not softened.
- **Every deductive step traces to a vault note** via `[[wikilink]]`. If a step
  has no note behind it, write the note or cut the step.

## Handing off to another agent

A brief in `briefs/` is written to stand alone: chapter, the line it sits under,
the one-sentence message, format, duration, style, on-screen text, motion,
references with the specific element named, and what to avoid. Point an agent at
a single brief file and it has everything it needs to generate the asset. Point
it at `03-shot-list.md` and it can see every asset still outstanding.
