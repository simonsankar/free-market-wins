---
name: make-video
description: Turns any starting point — an essay, a cluster of Core Theory notes, a loose idea, a raw rant, or an external URL — into a complete video pre-production package under videos/<slug>/. Produces a chaptered script with inline visual cues, per-asset briefs, and DaVinci Resolve import files. Invoke with `/make-video` and a target, or nothing at all.
version: 1.0.0
allowed-tools: Read, Glob, Grep, Bash, Write, Edit, WebFetch, AskUserQuestion
---

# Make Video

You are building the blueprint for a video, not writing an essay about one. The
deliverable is a folder someone can open six weeks from now — including a
different AI agent with no memory of this conversation — and know exactly what
to record, what to build, and what to cut to.

Two things make a video essay work, and this skill is about both: an argument
that holds without a single smuggled premise, and a structure that earns the
next thirty seconds, over and over, for the whole runtime. Neither survives
being bolted on afterwards.

The vault is the foundation. Every claim in a script traces back to something
in it, or gets cut, or becomes a new note first.

---

## Reference material

Load these as you need them — don't dump them all up front:

- `references/structure.md` — hook beats, chaptering, open loops, retention
- `references/script-format.md` — the full marker vocabulary and VO conventions
- `references/argument-audit.md` — the audit checklist, run before a script is done
- `references/visual-briefs.md` — what makes a brief actionable
- `references/resolve-free.md` — the DaVinci Resolve (free edition) handoff

`videos/README.md` documents the folder layout and the build tool for whoever
comes next. If you change the marker vocabulary, change it there too.

---

## Step 0 — Work out what you were handed

The whole point of this skill is that the starting point can be anything. Read
the invocation and pick the mode. Say which mode you picked in one line, then
get on with it.

**Mode A — an essay.** A path, a `[[wikilink]]`, or a title. Read it in full,
plus every note it links. The essay is the spine: adapt it, don't re-argue it.
A video is not an essay read aloud — the essay's paragraph order is optimised
for a reader who can re-read, and the video's order is optimised for a viewer
who can leave. Expect to reorder, and expect the strongest line in the essay to
belong in the first fifteen seconds.

**Mode B — several essays or Core Theory notes.** Read them all, then find the
through-line. The video is the argument they *jointly* make, which is usually
one none of them makes alone. If you can't state that joint argument in one
sentence, say so and ask which of them is the spine.

**Mode C — a loose idea with no source.** "A personal odyssey." "Something
about why people defend the thing that's failing them." Grep the vault for
material that bears on it, assemble what exists into a spine, and then — this
part matters — **report explicitly what the vault does not cover**. Every gap
is one of two things: a Core Theory note that should be written first, or a
limit the video states out loud. A gap you don't name is where a fallacy gets
in.

**Mode D — a rant or transcript.** Pasted text, or a file like
`private/Moe Boy — Status Quo Mentality (Raw Transcript).md`. Speech is
repetitive, circles back, and buries the thesis in the middle. Extract the
actual argument, drop the repetition, put the buried thesis where it belongs,
then back each claim with vault material. Keep the phrasings that land — a rant
usually contains two or three lines better than anything you'd write cold. Show
the extracted argument as a numbered spine and confirm it before scripting.

**Mode E — an external URL or article.** Fetch it, run the `/dissect` framework
against it, then build the video from that output. The video's spine is the
dissect's structure: stated problem → shallow take → actual sins → market proof
→ verdict.

**No target at all?** Ask one question — what's the idea — and proceed. Don't
interrogate.

---

## Step 1 — Arm yourself from the vault

The vault root is the repository root. Read the foundations before anything
else:

- `The Non-aggression Principle.md`
- `Argumentation Ethics.md`
- `Self-ownership.md`
- `Austrian Economics.md`
- `economic calculation problem.md`
- `Knowledge Problem (Information Throughput Problem).md`
- `essays/economics/Inverse incentive structure.md`

Then Grep for what the topic actually needs. The vault has notes on
`Taxation.md`, `Democracy.md`, `Socialism.md`, `Fiat Currency.md`,
`Cantillon Effect.md`, `Fractional Reserve Banking.md`, `Revealed Preference.md`,
`Subjective Value Theory.md`, `price system.md`, `private property.md`,
`Homesteading (First-comer Ethic).md`, `Polylogism.md`,
`Law of Non-Contradiction.md`, and more — use them by name, and link them.

Read at least one existing essay for voice if you haven't in this session.
`essays/dissects/3rd-world-woes/Moe Boy — Portrait of a Self-Defeating Statist.md`
is the fullest example of the register.

---

## Step 2 — Scaffold and brief

Pick a slug: lowercase, hyphenated, short, stable. It's a directory name and it
will appear in file paths for the life of the project.

```bash
cp -R videos/_template videos/<slug>
```

Then write `00-brief.md`. Every field, no placeholders left standing.

The thesis is one sentence. If it takes two, the video isn't ready — you have
either two videos or an unresolved argument. Write the counterintuitive claim
separately, because that's what the hook is built from: the part that sounds
wrong until it's explained. If nothing in the thesis sounds wrong on first
hearing, there is no reason to watch, and you should say so rather than
building a video with no engine.

