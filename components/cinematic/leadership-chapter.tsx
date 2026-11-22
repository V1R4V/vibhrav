"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ArrowUpRight } from "lucide-react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { leadership, publicCopy } from "@/lib/portfolio-data"
import { usePortfolioMotion } from "./portfolio-frame"
import { EvidenceText } from "./evidence-text"
import { ImpactMetrics } from "./impact-metrics"
import "./leadership-chapter.css"

export function LeadershipChapter() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const { paused } = usePortfolioMotion()

  useEffect(() => {
    const section = root.current
    if (!section) return
    const roles = Array.from(section.querySelectorAll<HTMLElement>("[data-leadership-role]"))
    let frame = 0
    let visible = false
    const update = () => {
      frame = 0
      const positions = roles.map(role => role.getBoundingClientRect())
      let current = 0
      positions.forEach((bounds, index) => { if (bounds.top < innerHeight * .55) current = index })
      setActive(current)
    }
    const schedule = () => { if (visible && !frame) frame = requestAnimationFrame(update) }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule() })
    observer.observe(section)
    addEventListener("scroll", schedule, { passive: true })
    addEventListener("resize", schedule)
    update()
    return () => { observer.disconnect(); cancelAnimationFrame(frame); removeEventListener("scroll", schedule); removeEventListener("resize", schedule) }
  }, [])

  useEffect(() => {
    if (!root.current || paused) return
    gsap.registerPlugin(ScrollTrigger)
    const context = gsap.context(() => {
      gsap.fromTo(".leadership-sculpture", { rotateY: -24, rotateX: 14 }, {
        rotateY: 28, rotateX: -12, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: .8 },
      })
      root.current!.querySelectorAll<HTMLElement>("[data-leadership-role]").forEach(role => {
        gsap.fromTo(role, { y: 26, z: -45 }, { y: 0, z: 0, ease: "none", scrollTrigger: { trigger: role, start: "top bottom", end: "top 32%", scrub: .5 } })
      })
    }, root)
    return () => context.revert()
  }, [paused])

  return (
    <section ref={root} id="leadership" className="p-leadership p-chapter" data-chapter aria-labelledby="leadership-title">
      <div className="p-wrap">
        <header className="p-leadership-head">
          <h2 id="leadership-title" className="p-heading">{publicCopy.chapters.leadership.heading}</h2>
          <div className="p-leadership-intro"><p>{publicCopy.leadershipIntroduction}</p></div>
        </header>
        <div className="leadership-layout">
          <aside className="leadership-stage">
            <div className="leadership-sculpture-space" aria-hidden="true">
              <div className="leadership-sculpture">
                <div className="leadership-plane leadership-plane--back" />
                <div className="leadership-plane leadership-plane--middle" />
                <div className="leadership-plane leadership-plane--front"><span>{leadership[active].metrics?.[0]?.value}</span><small>{leadership[active].metrics?.[0]?.label}</small></div>
                <span className="leadership-connector" />
              </div>
            </div>
            <nav className="leadership-navigation" aria-label="Leadership roles">
              {leadership.map((role, index) => <a key={role.org} href={`#leadership-role-${index}`} aria-current={active === index ? "location" : undefined}><span>{role.org}</span><ArrowUpRight size={16} aria-hidden="true" /></a>)}
            </nav>
          </aside>
          <div className="leadership-stories">
            {leadership.map((role, index) => <article id={`leadership-role-${index}`} data-leadership-role className="leadership-story" key={role.org} aria-labelledby={`leadership-heading-${index}`}>
              <header className="leadership-role-meta"><p>{role.org}</p><p>{role.role}{role.period && <><br />{role.period}</>}{role.previousRole && <><br />Previously {role.previousRole}</>}</p></header>
              <h3 id={`leadership-heading-${index}`}>{role.heading}</h3>
              {role.scope && <p className="leadership-scope"><EvidenceText text={role.scope} /></p>}
              <ImpactMetrics metrics={role.metrics} title={role.org} />
              <ul className="leadership-bullets">{role.bullets.map(bullet => <li key={bullet}><EvidenceText text={bullet} /></li>)}</ul>
            </article>)}
          </div>
        </div>
        <div className="recognition"><span>Academic recognition</span><p>{publicCopy.about.recognition}</p></div>
      </div>
    </section>
  )
}
