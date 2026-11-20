"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"
import { ArrowDown, ArrowUpRight, Search, X } from "lucide-react"
import { projects } from "@/lib/portfolio-data"
import type { Project } from "@/lib/portfolio-data"
import { usePortfolioMotion } from "./portfolio-frame"
import "./project-gallery.css"

const categoryOrder = ["Fullstack", "Distributed Systems", "ML & AI", "Data Engineering", "Computing Foundations"]
const categories = Array.from(new Set(projects.flatMap(project => project.categories)))
  .sort((a, b) => {
    const ai = categoryOrder.indexOf(a), bi = categoryOrder.indexOf(b)
    return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi) || a.localeCompare(b)
  })
type Filters = { query: string; category: string; grouped: boolean }
const defaultFilters: Filters = { query: "", category: "all", grouped: false }

function locationFilters(): Filters {
  const params = new URLSearchParams(location.search)
  const category = params.get("category") || "all"
  return { query: params.get("q") || "", category: categories.includes(category) ? category : "all", grouped: params.get("group") === "category" }
}

function CatalogueEntry({ project }: { project: Project }) {
  return (
    <article className="pg-catalogue-entry" data-catalogue-project={project.slug}>
      <Link className="pg-catalogue-link" href={`/projects/${project.slug}`}>
        <div className="pg-catalogue-name"><h4>{project.title}</h4><span>{project.status}</span></div>
        <p>{project.summary}</p>
        <ArrowUpRight size={22} aria-hidden />
      </Link>
      <ul className="pg-catalogue-stack" aria-label={`${project.title} technologies`}>{project.stack.map(tool => <li key={tool}>{tool}</li>)}</ul>
    </article>
  )
}

