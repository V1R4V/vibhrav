"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"
import { experiences } from "@/lib/portfolio-data"
import { publicCopy } from "@/lib/public-copy"
import { usePortfolioMotion } from "./portfolio-frame"
import { Atmosphere } from "./atmosphere"
import { ExperienceRoadmap } from "./experience-roadmap"
import { EvidenceText } from "./evidence-text"
import { ImpactMetrics } from "./impact-metrics"
import "./experience-stage.css"

export function ExperienceStage() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const { paused } = usePortfolioMotion()

  useEffect(() => {
    const section = root.current
    const orb = section?.querySelector(".experience-orb")
    if (!section || !orb) return
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    let visible = false
    const sync = () => { section.dataset.orbMotion = visible && !paused && !reduced.matches && !document.hidden ? "running" : "paused" }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() }, { threshold: .01 })
    observer.observe(orb)
    document.addEventListener("visibilitychange", sync)
    reduced.addEventListener("change", sync)
    sync()
    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", sync)
      reduced.removeEventListener("change", sync)
    }
  }, [paused])

  useEffect(() => {
    const section = root.current
    if (!section) return
    const roles = Array.from(section.querySelectorAll<HTMLElement>("[data-experience-role]"))
    const sculpture = section.querySelector<HTMLElement>(".experience-sculpture")
    const compact = matchMedia("(max-width: 767px) and (min-height: 501px)")
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    let frame = 0
    let within = false
    const update = () => {
      frame = 0
      if (!within) return
      const sculptureBounds = sculpture?.getBoundingClientRect()
      const compactActive = compact.matches && !reduced.matches
      const readingTop = compactActive && sculptureBounds ? Math.max(80, sculptureBounds.bottom + 12) : 110
      const focus = (Math.min(readingTop, innerHeight * .55) + innerHeight) / 2
      let closest = 0
      let distance = Infinity
      const measurements = roles.map(role => ({ role, bounds: role.getBoundingClientRect() }))
      measurements.forEach(({ bounds }, index) => {
        const next = bounds.top <= focus && bounds.bottom >= focus ? 0 : Math.min(Math.abs(bounds.top - focus), Math.abs(bounds.bottom - focus))
        if (next < distance) { distance = next; closest = index }
      })
      for (const { role, bounds } of measurements) {
        const entry = paused || reduced.matches ? 0 : Math.max(0, Math.min(1, (bounds.top - innerHeight * .58) / (innerHeight * .42)))
        role.style.setProperty("--experience-role-shift", `${(entry * 18).toFixed(2)}px`)
        role.style.setProperty("--experience-role-opacity", (1 - entry * .12).toFixed(3))
      }
      setActive(closest)
    }
    const scroll = () => { if (within && !frame) frame = requestAnimationFrame(update) }
    const observer = new IntersectionObserver(([entry]) => {
      within = entry.isIntersecting
      if (within) scroll()
    })
    observer.observe(section)
    const resize = new ResizeObserver(() => {
      if (sculpture) section.style.setProperty("--experience-compact-height", `${sculpture.offsetHeight}px`)
      scroll()
    })
    if (sculpture) resize.observe(sculpture)
    addEventListener("scroll", scroll, { passive: true })
    addEventListener("resize", scroll)
    compact.addEventListener("change", scroll)
    reduced.addEventListener("change", scroll)
    return () => {
      observer.disconnect()
      resize.disconnect()
      cancelAnimationFrame(frame)
      removeEventListener("scroll", scroll)
      removeEventListener("resize", scroll)
      compact.removeEventListener("change", scroll)
      reduced.removeEventListener("change", scroll)
    }
  }, [paused])

  const current = experiences[active]
  if (!current) return null

  return (
    <section ref={root} id="experience" className="experience-chapter p-chapter" data-chapter aria-labelledby="experience-title">
      <header className="experience-heading p-wrap">
        <div><p className="experience-kicker">Experience</p><h2 id="experience-title">{publicCopy.chapters.experience.heading}.</h2></div>
        <p>{publicCopy.chapters.experience.introduction}</p>
      </header>
      <div className="experience-layout p-wrap">
        <aside className="experience-sculpture" aria-label="Explore experience">
          <div className="experience-orb" aria-hidden="true">
            <Atmosphere variant="orb" paused={paused} />
            <div className="experience-orbit experience-orbit--outer"><span /></div>
            <div className="experience-orbit experience-orbit--inner"><span /></div>
            <div className="experience-brand" key={current.slug} data-brand={current.slug}>
              {current.logo && <span className={`experience-company-logo experience-company-logo--${current.slug}`}><Image src={current.logo} alt="" width={100} height={76} unoptimized /></span>}
              <span className="experience-brand-mark">{current.mark}</span>
            </div>
          </div>
          <div className="experience-sculpture-caption"><span>{current.org}</span><span>{String(active + 1).padStart(2, "0")} / {String(experiences.length).padStart(2, "0")}</span></div>
          <nav className="experience-role-navigation" aria-label="Select an experience">
            {experiences.map((experience, index) => <a key={experience.slug} href={`#experience-${experience.slug}`} aria-label={`${experience.org}, ${experience.role}`} aria-current={index === active ? "step" : undefined}><span aria-hidden="true" /></a>)}
          </nav>
          <div className="experience-step-navigation">
            {active > 0 ? <a href={`#experience-${experiences[active - 1].slug}`} aria-label={`Previous experience: ${experiences[active - 1].org}`}><ArrowLeft size={17} aria-hidden="true" /><span className="experience-step-label">Previous</span></a> : <span />}
            {active < experiences.length - 1 ? <a href={`#experience-${experiences[active + 1].slug}`} aria-label={`Next experience: ${experiences[active + 1].org}`}><span className="experience-step-label">Next</span><ArrowRight size={17} aria-hidden="true" /></a> : <a href="#work" aria-label="Explore the projects"><span className="experience-step-label">Projects</span><ArrowDown size={17} aria-hidden="true" /></a>}
          </div>
        </aside>
        <div className="experience-roles">
          {experiences.map((experience, index) => (
            <article key={experience.slug} id={`experience-${experience.slug}`} className="experience-role" data-experience-role data-active={index === active ? "true" : "false"} aria-labelledby={`experience-heading-${experience.slug}`}>
              <div className="experience-role-content">
              <div className="experience-role-meta"><span>{experience.org}</span><span>{experience.period}</span></div>
              <h3 id={`experience-heading-${experience.slug}`}>{experience.role}</h3>
              <p className="experience-scope">{experience.summary}</p>

              <ImpactMetrics metrics={experience.metrics} title={experience.org} />
              <ul className="experience-bullets">{experience.bullets.map((bullet, bulletIndex) => <li key={bulletIndex}><EvidenceText text={bullet} /></li>)}</ul>
              </div>
            </article>
          ))}
        </div>
      </div>
      <ExperienceRoadmap />
      <div className="experience-next p-wrap"><p>Different settings. A shared need to understand the work around the software.</p><a href="#work">Explore the projects <ArrowDown size={19} aria-hidden="true" /></a></div>
    </section>
  )
}
