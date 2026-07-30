---
title: Coincidence of wants
date: 2024-12-02
---
The problem that makes pure barter break down at scale. For two parties to trade directly, two conditions must be met *simultaneously*:

1. Person A has what Person B wants
2. Person B has what Person A wants

This is the **double coincidence of wants** — and it's far rarer than it sounds.

## Why It Destroys Barter at Scale

In a simple two-person economy, it's manageable. In a complex division of labour, it's crippling.

Consider:

```
The surgeon needs bread.
The baker needs shoes.
The cobbler needs surgery.
```

With barter, none of these transactions can happen directly:
- The surgeon can't pay the baker in surgery (baker doesn't need surgery right now)
- The baker can't pay the cobbler in bread (cobbler doesn't need bread right now)
- The cobbler can't pay the surgeon in shoes (surgeon doesn't need shoes right now)

A triangle of mutual need, unsatisfied — not because the value isn't there, but because the *timing and directness* of the exchanges can't line up.

Multiply this across an economy of millions of people, thousands of occupations, and billions of daily transactions. Barter cannot coordinate this. The information and logistics required to find matching pairs across a modern economy would consume more effort than the production itself.

## The Solution: A Common Medium

The market's solution is elegant: find something *everyone* is willing to accept — not because they personally need it, but because they know *everyone else* will accept it too.

That good becomes the **medium of exchange**. The surgeon accepts it from the cobbler. The baker accepts it from the surgeon. The cobbler accepts it from the baker. Each transaction is now independent. The double coincidence requirement disappears.

That good is [[Money]].

<svg viewBox="0 0 900 430" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;margin:1.75rem 0" font-family="var(--bodyFont, ui-sans-serif, system-ui, sans-serif)">
<g transform="translate(50,50)">
<text x="0" y="-18" font-size="15" font-weight="600" fill="var(--darkgray, #9a9a9a)">Without money</text>
<line x1="170" y1="40" x2="20" y2="230" stroke="#e05a4f" stroke-width="1.8" stroke-dasharray="5 5"/>
<line x1="20" y1="230" x2="320" y2="230" stroke="#e05a4f" stroke-width="1.8" stroke-dasharray="5 5"/>
<line x1="320" y1="230" x2="170" y2="40" stroke="#e05a4f" stroke-width="1.8" stroke-dasharray="5 5"/>
<text x="170" y="152" font-size="12" fill="#e05a4f" text-anchor="middle">can't trade directly</text>
<circle cx="170" cy="40" r="20" fill="#7a9ec2" fill-opacity="0.15" stroke="#7a9ec2" stroke-width="1.8"/>
<circle cx="20" cy="230" r="20" fill="#7a9ec2" fill-opacity="0.15" stroke="#7a9ec2" stroke-width="1.8"/>
<circle cx="320" cy="230" r="20" fill="#7a9ec2" fill-opacity="0.15" stroke="#7a9ec2" stroke-width="1.8"/>
<text x="170" y="10" font-size="12.5" font-weight="600" fill="var(--darkgray, #9a9a9a)" text-anchor="middle">Surgeon</text>
<text x="20" y="270" font-size="12.5" font-weight="600" fill="var(--darkgray, #9a9a9a)" text-anchor="middle">Baker</text>
<text x="320" y="270" font-size="12.5" font-weight="600" fill="var(--darkgray, #9a9a9a)" text-anchor="middle">Cobbler</text>
<text x="170" y="305" font-size="13" fill="var(--darkgray, #9a9a9a)" text-anchor="middle">Each wants a specific person's good —</text>
<text x="170" y="324" font-size="13" fill="var(--darkgray, #9a9a9a)" text-anchor="middle">but not in the direction that matches.</text>
</g>
<g transform="translate(490,50)">
<text x="0" y="-18" font-size="15" font-weight="600" fill="var(--darkgray, #9a9a9a)">With money</text>
<line x1="170" y1="155" x2="170" y2="40" stroke="#7a9ec2" stroke-width="1.8"/>
<line x1="170" y1="155" x2="20" y2="230" stroke="#7a9ec2" stroke-width="1.8"/>
<line x1="170" y1="155" x2="320" y2="230" stroke="#7a9ec2" stroke-width="1.8"/>
<circle cx="170" cy="155" r="26" fill="var(--secondary, #e0932f)" fill-opacity="0.18" stroke="var(--secondary, #e0932f)" stroke-width="2"/>
<text x="170" y="159" font-size="12.5" font-weight="600" fill="var(--secondary, #e0932f)" text-anchor="middle">Money</text>
<circle cx="170" cy="40" r="20" fill="#7a9ec2" fill-opacity="0.15" stroke="#7a9ec2" stroke-width="1.8"/>
<circle cx="20" cy="230" r="20" fill="#7a9ec2" fill-opacity="0.15" stroke="#7a9ec2" stroke-width="1.8"/>
<circle cx="320" cy="230" r="20" fill="#7a9ec2" fill-opacity="0.15" stroke="#7a9ec2" stroke-width="1.8"/>
<text x="170" y="10" font-size="12.5" font-weight="600" fill="var(--darkgray, #9a9a9a)" text-anchor="middle">Surgeon</text>
<text x="20" y="270" font-size="12.5" font-weight="600" fill="var(--darkgray, #9a9a9a)" text-anchor="middle">Baker</text>
<text x="320" y="270" font-size="12.5" font-weight="600" fill="var(--darkgray, #9a9a9a)" text-anchor="middle">Cobbler</text>
<text x="170" y="305" font-size="13" fill="var(--darkgray, #9a9a9a)" text-anchor="middle">Every trade only needs one common</text>
<text x="170" y="324" font-size="13" fill="var(--darkgray, #9a9a9a)" text-anchor="middle">point — no pairwise match required.</text>
</g>
</svg>

## Why This Matters for Economic Complexity

The coincidence of wants problem isn't just an inconvenience — it's a *ceiling* on economic complexity. The more specialised a society becomes, the worse barter performs.

A peasant farmer who grows grain and occasionally trades for tools can barter. A modern software engineer, dentist, or classical musician cannot meaningfully barter for everything they need. Their skills are too specific, their needs too varied, the timing never aligns.

[[Money]] is the technology that removes that ceiling. It enables:
- Full specialisation — do what you do best, sell it, buy everything else
- Asynchronous exchange — produce now, consume later
- Long supply chains — goods can pass through dozens of hands, each transaction independent
- Price signals — the [[price system]] only works because everything can be denominated in a common unit

Every extension of the division of labour — which is the engine of prosperity — rests on solving the coincidence of wants problem.

## What Happens When You Corrupt the Solution

If the medium of exchange is inflated, debased, or made unpredictable, the coincidence of wants problem *returns in a new form*. People stop accepting the currency, revert to barter, or find substitutes (foreign currencies, gold, [[Bitcoin]]).

Hyperinflationary economies throughout history have demonstrated this repeatedly. When the currency collapses, people revert to carrying goods. The baker sells bread only to people who have something the baker needs *right now*. Economic complexity collapses. Living standards collapse with it.

Sound money is not a preference. It is a prerequisite for civilisation beyond subsistence.


*See also: [[Money]], [[Trade]], [[Sound Money]], [[Fiat Currency]], [[price system]]*
