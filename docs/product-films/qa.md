# Render review log

## Nura draft 1 — decoded 46-second MP4

Evidence: `film-production/qa/nura/draft-1/` survey plus dense transition strips.
The original has been preserved. This is an actual rendered-output critique,
not a build-success check. Extracted frames and chronological samples were
visually inspected; full audiovisual viewing/listening is not claimed.

Observed improvements: product visible at frame0, unified health overview in
opening, clear daily card then explicitly scoped Month78, chart and workout
trace readable, real calendar, supporting sleep/recovery late, intentional held
end card. New source-derived seed removes old workout and sleep inconsistencies.

Defects found and fixed for draft2:

- Font assets were static Semibold/Extrabold masquerading as variable. Replaced
  with the actual official variable families and defined their weights.
- Historical-summary reveal had a zero-height wrapper; calendar stayed isolated
  after its introductory copy disappeared. Gave the mask an explicit full-frame
  layout so the selected day is actually revealed.
- Sleep crop extended into the next component, creating a stray lower strip.
  Crop now ends at the real native component edge.
- Daily detail wasted40% of its surface on an uninformative “nothing stands
  out” card. Camera now lands on the health card itself, with clear side copy.
- Period card was too close to bottom safe area. Reduced its width and kept the
  complete native component within frame.
- Every scene used the same wipe. Kept wipes only for intentional scope/palette
  changes; chart and workout context use clean cuts.
- Voice was too brisk for the reading pace. Re-synthesized at.88 with longer
  pauses; every cue fits its allotted window without stretching audio.

At this draft stage, rendered-frame, playback, audio and integration review
remained open. Subsequent findings and release evidence follow below.

## Nura final picture review

Decoded final master:46s,1380frames,1920×1080. Evidence in
`review-evidence/nura-*`. Inspected opening, all scene changes, chart/workout/
calendar boundaries, supporting sleep/recovery and held end. The calendar's old
lower edge briefly survived the historical-summary mask in draft2; the outgoing
calendar now fades fully and the historical date label changes to Nov19. Final
transition strip shows the clean settled summary. No poster is baked into frame0.

Daily81, selected30-day78 and trailing28-day77 remain distinct constructs.
The48-minute workout zones total40m45s; the film explicitly accounts for7m15s
below zone1. No direct zone→workout link, causal health inference or scientific
validation claim is added. Native estimate labels remain. Sleep/recovery enter
only at34s, after overview, trend, workout and history context.

## StudyFlow final picture review

Decoded final master:44s,1320frames. Evidence in
`review-evidence/studyflow-*`. The first draft's statistics crop clipped its
header and included the next Activity header. Replaced it with measured native
Time Distribution/Subject Breakdown bounds. The timer captures originally cut
lower controls; recaptured at a deterministic scroll offset. Measured button
bounds corrected the cursor from the distraction control to Start/Pause/Resume.
The final transition strip shows the correct native controls and settled states.

One real native45-minute save connects the story:585→630weekly minutes,
69→75goal credit,2605all-time minutes and41saved sessions. The12-minute time
jump is labeled. Session notes, rating and timestamps agree with the saved row.
The male voice is `am_michael`; no cloned or impersonated person.

## Vyaya final picture review

Decoded final master:34s,1020frames. Evidence in
`review-evidence/vyaya-*`. Draft1 cut off the lane balance, and the category shot
showed charts without the promised purchases. The final film separates the
native lane control from its complete card, and adds a fresh native scrolled
capture of the three November grocery rows. Final lane strips retain every
principal amount; no partial next panel is shown.

The real$5.25entry changes spend5005.45→5010.70 and tracked net6424.55→6419.30.
The189-row ledger preserves all188prior records. Funding18500in/out and
settlement114.45in/600out remain separate from Everyday. Net is explicitly
tracked money, not a verified bank account balance. Salary is generic.

## Audio defect and correction

The first single-pass normalized StudyFlow export measured−17.87LUFS, outside
the−16±1target. This failed the release check. Two-pass measured loudness
normalization now reserves−2dBTPheadroom before AAC; final exports are decoded
and measured again. Picture packets are SHA256-verified unchanged during audio
remux. No animation/transition/source capture was silently altered to fix sound.
`audio/*-mix.log`, `qa/audio-remux.json` and `qa/technical/` retain the evidence.

## Inspection limits

Visual review uses exact decoded frames, full-resolution crops and chronological
transition strips. Automated real browser playback at1× and transition intervals
at.5× is technical evidence. It is not a claim of human continuous viewing or
full-film listening. The final voice performance still benefits from a human
listen on speakers/headphones; measurements alone cannot certify naturalness.
Dense native interface details are best inspected in fullscreen on a phone;
feature headlines, principal figures, captions and transcripts carry the story
in smaller inline players.

