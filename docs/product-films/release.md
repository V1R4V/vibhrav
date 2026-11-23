# Final release —22November2026

Live: https://vibhrav.vercel.app/#product-films
Application code: `8e50ad65330608eacfc2603291341e983558a4f1`.
Production deployment: `dpl_6Z91ZE5hdGC9yzwFw5GAmgXCYuWB`, READY, targetproduction.
The public alias was explicitly promoted after the post-fix checks passed.

- Three finished web movies: Nura46s,StudyFlow44s,Vyaya34s.
- Full portfolio regression:133passed before the close fix.
- Post-fix focused suite:6passed, including the previously failing stalled-exit
  regression, rapid Escape, focus return, no-JavaScript controls and mobile modal.
- Root production build, lint and typecheck passed; separate Remotion checks
  passed;19contact tests passed. Six unrelated existing image lint warnings remain.
- Final public-origin browser smoke passed for allthree films: intent loading,
  actual playback, captions,206byte seeking, mobile bounds, no new accessibility
  violations, Escape cleanup, restored focus and no retained video.
- Downloaded production movie hashes exactly match reviewed local web exports:
  see `production-hashes.json`. Browser results are in
  `production-playback-results.json`.
- All original movies remain in the repository for rollback.

High-quality upload masters, captions, scripts and a ZIP were also copied into
`Portfolio Website/output/product-films/final-2026-11-22/` and the adjacent
`Product-Films-Final-1080p.zip`. That stable local delivery directory is ignored
by Git. Master hashes are recorded in `asset-manifest.json`; both web and master
AACaudio passed loudness/true-peak checks. The website deliberately serves the
smaller web versions, not the upload masters.

The latest change removes dependence on a CSS animation ending before the film
player can close. Video/audio now unmount immediately and keyboard focus returns.
The successful opening entrance remains. This was reproduced failing on the old
player and passing on the new one; no timing assertion was relaxed.

Inspection remains decoded-frame/contact-sheet/transition review plus automated
normal and half-speed browser playback. Full human continuous viewing/listening
is not claimed. Remaining bounds and the pre-existing wordmark accessibility
issue are explicitly described in `qa.md`; no silent exception is introduced.
