"use client"

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"
import Image from "next/image"
import { useRef } from "react"
import { about, profile } from "@/lib/site-data"
import { Globe } from "@/components/site/globe"

const EASE = [0.16, 1, 0.3, 1] as const

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
}

export function About() {
  return (
    <section id="about" className="relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <header className="mb-16 flex items-baseline gap-4">
          <span className="eyebrow">04 — About</span>
          <span className="hidden h-px flex-1 bg-line-strong sm:block" />
        </header>

        {/* Intro + portrait */}
        <div className="grid items-start gap-12 md:grid-cols-[1.3fr_1fr] md:gap-16">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
          >
            <h2 className="font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] text-ink">
              {about.heading.split(", ").map((w, i, arr) => (
                <span key={w}>
                  {i === arr.length - 1 ? (
                    <span className="font-hero italic text-gold">{w}</span>
                  ) : (
                    `${w}, `
                  )}
                </span>
              ))}
            </h2>
            <p className="mt-6 max-w-xl text-pretty text-[0.95rem] leading-relaxed text-ink-soft">
              {about.intro}
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {["Fullstack + AI", "Product Impact", "High Ownership"].map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-card px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-wide text-ink shadow-sm transition-colors hover:border-burgundy"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--gold))]" />
                  {c}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <DuotonePortrait />
          </motion.div>
        </div>

        {/* Work-style pillars */}
        <div className="mt-24 grid gap-px overflow-hidden rounded-xl border border-line bg-line shadow-card sm:grid-cols-3">
          {about.pillars.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
              className="group relative bg-card p-7 transition-colors duration-300 hover:bg-paper-2"
            >
              {/* Top accent line — draws in on hover */}
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-burgundy via-[hsl(var(--gold))] to-transparent opacity-0 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-100" />

              <div className="flex items-start justify-between">
                <span className="text-gold font-mono text-4xl font-light leading-none opacity-40 transition-opacity duration-300 group-hover:opacity-100">
                  0{i + 1}
                </span>
                <span className="mt-1 h-2 w-2 rounded-full bg-[hsl(var(--gold))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              <h3 className="mt-5 font-display text-xl text-ink">{p.title}</h3>
              <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-wide text-ink-faint">
                {p.subtitle}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                {p.text}
              </p>
            </motion.article>
          ))}
        </div>

        {/* Roots & travels */}
        <div className="mt-24">
          <header className="mb-12 flex items-baseline gap-4">
            <span className="eyebrow">Roots &amp; Travels</span>
            <span className="hidden h-px flex-1 bg-line-strong sm:block" />
          </header>

          <div className="grid items-start gap-12 md:grid-cols-[1fr_1.05fr] md:gap-16">
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
            >
              <p className="font-display text-2xl leading-snug text-ink sm:text-[1.75rem]">
                Based in {profile.location}, originally from{" "}
                <span className="font-hero italic text-gold">
                  {profile.origin}
                </span>
                .
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
                {about.personal.focus} Switch the globe to{" "}
                <span className="text-teal">Places I&apos;ve been</span> and tap a
                flag to spin there.
              </p>
              <div className="mt-6">
                <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-faint">
                  Outside work
                </p>
                <div className="flex flex-wrap gap-2">
                  {about.personal.outside.map((o) => (
                    <span
                      key={o}
                      className="rounded-full border border-line px-3 py-1 text-sm text-ink-soft"
                    >
                      {o}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <Globe />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DuotonePortrait() {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), {
    stiffness: 150,
    damping: 18,
  })
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), {
    stiffness: 150,
    damping: 18,
  })

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <div className="[perspective:1100px]">
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative mx-auto aspect-[3/4] w-full max-w-[300px] overflow-hidden rounded-md border border-line-strong bg-[#2a0e12]"
      >
        <Image
          src="/IMG_0950.jpg"
          alt={`${profile.name}, ${profile.location}`}
          fill
          sizes="(max-width: 768px) 70vw, 300px"
          className="object-cover"
          style={{ transform: "translateZ(0)" }}
        />
        {/* warm sheen + label, lifted on Z for depth */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2a0e12]/55 via-transparent to-transparent"
          style={{ transform: "translateZ(40px)" }}
        />
        <span
          className="absolute bottom-3 left-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white/90"
          style={{ transform: "translateZ(55px)" }}
        >
          {profile.location}
        </span>
      </motion.div>
    </div>
  )
}