## Final technical delivery measurements

| Film | Integrated loudness | True peak | Captions | Complete decode |
|---|---:|---:|---:|---|
| nura | -16.01 LUFS | -1.95 dBTP | 8 cues | Passed |
| studyflow | -16.70 LUFS | -1.90 dBTP | 7 cues | Passed |
| vyaya | -16.42 LUFS | -1.96 dBTP | 6 cues | Passed |

All video streams are1920×1080,30FPS,H.264/yuv420p. Exact frame counts are
1380/1320/1020. AAC/video end times differ by less than50ms. All caption
text and cue bounds match measured narration; no overlap/overflow. Complete
FFmpeg decode reports no error and no unexpected black interval≥100ms.

The portfolio production build, separate Remotion lint/typecheck, root
typecheck/lint and19contact tests pass. Root lint retains six pre-existing
image warnings. The full browser suite and extended playback checks have
separate reports; their final outcomes are recorded in the release notes.

## Browser playback and integration results

All three web exports played to the end at1× in actual Chrome. The player's
reported decoded frame statistics show0dropped frames and no waiting events
for each complete playback. Then11Nura,10StudyFlow and9Vyaya transition intervals
were exercised at.5×. These are automated playback measurements, not human
continuous viewing/listening claims. `playback-results.json` retains exact values.

All three films load only after viewer intent, return206for byte-range seeking,
load the correct8/7/6English caption cues, fit342×192.375px in a390px viewport,
and have0axe violations within the film player. A complete-page axe scan also
records an existing name mismatch on the header/footerVJwordmarks, confirmed
unchanged from baseline6e129082; those unrelated labels have not been rewritten.
The scan fails on any unexpected rule or target instead of hiding the baseline.

The full133-test portfolio regression suite passed in9minutes, alongside19contact
tests. A separately repeated rapid Escape test exposed an intermittent existing
CSS-presence problem: a closed dialog could remain mounted until an animation
finished. A new paused-exit regression test fails on the old player. The fix
makes portal lifetime follow actual open state, so closing immediately unmounts
and pauses the video and restores focus, independent of CSS animation events.
Opening keeps its original entrance; a stalled exit cannot retain audio/focus.
The post-fix focused tests and production verification are recorded at release.

## Evidence-based editorial self-assessment

These are this editor's judgments from decoded output, full-resolution crops,
source verification and browser/technical measurements. They are not independent
certification or a claim that a numeric score proves premium craft.

| Dimension | Nura | StudyFlow | Vyaya | Observed basis |
|---|---:|---:|---:|---|
| Story /20 |19|19|18|Product visible immediately; ordered context, one coherent session, concrete ledger action|
| Native UI /20 |19|19|19|DPR2captures, measured crops, source-derived/validated records, actual saves|
| Motion /20 |18|18|18|No empty fades; stable reading holds, continuous camera, distinct cuts/scope masks; ordered transition strips|
| Compositing /10 |9|9|9|Purposeful flat UI, consistent fine edges/shadows; unnecessary3D removed|
| Type /10 |9|9|9|Actual variable fonts, product-specific hierarchy, readable principal figures and deliberate end cards|
| Sound /10 |8|8|8|Measured cues, sparse interaction sound, licensed beds and final loudness/peak checks; human listening limit retained|
| Delivery /10 |9|9|9|Responsive intent-loaded player, captions/transcripts, byte seeking, small web files and preserved originals|
| Total /100 |91|91|90|Subjective, bounded by the inspection limitations above|

No failed delivery gate is waived by these scores. Remaining limitations are the
human audiovisual review, dense small-phone UI details, unavailable Vyaya public
URL and the explicitly recorded pre-existing page-wordmark accessibility issue.

## Source and delivery review

Correctness: the new close regression reproduces on the old production build;
portal lifetime now follows open state and video cleanup is immediate.
Readability: one controlled boolean; no extra timer or animation-event coupling.
Architecture: separate pinned Remotion/React19toolchain; root Next remainsReact18.
Security: fictional local capture contexts, no private accounts or secrets in
footage; source music is not separately distributed. Performance: total new web
video7.26MBversus20.84MBpreviously (about65%smaller), no pre-intent movie fetch,
native byte seeking, and static composed posters. Old exports remain untouched.

A local incremental rebuild hit an internal WebpackWasmHashcache exception. A
clean generated-cache rebuild passed; no source check was skipped or weakened.
The first failed targeted test and the paused-animation regression are retained
in local QA logs; final post-fix results are separate.
