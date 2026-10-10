# The descent

The ladder every rebuttal is tagged against. The canonical, published version
is `essays/philosophy/The Descent.md` — read it; it has each rung's question,
the typical refusal, the answer, and the vault notes behind it. This file is
just the tagging rules.

## The rungs, top to bottom

| Rung | Question | Heading to link |
|---|---|---|
| Policy | What is actually being done? | `Policy` |
| Economics: Incentives | Who pays for being wrong? | `Incentives` |
| Economics: Knowledge | Who has the information? | `Knowledge` |
| Economics: Scarcity | What's given up, and where does scarcity move? | `Scarcity` |
| Economics: Action | Do people respond to change? | `Action` |
| Authority | Who gets to decide for others? | `Authority` |
| Rights | Whose is it, and was it invaded? | `Rights` |
| Equality | Does the same rule bind everyone? | `Equality` |
| Logic | Is it consistent? (floor: identity) | `Logic` |

Use the shallowest rung that actually settles the claim. A rebuttal settled at
Economics isn't weaker than one taken to Logic; it's cheaper. Add the next rung
down only when the holder would likely refuse the first.

## Tag format

Names, never numbers or codes. Every rung links to its section of the
published note, with the rung name as the visible text:

```markdown
*Bottoms out at:* [[The Descent#Scarcity|Economics: Scarcity]] → [[The Descent#Rights|Rights]]
```

In the claims table, the same links go in the "Bottoms out at" column. Keep
the link target to the bare heading (`#Scarcity`, not `#Economics: Scarcity`)
— the site builds anchors from the heading text, and the sub-rungs are
`###` headings under Economics.

Which rung, roughly:

- the mechanism is mislabelled ("contribution", "guardrail") → **Policy**
- it can't work, or its costs are hidden → **Economics** (pick the part)
- "we voted", "experts say", "it's an emergency" → **Authority**
- "it affects me", "it's society's", lost value treated as theft → **Rights**
- "different when the state does it" → **Equality**
- different logic for different people, or contradictions shrugged off →
  **Logic**
