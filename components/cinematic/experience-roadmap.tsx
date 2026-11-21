"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import { experiences } from "@/lib/portfolio-data"
import { usePortfolioMotion } from "./portfolio-frame"
import "./experience-roadmap.css"

/** A compact, chronological overview after the detailed experience sequence. */
export function ExperienceRoadmap() {
  const root = useRef<HTMLElement>(null)
  const { paused } = usePortfolioMotion()

  useEffect(() => {
    const section = root.current
    if (!section) return
    const track = section.querySelector<HTMLElement>(".experience-roadmap-track")!
    const progress = section.querySelector<HTMLElement>(".experience-roadmap-progress")!
    const cards = Array.from(section.querySelectorAll<HTMLElement>(".experience-roadmap-card"))
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    let within = false
    let frame = 0
    const update = () => {
      frame = 0
      const still = paused || reduced.matches
      const bounds = track.getBoundingClientRect()
      const fraction = Math.max(0, Math.min(1, (innerHeight * .62 - bounds.top) / bounds.height))
      progress.style.transform = `scaleY(${still ? 1 : fraction})`
      const positions = cards.map(card => ({ card, top: card.getBoundingClientRect().top }))
      for (const { card, top } of positions) {
        const entering = still ? 0 : Math.max(0, Math.min(1, (top - innerHeight * .72) / (innerHeight * .28)))
        const side = card.dataset.side === "left" ? -1 : 1
        card.style.transform = `translate3d(${side * entering * 24}px, ${entering * 12}px, 0)`
        card.style.opacity = String(1 - entering * .12)
      }
    }
    const schedule = () => { if (within && !frame) frame = requestAnimationFrame(update) }
    const observer = new IntersectionObserver(([entry]) => {
      within = entry.isIntersecting
      if (within) schedule()
    }, { rootMargin: "100px" })
    observer.observe(section)
    addEventListener("scroll", schedule, { passive: true })
    addEventListener("resize", schedule)
    reduced.addEventListener("change", schedule)
    update()
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      removeEventListener("scroll", schedule)
      removeEventListener("resize", schedule)
      reduced.removeEventListener("change", schedule)
      progress.style.removeProperty("transform")
      for (const card of cards) { card.style.removeProperty("transform"); card.style.removeProperty("opacity") }
    }
  }, [paused])

  return (
    <section ref={root} className="experience-roadmap p-wrap" aria-labelledby="experience-roadmap-title">
      <header className="experience-roadmap-heading">
        <p className="experience-kicker">Experience · At a glance</p>
        <h3 id="experience-roadmap-title">The path so far.</h3>
        <p>Current work first. A view across the engineering, research and teaching behind it.</p>
      </header>
      <nav className="experience-roadmap-track" aria-label="Career roadmap">
        <div className="experience-roadmap-spine" aria-hidden="true"><span className="experience-roadmap-progress" /></div>
        <ol>
          {experiences.map((experience, index) => (
            <li key={experience.slug} className="experience-roadmap-stop" data-side={index % 2 ? "right" : "left"}>
              <span className="experience-roadmap-node" aria-hidden="true" />
              <a href={`#experience-${experience.slug}`} className="experience-roadmap-card" data-side={index % 2 ? "right" : "left"}>
                <p className="experience-roadmap-period">{experience.period}</p>
                <div className="experience-roadmap-identity">
                  {experience.logo && <span className={`experience-roadmap-logo experience-roadmap-logo--${experience.slug}`}><Image src={experience.logo} alt="" width={48} height={48} /></span>}
                  <div><p>{experience.org}</p><h4>{experience.role}</h4></div>
                  <ArrowUpRight size={20} aria-hidden="true" />
                </div>
                <p className="experience-roadmap-summary">{experience.summary}</p>
                {experience.metrics && <ul className="experience-roadmap-metrics" aria-label={`${experience.org} scope`}>
                  {experience.metrics.slice(0, 2).map(metric => <li key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></li>)}
                </ul>}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </section>
  )
}
