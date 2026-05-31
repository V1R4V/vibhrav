"use client"

import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { forwardRef, useEffect, useMemo, useRef, useState } from "react"
import { Check, ChevronDown, SlidersHorizontal } from "lucide-react"
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
  const [skill, setSkill] = useState<string | null>(null)
  const filters: Filter[] = ["All", ...projectCategories]

  // Every unique tech tag across all projects, alphabetized.
  const allSkills = useMemo(
    () =>
      Array.from(new Set(projects.flatMap((p) => p.tags))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [],
  )

  // Category and skill filters combine (AND). Projects keep their wow-order.
  const shown = projects.filter(
    (p) =>
      (filter === "All" || p.categories.includes(filter)) &&
      (!skill || p.tags.includes(skill)),
  )

  return (
    <section id="work" className="relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-baseline gap-4">
          <span className="eyebrow">02 — Work</span>
          <span className="hidden h-px flex-1 bg-line-strong sm:block" />
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-faint tnum">
            {shown.length === projects.length
              ? `${projects.length} projects`
              : `${shown.length} / ${projects.length}`}
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
          <span className="font-hero italic text-burgundy">built</span>: shipped
          products, systems &amp; experiments.
        </motion.h2>

        {/* Filters: category chips + searchable skill dropdown */}
        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex flex-wrap gap-2">
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

          <div className="sm:ml-auto">
            <SkillFilter skills={allSkills} value={skill} onChange={setSkill} />
          </div>
        </div>

        {/* Grid */}
        {shown.length > 0 ? (
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
        ) : (
          <div className="mt-10 rounded-xl border border-dashed border-line-strong px-6 py-16 text-center">
            <p className="text-sm text-ink-soft">
              No projects match{" "}
              <span className="font-medium text-ink">{filter}</span>
              {skill && (
                <>
                  {" "}
                  +{" "}
                  <span className="font-medium text-ink">{skill}</span>
                </>
              )}
              .
            </p>
            <button
              onClick={() => {
                setFilter("All")
                setSkill(null)
              }}
              className="mt-4 rounded-full border border-line px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-soft transition-colors hover:border-burgundy hover:text-burgundy"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

// Searchable dropdown to filter projects by a single tech tag.
function SkillFilter({
  skills,
  value,
  onChange,
}: {
  skills: string[]
  value: string | null
  onChange: (s: string | null) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDoc)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const filtered = skills.filter((s) =>
    s.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.1em] transition-colors ${
          value
            ? "border-burgundy bg-burgundy text-paper"
            : "border-line text-ink-soft hover:border-line-strong hover:text-ink"
        }`}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <span className="normal-case tracking-normal">{value ?? "Filter by skill"}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-64 overflow-hidden rounded-xl border border-line bg-card shadow-lift">
          <div className="border-b border-line p-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills…"
              className="w-full rounded-md bg-paper-2 px-2.5 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
            />
          </div>
          <ul className="max-h-64 overflow-y-auto p-1" role="listbox">
            <li>
              <button
                type="button"
                onClick={() => {
                  onChange(null)
                  setOpen(false)
                  setQuery("")
                }}
                className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-paper-2 ${
                  !value ? "font-medium text-burgundy" : "text-ink-soft"
                }`}
              >
                All skills
                {!value && <Check className="h-3.5 w-3.5" />}
              </button>
            </li>
            {filtered.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(s)
                    setOpen(false)
                    setQuery("")
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-paper-2 ${
                    value === s ? "font-medium text-burgundy" : "text-ink"
                  }`}
                >
                  {s}
                  {value === s && <Check className="h-3.5 w-3.5" />}
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-2.5 py-3 text-center text-sm text-ink-faint">
                No matching skill
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
