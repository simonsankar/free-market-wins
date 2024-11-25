---
dg-publish: true
---
### Pricing under Fiat
Under [[Fiat money]], we live under the assumption that prices _should_ rise. When the money supply is relatively low, prices for basic goods tended to be within the range of small numeric values, (some cents, a dollar, some dollars etc). But as [[Money Printing (bad)]] ensues, the purchasing power of these units become weaker and thus more is required to obtain the same good.
Different countries experience different rates of currency inflation and this is reflected in how they show their prices. 
For example in Argentina under their current pesos system, 1 peso is practically worthless. The more common unit that is exchangeable for goods is 1000 pesos, so prices for bread/milk etc may look like 4000.00 ARS or 2700.00 ARS and for bigger purchases like a car/house may be noted in full such as 160.000.000.00 ARS (one hundred and sixty thousand pesos) or shortened with the equivalent of USD such as ~ $150,000. 
But this seems difficult to engage with, the extra 0s are practically worthless and add clutter so why not simplify the currency with a more useful abstraction, maybe instead of circulating notes in the hundreds or thousands they divide by 1000 and make 1000 pesos the equivalent to a new note, 1 peso-max or something of that ilk. Well, this is actually the story of the current Argentinian pesos, a long story of chopping of zeros. 
See (https://en.wikipedia.org/wiki/Historical_exchange_rates_of_Argentine_currency)
```
The value of one current peso is ten trillion pesos moneda nacional (m$n), the currency in use from 1881 to 1969
```

### Pricing under Bitcoin
Under a [[Bitcoin]] standard, how would prices look since it is a fixed-limit currency and thus deflationary. We would expect prices to get lower and lower each year, so how would this look like using Bitcoin?

| Unit          | Symbol   | Bitcoin Value      | USD Value       |
|---------------|----------|--------------------|-----------------|
| bitcoin       | BTC or ₿ | 1                  | $100,000       |
| decibitcoin   | dBTC     | 0.1                | $10,000        |
| centibitcoin  | cBTC     | 0.01               | $1,000         |
| millibit      | mBTC     | 0.001              | $100           |
| bit           | μBTC     | 0.000001           | $0.10          |
| satoshi       | sat      | 0.00000001         | $0.001         |
| millisatoshi  | msat     | 0.00000000001      | $0.000001      |

In our case, we would have the opposite problem in that labelling prices in BTC will be cumbersome and would need to find smaller units to express smaller values. This style of pricing would be difficult to adopt at first since _we already think in dollars_, but over time just like Argentinians have adapted to long price labels, we too would adapt to using smaller bitcoin units.
An interest effect of this is that each range could map onto a particular subset of goods quite nicely. Let's take the case that 1 BTC is currently valued at $100k USD

| Unit         | Symbol | BTC Value     | USD Value |
| ------------ | ------ | ------------- | --------- |
| bitcoin      | BTC    | 1             | $100,000  |
| decibitcoin  | dBTC   | 0.1           | $10,000   |
| centibitcoin | cBTC   | 0.01          | $1,000    |
| millibit     | mBTC   | 0.001         | $100      |
| bit          | μBTC   | 0.000001      | $0.10     |
| satoshi      | sat    | 0.00000001    | $0.001    |
| millisatoshi | msat   | 0.00000000001 | $0.000001 |

BTC maps onto houses / firms / luxury cars etc
dBTC maps onto cars / renovations / medical bills
cBTC maps electronics / appliances / travel
mBTC maps onto most monthly expenses
μBTC maps onto most everyday items

These will change overtime in a downward manner since Bitcoin is capped, and deflation would occur (increase in purchasing power), but nonetheless these ranges would be useful abstractions as to how we map purchasing power to goods/services.
