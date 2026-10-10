# Argument audit

Run this before a script is done. The vault's essays exist to take apart bad
arguments; a video built on one is the most expensive possible mistake, because
unlike a page, a video can't be quietly edited after it's watched.

Work through every check. Report findings as a list — including the ones you
fixed, because "I found and fixed three smuggled premises" is information the
author wants.

## 1. Every empirical claim carries a `[SRC:]`

Numbers, dates, historical facts, "studies show," "most people," any quantity at
all. The build tool flags chapters with numeric claims and no `[SRC:]` anywhere
in them, but it only catches the obvious shape.

**Unsourced statistics get deleted, not softened.** Rewriting "spending rose
40%" as "spending rose sharply" doesn't fix an unsourced claim — it hides it.
Either find the source or cut the sentence.

## 2. Every deductive step traces to a vault note

Each inferential move should be linkable to a Core Theory note by `[[wikilink]]`.
If a step has no note behind it, one of three things is true:

- The note should exist and doesn't → write it first, in the root bin.
- The step is doing work the vault doesn't support → cut it.
- The step is a genuine novel contribution → then say so out loud in the script,
  and flag it to the author, because that's an essay's worth of claim riding
  inside a video.

## 3. No smuggled premises

The most common failure in confident writing. For each chapter, ask: what does
this need to be true that it never states?

Watch for:

- **Contested premises stated as background.** "Since the state can't provide X
  efficiently…" is the conclusion of an argument, used as its own premise.
- **Definitions doing argumentative work.** If the case turns on a particular
  definition of a word, define it on screen where the viewer can see it happen,
  rather than in the writer's head.
- **Scope creep between chapters.** A claim established about one case, used two
  chapters later as though established generally.
- **Empirical claims dressed as deductions.** Praxeology gets you that people
  act purposefully toward ends. It does not get you that a particular policy
  produced a particular outcome in Trinidad in 2019. That's a historical claim
  and needs evidence, not logic.

Anything load-bearing and unstated gets promoted to an explicit line. If it
can't survive being stated explicitly, it wasn't load-bearing — it was the
problem.

## 4. Steelman check

Name the strongest counterargument — the one an intelligent opponent would
actually make, not the weakest one that's easiest to knock down. Then either the
video answers it, or `00-brief.md` records that this video deliberately doesn't.

The test: would someone who holds the opposing view recognise their own position
in how you stated it? If they'd say "that's not what I think," you've built a
strawman, and everyone who already disagrees will stop watching at that exact
timestamp.

## 5. Hook honesty

Whatever the first thirty seconds promises, the body delivers — specifically,
not approximately. Re-read the hook beats against the finished chapter list.

An overpromising hook is the fastest way to lose the exact audience it just won,
and it costs more than a weak hook because those viewers leave *late*, having
already been counted.

## 6. Named fallacy sweep

The tests the vault applies to opponents, turned inward:

- **Equivocation** — a word shifting meaning between chapters. "Freedom,"
  "efficiency," "public," "we," and "cost" are the usual offenders.
- **Appeal to consequences** — "if this were true it would be terrible,
  therefore it's false" is invalid whichever direction it points.
- **Is-to-ought** — an unstated normative leap from a description of how
  incentives work to a claim about what anyone ought to do. The bridge is
  argumentation ethics and the NAP; if you're relying on it, say so.
- **Composition and division** — true of each part, therefore true of the whole,
  or the reverse.
- **Survivorship** — the market comparison that only counts firms that lived.
- **False dilemma** — "either X or Y" where a third option exists. The vault's
  strongest arguments are genuine dilemmas; presenting a weak one as a dilemma
  discredits the real ones.
- **Selection in the comparison** — the market-proof comparison is the vault's
  sharpest tool and its easiest to misuse. USPS vs FedEx is fair: same domain,
  same era, different incentive structure. A comparison across different
  domains, eras, or capital intensities is not, and an opponent will say so.

## 7. The market proof actually holds

If the script uses a private-sector comparison, check that the two cases are
genuinely comparable on everything except the variable being argued about. The
comparison should be one where a hostile reader has to concede the setup before
they can dispute the conclusion.

## 8. Visual claims are claims

A chart is an argument, not decoration. Every `[CHART:]` needs its actual series
and source in the brief. An axis choice that makes a trend look steeper is the
visual form of an unsourced claim, and it's the thing screenshot-and-quoted back
at you.

The same applies to `[SCREEN:]` cues quoting someone: quote enough context that
the quote means on screen what it meant in place.

## Reporting

Give the author:

- What you fixed, and where.
- What you couldn't fix without new vault material — named, not hedged around.
- Anything you deliberately let stand, and why.

A clean audit report on a script that has problems is worse than no audit.
