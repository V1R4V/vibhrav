"use client"

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Github, Linkedin } from "lucide-react"
import { profile } from "@/lib/site-data"
import { ContactButton } from "@/components/site/contact-form"

const EASE = [0.16, 1, 0.3, 1] as const

// Headline rendered line-by-line so each can mask-reveal independently.
type Seg = { t: string; italic?: boolean; accent?: boolean; gold?: boolean }
const LINES: Seg[][] = [
  [{ t: "Software " }, { t: "Engineer", gold: true }],
  [{ t: "building across" }],
  [{ t: "Fullstack, AI & " }, { t: "systems.", italic: true, accent: true }],
]

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 120])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const lineDelayBase = 0.35

  // Cursor-reactive spotlight (drives the .hero-stage::before glow position).
  const onMove = (e: React.MouseEvent) => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`)
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`)
  }

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={onMove}
      className="hero-stage relative flex min-h-dvh flex-col justify-center overflow-hidden px-5 pb-24 pt-32 sm:px-8 sm:pb-28"
    >
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          className="mb-8 flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.24em]"
        >
          <span className="font-medium text-burgundy">Portfolio</span>
          <span className="h-px w-12 bg-ink/20" />
          <span className="text-ink-faint">{profile.location}</span>
        </motion.div>

        {/* Headline — Newsreader serif, line-mask reveal */}
        <h1 className="font-hero text-[clamp(2.75rem,9vw,8rem)] font-medium leading-[1.0] tracking-[-0.018em] text-ink">
          {LINES.map((line, li) => (
            <span key={li} className="block overflow-hidden py-[0.03em]">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 1,
                  ease: EASE,
                  delay: lineDelayBase + li * 0.09,
                }}
              >
                {line.map((seg, si) => (
                  <span
                    key={si}
                    className={[
                      seg.italic ? "italic" : "",
                      seg.accent ? "text-grad" : "",
                      seg.gold ? "text-gold" : "",
                    ].join(" ")}
                  >
                    {seg.t}
                  </span>
                ))}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Status line + intro */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.85 }}
          className="mt-9 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <p className="max-w-md text-pretty text-[0.98rem] leading-relaxed text-ink/75">
            Hey, I&apos;m{" "}
            <span className="font-medium text-gold">
              {profile.name.split(" ")[0]}
            </span>
            , a{" "}
            <span className="font-medium text-ink">
              CS, Data Science &amp; Economics
            </span>{" "}
            student at UW–Madison shipping production software at the
            intersection of{" "}
            <span className="font-medium text-ink">web development</span> and{" "}
            <span className="font-medium text-ink">applied AI</span>.
          </p>

          <div className="flex flex-col items-start gap-4 sm:items-end">
            {/* Availability pill */}
            <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-ink/[0.04] px-3.5 py-2 font-mono text-[0.7rem] uppercase tracking-[0.13em] text-ink-soft backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-burgundy opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-burgundy" />
              </span>
              {profile.availability}
            </span>

            <div className="flex items-center gap-2">
              {[
                {
                  href: profile.socials.github,
                  Icon: Github,
                  label: "GitHub",
                  colorClass: "text-ink dark:text-[#f5f5f5]",
                  hoverClass: "hover:border-ink/60 dark:hover:border-white/60",
                },
                {
                  href: profile.socials.linkedin,
                  Icon: Linkedin,
                  label: "LinkedIn",
                  colorClass: "text-[#0A66C2]",
                  hoverClass: "hover:border-[#0A66C2]",
                },
              ].map(({ href, Icon, label, colorClass, hoverClass }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className={`rounded-full border border-line p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy ${colorClass} ${hoverClass}`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}

              <ContactButton
                label="Contact me"
                showIcon={true}
                iconClassName="text-[#EA4335]"
                className="rounded-full border border-line bg-transparent px-3.5 py-2 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-ink-soft hover:border-ink/60 hover:bg-transparent hover:text-ink h-auto"
                variant="ghost"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.span
          aria-hidden
          animate={reduced ? {} : { y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="block font-mono text-[0.65rem] uppercase tracking-[0.3em] text-ink-faint"
        >
          scroll
        </motion.span>
      </motion.div>
    </section>
  )
}
