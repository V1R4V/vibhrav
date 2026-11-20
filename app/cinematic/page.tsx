import type { Metadata } from "next"
import { CinematicHero } from "@/components/cinematic/hero"
import { PortfolioFrame } from "@/components/cinematic/portfolio-frame"
import { PortfolioChapters } from "@/components/cinematic/chapters"
import { ContactForm } from "@/components/cinematic/contact-form"
import "./cinematic.css"

export const metadata: Metadata = {
  title: "Vibhrav Jha — Software engineer",
  description: "Software engineering across AI, web and systems. Selected work and experience by Vibhrav Jha.",
  robots: { index: false, follow: false },
  other: {
    "page-type": "software",
    "site-kind": "software",
  },
}

export default function CinematicPage() {
  return <PortfolioFrame home><main id="introduction" tabIndex={-1}><CinematicHero /><PortfolioChapters /><ContactForm /></main></PortfolioFrame>
}
