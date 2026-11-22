# Product films

The homepage film shelf and `/films/{vyaya,studyflow,nura}` use one metadata source,
`lib/project-films.ts`. Vyaya and StudyFlow also use the player on their project
pages. Nura has a film page without changing the reviewed project catalogue.

Playback starts on a viewer action. Videos use `preload="none"`, native controls,
inline mobile playback and optional English captions. Dialogs restore focus and
scroll position. Device reduced motion removes player transitions. Without
JavaScript, native playback and direct film-page links remain available.

## Exports

| Film | Duration | Narration | SHA-256 |
| --- | --- | --- | --- |
| Vyaya | 26.1 seconds | Female | `7594e9370d1ed11ecb9e804bcb448235f5ec4654dd71e3f89d73088d8f3d8ce0` |
| StudyFlow | 81 seconds | Male | See the deployed MP4 |
| Nura | 80 seconds | Female | See the deployed MP4 |

Vyaya is the exact user-approved export. All films show independently prepared
synthetic app data. Raw captures and production material are outside public assets.
Vyaya's public app URL is pending; its film page omits a trial link until verified.

## Asset licenses

- Music from [Mixkit](https://mixkit.co/license/modal/musicFree/): Cat Walk by Arulo
  (Vyaya), Deep Urban by Eugenio Mininni (StudyFlow), Digital Clouds by Alejandro
  Magaña (Nura). Music is distributed only as part of the films.
- Studio lighting: [Studio Small 08](https://polyhaven.com/a/studio_small_08) by
  Sergej Majboroda, Poly Haven, CC0.
- Interface sounds: [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds), CC0.

## Verification

The full browser suite passed 133 cases; contact tests passed 19 cases. Typecheck,
production build, and lint passed, with six pre-existing image warnings. Focused
film tests cover intent loading, actual playback, keyboard dismissal and focus,
no-JavaScript playback, captions, public app links and mobile dialog bounds.
Additional browser inspection verified 1440/1024/390px layouts, all three runtimes,
seeking responses, and no accessibility violations in the Nura page or film dialog.
