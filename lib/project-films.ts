export type ProductFilm = {
  slug: string; name: string; duration: number; src: string; poster: string; mark: string; captions: string; summary: string; appUrl: string | null; projectHref: string | null; transcript: string[]
}

export const productFilms: ProductFilm[] = [
  {
    "slug": "vyaya",
    "name": "Vyaya",
    "duration": 26.1,
    "src": "/cinematic/films/vyaya-26.mp4",
    "poster": "/cinematic/films/vyaya-poster.webp",
    "mark": "/cinematic/films/vyaya-mark.svg",
    "captions": "/cinematic/films/vyaya.vtt",
    "summary": "Track spending, see where your salary goes, and plan across three lanes.",
    "appUrl": null,
    "projectHref": "/projects/vyaya",
    "transcript": [
      "A few purchases. A few subscriptions. It adds up.",
      "Vyaya keeps your spending in view, so you can see where your salary goes.",
      "Track expenses. Compare categories. Check what's left.",
      "And keep everyday spending, funding, and repayments in three separate lanes.",
      "Try Vyaya."
    ]
  },
  {
    "slug": "studyflow",
    "name": "StudyFlow",
    "duration": 81,
    "src": "/cinematic/films/studyflow-81.mp4",
    "poster": "/cinematic/films/studyflow-poster.webp",
    "mark": "/cinematic/films/studyflow-mark.svg",
    "captions": "/cinematic/films/studyflow.vtt",
    "summary": "Plan a week, focus on a subject, record a session, and follow your progress.",
    "appUrl": "https://studyflow-v1r4v.vercel.app/",
    "projectHref": "/projects/studyflow",
    "transcript": [
      "Know what you are studying. Make time for it.",
      "Name your subjects and give each one a colour. Your plan, sessions, and statistics stay connected.",
      "Set a weekly goal in Command Center. Spread the hours across your week, beside the time already studied.",
      "Choose Pomodoro, a custom countdown, or a stopwatch. Breaks are tracked separately.",
      "Choose a subject and start. Pause, log a distraction, then resume the same session.",
      "Rate your focus and note what you worked on. Save the session, and the time counts toward your goals.",
      "Find past sessions by subject or date, with notes, ratings, and distractions.",
      "See where your time went, by subject, weekday, and hour. Change the range to compare another period.",
      "Try a daily study target. Move the slider to see whether your pace meets the week's remaining goals.",
      "See your study pattern, day by day.",
      "Try Study Flow."
    ]
  },
  {
    "slug": "nura",
    "name": "Nura",
    "duration": 80,
    "src": "/cinematic/films/nura-80.mp4",
    "poster": "/cinematic/films/nura-poster.webp",
    "mark": "/cinematic/films/nura-mark.svg",
    "captions": "/cinematic/films/nura.vtt",
    "summary": "A walkthrough of recovery, sleep, strain, and the readings behind each score.",
    "appUrl": "https://nura-v1r4v.vercel.app",
    "projectHref": null,
    "transcript": [
      "Your watch measures. Nura shows the working.",
      "Recovery compares last night with your own previous twenty-eight nights. Open it to see heart-rate variability, sleeping heart rate, and sleep, with the weights shown.",
      "Sleep looks beyond the hours. Duration, regularity, and interruptions make up most of the score. Sleep need includes strain, sleep debt, and naps.",
      "Strain tracks how much work your heart did, on a zero-to-twenty-one scale. Harder minutes count more. Open a workout to inspect heart-rate zones and training load.",
      "Health score combines fitness, activity, sleep, and resting heart rate. See how each part contributes.",
      "Cardio compares your estimated fitness with your age group, alongside heart-rate trends.",
      "The target planner shows how changes could move your score, with the assumptions visible.",
      "Body Age estimates your habits in years above or below your calendar age. It uses six-month averages, with each factor shown.",
      "Inspect the formulas, weights, research, and limitations behind each estimate.",
      "Your data, explained. Try Nura."
    ]
  }
]

export const getProductFilm = (slug: string) => productFilms.find(film => film.slug === slug)
export function filmLength(seconds: number) {
  const rounded = Math.round(seconds)
  return rounded < 60 ? `${rounded}s` : `${Math.floor(rounded / 60)}m ${rounded % 60}s`
}
