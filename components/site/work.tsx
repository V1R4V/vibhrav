"use client"

import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { forwardRef, useState } from "react"
import {
  projectCategories,
  projects,
  type Project,
  type ProjectCategory,
} from "@/lib/site-data"

const EASE = [0.16, 1, 0.3, 1] as const
type Filter = "All" | ProjectCategory

const ArrowUpRight = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
)

const ProjectCard = forwardRef<HTMLElement, { p: Project }>(({ p }, ref) => {
  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-lift"
    >
      <a
        href={p.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
      >
        {/* Cover */}
        <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-paper-2">
          {p.image ? (
            <Image
              src={p.image}
              alt={p.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,hsl(var(--burgundy)/0.12),transparent_60%),radial-gradient(circle_at_80%_90%,hsl(var(--teal)/0.12),transparent_55%)]">
              <span className="font-hero text-5xl italic text-ink/20">
                {p.title
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")}
              </span>
            </div>
          )}
          <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-paper/85 text-ink opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            <ArrowUpRight />
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-5">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ember">
            {p.subtitle}
          </p>
          <h3 className="mt-2 font-display text-xl leading-snug text-ink">
            {p.title}
          </h3>
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-soft">
            {p.description}
          </p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {p.tags.slice(0, 4).map((t) => (
              <li
                key={t}
                className="rounded-full border border-line px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-wide text-ink-faint"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </a>
    </motion.article>
  )
})
ProjectCard.displayName = "ProjectCard"

export function Work() {
  const [filter, setFilter] = useState<Filter>("All")
  const filters: Filter[] = ["All", ...projectCategories]
  const shown =
    filter === "All"
      ? projects
      : projects.filter((p) => p.categories.includes(filter))

  return (
    <section id="work" className="relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-baseline gap-4">
          <span className="eyebrow">02 — Work</span>
          <span className="hidden h-px flex-1 bg-line-strong sm:block" />
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-faint tnum">
            {projects.length} projects
          </span>
        </header>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-2xl font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.08] text-ink"
        >
          Things I&apos;ve{" "}
          <span className="font-hero italic text-burgundy">built</span> — shipped
          products, systems &amp; experiments.
        </motion.h2>

        {/* Category filter */}
        <div className="mt-9 flex flex-wrap gap-2">
          {filters.map((f) => {
            const on = filter === f
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={on}
                className={`rounded-full border px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.1em] transition-colors ${
                  on
                    ? "border-burgundy bg-burgundy text-paper"
                    : "border-line text-ink-soft hover:border-line-strong hover:text-ink"
                }`}
              >
                {f}
              </button>
            )
          })}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {shown.map((p) => (
              <ProjectCard key={p.title} p={p} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
