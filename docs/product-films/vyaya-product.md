# Vyaya verified inventory and demonstration provenance

A spending/earned-income tracker with Everyday, Fees & Funding and Settlements.
Its useful promise is a clear view of ordinary spending without funding and
repayments distorting the headline. Audience: people recording purchases,
subscriptions and irregular transfers. Keep “budget/spending tracker” as product
category; do not imply envelope budgets, automatic bank sync or verified balances.

Capture source is the current isolated app `/tmp/vyaya-brag-v2-capture-20261122`,
updated from source revision `c4f1fc28`. Screens are native React UI, dark mode,
1440×1000DPR2, real loaded fonts and charts. No personal ledger was opened.

Implemented and verified: overview earned/spent/net, date ranges, income/category
Sankey, native category drilldown into purchases, full ledger, real quick-entry
sheet with merchant/category/payment/date/note, three functional lane controls.
Film priority: overview → flow → purchase evidence → save → lane separation.

`capture/vyaya/make-demo.mjs` authors a six-month fictional ledger, not random
per-screen values. `data-validation.json` records integer-cent/unique-ID/date/
category/lane invariants. Salary is the generic income label, never a person.
Actual native saved entry is captured in `final-native-ledger.json`.

| State | Everyday income | Everyday spending | Tracked net |
|---|---:|---:|---:|
| Before $5.25 cafe purchase |$11,430.00|$5,005.45|$6,424.55|
| After native Save |$11,430.00|$5,010.70|$6,419.30|

Fees & Funding is independently$18,500in and$18,500out. Settlements are excluded
from all Everyday summaries. Exact category/month totals derive from the same
source records. November is explicitly a partial month. Net is tracked inflow
minus tracked outflow, not a bank account balance.

`capture-manifest.json` records routes, state, focal rectangles, source identity,
image hashes and the before/after distinction. `capture.mjs` and
`finish-entry.mjs` reproduce the actual controls and save. Font requests are cached
from Google Fonts; unrelated remote services are blocked in the primary capture.
No invented screen or shipped-feature claim is used.
