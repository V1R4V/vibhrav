# Editorial and motion specification

1920×1080, 30fps. Native captures: 1440×1000 at DPR2. High-quality 1080p master
is appropriate; 4K would magnify cropped native UI without adding information.
Scene time, camera, masking, cursor and text depend exclusively on Remotion
frames. No CSS animation, requestAnimationFrame, random or wall-clock animation.

- Safe area: 96px horizontal, 72px top; final caption zone below 960px.
- Principal headlines: 88–108px, controlled two-line wrap, product font.
- Supporting copy: 30–36px. UI screen text is not expected to replace headings;
  crop to the principal card at 1.3–1.8× CSS scale where reading matters.
- Nura: Inter, forest #101d17, sage #b8d77b, lavender/orange only where native.
- StudyFlow: Plus Jakarta Sans, ink #101522, periwinkle #a8bfff, cream interlude.
- Vyaya: native sans plus existing editorial serif, ink #0b1015, violet #b9a7ef,
  pale paper #f1efe8. Categories retain native colors and exact values.
- One camera per UI plane. Establish → move → hold. No incessant breathing zoom.
- Translation uses cubic-bezier(.65,0,.22,1); entrances (.16,1,.3,1).
- Normal transition: 18–30 frames; text reveal: 15–21 frames. Important holds
  last at least 2s after camera settles. Hard cuts permitted on beat/subject shift.
- Masks reveal an incoming real state; linked views share a landing rectangle.
  Daily versus period views change after the scope label, never numerical morph.
- Surface: 18px radius, fine native-tinted keyline, soft contact shadow. No fake
  glass slabs, fake device chassis, reflections obscuring charts, or invented UI.
- UI highlights: thin frame or pointer over the actual actionable control;
  pointer disappears after action. No looping rings or decorative attention spam.
- End cards: 3–4s, upright product wordmark, a short promise, readable CTA. No
  abrupt fade to black. Last frame is an intentional held composition.
- Captions: separate WebVTT, narration text with actual measured cue lengths.
  On-screen feature copy also explains the silent version. No production markers.
- Audio: product-specific licensed electronic beds chosen before the edit;
  low under speech, small punctuation for real interaction, no repeated whooshes.
  Preserve pauses after claims and settle before final CTA. Target −16LUFS,
  true peak ≤−1dBTP. Final QA records measured results and listening limitations.
- Website: viewer-initiated load/audio, preload none, explicit poster, native
  controls and captions, responsive 16:9, reduced-motion UI transitions disabled.