Name the strongest counterargument in the brief before writing a word of
script. Either the video answers it or the brief records that it deliberately
doesn't — both are fine, silently ignoring it is not.

**Stop here and show the brief.** The thesis and the counterintuitive claim are
worth one round of confirmation before you write ten minutes of narration
against them.

---

## Step 3 — Outline

Fill `01-outline.md`. Read `references/structure.md` first.

Write the hook as three actual lines, not three descriptions of lines. Then the
chapter table, where every chapter is one claim doing one job. Then the open
loops, the pattern interrupts, and the callbacks — before scripting, because
loops that get added afterwards are always visible as seams.

Finish with the argument spine: the chapters as bare premises and a conclusion,
stripped of all rhetoric. If it doesn't hold as a syllogism there, no delivery
saves it later. This is also the cheapest possible moment to discover the
argument doesn't work.

---

## Step 4 — Script

Write `02-script.md`. Read `references/script-format.md` for the marker
vocabulary.

Narration in the vault's voice: direct, declarative, no hedging, no "on the
other hand." Arithmetic worked out on screen rather than asserted. Dark humour
where the irony is genuinely unavoidable. The critique is always structural —
the system produces these outcomes because of what it is, never because of who
runs it.

Written to be **spoken**, which is a different craft from written to be read:

- One sentence per line. It cues read-rhythm at the mic and keeps diffs clean.
- Full sentences. Bullet-list cadence sounds like a bullet list out loud.
- `**Bold**` marks vocal stress and survives into the mic read.
- Short sentences after long ones. Read it aloud as you write it, not later.

Place visual cues **as you write**, never afterwards. For faceless narration the
visuals are the argument's second channel — a chart is a premise, a text card is
emphasis, and B-roll is the only thing standing between the viewer and ten
minutes of a static screen. A chapter with no cues in it is a chapter where
people leave.

Attach `[SRC:]` to every claim carrying a number, at the moment you write the
number. Retrofitting citations is how unsourced claims survive.

---

## Step 5 — Argument audit

Run the full checklist in `references/argument-audit.md` before calling the
script done. This is not optional and not a formality — it is the step that
makes the difference between the vault's essays and the arguments they take
apart.

Report the audit as a list of findings, including the ones you fixed. If
something can't be fixed without new vault material, say that plainly rather
than softening the claim until it's unfalsifiable.

---

## Step 6 — Build and brief the assets

```bash
node videos/_tools/build.mjs videos/<slug> --assign-ids   # only if ids are missing
node videos/_tools/build.mjs videos/<slug>
```

This regenerates `03-shot-list.md` and everything in `build/`, stubs a brief for
every `MGFX`/`CHART` cue, and reports unsourced cues, unlicensed footage,
chapters that make numeric claims with no `[SRC:]`, and any chapter that would
fail YouTube's chapter rules.

**Fix every warning it prints, or explain why it stands.** A warning you leave
without comment reads as one you didn't see.

Then fill in the stubbed briefs — see `references/visual-briefs.md`. Each one
has to stand entirely alone, because the thing that will read it has no context.
Empty stubs are worse than no stubs: they look done.

Re-run the build after filling briefs, so the shot list reflects reality.

---

## Step 7 — Hand off

Close by telling the user, concretely:

1. **Runtime and chapter count** — and whether the chapter block passes YouTube
   validation. If it doesn't, which chapter and by how much.
2. **What's outstanding** — assets to generate, footage to source, gaps in the
   vault the argument leaned on.
3. **What to do in Resolve** — point at `references/resolve-free.md` and give
   the two commands that matter: set the timeline to the right fps, import
   `build/markers.edl`.
4. **The honest caveat** — timecodes are estimated from word count until the VO
   exists. Chapter positions will drift, more so past ten minutes. After
   recording, write real chapter in-points into `build/timings.csv` and re-run
   with `--from-timings`.

---

## Tone

Match the vault. Direct, assertive, intellectually confident, no hedging. The
goal is precision, not balance.

But note the difference between an essay and a script: on the page a reader can
stop and re-read a dense sentence. A viewer can't. Contempt that reads as funny
lands harder when it's *earned by the preceding thirty seconds* rather than
deployed continuously. Space it out. The emoji punctuation that works in the
essays is a written-register device — on screen it becomes a text card or a cut,
not a spoken word.

---

## Notes

- Never write an `# H1` into any file — Obsidian renders the filename as the
  title and a heading duplicates it. Chapters are `##`.
- `videos/` is excluded from the published site in three `IGNORE_DIRS` lists and
  in `.dockerignore`. Don't link into it from a published essay — that renders
  as a broken link on the site. Linking *out* of it into essays and Core Theory
  is the whole point and works fine.
- Don't put video files in the repo. Cues carry a `src:` field naming where the
  footage should come from; sourcing stays manual.
- If the work reveals a gap in Core Theory that the argument genuinely needs,
  say so — writing that note is a legitimate output of this skill, and it
  belongs in the root bin, not in `videos/`.
- If asked to do only part of this — just an outline, just a hook — do that
  part properly rather than producing a thin version of everything.
