"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { publicCopy } from "@/lib/portfolio-data"
import { usePortfolioMotion } from "./portfolio-frame"
import "./skills-chapter.css"

const orbitLabels = ["AI", "DATA", "WEB", "PRODUCT"]

export function SkillsChapter() {
  const section = useRef<HTMLElement>(null)
  const { paused } = usePortfolioMotion()

  useEffect(() => {
    const root = section.current
    if (!root || paused || matchMedia("(prefers-reduced-motion: reduce)").matches) return

    gsap.registerPlugin(ScrollTrigger)
    const context = gsap.context(() => {
      gsap.fromTo(".skills-planetarium-model", { rotateX: -16, rotateY: -22 }, {
        rotateX: 16,
        rotateY: 22,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.7 },
      })
      gsap.from(".skills-group", {
        y: 22,
        opacity: 0,
        stagger: 0.1,
        duration: 0.55,
        ease: "power2.out",
        scrollTrigger: { trigger: root, start: "top 68%", once: true },
      })
    }, root)

    return () => context.revert()
  }, [paused])

  return (
    <section ref={section} id="skills" className="skills-chapter p-chapter" data-chapter aria-labelledby="skills-title">
      <div className="skills-chapter-inner p-wrap">
        <header className="skills-heading">
          <h2 id="skills-title" className="p-heading">A connected<br /><span>toolkit.</span></h2>
        </header>
        <div className="skills-layout">
          <div className="skills-planetarium" aria-hidden="true">
            <div className="skills-planetarium-model">
              <div className="skills-halo skills-halo--outer" />
              <div className="skills-halo skills-halo--middle" />
              <div className="skills-halo skills-halo--inner" />
              <div className="skills-core"><span>VJ</span></div>
              {orbitLabels.map((label, index) => <span className={`skills-node skills-node--${index + 1}`} key={label}>{label}</span>)}
              <span className="skills-satellite skills-satellite--one" />
              <span className="skills-satellite skills-satellite--two" />
            </div>
            <p className="skills-diagram-caption">Interfaces · models · infrastructure</p>
          </div>
          <dl className="skills-groups">
            {publicCopy.about.skills.map((skill) => (
              <div className="skills-group" key={skill.label}>
                <dt>{skill.label}</dt>
                <dd>{skill.tools.split(/,\s*/).map((tool) => <span className="skills-tool" key={tool.replace(/\.$/, "")}>{tool.replace(/\.$/, "")}</span>)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
