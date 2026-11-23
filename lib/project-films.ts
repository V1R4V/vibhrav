export type ProductFilm = {
  slug: string; name: string; duration: number; src: string; poster: string; mark: string; captions: string; summary: string; appUrl: string | null; projectHref: string | null; transcript: string[]
}

export const productFilms: ProductFilm[] = [
  {
    "slug": "vyaya",
    "name": "Vyaya",
    "duration": 34,
    "src": "/cinematic/films/vyaya-34-v3.mp4",
    "poster": "/cinematic/films/vyaya-v3-poster.webp",
    "mark": "/cinematic/films/vyaya-mark.svg",
    "captions": "/cinematic/films/vyaya-v3.vtt",
    "summary": "See tracked income and spending, inspect purchases, and keep funding and repayments in separate lanes.",
    "appUrl": null,
    "projectHref": "/projects/vyaya",
    "transcript": [
      "Vyaya keeps your spending in view.",
      "See what came in, where it went, and what remains from the money you've tracked.",
      "Open a category to see the purchases behind it.",
      "Add the next purchase, give it a category, and keep the picture current.",
      "Keep everyday spending separate from funding and repayments, in three lanes.",
      "Vyaya. Your money, in view."
    ]
  },
  {
    "slug": "studyflow",
    "name": "StudyFlow",
    "duration": 44,
    "src": "/cinematic/films/studyflow-44-v3.mp4",
    "poster": "/cinematic/films/studyflow-v3-poster.webp",
    "mark": "/cinematic/films/studyflow-mark.svg",
    "captions": "/cinematic/films/studyflow-v3.vtt",
    "summary": "Plan a week, focus on a subject, record a session, and follow your progress.",
    "appUrl": "https://studyflow-v1r4v.vercel.app/",
    "projectHref": "/projects/studyflow",
    "transcript": [
      "Plan your week. See your study time count.",
      "Give each subject a goal. Put the hours on your calendar.",
      "Choose a subject and start. Pause when you need to, then return to the same session.",
      "Keep the time, rate your focus, and note what you worked on.",
      "Save once. Your session appears in the log, and your goal progress updates.",
      "Find the session later, or step back and see where your study time went.",
      "Plan. Focus. Follow through. With Study Flow."
    ]
  },
  {
    "slug": "nura",
    "name": "Nura",
    "duration": 46,
    "src": "/cinematic/films/nura-46-v3.mp4",
    "poster": "/cinematic/films/nura-v3-poster.webp",
    "mark": "/cinematic/films/nura-mark.svg",
    "captions": "/cinematic/films/nura-v3.vtt",
    "summary": "Apple Watch analytics in context: daily summaries, longer-term trends, workouts, sleep and recovery.",
    "appUrl": "https://nura-v1r4v.vercel.app",
    "projectHref": null,
    "transcript": [
      "Nura brings your Apple Watch data into one view.",
      "Start with today's summary, and see what contributes to your health score.",
      "Then take a longer view. A selected-period score summarizes the dates you choose.",
      "Daily bars and a twenty-eight-day line keep the two views distinct.",
      "Open a workout. Follow its heart-rate trace, and see time in each zone.",
      "Use the calendar to return to a day, with the weeks that led up to it.",
      "Sleep and recovery add context. The scores are estimates, with their inputs shown.",
      "Nura. Health data, made understandable."
    ]
  }
]

export const getProductFilm = (slug: string) => productFilms.find(film => film.slug === slug)
export function filmLength(seconds: number) {
  const rounded = Math.round(seconds)
  return rounded < 60 ? `${rounded}s` : `${Math.floor(rounded / 60)}m ${rounded % 60}s`
}
