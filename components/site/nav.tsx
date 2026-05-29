"use client"

import { useEffect, useState } from "react"
import { profile } from "@/lib/site-data"
import { ThemeToggle } from "@/components/site/theme-toggle"

type NavItem = { id: string; label: string }

const NAV_ITEMS: NavItem[] = [
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "stack", label: "Stack" },
  { id: "about", label: "About" },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<string>("")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Scroll-spy: highlight the section currently in view.
  useEffect(() => {
    const sections = NAV_ITEMS.map((i) => document.getElementById(i.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    )
    if (sections.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: "-45% 0px -50% 0px" },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const handleClick = (e: React.MouseEvent, id: string) => {
    const el = document.getElementById(id)
    if (el) {
      e.preventDefault()
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Before scroll the nav floats over the always-dark hero stage → use light
  // text; once scrolled it sits on a glass panel over the themed page.
  const onDark = !scrolled

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "glass border-b" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        {/* Brand */}
        <a
          href="#top"
          onClick={(e) => handleClick(e, "top")}
          className="group flex items-center gap-2.5"
          aria-label={`${profile.name} — home`}
        >
          <span
            aria-hidden
            className="block h-2.5 w-2.5 rotate-45 bg-[linear-gradient(135deg,hsl(var(--grad-1)),hsl(var(--grad-2)),hsl(var(--grad-3)))] transition-transform duration-300 group-hover:rotate-[135deg]"
          />
          <span
            className={`font-mono text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
              onDark ? "text-white" : "text-ink"
            }`}
          >
            {profile.name}
          </span>
        </a>

        {/* Links */}
        <ul className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item, i) => {
            const isActive = active === item.id
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={`group flex items-center gap-1.5 py-1 text-sm transition-colors ${
                    onDark
                      ? "text-white/60 hover:text-white"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  <span
                    className={`font-mono text-[0.6rem] ${
                      onDark ? "text-white/40" : "text-ink-faint"
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <span className="relative">
                    {item.label}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-px bg-burgundy transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </span>
                </a>
              </li>
            )
          })}
        </ul>

        {/* Theme toggle + Résumé */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle onDark={onDark} />
          <a
            href={profile.socials.resume}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.12em] transition-colors ${
              onDark
                ? "border-white/25 text-white hover:border-white hover:bg-white hover:text-[#0B0A08]"
                : "border-line-strong text-ink hover:border-burgundy hover:text-burgundy"
            }`}
          >
            Résumé
          </a>
        </div>
      </nav>
    </header>
  )
}
