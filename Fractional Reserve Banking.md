---
title: Fractional Reserve Banking
date: 2024-06-05
---


## The Basic Scam

Fractional reserve banking allows banks to lend out money they don't actually have. Here's how it works:

1. You deposit $1,000 in the bank
2. Bank keeps only 10% ($100) as "reserves"
3. Bank loans out $900 to someone else
4. That $900 gets deposited in another bank
5. That bank loans out $810 (keeping 10%)
6. Process continues...

**Result**: Your original $1,000 becomes $10,000 in the money supply through this multiplication process.

<svg viewBox="0 0 820 560" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;margin:1.75rem 0" font-family="var(--bodyFont, ui-sans-serif, system-ui, sans-serif)">
<defs>
<marker id="frb-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,1 L9,5 L0,9 z" fill="var(--gray, #9a9a9a)"/></marker>
<marker id="frb-arrow-orange" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,1 L9,5 L0,9 z" fill="var(--secondary, #e0932f)"/></marker>
</defs>
<g transform="translate(60,55)">
<text x="0" y="-20" font-size="15" font-weight="600" fill="var(--darkgray, #9a9a9a)">The deposit multiplier at a 10% reserve requirement</text>
<rect x="0" y="0" width="260" height="88" rx="4" fill="#7a9ec2" fill-opacity="0.22" stroke="#7a9ec2" stroke-width="2.4"/>
<text x="14" y="34" font-size="13.5" font-weight="600" fill="#7a9ec2">$1,000 deposit</text>
<text x="14" y="56" font-size="12" fill="var(--gray, #9a9a9a)">running total: $1,000</text>
<line x1="260" y1="20" x2="330" y2="20" stroke="var(--gray, #9a9a9a)" stroke-width="2" marker-end="url(#frb-arrow)"/>
<rect x="335" y="0" width="200" height="40" rx="4" fill="var(--gray, #9a9a9a)" fill-opacity="0.18" stroke="var(--gray, #9a9a9a)" stroke-width="2"/>
<text x="345" y="25" font-size="12" fill="var(--darkgray, #9a9a9a)">bank keeps 10% ($100 reserve)</text>
<line x1="130" y1="88" x2="130" y2="130" stroke="var(--secondary, #e0932f)" stroke-width="2.4" marker-end="url(#frb-arrow-orange)"/>
<text x="140" y="115" font-size="12.5" font-weight="600" fill="var(--secondary, #e0932f)">lends $900</text>
<rect x="20" y="140" width="220" height="72" rx="4" fill="#7a9ec2" fill-opacity="0.30" stroke="#7a9ec2" stroke-width="2.4"/>
<text x="34" y="170" font-size="13" font-weight="600" fill="#7a9ec2">$900 redeposited</text>
<text x="34" y="190" font-size="12" fill="var(--gray, #9a9a9a)">running total: $1,900</text>
<line x1="240" y1="158" x2="300" y2="158" stroke="var(--gray, #9a9a9a)" stroke-width="2" marker-end="url(#frb-arrow)"/>
<rect x="305" y="140" width="170" height="34" rx="4" fill="var(--gray, #9a9a9a)" fill-opacity="0.18" stroke="var(--gray, #9a9a9a)" stroke-width="2"/>
<text x="315" y="162" font-size="11.5" fill="var(--darkgray, #9a9a9a)">keeps $90 reserve</text>
<line x1="130" y1="212" x2="130" y2="250" stroke="var(--secondary, #e0932f)" stroke-width="2.4" marker-end="url(#frb-arrow-orange)"/>
<text x="140" y="236" font-size="12" font-weight="600" fill="var(--secondary, #e0932f)">lends $810</text>
<rect x="40" y="260" width="185" height="58" rx="4" fill="#7a9ec2" fill-opacity="0.4" stroke="#7a9ec2" stroke-width="2.4"/>
<text x="54" y="285" font-size="12.5" font-weight="600" fill="#7a9ec2">$810 redeposited</text>
<text x="54" y="303" font-size="11.5" fill="var(--gray, #9a9a9a)">running total: $2,710</text>
<line x1="225" y1="274" x2="270" y2="274" stroke="var(--gray, #9a9a9a)" stroke-width="2" marker-end="url(#frb-arrow)"/>
<rect x="275" y="258" width="150" height="30" rx="4" fill="var(--gray, #9a9a9a)" fill-opacity="0.18" stroke="var(--gray, #9a9a9a)" stroke-width="2"/>
<text x="283" y="278" font-size="11" fill="var(--darkgray, #9a9a9a)">keeps $81 reserve</text>
<line x1="130" y1="318" x2="130" y2="345" stroke="var(--secondary, #e0932f)" stroke-width="2" stroke-dasharray="3 4" marker-end="url(#frb-arrow-orange)"/>
<text x="140" y="336" font-size="12" fill="var(--darkgray, #9a9a9a)">…and so on, iteration after iteration</text>
<text x="0" y="372" font-size="12.5" fill="var(--gray, #9a9a9a)">$1,000 → $1,900 → $2,710 → … → converging on $10,000</text>
<rect x="0" y="392" width="480" height="46" rx="6" fill="#e05a4f" fill-opacity="0.12" stroke="#e05a4f" stroke-width="2"/>
<text x="16" y="420" font-size="13.5" font-weight="600" fill="#e05a4f">10% reserve → ~10x money multiplier (1 / 0.10 = 10)</text>
<text x="0" y="466" font-size="12.5" fill="var(--darkgray, #9a9a9a)">Every dollar deposited is loaned, redeposited, and loaned again — until $1,000 in real money backs $10,000 in claims.</text>
</g>
</svg>

## Why It's a Ponzi Scheme

Like all Ponzi schemes, fractional reserve banking only works as long as:
- New money keeps entering the system
- Not everyone tries to withdraw at once
- People maintain faith in the illusion

**The Fatal Flaw**: The bank owes $10,000 worth of demand deposits but only has $1,000 in actual money. If even 11% of depositors want their money simultaneously, the bank collapses. This is a **bank run**.

## Purchasing Power Theft

When banks create money from nothing through lending:

### The Dilution Process
1. Bank creates $9,000 from your $1,000 deposit
2. Total money supply increases by 900%
3. More dollars chase the same goods
4. Prices rise to reflect new money supply
5. Your savings lose 90% of purchasing power

**You're being robbed**: Not by someone taking your dollars, but by making each dollar worth less. It's counterfeiting with a banking license.

### Who Benefits vs Who Loses

**Winners**:
- Banks (collect interest on money they never had)
- First recipients of new loans (spend at old prices)
- Debtors (repay with devalued currency)

**Losers**:
- Savers (purchasing power stolen)
- Fixed-income earners (wages don't keep up)
- Last recipients (face higher prices without higher income)

## The Mathematics of Fraud

With a 10% reserve requirement:
- **Money Multiplier** = 1 / Reserve Ratio = 1 / 0.1 = 10
- Every $1 deposited becomes $10 in the system
- Bank profits from interest on $9 they never had
- If loans default, bank still owns collateral bought with fake money

**The Perfect Crime**: Create money � Loan it at interest � Seize real assets when loans default � All "legal"

## Historical Con Game

### Gold Standard Era (Pre-1971)
- Banks issued more notes than gold in vaults
- Periodic bank runs exposed the fraud
- Government "solved" this by suspending gold redemption

### The Nixon Shock (1971)
- August 15, 1971: Nixon "temporarily" suspended gold convertibility
- Completed the divorce from any backing whatsoever
- Fractional reserves became **no reserves**

### Post-1971: Pure Fiat
- Money backed by nothing but government force
- No mathematical limit to money creation
- Central banks can create infinite currency
- [[Fiat Currency]] is fractional reserve banking without even the pretense of reserves

## Modern Evolution: Zero Reserves

Many countries now have **NO reserve requirements**:
- Canada: 0% since 1992
- UK: 0% since 2009
- US: 0% since 2020 (COVID excuse)

Banks can literally create unlimited money, constrained only by:
- Capital requirements (easily gamed)
- Fear of triggering hyperinflation
- Need to maintain the illusion

## Why It Persists

Fractional reserve banking survives because:

1. **Government Protection**: Legal tender laws force acceptance of debased currency
2. **FDIC/Deposit Insurance**: Taxpayers backstop the fraud
3. **Central Bank**: Lender of last resort prints money to prevent bank runs
4. **Complexity**: Most people don't understand they're being robbed
5. **Regulatory Capture**: Banks control their regulators

## The Austrian Critique

From an Austrian economics perspective, fractional reserve banking:
- Violates [[Property Rights]] (lending what you don't own)
- Creates the [[boom-bust cycle]] through credit expansion
- Causes [[Inflation]] (hidden tax on savings)
- Enables government growth through money printing
- Destroys economic calculation through false price signals

## The Only Solution

Full reserve banking or [[Bitcoin]]:
- 100% reserves: Banks can only lend what they actually have
- No money creation through lending
- No bank runs possible
- Honest interest rates reflecting real savings
- Sound money that can't be debased

## The Bottom Line

Fractional reserve banking is institutionalized fraud. It's a system where:
- Banks pretend to have money they don't
- Your deposits fund loans without your permission
- Purchasing power is systematically stolen from savers
- The entire economy becomes a house of cards
- Collapse is inevitable, only timing uncertain

When everyone realizes the banks don't have "their" money, the Ponzi scheme collapses. The only question is when, not if. Until then, every dollar you hold is being diluted, every save is being stolen from, and every loan creates money from nothing - stealing from everyone else.

**It's not a bug, it's the feature.** The system is designed to transfer wealth from producers to parasites through the hidden tax of inflation.