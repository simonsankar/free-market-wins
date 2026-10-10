---
name: bedrock
description: Takes a position — a sentiment ("people are anti-AI"), an article or video, a named person's stance, or a conversation with someone — researches what its holders actually argue, distils each argument to its basic form, and traces every rebuttal down to bedrock. Produces a fixed-format dissect under essays/dissects/, plus a plain reply (chat only) when answering a specific person. Invoke with `/bedrock` and the target.
version: 2.0.0
allowed-tools: Read, Glob, Grep, Bash, Write, Edit, WebFetch, WebSearch, Agent, AskUserQuestion
---

# Bedrock

The output is a dissect in a fixed format, published with the rest of
`essays/dissects/`. Its job is that the reader fully understands what the
position is made of, sees the one premise under it, knows exactly where each
claim fails and what it fails *on*, and can answer the next things its holder
will say — without ever feeling lost along the way.

Two rules outrank everything else in this file:

1. **Answer the claim they actually made.** Restate it the way its holder
   would write it, at full strength, before rebutting anything. A good answer
   to a weaker claim is a wrong answer.
2. **Every rebuttal reaches bedrock or says where it stops.** Each one is tagged
   with the rung of the descent it bottoms out at (`references/descent.md`),
   written as a named link to `essays/philosophy/The Descent.md` — never a code.
   Policy arguments that float free of the ladder are exactly the whack-a-mole
   this skill exists to end.
3. **No exceptions, and no needless ground.** There is never a situation so
   unique that state intervention, a halt on a technology, or a ban on a company
   is the necessary answer. Every such proposal rests on the same premise: a
   group may introduce conflict because it thinks it knows what's best for
   society. The dissect rejects that premise every time, however large the
   claimed stakes (see `essays/dissects/The Alien Ultimatum - Why Parasitic
   Ethics Cannot Answer Their Own Hypotheticals.md`: not even a penny to save
   humanity). Concede facts that are true. Never concede that a fact justifies
   intervention, never endorse a regulator's "better" version of an
   intervention, and never stretch self-defence from an aggressor to a
   technology. Before conceding anything, be very sure it can't be answered
   outright.

How this differs from `/dissect`: dissect takes one text and writes a
free-form rebuttal. Bedrock takes a *position*, collects the arguments people
actually make for it from their own sources, and writes the rebuttal in a fixed
structure with every claim traced to bedrock. Both land in `essays/dissects/`.

---

## Reference material

- `references/descent.md` — the ladder every rebuttal is tagged against
- `references/patterns.md` — the catalogue of reasoning patterns and fallacies
- `references/template.md` — the dissect's fixed section order and shape rules
- `references/style.md` — how it reads: logic establishes, examples
  illustrate; prose rules; diagram sizing and SVG rules
- `references/reply.md` — rules for the plain reply in Mode D

Read `descent.md` and `patterns.md` before Step 2; the subagents need them too,
so pass their paths along.

---

## Step 0 — Work out what you were handed

Say which mode in one line, then proceed.

**Mode A — a sentiment or topic.** "The anti-AI crowd." "Rent control." There
is no single text; the position *is* what its holders commonly argue. Research
maps its camps — the distinct groups and what each believes — and each camp's
strongest argument. A fringe or hypothetical position is just as answerable as
a popular one; nothing has to prove it's widely held.

**Mode B — a specific text, URL, or video.** Fetch it. For video, try the
transcript (WebFetch on the page; search for a transcript if that fails). If no
transcript can be had, ask for a paste — don't rebut a summary of a video you
haven't seen. The position is what *this source* argues; research is only for
context and for the facts it cites.

**Mode C — a named person's stance.** "Tucker Carlson on protectionism." Find
the person's own words — interviews, monologues, essays — not reporting about
them. Quote them. If their stated position is vaguer than their reputation,
answer the stated one and note the gap.

**Mode D — a conversation with a specific person.** A pasted chat, message, or
post someone sent. Everything in Mode B, plus: the checkpoint in Step 3 is
mandatory, and you finish with a reply (chat only) written under
`references/reply.md`.

---

## Step 1 — Arm yourself from the vault

The vault root is the repository root. The arsenal, in the order to search it:

