"use client"

import { motion, useInView, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"
import { timeline, type TimelineEntry } from "@/lib/site-data"

const EASE = [0.16, 1, 0.3, 1] as const

export function Experience() {
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 70%", "end 70%"],
  })
  // The burgundy spine draws from top to bottom as the section scrolls past.
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="experience" className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <header className="mb-16 flex items-baseline gap-4">
          <span className="eyebrow">01 — Experience</span>
          <span className="hidden h-px flex-1 bg-line-strong sm:block" />
        </header>

        <div ref={trackRef} className="relative">
          {/* Spine: faint track + drawing progress line */}
          <div className="absolute left-2 top-0 h-full w-px bg-line md:left-1/2 md:-translate-x-1/2" />
          <motion.div
            style={{ scaleY }}
            className="absolute left-2 top-0 h-full w-px origin-top bg-burgundy md:left-1/2 md:-translate-x-1/2"
          />

          <ol className="space-y-20 md:space-y-28">
            {timeline.map((entry, i) => (
              <TimelineRow
                key={entry.org + entry.period}
                entry={entry}
                side={i % 2 === 0 ? "left" : "right"}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function TimelineRow({
  entry,
  side,
}: {
  entry: TimelineEntry
  side: "left" | "right"
}) {
  const ref = useRef<HTMLLIElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.45 })
  const isLeft = side === "left"

  return (
    <li ref={ref} className="relative">
      {/* Node on the spine */}
      <span className="absolute left-2 top-1.5 z-10 -translate-x-1/2 md:left-1/2">
        <motion.span
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="block h-3.5 w-3.5 rounded-full border-2 border-burgundy bg-paper"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.15 }}
            className="block h-full w-full scale-50 rounded-full bg-burgundy"
          />
        </motion.span>
      </span>

      <div className="md:grid md:grid-cols-2 md:gap-x-16">
        <motion.div
          initial={{ opacity: 0, x: 0, y: 24 }}
          animate={
            inView
              ? { opacity: 1, x: 0, y: 0 }
              : { opacity: 0, x: isLeft ? -28 : 28, y: 24 }
          }
          transition={{ duration: 0.8, ease: EASE }}
          className={[
            "pl-10 md:pl-0",
            isLeft
              ? "md:col-start-1 md:pr-12 md:text-right"
              : "md:col-start-2 md:pl-12 md:text-left",
          ].join(" ")}
        >
          {/* Period */}
          <p className="eyebrow mb-3 !tracking-[0.18em]">{entry.period}</p>

          {/* Title */}
          <h3 className="font-display text-2xl leading-tight text-ink sm:text-[1.75rem]">
            {entry.title}
          </h3>

          {/* Org + logo */}
          <div
            className={[
              "mt-3 flex items-center gap-3",
              isLeft ? "md:flex-row-reverse" : "",
            ].join(" ")}
          >
            {entry.logo && (
              <span
                className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-white p-1.5 shadow-sm transition-all duration-500 ${
                  inView ? "opacity-100" : "opacity-60"
                }`}
              >
                <Image
                  src={entry.logo}
                  alt={`${entry.org} logo`}
                  width={40}
                  height={40}
                  className="h-full w-auto object-contain"
                />
              </span>
            )}
            <span className="text-[0.95rem] font-medium text-ink-soft">
              {entry.org}
            </span>
          </div>

          {/* Summary */}
          <p
            className={[
              "mt-4 max-w-md text-pretty text-sm leading-relaxed text-ink-soft",
              isLeft ? "md:ml-auto" : "",
            ].join(" ")}
          >
            {entry.summary}
          </p>

          {/* Impact bullets */}
          <ul className="mt-5 space-y-2">
            {entry.bullets.map((b, bi) => (
              <motion.li
                key={b}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.35 + bi * 0.08 }}
                className={[
                  "flex items-center gap-2 text-sm text-ink-faint",
                  isLeft ? "md:flex-row-reverse" : "",
                ].join(" ")}
              >
                <span className="h-1 w-1 shrink-0 rounded-full bg-ember" />
                <span className="tnum">{b}</span>
              </motion.li>
            ))}
          </ul>

          {/* Tools */}
          {entry.tools && (
            <div
              className={[
                "mt-5 flex flex-wrap gap-2",
                isLeft ? "md:justify-end" : "",
              ].join(" ")}
            >
              {entry.tools.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide text-ink-faint"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </li>
  )
}
