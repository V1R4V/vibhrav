"use client"

import { useEffect, useState } from "react"
import { Github, Linkedin } from "lucide-react"
import { profile } from "@/lib/site-data"
import { ThemeToggle } from "@/components/site/theme-toggle"
import { ContactButton } from "@/components/site/contact-form"

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

  // The hero is theme-aware (dark in dark mode, cream in light), so the nav
  // uses semantic tokens that adapt to both themes and to the glass panel.
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
          <span className="text-gold font-mono text-sm font-semibold tracking-[0.18em] transition-colors">
            {profile.name}
          </span>
        </a>

        {/* Links */}
        <ul className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className="group flex items-center gap-1.5 py-1 text-sm text-ink-soft transition-colors hover:text-ink"
                >
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

        {/* Theme toggle + social icons + Résumé */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          {/* Social icon links */}
          <div className="hidden items-center gap-1.5 sm:flex">
            {[
              {
                href: profile.socials.github,
                Icon: Github,
                label: "GitHub",
                colorClass: "text-ink",
                hoverClass: "hover:opacity-70",
              },
              {
                href: profile.socials.linkedin,
                Icon: Linkedin,
                label: "LinkedIn",
                colorClass: "text-[#0A66C2]",
                hoverClass: "hover:text-[#0A66C2]",
              },
            ].map(({ href, Icon, label, colorClass, hoverClass }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className={`rounded-md p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy ${colorClass} ${hoverClass}`}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <ContactButton
            label=""
            ariaLabel="Contact me"
            showIcon={true}
            iconClassName="text-[#EA4335]"
            className="hidden p-1.5 sm:inline-flex"
            variant="ghost"
          />

          <a
            href={profile.socials.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-line-strong px-4 py-1.5 font-mono text-xs uppercase tracking-[0.12em] text-ink transition-colors hover:border-burgundy hover:text-burgundy"
          >
            Résumé
          </a>
        </div>
      </nav>
    </header>
  )
}
