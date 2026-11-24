# Nura — observed review evidence

## Finished files
- Master:54.000seconds,1920×1080,30FPS,1,620frames,H.264/yuv420p,AAC48kHz stereo,16,104,173bytes.
- Web:54.016seconds, same frame count and dimensions,7,225,900bytes. Both MP4s place the moov atom before media data for progressive playback.
- Poster: a deliberate full-resolution opening composition,4seconds into the film. VTT and SRT supplied,7 narration cues. Editable one-film source archive excludes standalone licensed music.

## What was actually reviewed
The draft was rendered in full at540p. The final was rendered at1080p, revised after independent visual review, then rendered again.95 exact-frame samples cover the opening, every chapter, eight transition/morph areas, and the last frame. The9 contact sheets are under evidence/. Representative detailed frames were inspected at1920×1080. Full native browser playback was automated at1× and0.5×,54.074s and108.098s elapsed, both reaching ended without media errors. Two dropped frames across3,240 rendered playback frames; no additional dropped frames on the half-speed pass.

The visual review used extracted frames and chronological transition strips. Automated playback is runtime evidence; it is not a claim of a human continuously watching or listening. A full listening review of the voice performance, music taste and perceived balance has not been performed. No unsupported90/100 quality stamp is asserted from technical checks alone.

## Findings corrected
1. Initial broad white lighting desaturated the ring materials. Lowered environment/key intensity, increased material response and refined shadows.
2. Two coincident ring surfaces caused black stippling. Replaced the full track behind active segments with complementary arc geometry.
3. The ring-to-timeline handoff jumped camera position and introduced a board through the still-curved band. Matched the incoming camera and delayed the base until unfolding was underway.
4. Replaced the first synthetic music exploration with licensed Vastness by Andrew Ev, cue-aware ducking and restrained authored accents. Preserved the licensed track's existing stereo space; final mix runs48kHz.
5. Zone labels did not align with their rings. Aligned the physical ring centers and delayed label entrance until the trace had moved clear.
6. Workout time-axis labels extended beyond the actual trace. Anchored them to the settled trace's endpoints and center; withheld labels during the camera move.
7. The sleep strip lacked semantic labels. Added Core/Deep/REM/Awake key plus7h38m in bed and15m awake, alongside7h23m asleep.
8. The first history shot repeated the earlier graph. Rebuilt it as a moving field of28 dates carrying native daily values, then gathering into the brand motif.
9. Held the closing title to the last frame and let the soundtrack end smoothly.
10. The plain Python HTTP server could play but not seek the MP4, exposing a false caption screenshot at0s. Replaced it with a local-only byte-range server. Subsequent1440px/390px tests sought to12s, showed the matching active caption and received206 responses. No horizontal overflow; controls enabled, autoplay off. These corrected results supersede the initial caption screenshots.
11. Renamed inspect.py to inspect-film.py after its name shadowed Python's standard inspect module during audio generation. Audio authoring then completed successfully.

## Product and data
The existing raw source validator passes2,865 checks. The film validator confirms all displayed scores, weights, mean/maximum workout heart rate, zone sums including7m15s below zone1, sleep-stage totals, baseline values, and narration bounds. A deliberately wrong workout duration was rejected; original source bytes were restored. Plot samples are intentionally whole-bpm values; the native average retains raw precision. The selected28-day window has complete score data; missing readings are never converted into a healthy-looking score.

The health estimate is81, trailing28-day estimate77, sleep estimate78 and separate recovery estimate32. Recovery is not included in health's four-pillar weights. The film makes no diagnosis, validation, medical-advice or zone-to-workout navigation claim. Animated graphics illustrate native data; no invented app screen is presented as shipped UI.

## Technical and source checks
Remotion ESLint and TypeScript checks pass; composition bundle/render passes. Full FFmpeg decode completed without errors. Black detection found no50ms black segment. Encoded master measured−16.28LUFS,−1.99dBTP,7.9LU range. These measurements establish technical headroom, not subjective audio excellence.

Changes are isolated to film production and its documentation. The website and three existing film assets are unchanged. The new film is delivered for review rather than silently replacing a live film. Rendering dependencies are isolated from the website. npm audit reports nine moderate findings in the pre-existing ESLint/minimatch development-tool chain, no high/critical findings; no runtime-website dependency change or force upgrade was made.

## Remaining limits
The smallest labels are intended for full-size/laptop viewing; the main headlines and headline numbers carry the muted story on a small player, with native captions and fullscreen available. The3D treatment is deliberately stylized, not a claim of photoreal cinematography. A continuous human watch/listen and the user's creative judgment remain the authority on whether this direction succeeds.

## Editable-source smoke check
Both delivery ZIPs pass CRC integrity checks. The standalone one-film source was extracted to a separate directory, type-checked against the pinned installed dependencies and successfully rendered frame120 with its independent composition root. No old-film module or screenshot asset is required by that root.
