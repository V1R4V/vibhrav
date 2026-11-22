# Before It Breaks

**Predictive maintenance and outage planning for UW–Madison campus utilities.**
Team zeroday@c3 · C3 AI hackathon, October 19 2026 · one C3 package: `pkg22bc8209/`

> **Fix it before it breaks. Have the outage plan ready.**

![The Overview page on June 9, 2026, eight days before the reenacted June 17 break: one asset needs inspection, ranked by what's at stake](docs/images/app-overview.png)
*The Overview page, replayed to June 9, 2026. The chilled-water main S3 is already flagged "Inspection due" eight days before the reenacted break, with 9 buildings and ~\$67K/day of cooling at stake.*

---

## In 60 seconds

- **The problem.** A chilled-water main broke on June 17, 2026. 34 buildings lost cooling during a heat emergency and the bill came to **\$15.8M**, 63% of it spent renting temporary chillers because nobody had a plan.
- **What we built.** An app that scores every cooling, heating and air-handling asset against its *own* weather-adjusted normal, flags the ones drifting toward failure, ranks them by the buildings and dollars at stake, drafts a work order for a human to approve, and simulates the outage plan before anything breaks.
- **Does it work?** On an 8-month replay with real Madison weather and five planted failures, it caught **5 of 5 failures 6–9 days early**, ignored all **4 decoys**, and raised **2 false-alarm days in 4,860 asset-days**.
- **What's real.** Weather, buildings, plants and outage costs are real; sensor data and failures are synthetic because UW does not publish them ([§4](#4-data-what-is-real-what-is-synthetic-how-it-gets-in)).

## Contents

1. [The problem](#1-the-problem)
2. [What Before It Breaks does](#2-what-before-it-breaks-does)
3. [System design](#3-system-design)
4. [Data: what is real, what is synthetic, how it gets in](#4-data-what-is-real-what-is-synthetic-how-it-gets-in)
5. [The model](#5-the-model)
6. [The pages, and what each one means](#6-the-pages-and-what-each-one-means)
7. [Backend contract](#7-backend-contract-what-the-ui-calls)
8. [Running it](#8-running-it)
9. [Known limitations](#9-known-limitations)
10. [Repo map and team](#10-repo-map-and-team)
11. [Sources](#sources)

---

## 1. The problem

On **June 17, 2026** a chilled-water supply main broke near the Charter Street plant. **23 campus buildings closed and 11 more partly closed** during a heat emergency; buildings did not fully reopen until **August 10**, 54 days later.

![\$15.8M total incident cost; 63% of it (\$10.0M) spent renting about 30 temporary chillers](docs/images/outage-cost.png)

The bill was **\$15.8M**, and **\$10M of it was renting temporary chillers**, because nobody knew in advance which buildings would lose cooling, in what order, or how many chillers to stage.

**The expensive part was not the pipe. It was being caught unprepared.**

### It was not a surprise

UW carries a ~\$1.5B deferred-maintenance backlog and spends roughly a third of what peer campuses spend on prevention. The Regents were warned about exactly this in 2019.

![Preventive maintenance is 4% of UW–Madison's O&M budget vs 10–12% at peers; \$1.5B backlog; 120 facilities emergency calls in May 2021](docs/images/backlog.png)

With that little going to prevention, the question is not "can we fix everything?" but **"what do we fix first, and what's our plan if it breaks anyway?"** That is the question this app answers.

### The timeline, and where the app fits

![Timeline of the 2026 outage from the June 17 break to the October 8 cost disclosure, with what the app would have provided at each step](docs/images/outage-timeline.png)

---

## 2. What Before It Breaks does

A facilities manager opens it at 7 a.m. and gets three answers:

| Question | Page | What the system does |
|---|---|---|
| **What needs attention today?** | Overview | Scores every monitored cooling, heating and air-handling asset against its own weather-adjusted normal, marks **Inspection due** on the ones drifting toward failure, and ranks them by the buildings and dollars at stake. |
| **Why, and what do I do?** | Asset detail | Shows which signals are drifting and by how much, four independent probabilities that the asset fails in the next 14 days, an agent-written briefing, and a drafted work order that waits for a human to approve. |
| **What happens if I don't?** | Outage plan | For any chilled-water loop: who loses cooling, in what order (labs and patient care first), how many rental chillers, what it costs per day, next to what the real June outage cost. |

**Plus the everyday payoff:** every degrading asset is also shown running X% over its weather-expected energy, so the same alert saves money in the weeks when nothing breaks.

![Modeled value: \$3.5M–\$4.5M potential rental savings in a June-scale scenario, \$180K–\$320K/year everyday energy savings, and the 9-day warning from first inspection due on June 8 to failure on June 17](docs/images/value-and-warning.png)
*Modeled estimates, not observed savings. Arithmetic and assumptions are in §4 and the deck appendix.*

### How the demo works

The app replays **January 1 to August 31, 2026** on real Madison weather, with **five planted equipment failures** (including a reenactment of the June 17 break) and **four decoys** that a naive alarm would have fired on. A date scrubber in the top bar moves the whole app through time, so you can stand on June 9 and watch the warning before the failure.

Demo path: **Prioritize** (Overview) → **Explain** (Asset detail) → **Approve** (Work orders) → **Simulate** (Outage plan) → **Evaluate** (Backtest).

---

## 3. System design

![Pipeline: C3 data model → feature and risk pipeline → agent recommendations with human approval → React operations interface](docs/images/pipeline.png)

```
                      ┌─────────────────────────────── C3 AI platform ───────────────────────────────┐
  real NOAA weather ──┤  seed JSON                 entity types                 API types (json)       │
  synthetic sensors ──┤  data/<Type>/*.json  ──►  Plant, LoopSegment,  ──►  CampusSnapshot.compute   │
  real buildings,     │        │                   Building, Asset,         BuildingDashboard.compute │
  plants, costs       │  upsertSeedData            WeatherDay,              AssetHistory.get          │
                      │        │                   SensorReading,           Briefing.generate         │
                      │        ▼                   FailureEvent,            PlanB.simulate            │
                      │  RiskModel.score_all ──►  RiskScore (4,860)        Backtest.run              │
                      │        │                                            RiskForecast.compare     │
                      │        ▼                                            RiskForecast.campus      │
                      │  RiskModel.forecast_all ─► RiskForecast (19,440)    FacilitiesAgent.ask      │
                      │                            WorkOrder (approve/dismiss members)               │
                      └──────────────────────────────────────┬───────────────────────────────────────┘
                                                             │  c3Action(type, method, [args])
                      ┌──────────────────────────────────────┴───────────────────────────────────────┐
                      │  React + TypeScript + Vite  (ui/react/src)                                   │
                      │  AsOfProvider (one global date, campus snapshot, events, threshold)          │
                      │  shared/api/*  →  pages: Overview · Buildings · Building · Asset ·            │
                      │                   Outage plan · Work orders · Predictions · Backtest          │
                      └──────────────────────────────────────────────────────────────────────────────┘
```

### Design choices and why

| Choice | Why |
|---|---|
| Everything is precomputed over the whole replay (RiskScore, RiskForecast rows per asset per day). | The date scrubber must be instant on a projector. Every page call is a read; nothing heavy runs during the demo. |
| One C3 package: entity types in `src/`, seed JSON in `data/`, React in `ui/react/`. | C3 Code builds, syncs and serves all three together; one place to deploy. |
| A frozen data contract (`docs/CONTRACT.md`) with fixtures for every call. | Four people and four coding agents built in parallel. Field names, units, enums and payload shapes were fixed first, so the UI was built against fixtures while the backend was written, then flipped to live calls with no page changes. |
| API methods return `json` in exactly the fixture shape. | Avoids ~25 result types and keeps the contract the single source of truth. |
| Each asset is compared with its own 30-day normal, and energy is weather-normalised (degree-day regression). | A 1965 pipe and a 2014 chiller have different normals; a heat wave raises every chiller's energy without anything being wrong. Both are handled by construction, not by hand-tuned thresholds. |
| Status needs persistence (two consecutive days over threshold) with hysteresis. | A one-day spike is noise. A naive alarm fires on it; this does not. |
| Four forecasting methods, side by side, with a consensus. | One probability is a black box. When a calibrated rule, a classifier and a Monte Carlo simulation agree and the age-only baseline does not, the disagreement is the insight ("age-based maintenance would have missed this"). |
| The agent drafts, a person approves. | Every work order is `PENDING_APPROVAL` until a manager clicks Approve. Nothing is auto-executed. |
| Colour means status only. Systems are icons. One status pill everywhere. One global as-of date. | Projector-first design: a manager reads colour as "how bad", never as "which system". |
| Provenance stated in the pitch and this file, not on every card. | An earlier version carried REAL / SYNTHETIC / ESTIMATE chips on every panel (visible in the screenshot above); they cluttered the screens. The honesty now lives in §4 and the spoken pitch. |

---

## 4. Data: what is real, what is synthetic, how it gets in

### Provenance

| | Source |
|---|---|
| **Real** | Daily weather, Jan 1 to Aug 31 2026: NOAA GHCN-Daily station USW00014837, Madison Dane County Regional Airport (`tavg_f` derived as the mean of max and min where NOAA omits it). The three plants and the campus building names. The outage facts: \$15.8M total, ~\$10M rentals, ~\$4M deterioration found, ~\$1.8M line repair, ~30 chillers, 23 closed + 11 partial, Jun 17 to Aug 10 (Cap Times, WPR, UW News). FP&M's work-order number format `WO 26-0NNNNN` and preventive-maintenance asset categories. |
| **Synthetic** | All sensor readings (UW does not publish building-automation data). The chilled-water loop layout (3 plants, 6 loops, which buildings each loop serves). The five planted failures and four decoys, including the June 17 reenactment. |
| **Estimate** | \$3,704 per rental chiller per day (\$10M ÷ ~30 chillers ÷ ~90 days); ~\$111K/day campus rental burn; \$0.10/kWh; 400 tons per rental chiller; building peak load from square footage. Savings: 35–45% assumed rental reduction → \$3.5M–\$4.5M; degrading assets use 15–30% excess energy. |

> **The failures were planted.** The backtest proves the pipeline detects physically shaped degradation and ignores the decoys; it does not prove the real June 17 break was predictable.

### Ingestion strategy

- **Seed files are the source of truth.** Every table is a JSON array in `pkg22bc8209/data/<Type>/` (string ids, references as plain id strings, null keys omitted, SensorReading chunked by month). `upsertSeedData` loads them into the C3 entity types.
- **Weather is pulled, not typed.** `tools/datagen/interim_generator.py` fetches NOAA GHCN-Daily over HTTP (cached in `tools/datagen/raw/`), derives `tavg_f`, and writes `WeatherDay/weather_2026.json` with the station in `source`.
- **Sensors are generated with physics, driven by the real weather.** One row per asset per day for 20 assets × 243 days.
  - Each asset type reports only the sensors it would really have (a chilled-water main: pressure, flow imbalance, ΔT, pumping energy; a chiller: ΔT, vibration, energy).
  - Healthy values are a fixed per-asset baseline plus Gaussian noise at realistic σ (ISO 10816 vibration bands).
  - Daily energy follows the ASHRAE degree-day form (cooling scales with CDD base 55 °F, heating with HDD base 60 °F, AHUs both ways with a weekend dip); ~2% of readings are missing at random.
  - Failure modes follow the LBNL/PNNL chiller-plant fault taxonomy (leak → pressure + flow imbalance; bearing → vibration + energy; fouling → ΔT + energy) and ramp convexly from `onset_date` to the failure day.
  - Decoys: **D1** one-day vibration spike, **D2** five-day sensor dropout, **D4** slow year-long aging drift (all planted); **D3** is the real July 12–17 heat wave.
  - Deterministic (`SEED = 20260617`) and driven by `data/FailureEvent/events.json`, so changing an event changes the data.
- **Derived tables are computed, never seeded.** After any seed change, one call at a time: `upsertSeedData` → `RiskModel.score_all(3.0)` → `RiskModel.forecast_all()` → `Backtest.run(3.0)`. Both compute steps wipe their table before writing (a partial merge would keep stale fields).
- **Swapping in real data needs no code change.** A production feed (building-automation history, a work-order system) maps onto the same `SensorReading` / `WorkOrder` shapes, so adoption is a C3 integration into those two types, then the same run order. Devansh's fuller generator (real building facts, ~25 buildings, ~60 assets) overwrites the same file names and ids.

---

## 5. The model

![How an asset gets flagged: its own baseline, weather-normalized energy, persistence, network impact; example Vilas Hall unit heater running 22% over its weather-normalized baseline](docs/images/how-an-asset-gets-flagged.png)
*Example on synthetic telemetry. The risk score is an anomaly score; calibrated failure probabilities come from Stage 2.*

### Stage 1: the risk score (`RiskModel.score_all`, `src/RiskModel.py`)

For each asset and day:

1. **Weather-normalised energy baseline.** Regress daily energy on degree-days over a trailing 60-day window ending 7 days before the scored day (so slow degradation never teaches the baseline that "bad is normal"). `energy_over_expected_pct = (actual − expected) / expected`.
   A slope is trusted only with real degree-day support (≥ 5 days with degree-days > 0 and ≥ 1 degree-day of spread) and is never extrapolated more than 5 degree-days past the window; otherwise energy is excluded that day. Without this rule the first warm days of spring read as "+300% energy" on every chiller, the single biggest source of false alarms found while building.
2. **Z-scores per signal** against the asset's own previous 30 days, direction-adjusted so positive is bad (pressure falling, flow imbalance rising, ΔT shrinking, vibration rising, energy rising), clipped at zero, smoothed with a 3-day rolling median (kills a one-day spike, passes drift).
3. **Risk** = 0.6 × weighted mean (pressure .25, flow .25, ΔT .15, vibration .15, energy .20, renormalised over present signals) + 0.4 × max z (so a bearing failure visible only in vibration is not diluted), × (1 + age/60), × 1.3 for heating below 0 °F, × 1.2 for cooling above 85 °F. All-null days decay the previous risk by 10% and never raise it.
4. **Status.**

   | Status | Rule |
   |---|---|
   | `WATCH` | risk ≥ 2.0 |
   | `INSPECTION_DUE` | risk ≥ 3.0 on two consecutive days; held while ≥ 2.0; cleared after two days below |
   | `FAILED` | inside a failure event's window |
   | `HEALTHY` | otherwise |

5. **Ranking.** Inspection due first, then failed, then risk × impact, where impact weights the buildings served by criticality (patient care 4, lab 3, instruction 2, office 1) and peak load.

### Stage 2: four failure probabilities (`RiskModel.forecast_all` → `RiskForecast`)

| Method | What it is | Trained on |
|---|---|---|
| Calibrated risk | Logistic calibration of the risk score against "failed within 7 / 14 / 30 days" | planted F1–F5, leave-one-failure-out |
| Classifier | L2 logistic regression on 8 condition features (risk, 3- and 7-day slopes, max z, number of elevated signals, energy over expected, days at WATCH, age) | planted F1–F5, leave-one-failure-out |
| Monte Carlo | 1,000 forward paths of the asset's own trailing 14-day drift and noise; probability = share reaching the failure level; also p10 / p50 / p90 days to failure | nothing: the asset's own history |
| Age baseline | Weibull from ASHRAE median service lives, conditional on surviving to the asset's age | population estimate, no sensors |

The **consensus** is the mean of the three condition-based methods; the age baseline is shown as "what age alone would predict". Every row carries a confidence, a one-line basis and a `trained_on` label. The default C3 Python runtime has numpy / pandas / scipy but no scikit-learn, so the logistic fits use `scipy.optimize`.

### Results (backtest at threshold 3.0 on the current seed)

| | F1 unit heater | F2 heat exchanger | F3 air handler | F4 chilled-water main | F5 chiller |
|---|---|---|---|---|---|
| Failed | Jan 28 | Feb 16 | Apr 14 | **Jun 17** | Jul 22 |
| First inspection due | Jan 22 | Feb 10 | Apr 8 | **Jun 8** | Jul 15 |
| Warning (days) | 6 | 6 | 6 | **9** | 7 |

- **All four decoys ignored.**
- **2 false-alarm days in 4,860 asset-days** (S4-PIPE, May 16–17: a +7.9% energy reading in the first mid-May warm spell on a 54-year-old main; reported, not tuned away).
- **Threshold sensitivity:** at 3.25–3.5 there are zero false alarms with no misses; at 3.75 one failure is missed.
- **S3-PIPE on June 9:** calibrated risk 92%, classifier 72%, Monte Carlo 94%, age baseline 0.2%, consensus **86%**; every healthy asset that day is at or below 6%.

---

## 6. The pages, and what each one means

**Top bar (every page).** The as-of scrubber sets the one date the whole app shows: drag, step a day with the arrows, or press Play. Red ticks are the planted failures; the dark **Real break** flag is June 17. Clicking a marker lands 8 days before it, so you see the warning, not the failure. The weather chip shows that day's real high. **Ask the agent** opens the only agent drawer.

| Page | Route | What it answers | What you see |
|---|---|---|---|
| Overview | `/overview` | What needs attention today? | Four numbers: inspections due (with change vs yesterday), on watch, energy wasted per day, cooling exposure per day. The campus network: plants feed loops that serve buildings; loop colour is the loop's worst status, dot colour the building's. **Inspect next:** the ranked queue with status, days in status, risk bar, driving signal, buildings served, \$/day at stake and work-order state; filter by system. The agent's morning brief in one sentence. |
| Buildings | `/buildings` | Which buildings are at risk right now? | Every building as a card (worst-first, searchable) or on the real campus map, one dot per building coloured by status, plants as grey squares, feed lines to their buildings. Click either to open the building. |
| Building | `/building/:id` | How is this building doing, system by system? | Cooling / heating / air-handling cards with status, risk sparkline, energy over expected and each system's chance of failure within 14 days. Energy actual vs weather-expected for 90 days (the gap is waste). Every asset serving the building. Its place in the outage plan. Its work orders. |
| Asset | `/asset/:id` | Why is this flagged, and what do I do? | Risk over time with the threshold, shaded inspection-due spans, failure and decoy markers, and the as-of cursor (the future is greyed out). **Chance of failure:** consensus headline, one row per method with 7 / 14 / 30-day bars and days-to-failure, 30-day history. **What's driving it:** each signal's share of the risk and its deviation, with small charts against its normal band. Agent briefing and the drafted work order with Approve / Edit / Dismiss. Buildings served. |
| Outage plan | `/planb/:loop?` | What happens if this loop fails? | Pick a loop and an outdoor temperature (the 95 °F design day by default, the same basis every "if it fails" figure uses, or today's real high). **Simulate failure** dims the buildings one by one in dispatch order while the table fills: labs and patient care first, then by load. Totals: rental chillers, \$/day, and one week of rental burn, beside what actually happened in June (\$15.8M, ~30 chillers, 23 + 11 buildings). A toggle stages priority buildings only. |
| Work orders | `/workorders` | What has the agent proposed, and what did we decide? | Pending / Approved / Dismissed. Each card: what to inspect, for which asset, priority, crew, estimate, drafted date, and actions. One open draft per asset; nothing is scheduled until approved. |
| Predictions | `/predictions` | Who is most likely to fail next? | One card per system naming the most at-risk asset with its chance of failure, then every asset ranked by that chance with the range the methods disagree over and the likely time to failure. A switch reveals the four methods. |
| Backtest | `/backtest` | How do we know it works? | Slide the inspection threshold 2.0 to 4.0 and watch warning time, false-alarm days and misses move. Risk curves for all five failures aligned on their failure day. The four decoys and why each was ignored. The sweep. The planted-failure table. |

Cards on Buildings, Outage plan, Work orders, Predictions and Backtest can be dragged into your own order (grip handle on hover); the order is remembered per page.

---

## 7. Backend contract (what the UI calls)

Pages never call the platform directly; every call goes through `ui/react/src/shared/api/` as a one-liner from `docs/CONTRACT.md` §5.2, arguments as a positional array.

| Call | Used by |
|---|---|
| `CampusSnapshot.compute(as_of)` | shell, Overview, Buildings |
| `BuildingDashboard.compute(building_id, as_of)` | Building |
| `AssetHistory.get(asset_id)` | Asset |
| `Briefing.generate(asset_id, as_of)` (drafts or reuses the pending work order) | Asset |
| `RiskForecast.compare(asset_id, as_of)` · `RiskForecast.campus(as_of)` | Asset, Building, Predictions |
| `PlanB.simulate(segment_id, temp_f, priority_only)` | Outage plan, Building |
| `Backtest.run(threshold)` | Backtest |
| `WorkOrder.fetch` · member `approve(approver)` · member `dismiss(reason)` | Work orders, Asset, Building |
| `FacilitiesAgent.ask(question, as_of)` | agent drawer |
| `FailureEvent.fetch` · `Building.fetch` · `Plant.fetch` | scrubber markers, campus map |
| `RiskModel.score_all(threshold)` · `RiskModel.forecast_all()` | offline, after a seed change |

---

## 8. Running it

### In C3 Code (the intended environment)

Code sync is automatic.

```bash
# Frontend check (lint + tsc + bundle)
cd pkg22bc8209/ui/react && VITE_C3_PKG=pkg22bc8209 npm run build
```

Backend, after any seed change, via the console or `runJsCode`, **one call at a time**:

```
upsertSeedData  →  RiskModel.score_all(3.0)  →  RiskModel.forecast_all()  →  Backtest.run(3.0)
```

Regenerate the seed, then repeat the run order above:

```bash
python3 tools/datagen/interim_generator.py
# or, offline:
python3 tools/datagen/interim_generator.py --noaa-file tools/datagen/raw/noaa_USW00014837_2026.json
```

### UI outside C3 Code (no backend)

```bash
cd pkg22bc8209/ui/react && npm install
VITE_C3_PKG=pkg22bc8209 VITE_USE_FIXTURES=true npm run dev
```

Fixtures in `contract/fixtures/` are the exact shapes the backend returns. The switch defaults off and `main` never depends on it.

The campus map uses OpenStreetMap tiles from the browser; if tiles are blocked, dots, lines and tooltips still render.

---

## 9. Known limitations

- **Two false-alarm days at the default threshold.** 3.25–3.5 gives zero on this seed; we ship 3.0 and show the slider rather than pick the flattering number.
- **Monte Carlo's median is early by design.** For S3-PIPE on June 9 it says about 3 days; the planted failure is 8 days out. It is a first-crossing estimate against a level derived from the other failures; the UI shows the p10–p90 range and all four methods for that reason.
- **Small training set.** The classifier and calibration are trained on five planted failures, leave-one-failure-out. Enough to demonstrate calibration, not to claim generalisation.
- **Interim seed.** 16 buildings and 20 assets with placeholder year / square footage; the fuller generator with cited building facts replaces it in place.
- **Template text.** Briefing and agent answers are template-generated from the model's numbers (`generated_by: template`); an LLM rewrite with the same template fallback is specified as an optional upgrade.
- **Seed re-load resets work orders to pending.** The Work orders page collapses duplicates and the briefing reuses an existing draft, so repeat visits never create another.
- **No UW deployment yet.** Next step is validation on historical telemetry and work-order outcomes before any operational use.

---

## 10. Repo map and team

```
/usr/workspace
├── PROJECT.md                        this file
├── START_HERE.md, AGENTS.md          team start page; rules for people and coding agents
├── docs/                             PLAN (pitch, demo path, judge Q&A), RUBRIC, CONTRACT (data contract,
│   │                                 §5 = C3 mapping), ML, DATA, FRONTEND, RULES, briefs/<name>.md
│   └── images/                       figures used in this README (from the pitch deck)
├── contract/fixtures/*.json          exact payload shape for every call (also loaded as seed v0)
├── tools/datagen/                    interim_generator.py (real NOAA + synthetic sensors), raw/ cache
└── pkg22bc8209/                      the one C3 package
    ├── src/                          *.c3typ entity + API types, *.py implementations, WORKSPACE_SUMMARY.md
    ├── data/<Type>/*.json            seed: Plant, LoopSegment, Building, Asset, WeatherDay, SensorReading,
    │                                 FailureEvent, WorkOrder (RiskScore / RiskForecast are computed)
    └── ui/react/src/                 App.tsx, contexts/AsOfProvider, shared/api/, components/, pages/
```

| Person | Owned |
|---|---|
| Vibhrav | risk model, forecast layer, agent backend, contract and types, integration, pitch |
| Devansh | real and synthetic data, loop topology, Plan B compute |
| Arnav | UI shell (scrubber, nav), Overview, Outage plan, Backtest, Buildings, shared tokens and components |
| Anuva | Building dashboard, Asset detail, Work orders, agent drawer, risk chart and signal components |

---

## Sources

- UW–Madison News, campus cooling updates (Jun to Aug 2026)
- WPR (Jun 30 2026; Feb 8 2019)
- Cap Times (Oct 8 2026)
- WMTV / Channel 3000 (Jun 29, Jul 1 and Jul 15 2026)
- FP&M Physical Plant Operations Report (May 2021)
- NOAA GHCN-Daily, Madison Dane County Regional Airport (USW00014837)

Figures in this README are taken from the team's pitch deck.
