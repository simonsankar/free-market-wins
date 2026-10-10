# Style

How a dissect reads. The standard is Rothbard: builds the case step by step
with surgical precision and stays readable. The reader has above-average sense
and may only know the topic on the surface — no hand-holding, but never a point
where they're lost, stuck, or unable to follow an explanation.

## The argument

- **Logic establishes; examples illustrate.** The argument stands on
  principle. A fact or example is there to make the logic visible ("most
  people once farmed", "tractors replaced horses"), never to prove it. If a
  number could change next year and the argument would still hold, the number
  isn't needed — leave it out. Statistics invite whataboutism; principles
  don't.
- **Don't establish that the position exists.** No politicians, polls,
  surveys, or "who holds this". A claim is answerable whether a million people
  hold it or one does. State what the camp believes and why, and answer it.
- **Concrete before abstract.** Open a principle with one specific scene (a
  café, a warehouse, a hundred neighbours), then name the principle.
- **Visible links.** "So", "because", "which means" — a reader should be able
  to point at the exact step they dispute.
- **Answer objections where the reader would raise them**, in bold quotes
  ("**"But this time there's no higher rung."**"), not in a FAQ at the end.
- **Concede facts narrowly, then turn.** Never concede that a fact justifies
  intervention.

## The prose

- **One paragraph, one move**, two to four sentences, topic sentence first.
- **Plain words.** Define a term once, in plain language, and never swap in a
  synonym. No vault shorthand in the prose ("rungs", "holders", "exits") — the
  *Bottoms out at* lines are the only place the ladder appears.
- **Active voice that names who does what to whom.**
- **Cut padding, never steps.** Every step a smart outsider couldn't fill in
  alone stays.
- **Tight.** Every sentence earns its place. The anti-AI dissect (six camps,
  nine claims) runs about 2,600 words of prose; most topics should be shorter.

## Diagrams

Inline SVG, only where a diagram carries the argument better than prose. Good
fits: the camps resting on the root; a two-column contrast (integrity vs
value, bound by the ban vs not); a loop or flow of cause and effect. Skip it
when it would only repeat the prose.

- **Size for reading.** `viewBox` about 720 wide (the article column renders
  it at roughly 1:1 or larger); `style="width:100%;height:auto;display:block;margin:2rem 0"`.
  Titles 17px, box headings 16–17px bold, box text 14–15px. Nothing under
  13px.
- **Room.** Boxes at least 52px tall for one line of text, 68px for two;
  20px gaps. Keep label text short enough to fit with margin — about 38
  characters across a 320px box at 15px.
- **Palette** (theme-aware, with fallbacks):
  `var(--darkgray, #9a9a9a)` for titles and captions, `#5a80a7` / `#7a9ec2`
  blues, `var(--secondary, #e0932f)` orange for the root or the "value" side,
  `#e05a4f` red for what fails; white text on filled boxes.
  `font-family="var(--bodyFont, ui-sans-serif, system-ui, sans-serif)"`.
- **No blank lines anywhere inside an `<svg>` block** — a blank line ends the
  HTML block and the rest renders as text.
- **Unique marker ids** per diagram (prefix them with a short slug), since
  several diagrams share one page.
