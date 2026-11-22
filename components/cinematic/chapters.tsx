import { ArrowDown } from "lucide-react"
import { publicCopy } from "@/lib/portfolio-data"
import { ExperienceStage } from "./experience-stage"
import { ProjectGallery } from "./project-gallery"
import { SkillsChapter } from "./skills-chapter"
import { LeadershipChapter } from "./leadership-chapter"
import { FootballChapter } from "./football-chapter"
import "./chapters.css"

export function PortfolioChapters() {
  return <>
    <ExperienceStage />
    <ProjectGallery />
    <SkillsChapter />
    <LeadershipChapter />
    <section id="about" className="p-about p-chapter p-wrap" data-chapter aria-labelledby="about-title">
      <div className="p-about-copy">
        <h2 id="about-title" className="p-heading" data-reveal>{publicCopy.chapters.about.heading}</h2>
        {publicCopy.about.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        <a className="p-text-link" href="#contact">Get in touch <ArrowDown size={17} aria-hidden /></a>
      </div>
      <FootballChapter />
    </section>
  </>
}