- `site/tier-list-content/*.md` — thirty compact rebuttals to the stock
  objections (roads, poor people, natural monopoly, environment, IP, …).
  `ls` it every run; grep it for the topic.
- Core Theory — the `.md` files at the root (`Scarcity.md`,
  `Human action.md`, `Revealed Preference.md`, `Mixed Law.md`,
  `economic calculation problem.md`, `Skin in the game.md`, …).
- `essays/` — applied cases. `essays/philosophy/The Selective Guillotine.md`
  is the source of the descent; the Moe Boy portrait's "The Machinery" section
  is the source of several patterns.

Link notes by their exact filename with `[[wikilinks]]`. Never link a note
that doesn't exist — if the dissect needs a concept the vault lacks, flag it in
your final message (Step 7) as a candidate Core Theory note.

---

## Step 2 — Research and distil (subagent)

Spawn one `general-purpose` agent. Its prompt must stand alone — it has no
memory of this conversation. Give it: the mode, the target (text pasted in
full, or the URL/name), and these instructions:

> Find what holders of this position actually argue, from their own sources
> (their posts, videos, op-eds, advocacy groups, the person's own words) — not
> from critics describing them. For Mode A, first map the camps: the distinct
> groups that hold the position (e.g. workers, artists, neighbours), what each
> believes, its rough reasoning, and what it wants done. Don't catalogue which
> politicians or polls back it — the claims are what matter, not who holds
> them.
>
> Return a claims ledger grouped by camp. One entry per distinct claim — split
> bundles; a scary take usually packs three or four claims with different
> answers. For each:
> - **as stated**: their wording, quoted, with source
> - **distilled**: one plain sentence, the way a holder would sign off on it
> - **hidden premise**: what must be true for the claim to follow
> - **demand**: what they want done (ban, tax, licence, vote)
> - **empirical content**: any factual assertion it rests on, and whether that
>   fact checks out (cite; write UNVERIFIED if you can't confirm)
>
> Then: the key terms the position depends on ("engineering", "capitalism",
> "security") and how holders use them.

## Step 3 — Honesty and arsenal (two subagents, in parallel)

Send both the ledger. Run them in the same message.

**Honesty agent** (`general-purpose`):

> You are checking a claims ledger for fairness before anyone rebuts it. For
> each entry: would a thoughtful holder of the position sign off on the
> distilled wording? If not, rewrite it so they would. Find stronger versions
> the ledger missed. Flag any conflation of terms (e.g. "reverse engineering"
> vs "breaking encryption"). Re-check every empirical claim, both the holder's
> and any the ledger asserts. List what in the position is factually true and
> should be conceded as fact — facts only, never that a fact justifies an
> intervention. Then propose definitions of the key terms that a holder
> would accept — shared ground to argue from.

**Arsenal agent** (`general-purpose`):

> Vault at `<repo root>`. Read `.claude/skills/bedrock/references/descent.md`
> and `references/patterns.md` first. For each ledger entry: name the pattern
> it runs on (from patterns.md, or propose a new one), find the vault notes and
> tier-list rebuttals that answer it (exact filenames), assign the descent
> rung the rebuttal bottoms out at (by name, e.g. "Economics: Scarcity →
> Rights"), and draft the rebuttal in under 150 words. The rebuttal stands on
> logic and principle; use an example only to illustrate it (a café, the
> tractor and the horse), never a statistic as the foundation. No forecasts.
> Then: what single premise do the claims share? State it in one sentence, the
> way its holders would put it. Finally, list the distinct ways that premise
> fails, and assign each claim to the failure that answers it — these become
> the dissect's numbered sections.

Merge: the honesty agent's wording wins on what the claim *is*; the arsenal
agent's drafts get re-checked against any claim the honesty agent rewrote.

**Checkpoint.** Mode D: always stop and show the restated claims and the root
in plain sentences, and ask whether that's what was said. Other modes: proceed,
unless the honesty agent found the position genuinely ambiguous — then ask one
question.

## Step 4 — Red team (subagent)

Spawn one `general-purpose` agent with the merged ledger and draft rebuttals:

> Attack these rebuttals the way the position's smartest holder would. The
> rebuttals argue from the vault's principles (self-ownership, the NAP,
> praxeology, the illegitimacy of IP, decentralisation over central rule) and
> are judged by those principles alone. A rebuttal is weak only if it is
> *wrong*: a factual error or unverified fact, a gap in the logic, an answer to
> a weaker claim than the strongest version, a word less precise than the
> holder's, a forecast about what a technology can or can't do, or an
> inconsistency with the vault's own notes. Do NOT flag anything for being
> too libertarian, unpopular, costly with a general audience, or one-sided, and
> never propose conceding that some case (catastrophic, irreversible, unique)
> justifies intervention or a ban: the vault holds that none does, and an
> "emergency exception" is the special-case pattern, to be answered —
> the goal is a correct argument, not a balanced one. A priori claims from
> praxeology (only acting beings value; ends are human; production serves
> consumers) are not forecasts.
>
> When the holder's best counter works only by rejecting one of the vault's
> premises (e.g. "IP is legitimate", "a majority can decide"), don't call the
> rebuttal weak. Say which premise is rejected and which descent rung answers
> it: that's where the argument goes next, not where it retreats.
>
> Then predict where a holder pivots next when this line of argument is
> closed — the next two or three things they'll say — and whether those
> pivots share the root premise.

Discard any red-team point that amounts to "soften it" — that's the agent
failing to follow the argument, not a weakness in it. Then resolve every point
that survives. The published dissect never carries a list of weak spots:

- **Unverified fact** → verify it (WebSearch). If it can't be confirmed, cut
  it, and rewrite the rebuttal so it doesn't need it.
- **Forecast about a technology** → restate the rebuttal structurally (an
  argument that holds whether or not the forecast comes true), or cut it.
- **Logic gap, imprecise word, answer to a weaker claim** → fix it.
- **A genuine choice of position the vault doesn't settle** (two defensible
  libertarian answers, or a concept with no vault note) → don't guess. Ask the
  author with AskUserQuestion, with the options and a recommendation, then
  write it his way. List these in one batch, not one at a time.

## Step 5 — Write the dissect

Follow `references/template.md` exactly — same sections, same order, every
time — and `references/style.md` for how it reads and how diagrams are
drawn. Read the model dissect the template names before writing. Write it to `essays/dissects/<Title>.md`, titled the way the existing
dissects are (a claim, an em dash, the subtitle), or under
`essays/dissects/3rd-world-woes/` if it targets a developing-world state.
Follow the vault's CLAUDE.md: frontmatter `title` and `date`, no `#` heading.

It's published, so it's about arguments, never about a private person: no
names or identifying details of anyone from a Mode D conversation. Public
figures in Mode C are fair game, quoted accurately. Keep it tight: no
paragraph that restates another, no figure that the argument doesn't need.

## Step 6 — Reply (Mode D, or when asked)

Write it under `references/reply.md`. It goes in chat only — never in the
published file. This is the one place where structure is *not* welcome.

## Step 7 — Grow the references

- A pattern that recurred and isn't in `patterns.md`: add it, with this case as
  its example.
- A concept the dissect needed that the vault lacks: name it in your final
  message as a candidate Core Theory note. Never in the published file — gaps
  are a to-do list for the author, not content for the reader.

Final message: the dissect's path, the root premise in one sentence, and any
gaps. Don't paste the dissect back into chat.

---

## Things that went wrong before, and must not again

- Leading with an argument that answers a *different* claim ("cheap software
  means more demand" against "the capital owner just asks the model").
- Making it about the person — gloating, mind-reading why they went quiet,
  "your video" when it wasn't theirs.
- Imprecise words where the holder was precise ("reading code" for reverse
  engineering a finished binary).
- Stating unverified specifics with confidence. Verify it or cut it — nothing
  unverified ships.
- Over-reaching into a side debate that doesn't bear on the claim, or that
  rests on facts that couldn't be verified (Bitcoin specifics, in a security
  argument).
- Building the case on data: polls, studies and precise figures that invite
  whataboutism and date the piece. Logic establishes; examples illustrate.
- Establishing who holds the position (politicians, surveys, bills) instead of
  stating what it claims.
- Long sentence-headings for the main sections, and diagrams too small to
  read.
- Softening a rebuttal to appease a general audience. Briefs aren't balanced;
  they're correct. A concession is for what's factually true, never for what's
  unpopular to say.
