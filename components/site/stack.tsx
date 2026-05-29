"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { techStack, techMarquee, type TechItem } from "@/lib/site-data"

const EASE = [0.16, 1, 0.3, 1] as const

const DEVICON = (p: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${p}.svg`
const SIMPLE = (s: string) => `https://cdn.simpleicons.org/${s}`

// Original brand-color logo. Tries devicon (multicolor) → simpleicons
// (brand color) → a text glyph in the accent. Never grayscaled.
function TechLogo({ item, size = 30 }: { item: TechItem; size?: number }) {
  const sources: string[] = []
  if (item.icon) sources.push(DEVICON(item.icon))
  if (item.slug) sources.push(SIMPLE(item.slug))
  const [stage, setStage] = useState(0)

  if (stage >= sources.length) {
    return (
      <span
        aria-hidden
        className="grid h-full w-full place-items-center font-mono text-[0.7em] font-semibold text-burgundy"
      >
        {item.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2)}
      </span>
    )
  }
  return (
    <img
      src={sources[stage]}
      alt={item.name}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setStage((s) => s + 1)}
      className="h-full w-full object-contain"
    />
  )
}

export function Stack() {
  // Duplicate the marquee so the loop is seamless.
  const marquee = [...techMarquee, ...techMarquee]

  return (
    <section id="stack" className="relative bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Heading + index — matches the design's section head */}
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <h2 className="font-display text-[clamp(2.25rem,6.4vw,5.5rem)] font-bold leading-[0.96] tracking-[-0.03em] text-ink">
            Tools I use to ship.
          </h2>
          <span className="flex items-center gap-2 font-mono text-[0.78rem] tracking-[0.12em] text-burgundy">
            <span className="h-[7px] w-[7px] rounded-full bg-burgundy" />
            03 — Tech Stack
          </span>
        </div>
      </div>

      {/* Scrolling marquee — big display names + brand logos + ✦ stars */}
      <div className="marquee-mask group mt-12 overflow-hidden border-y border-line py-6">
        <div className="marquee-track group-hover:[animation-play-state:paused]">
          {marquee.map((item, i) => (
            <div key={`${item.name}-${i}`} className="flex shrink-0 items-center">
              <span className="flex items-center gap-3.5 px-8">
                <span className="h-8 w-8 shrink-0 sm:h-9 sm:w-9">
                  <TechLogo item={item} size={36} />
                </span>
                <span className="whitespace-nowrap font-display text-[clamp(1.6rem,3.4vw,3rem)] font-semibold tracking-[-0.02em] text-ink">
                  {item.name}
                </span>
              </span>
              <span className="text-lg text-burgundy">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Atlas */}
      <div className="mx-auto mt-16 max-w-6xl px-5 sm:px-8">
        <p className="mb-6 flex items-center gap-3 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-ink-faint">
          Skill Atlas
          <span className="h-px flex-1 bg-line" />
        </p>

        <div className="grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {techStack.map((group, gi) => (
            <motion.div
              key={group.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: EASE, delay: gi * 0.06 }}
              className="border-b border-line py-7 sm:border-b-0 sm:[&:nth-child(-n+2)]:border-b lg:border-b-0 lg:border-r lg:pr-6 lg:last:border-r-0 sm:[&:nth-child(odd)]:pr-6 sm:[&:nth-child(odd)]:border-r"
            >
              <h3 className="flex items-baseline gap-2.5 font-display text-xl font-bold tracking-[-0.01em] text-ink">
                <span className="font-mono text-[0.7rem] font-medium text-burgundy">
                  0{gi + 1}
                </span>
                {group.name}
              </h3>
              <p className="mt-2 min-h-[2.5rem] max-w-[26ch] text-[0.82rem] leading-snug text-ink-faint">
                {group.summary}
              </p>

              <div className="mt-3 flex flex-col">
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    className="group/it flex items-center gap-3 border-t border-line/60 py-2.5 first:border-t-0"
                  >
                    <span className="grid h-[30px] w-[30px] shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-white p-[5px] transition-transform duration-300 group-hover/it:-translate-y-0.5 group-hover/it:scale-105">
                      <TechLogo item={item} size={20} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.9rem] font-medium leading-tight text-ink">
                        {item.name}
                      </span>
                      <span className="mt-0.5 block font-mono text-[0.62rem] tracking-[0.02em] text-ink-faint">
                        {item.desc}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