export function ProjectGallery() {
  const { paused } = usePortfolioMotion()
  const root = useRef<HTMLElement>(null)
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const featured = projects.filter(project => project.featured)
  const terms = filters.query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean)
  const filtered = projects.filter(project => (filters.category === "all" || project.categories.includes(filters.category)) && terms.every(term => `${project.title} ${project.summary} ${project.stack.join(" ")} ${project.categories.join(" ")}`.toLocaleLowerCase().includes(term)))
  const groups = filters.grouped ? categories.flatMap(category => {
    const items = filtered.filter(project => (filters.category === "all" ? project.categories[0] : filters.category) === category)
    return items.length ? [{ title: category, items }] : []
  }) : [{ title: "All projects", items: filtered }]

  useEffect(() => {
    const sync = () => setFilters(locationFilters())
    sync()
    addEventListener("popstate", sync)
    return () => removeEventListener("popstate", sync)
  }, [])

  useEffect(() => {
    const node = root.current
    if (!node) return
    const media = matchMedia("(prefers-reduced-motion: reduce)")
    let frame = 0
    const screens = Array.from(node.querySelectorAll<HTMLElement>("[data-project-display]")).map(screen => ({
      screen,
      visual: screen.closest<HTMLElement>(".pg-exhibit-visual")!,
      article: screen.closest<HTMLElement>(".pg-exhibit")!,
    }))
    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))
    const update = () => {
      frame = 0
      const enabled = !paused && !media.matches
      const compact = innerWidth <= 900
      const short = innerHeight < 540
      node.dataset.projectMotion = enabled ? "scroll" : "static"
      // Measure the untransformed container, so depth never feeds back into its
      // own progress. Mobile keeps the same scene with a smaller travel budget.
      const measurements = screens.map(item => ({ ...item, visualBox: item.visual.getBoundingClientRect(), articleBox: item.article.getBoundingClientRect() }))
      for (const { screen, visual, article, visualBox, articleBox } of measurements) {
        const progress = clamp((innerHeight * .8 - articleBox.top) / (articleBox.height + innerHeight * .6), 0, 1)
        const viewportTravel = clamp((innerHeight * .5 - visualBox.top - visualBox.height * .5) / innerHeight, -1, 1)
        const travel = clamp(viewportTravel * .65 + (progress - .5) * .7, -1, 1)
        const lift = short ? 12 : compact ? 24 : 32
        article.dataset.projectProgress = progress.toFixed(3)
        screen.dataset.displayState = enabled ? "scrolling" : "static"
        screen.style.setProperty("--display-rotation", enabled ? `${travel * 9}deg` : "0deg")
        screen.style.setProperty("--display-turn", enabled ? `${(compact ? -4 : -8) + travel * 9}deg` : "0deg")
        screen.style.setProperty("--display-lift", enabled ? `${travel * -lift}px` : "0px")
        screen.style.setProperty("--display-depth", enabled ? `${24 + (1 - Math.abs(travel)) * (compact ? 18 : 30)}px` : "0px")
        screen.style.setProperty("--display-scale", enabled ? String(.94 + (1 - Math.abs(travel)) * .06) : "1")
        visual.style.setProperty("--orbit-turn", enabled ? `${-22 + progress * 34}deg` : "-22deg")
        visual.style.setProperty("--ambient-lift", enabled ? `${travel * lift * .5}px` : "0px")
      }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    addEventListener("scroll", schedule, { passive: true })
    addEventListener("resize", schedule)
    media.addEventListener("change", schedule)
    update()
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener("scroll", schedule)
      removeEventListener("resize", schedule)
      media.removeEventListener("change", schedule)
    }
  }, [paused])

  function updateFilters(next: Filters, replace = false) {
    setFilters(next)
    const url = new URL(location.href)
    if (next.query) url.searchParams.set("q", next.query); else url.searchParams.delete("q")
    if (next.category !== "all") url.searchParams.set("category", next.category); else url.searchParams.delete("category")
    if (next.grouped) url.searchParams.set("group", "category"); else url.searchParams.delete("group")
    history[replace ? "replaceState" : "pushState"](history.state, "", `${url.pathname}${url.search}${url.hash}`)
  }

  return (
    <section ref={root} id="work" className="pg-work p-chapter" data-chapter aria-labelledby="work-title">
      <div className="pg-intro p-wrap" data-work-intro>
        <p className="pg-intro-label">Selected projects</p>
        <h2 id="work-title" className="pg-title" aria-label="The problem, the decisions, the result">{["The problem,", "the decisions,", "the result."].map(line => <span key={line} aria-hidden>{line.split("").map((letter, index) => <span className="work-title-letter" key={index}>{letter === " " ? "\u00a0" : letter}</span>)}</span>)}</h2>
        <div className="pg-intro-foot"><p>Selected projects across product engineering, AI and data infrastructure. Each starts with a concrete need and a decision worth examining.</p><a href="#project-catalogue">Browse all {projects.length} projects <ArrowDown size={18} aria-hidden /></a></div>
      </div>
      <div className="pg-exhibits">
        {featured.map((project, index) => (
          <article className="pg-exhibit p-wrap" key={project.slug} data-stack-card data-project={project.slug} aria-labelledby={`project-${project.slug}`} style={{ "--stack-index": index, "--exhibit-accent": index % 2 === 0 ? "#554634" : "#4e2730" } as CSSProperties}>
            <div className="pg-exhibit-copy">
              <p className="pg-exhibit-index"><span>{String(index + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")}</span>{project.categories.slice(0, 2).join(" / ")}</p>
              <h3 id={`project-${project.slug}`}>{project.title}</h3>
              <p className="pg-exhibit-summary">{project.summary}</p>
              <p className="pg-exhibit-status">{project.status}</p>
              <Link className="pg-details" href={`/projects/${project.slug}`}>Read the technical details <ArrowUpRight size={18} aria-hidden /><span className="pg-sr-only">: {project.title}</span></Link>
            </div>
            <Link className="pg-exhibit-visual" href={`/projects/${project.slug}`} aria-label={`Read the ${project.title} technical details`}>
              <div className="pg-orbit" aria-hidden /><div className="pg-exhibit-light" aria-hidden />
              <div className="pg-display" data-project-display>
                <div className="pg-display-edge" aria-hidden />
                <div className="pg-display-surface"><Image src={project.image} alt={project.imageAlt} fill sizes="(max-width: 900px) 90vw, 54vw" /></div>
                <div className="pg-display-base" aria-hidden />
              </div>
              <span className="pg-visual-caption"><span>{project.eyebrow}</span><ArrowUpRight size={20} aria-hidden /></span>
            </Link>
          </article>
        ))}
      </div>
      <section id="project-catalogue" className="pg-catalogue p-wrap" aria-labelledby="catalogue-title">
        <div className="pg-catalogue-head"><div><p className="pg-intro-label">The complete collection</p><h3 id="catalogue-title">More work,<br />different constraints.</h3></div><p>Interfaces, data pipelines, machine learning and computing foundations. Explore the work by field or find a particular tool.</p></div>
        <div className="pg-catalogue-controls">
          <div className="pg-search"><Search size={19} aria-hidden /><label htmlFor="project-search" className="pg-sr-only">Search projects</label><input id="project-search" name="q" type="search" placeholder="Search projects, tools, or ideas…" value={filters.query} onChange={event => updateFilters({ ...filters, query: event.target.value }, true)} autoComplete="off" />{filters.query && <button type="button" aria-label="Clear project search" onClick={() => { updateFilters({ ...filters, query: "" }, true); document.getElementById("project-search")?.focus() }}><X size={18} aria-hidden /></button>}</div>
          <div className="pg-group-control"><label htmlFor="project-group">Group by</label><select id="project-group" name="group" value={filters.grouped ? "category" : "none"} onChange={event => updateFilters({ ...filters, grouped: event.target.value === "category" })}><option value="none">None</option><option value="category">Category</option></select></div>
        </div>
        <div className="pg-filters" role="group" aria-label="Filter projects by category">
          {["all", ...categories].map(category => <button key={category} type="button" aria-pressed={filters.category === category} onClick={() => updateFilters({ ...filters, category })}>{category === "all" ? "All work" : category}</button>)}
        </div>
        <p className="pg-results" role="status" aria-live="polite" aria-atomic="true">{filtered.length} {filtered.length === 1 ? "project" : "projects"}{filters.category !== "all" ? ` in ${filters.category}` : ""}{filters.query.trim() ? ` matching “${filters.query.trim()}”` : ""}</p>
        {filtered.length ? <div className="pg-catalogue-groups">{groups.map(group => <div className="pg-catalogue-group" key={group.title}>{filters.grouped && <h4 className="pg-group-title">{group.title}</h4>}<div className="pg-catalogue-list">{group.items.map(project => <CatalogueEntry key={project.slug} project={project} />)}</div></div>)}</div> : <div className="pg-empty"><p>No projects match this filter.</p><button type="button" onClick={() => updateFilters(defaultFilters)}>Show all work <ArrowUpRight size={17} aria-hidden /></button></div>}
      </section>
    </section>
  )
}
