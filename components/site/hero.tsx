"use client"

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Github, Linkedin, Instagram } from "lucide-react"
import { profile } from "@/lib/site-data"
import { ContactButton } from "@/components/site/contact-form"

const EASE = [0.16, 1, 0.3, 1] as const

// Headline rendered line-by-line so each can mask-reveal independently.
const LINES = [
  [{ t: "Software engineer" }],
  [{ t: "building across" }],
  [{ t: "web, AI & " }, { t: "systems.", italic: true, accent: true }],
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
      className="hero-stage relative flex min-h-dvh flex-col justify-end overflow-hidden px-5 pb-16 pt-28 sm:px-8 sm:pb-20"
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
          <span className="h-px w-12 bg-white/20" />
          <span className="text-white/45">{profile.location}</span>
        </motion.div>

        {/* Headline — Newsreader serif, line-mask reveal */}
        <h1 className="font-hero text-[clamp(2.75rem,9vw,8rem)] font-medium leading-[1.0] tracking-[-0.018em] text-[#F4F1EA]">
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
          <p className="max-w-md text-pretty text-[0.95rem] leading-relaxed text-white/65">
            Hey — I&apos;m {profile.name.split(" ")[0]}, a CS, Data Science &amp;
            Economics student at UW–Madison shipping production software at the
            intersection of web development and applied AI.
          </p>

          <div className="flex flex-col items-start gap-4 sm:items-end">
            {/* Availability pill */}
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-2 font-mono text-[0.7rem] uppercase tracking-[0.13em] text-white/70 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-burgundy opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-burgundy" />
              </span>
              {profile.availability}
            </span>

            <div className="flex items-center gap-2">
              {[
                { href: profile.socials.github, Icon: Github, label: "GitHub" },
                { href: profile.socials.linkedin, Icon: Linkedin, label: "LinkedIn" },
                { href: profile.socials.instagram, Icon: Instagram, label: "Instagram" },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="rounded-full border border-white/15 p-2 text-white/60 transition-colors hover:border-white/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}

              <ContactButton
                label="Contact me"
                showIcon={true}
                className="rounded-full border border-white/15 bg-transparent px-3.5 py-2 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-white/60 hover:border-white/60 hover:bg-transparent hover:text-white h-auto"
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
          className="block font-mono text-[0.65rem] uppercase tracking-[0.3em] text-white/40"
        >
          scroll
        </motion.span>
      </motion.div>
    </section>
  )
}
