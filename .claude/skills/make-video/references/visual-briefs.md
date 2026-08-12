# Visual briefs

One file per `MGFX` or `CHART` cue, in `briefs/<ID>.md`. The build tool stubs
them; you fill them.

## The standard a brief has to meet

**It must work for a reader with zero context.** A different AI agent weeks from
now. An illustrator who has never seen the script. Assume the reader has this
one file and nothing else — not the conversation, not the script, not the
vault.

That's the whole design constraint. Everything below follows from it.

## Fields

**`message` — one sentence, and the most important field.** Not what is on
screen: what the viewer *understands* after seeing it. "Prices carry information
no central office can collect" is a message. "A diagram of price signals" is a
description of a picture and tells the builder nothing about what it's for.

If the message needs two sentences, the cue is doing two jobs and should be two
cues.

**`duration_s`** — from the script cue. It constrains everything: a six-second
graphic can hold about one idea and one transition.

**Format** — 1920×1080, transparent background (PNG sequence or ProRes 4444) is
the default for overlays. Say if it's a full-frame card instead.

**Style** — flat vector, line weight, colour count. Be concrete. "Clean and
modern" is not a style, it's an aspiration.

**On-screen text** — verbatim, including punctuation and capitalisation. Never
paraphrase it in the brief and expect it to come back right.

**Motion** — how elements enter, hold, and leave. Direction, stagger, easing,
timing. "Elements enter staggered left to right, ease-out 400ms, hold 3s, cut
out" is buildable. "Animate in nicely" is not.

**References — name what about them you want.** This is the single rule every
source agrees on. "Like this video" bounces straight back with a question.
"The type animation at 0:14, but slower" doesn't. One line per reference: the
link, then the specific element to take from it.

**Avoid** — the failure modes worth heading off. Stock-icon look, drop shadows,
gratuitous 3D, anything that reads as a corporate explainer. Cheap to write,
saves a whole revision cycle.

**Data (CHART only)** — the actual numbers and where they came from. A chart
with no cited series is an unsourced claim wearing a costume, and the audit
treats it as one.

## Charts specifically

- State the series, the units, the date range, and the source.
- State the axis range explicitly, and don't truncate a y-axis to exaggerate a
  trend — that's the visual form of lying, and it's the thing that gets
  screenshotted back at you.
- Say what the viewer should notice. A chart nobody is told how to read is four
  seconds of decoration.
- If the chart is the evidence for a claim, it needs to hold up paused. People
  pause charts.

## Working with an agent later

Point an agent at one brief file and it has everything. Point it at
`03-shot-list.md` and it can see every asset still outstanding — the generated
"Briefs to fill" checklist at the bottom is built for exactly that.

Set `status: done` in a brief's frontmatter when the asset exists, and put the
file in `assets/` (or note where it lives if it's too large for the repo).

## Anti-patterns

- **The empty stub left in place.** Worse than no brief — it looks finished. The
  build tool creates stubs precisely so they're visible as debt; leaving them
  hides the debt instead.
- **The brief that restates the script line.** If the brief just repeats the
  narration, no visual decision has been made yet, and the person building it
  will make that decision for you.
- **The brief with no duration.** Everything about the design depends on it.
- **The brief that describes a feeling.** "Evokes the weight of bureaucracy"
  needs a second line saying what's actually on screen.
