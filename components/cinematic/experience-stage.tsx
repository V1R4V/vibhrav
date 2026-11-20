"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react"
import { experiences } from "@/lib/portfolio-data"
import { usePortfolioMotion } from "./portfolio-frame"
import { Atmosphere } from "./atmosphere"
import "./experience-stage.css"

export function ExperienceStage() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const { paused } = usePortfolioMotion()

  useEffect(() => {
    const section = root.current
    if (!section) return
    const roles = Array.from(section.querySelectorAll<HTMLElement>("[data-experience-role]"))
    let frame = 0
    let within = false
    const update = () => {
      frame = 0
      if (!within) return
      const focus = innerHeight * .52
      let closest = 0
      let distance = Infinity
      roles.forEach((role, index) => {
        const bounds = role.getBoundingClientRect()
        const next = Math.abs((bounds.top + bounds.bottom) / 2 - focus)
        if (next < distance) { distance = next; closest = index }
      })
      setActive(closest)
    }
    const scroll = () => { if (within && !frame) frame = requestAnimationFrame(update) }
    const observer = new IntersectionObserver(([entry]) => {
      within = entry.isIntersecting
      if (within) scroll()
    })
    observer.observe(section)
    addEventListener("scroll", scroll, { passive: true })
    addEventListener("resize", scroll)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      removeEventListener("scroll", scroll)
      removeEventListener("resize", scroll)
    }
  }, [])

  const current = experiences[active]
  if (!current) return null

  return (
    <section ref={root} id="experience" className="experience-chapter p-chapter" data-chapter aria-labelledby="experience-title">
      <header className="experience-heading p-wrap">
        <div><p className="experience-kicker">Experience</p><h2 id="experience-title">Engineering that<br />changes the workflow.</h2></div>
        <p>Helping proposal teams reuse approved knowledge, researchers process field recordings, and teaching staff operate a data-management course.</p>
      </header>
      <div className="experience-layout p-wrap">
        <aside className="experience-sculpture" aria-label="Explore experience">
          <div className="experience-orb" aria-hidden="true">
            <Atmosphere variant="orb" paused={paused} />
            <div className="experience-orbit" />
            <div className="experience-brand" key={current.slug}>
              <span className="experience-brand-mark">{current.mark}</span>
            </div>
          </div>
          <div className="experience-sculpture-caption"><span>{current.org}</span><span>{String(active + 1).padStart(2, "0")} / {String(experiences.length).padStart(2, "0")}</span></div>
          <nav className="experience-role-navigation" aria-label="Select an experience">
            {experiences.map((experience, index) => <a key={experience.slug} href={`#experience-${experience.slug}`} aria-label={`${experience.org}, ${experience.role}`} aria-current={index === active ? "step" : undefined}><span aria-hidden="true" /></a>)}
          </nav>
          <div className="experience-step-navigation">
            {active > 0 ? <a href={`#experience-${experiences[active - 1].slug}`} aria-label={`Previous experience: ${experiences[active - 1].org}`}><ArrowLeft size={17} aria-hidden="true" /> Previous</a> : <span />}
            {active < experiences.length - 1 ? <a href={`#experience-${experiences[active + 1].slug}`} aria-label={`Next experience: ${experiences[active + 1].org}`}>Next <ArrowRight size={17} aria-hidden="true" /></a> : <a href="#work">Projects <ArrowDown size={17} aria-hidden="true" /></a>}
          </div>
        </aside>
        <div className="experience-roles">
          {experiences.map((experience, index) => (
            <article key={experience.slug} id={`experience-${experience.slug}`} className="experience-role" data-experience-role data-active={index === active ? "true" : "false"} aria-labelledby={`experience-heading-${experience.slug}`}>
              <div className="experience-role-meta"><span>{experience.org}</span><span>{experience.period}</span></div>
              <h3 id={`experience-heading-${experience.slug}`}>{experience.role}</h3>
              <p className="experience-scope">{experience.summary}</p>
              <ul className="experience-bullets">{experience.bullets.map((bullet, bulletIndex) => <li key={bulletIndex}>{bullet}</li>)}</ul>
            </article>
          ))}
        </div>
      </div>
      <div className="experience-next p-wrap"><p>Different settings. A shared need to understand the work around the software.</p><a href="#work">Explore the projects <ArrowDown size={19} aria-hidden="true" /></a></div>
    </section>
  )
}
