# Script format

`02-script.md` is the single source of truth. `03-shot-list.md` and everything
in `build/` derive from it — edit the script, re-run the build, never edit the
generated files.

## Why this format and not a two-column AV script

The industry-standard AV script puts video in a left column and audio in a
right. It exists to keep a *team* synchronised, and it earns its cost there. For
a solo creator in a git repo it's the wrong primitive: markdown tables diff
badly (one word changed rewrites the row and churns the column alignment), and
the alignment benefit buys nothing when one person writes, records, and edits.

Single-column narration with bracketed cue lines gives line-level diffs, greps
cleanly, and is already the shape the vault's prose is in. Fountain is the
serious plain-text screenplay standard and diffs well too, but it has nowhere to
put structured cue metadata, and narrated essays have no characters or slug
lines for it to format.

## Chapters

```markdown
## CH03 — The Calculation Problem
```

The part before the dash is the **ID** — it keys the Resolve marker and the
`timings.csv` row, so keep it stable once recording starts. The part after is
the **title**, which becomes the YouTube chapter text.

Conventional IDs: `HOOK`, `CH01`…`CHnn`, `OUTRO`. Never write an `# H1` — the
vault's convention is that the filename is the title.

The first chapter starts the clock. Narration above the first `##` is excluded
and the build tool warns about it.

## Markers

One per line, so each diffs independently. Fields separated by `|`. Fields are
self-identifying and order-free — `6s`, `src:…`, `license:…`, and an explicit ID
are recognised wherever they sit; the first unclaimed field is the description.

### Visual cues

These become shot-list rows and Resolve markers.

| Marker | Track | Brief? | Source? |
| --- | --- | --- | --- |
| `[MGFX: MGFX-007 \| description \| 6s]` | V4 | yes | no |
| `[CHART: CHART-002 \| description \| src:… \| 4s]` | V4 | yes | **yes** |
| `[TEXT: "words on screen" \| 2s]` | V4 | no | no |
| `[BROLL: archival \| description \| 4s \| src:… \| license:…]` | V2 | no | **yes** |
| `[STILL: press photo \| description \| 3s \| src:…]` | V2 | no | **yes** |
| `[SCREEN: the quote or document on screen \| 3s]` | V3 | no | **yes** |

`MGFX` and `CHART` carry an explicit ID and get a file in `briefs/`. If you omit
the ID the build assigns a provisional one and warns; `--assign-ids` writes them
back into the script so brief filenames stay stable.

A `CHART` needs a source because its numbers are a claim. `MGFX` and `TEXT` are
authored from the script itself and have nothing to cite.

`BROLL` and `STILL` take an optional leading subtype: `archival`, `stock`,
`news`, `screen-capture`.

### Audio cues

- `[SFX: paper shuffle]` → A3
- `[MUSIC: drop out entirely]` → A2

### Annotations

These shape the edit but are not shots.

- `[HOLD: 3s]` — visual-only silence. **The only marker that advances the
  clock**, so it's how you buy a beat for a graphic to land.
- `[SRC: Mises 1920, *Economic Calculation in the Socialist Commonwealth*]` —
  the citation backing the claim above it. The audit and the build tool both
  key on this.
- `[BEAT: open loop — "so why does every planner think he's the exception?"]`
- `[CALLBACK: cold-open bakery line]`
- `[INTERRUPT: hard cut to black, single line of text]`
- `[NOTE: …]` — anything else worth telling your future self.

### Rules

- A marker line must open with `[` and close with `]` on the same line.
  Otherwise it's read as narration — and it will be read aloud.
- An unrecognised marker type is treated as narration, with a warning. Don't
  invent types without adding them to `videos/_tools/build.mjs` and
  `videos/README.md`.
- HTML comments are stripped, so `<!-- -->` is safe for notes to yourself.
- `---` rules are structural and ignored.

## Narration conventions

**One sentence per line.** The highest-value convention in this format: it cues
read-rhythm at the mic and it keeps git diffs line-level.

**`**Bold**` is vocal stress.** It survives into `build/script.vo.txt`, so it's
a cue to you at the mic, not typography.

**Pause notation**, if you want it finer than line breaks: `…` short pause, `/`
a longer break, `//` a full stop and breath.

**Don't over-direct.** Too many bracketed tone cues make a script unreadable at
the mic. Keep visual markers visually distinct from read cues so your eye skips
them while performing — and remember `build/script.vo.txt` strips them all
anyway, which is why that file exists.

**Write to be spoken.** Full sentences. No bullet cadence. Short sentences after
long ones. Read it aloud while writing, not just while recording — that's where
you catch the sentence that only works on paper.

## Worked fragment

```markdown
## CH03 — Nobody Can Know What The Price Knows

[BEAT: open loop — if it's impossible, why does every planner think otherwise?]

The planner does not have a knowledge deficit.
He has a knowledge **impossibility**.

[MGFX: MGFX-007 | a million price signals funnelling into one committee window | 6s]

Every price in an economy is a compressed report from someone who knows
something you don't.
What a thing cost them. What they'd take for it. What they'd rather have.

[TEXT: "1,000,000 prices → 1 committee"]
[HOLD: 2s]

There were roughly twenty-four million distinct goods in the Soviet economy
by the 1980s.

[SRC: Nove, *The Soviet Economic System*, 3rd ed.]
[BROLL: archival | Gosplan office, planners at desks | 4s | src:TBD | license:TBD]

Gosplan set prices for about two hundred thousand of them.

[CALLBACK: the bakery from the cold open]
```
