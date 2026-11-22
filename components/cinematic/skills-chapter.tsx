"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { publicCopy } from "@/lib/portfolio-data"
import Image from "next/image"
import { skillMarks } from "@/lib/skill-marks"
import { usePortfolioMotion } from "./portfolio-frame"
import "./skills-chapter.css"

const orbitLabels = ["Python", "React", "PostgreSQL", "Docker", "PyTorch", "TypeScript", "Google Cloud", "Kafka"]

function SkillMark({ tool }: { tool: string }) {
  const src = skillMarks[tool]
  return src ? <Image className={`skill-mark skill-mark--${src.split("/").pop()?.replace(".svg", "")}`} src={src} alt="" width={24} height={24} unoptimized /> : null
}

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
              <div className="skills-orbit-carrier">{orbitLabels.map((label, index) => <span className={`skills-node skills-node--${index + 1}`} key={label}><SkillMark tool={label} /><span>{label}</span></span>)}</div>
              <span className="skills-satellite skills-satellite--one" />
              <span className="skills-satellite skills-satellite--two" />
            </div>
            <p className="skills-diagram-caption">Interfaces · models · infrastructure</p>
          </div>
          <dl className="skills-groups">
            {publicCopy.about.skills.map((skill) => (
              <div className="skills-group" key={skill.label}>
                <dt>{skill.label}</dt>
                <dd>{skill.tools.split(/,\s*/).map((tool) => { const name = tool.replace(/\.$/, ""); return <span className="skills-tool" key={name}><SkillMark tool={name} />{name}</span> })}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
