"use client"

import Link from "next/link"
import { useEffect, useRef, useState, createContext, useContext } from "react"
import { ArrowUpRight, Menu, X } from "lucide-react"
import { MotionDirector } from "./motion-director"
import { CurtainLoader } from "./curtain-loader"
import type { IntroPhase } from "./curtain-loader"
import { Atmosphere } from "./atmosphere"

const MotionContext = createContext({ paused: false })
export const usePortfolioMotion = () => useContext(MotionContext)

export function PortfolioFrame({ children, home = false }: { children: React.ReactNode; home?: boolean }) {
  const [reduced, setReduced] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [intro, setIntro] = useState<IntroPhase>(home ? "pending" : "complete")
  const menuButton = useRef<HTMLButtonElement>(null)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenuOpen(false); menuButton.current?.focus() }
    }
    document.addEventListener("keydown", close)
    return () => document.removeEventListener("keydown", close)
  }, [menuOpen])

  const prefix = home ? "" : "/"
  return (
    <MotionContext.Provider value={{ paused: reduced }}>
      <div ref={root} className="cinematic-page" data-motion={reduced ? "paused" : "playing"} data-intro={intro}>
        {home && <CurtainLoader root={root} onPhase={setIntro} />}
        <a className="cinematic-skip" href="#introduction">Skip to content</a>
        <header className="cinematic-nav">
          <Link className="cinematic-wordmark" href="/" aria-label="Vibhrav Jha home">VJ<span>.</span></Link>
          <nav className="desktop-navigation" aria-label="Main navigation">
            {[["experience", "Experience"], ["work", "Projects"], ["skills", "Skills"], ["leadership", "Leadership"], ["about", "About"]].map(([id, label]) => <Link key={id} href={`${prefix}#${id}`}>{label}</Link>)}
          </nav>
          <Link className="cinematic-contact" href={`${prefix}#contact`}>Let’s talk <ArrowUpRight size={16} aria-hidden /></Link>
          <button ref={menuButton} className="mobile-menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen(value => !value)}>
            {menuOpen ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          </button>
          <nav id="mobile-navigation" className="mobile-navigation" hidden={!menuOpen} aria-label="Mobile navigation">
            {[["experience", "Experience"], ["work", "Projects"], ["skills", "Skills"], ["leadership", "Leadership"], ["about", "About"], ["contact", "Contact"]].map(([id, label]) => <Link key={id} href={`${prefix}#${id}`} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={20} aria-hidden /></Link>)}
          </nav>
          <div className="reading-progress" aria-hidden><span data-reading-progress /></div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="footer-atmosphere" aria-hidden><Atmosphere variant="ink" paused={reduced} /></div>
          <div className="footer-closing"><p>Vibhrav Jha · Madison, Wisconsin</p><a className="footer-invitation" href={`${prefix}#contact`}>Get in touch<ArrowUpRight className="footer-invitation-arrow" aria-hidden="true" strokeWidth={1.35} /></a></div>
          <div className="footer-baseline"><Link href="/" className="footer-signature" aria-label="Vibhrav Jha home">VJ<span>.</span></Link><nav aria-label="Social links"><a href="https://github.com/V1R4V" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={14} aria-hidden /></a><a href="https://www.linkedin.com/in/vibhrav-jha-4846a3275/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={14} aria-hidden /></a><a href="#introduction">Back to top <ArrowUpRight size={14} aria-hidden /></a></nav></div>
        </footer>
        <MotionDirector root={root} paused={reduced} />
      </div>
    </MotionContext.Provider>
  )
}
