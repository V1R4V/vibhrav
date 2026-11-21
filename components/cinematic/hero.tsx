"use client"

import type { CSSProperties } from "react"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import { GoldSculpture } from "./gold-sculpture"
import { usePortfolioMotion } from "./portfolio-frame"
import { publicCopy } from "@/lib/portfolio-data"

export function CinematicHero() {
  const { paused } = usePortfolioMotion()
  return (
    <section className="cinematic-hero" data-cinematic-hero>
      <div className="cinematic-stage">
        <div className="cinematic-art" data-visual><GoldSculpture paused={paused} /></div>
        <div className="cinematic-wash" aria-hidden />
        <div className="hero-topline"><p className="hero-role">{publicCopy.hero.role}</p><p className="hero-statement">{publicCopy.hero.statement}</p></div>
        <div className="cinematic-copy" data-hero-type>
          <h1 className="cinematic-title" aria-label="Vibhrav Jha">
            <span className="name-line" aria-hidden>{"VIBHRAV".split("").map((character, index) => <span className="hero-letter-drift" key={index}><span className="name-letter" style={{ "--letter-index": index } as CSSProperties}>{character}</span></span>)}</span>
            <span className="hero-name-foot" aria-hidden><span>Jha<span className="cinematic-period">.</span></span></span>
          </h1>
        </div>
        <div className="hero-bottomline"><p className="hero-proof">{publicCopy.hero.supporting}</p><a className="cinematic-primary" href="#experience">View experience <ArrowUpRight size={20} aria-hidden /></a></div>
        <div className="cinematic-foot"><a href="#experience" className="cinematic-scroll">Scroll to explore <ArrowDown size={16} aria-hidden /></a><a href="#project-catalogue">Browse projects <ArrowUpRight size={15} aria-hidden /></a></div>
      </div>
    </section>
  )
}
