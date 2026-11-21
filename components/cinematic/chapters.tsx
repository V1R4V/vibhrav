import { ArrowDown } from "lucide-react"
import { leadership, publicCopy } from "@/lib/portfolio-data"
import { ExperienceStage } from "./experience-stage"
import { ProjectGallery } from "./project-gallery"
import { SkillsChapter } from "./skills-chapter"
import { EvidenceText } from "./evidence-text"
import { ImpactMetrics } from "./impact-metrics"
import "./chapters.css"

function FieldDrawing() {
  return (
    <svg className="p-field" viewBox="0 0 480 620" fill="none" aria-hidden="true">
      <g className="p-field-lines">
        <rect x="45" y="45" width="390" height="530" rx="2" />
        <path d="M45 310h390M165 45v84h150V45M208 45v30h64V45M165 575v-84h150v84M208 575v-30h64v30" />
        <circle cx="240" cy="310" r="57" />
        <circle cx="240" cy="310" r="2" fill="currentColor" />
        <path d="M196 129a55 55 0 0 0 88 0M196 491a55 55 0 0 1 88 0" />
        <circle cx="240" cy="104" r="2" fill="currentColor" />
        <circle cx="240" cy="516" r="2" fill="currentColor" />
      </g>
      <path className="p-field-route" d="M130 453c-4-92 169-64 158-151-8-67-94-65-75-127 9-29 35-37 61-51" />
      <circle className="p-field-ball" cx="130" cy="453" r="8" />
      <path className="p-field-arrow" d="m257 123 20-1-7 19" />
    </svg>
  )
}

export function PortfolioChapters() {
  const [recwell, ...ventureRoles] = leadership
  return <>
    <ExperienceStage />
    <ProjectGallery />
    <SkillsChapter />
    <section id="leadership" className="p-leadership p-chapter" data-chapter aria-labelledby="leadership-title">
      <div className="p-wrap">
        <div className="p-leadership-head">
          <h2 id="leadership-title" className="p-heading" data-reveal>{publicCopy.chapters.leadership.heading}</h2>
          <div className="p-leadership-intro"><p>{publicCopy.leadershipIntroduction}</p></div>
        </div>
        {recwell && <article className="p-recwell" aria-labelledby="recwell-title">
          <div className="p-leadership-role"><p className="p-label">{recwell.org}</p><p>{recwell.role}</p><p className="leadership-period">{recwell.period}</p><p className="leadership-period">Previously {recwell.previousRole}</p></div>
          <div className="p-recwell-story"><h3 id="recwell-title">{recwell.heading}</h3><p className="p-recwell-scope"><EvidenceText text={recwell.scope} /></p><ImpactMetrics metrics={recwell.metrics} title={recwell.org} /><ul className="leadership-bullets">{recwell.bullets.map(bullet => <li key={bullet}><EvidenceText text={bullet} /></li>)}</ul></div>
        </article>}
        <div className="p-venture-roles">{ventureRoles.map(role => <article className="p-venture-role" key={role.org}>
          <p className="p-label">{role.org}</p><p className="p-venture-position">{role.role}{role.period && <><br />{role.period}</>}</p>
          <h3>{role.heading}</h3><p><EvidenceText text={role.scope} /></p><ImpactMetrics metrics={role.metrics} title={role.org} /><ul className="leadership-bullets">{role.bullets.map(bullet => <li key={bullet}><EvidenceText text={bullet} /></li>)}</ul>
        </article>)}</div>
        <div className="recognition"><span>Academic recognition</span><p>{publicCopy.about.recognition}</p></div>
      </div>
    </section>
    <section id="about" className="p-about p-chapter p-wrap" data-chapter aria-labelledby="about-title">
      <div className="p-about-copy">
        <h2 id="about-title" className="p-heading" data-reveal>{publicCopy.chapters.about.heading}</h2>
        {publicCopy.about.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        <div className="p-about-personal"><h3>{publicCopy.about.personalHeading}</h3><p>{publicCopy.about.personal}</p></div>
        <a className="p-text-link" href="#contact">Get in touch <ArrowDown size={17} aria-hidden /></a>
      </div>
      <div className="p-about-visual"><FieldDrawing /></div>
    </section>
  </>
}
