# Nura verified inventory and demonstration provenance

Product: health analytics for Apple Watch exports/Shortcut data. Audience: people
who want daily and longer-term context and access to the inputs behind app
estimates. Original source commit `878caedee17e0544cc855558b3669374ab7b900e`.
Capture runs an isolated source copy with a fictional dataset; no health account
was accessed. Native typography, navigation, components and calculations remain.

| Capability | Source | Film decision |
|---|---|---|
| Unified Summary, latest/historical days | `apps/web/src/app/page.tsx` | Lead on its health card and metric tiles |
| Daily vs28day toggle | `components/HealthCards.tsx`, `HealthToggle.tsx` | Daily81 and trailing28day77 are different constructs |
| Selected-period health score | `app/health/page.tsx`, `lib/health.ts` | Month Oct24–Nov22 is30days, score78; label explicitly |
| Daily/rolling chart | `app/health/page.tsx`, `components/Chart.tsx` | Daily bars; line always trailing28days, regardless of selected scope |
| Workout list/detail, HR and zones | `app/workouts/page.tsx`, `app/workouts/[id]/page.tsx` | Actual linked Running session Nov19,17:35–18:23,48min |
| Calendar historical Summary | `components/DayJump.tsx`, Summary | Native picker click selects Nov19 with context leading up to it |
| Sleep/recovery inputs | `app/sleep/page.tsx`, `app/recovery/page.tsx` | Supporting components; period averages clearly identified |
| Direct zone→workout link | Strain zone bars are plain divs | **Not implemented. Excluded.** |
| Medical validation/diagnosis | No such evidence in implementation | **Never claimed.** Scores are app estimates |

The old seed hardcoded overnight scores and inconsistent workout traces. The
replacement `capture/nura/seed.mts` produces raw readings/workouts/sleep segments
and calls the actual engine `Collector` and `buildDataset`. It does not invent
already-good scores.252calendar days,179workouts across4activity types,14distinct
durations and3explicit watch gaps. Missing days remain missing.

`capture/nura/validate.mjs` passes2,865 assertions: timestamps/durations, zone
minute bounds, raw HR maxima/means, daily workout/exercise/energy relationships,
sleep stage sums/timeline, engine bias corrections and missing values. Exact
health-window values are in `health-values.json`, calculated by native functions.

Captures: Playwright1440×1000,DPR2, PNG2880×2000; dark mode, loaded fonts, settled
charts. `capture/nura/captures.json` records route,scroll position,focal rectangles,
source identity and SHA256 for every native state. Calendar selection and workout
navigation are executed through actual app controls. Production-only Next dev
portal is hidden; no product components/text are modified.

Claims excluded from the46second story: Body Age, clinical validation, medical
recommendations, causal workout/recovery conclusions, target-planner promises,
comprehensive health monitoring. Native estimate labels/uncertainty remain.
