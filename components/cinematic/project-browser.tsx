"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"

type Choice = { slug: string; title: string; category: string; image: string; imageAlt: string }

export function ProjectBrowser({ items, current }: { items: Choice[]; current: string }) {
  const track = useRef<HTMLOListElement>(null)
  const [ready, setReady] = useState(false)
  const [edges, setEdges] = useState({ start: true, end: false })
  const index = items.findIndex(item => item.slug === current)
  const next = items[(index + 1) % items.length]
  const updateEdges = useCallback(() => {
    const el = track.current
    if (!el) return
    const inset = parseFloat(getComputedStyle(el).paddingLeft || "0")
    const start = el.scrollLeft <= inset + 1, end = el.scrollLeft + el.clientWidth >= el.scrollWidth - inset - 1
    setEdges(previous => previous.start === start && previous.end === end ? previous : { start, end })
  }, [])
  useEffect(() => {
    const el = track.current
    const selected = el?.querySelector<HTMLElement>('[aria-current="page"]')?.parentElement
    if (!el) return
    if (selected) el.scrollLeft = Math.max(0, selected.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft || "0"))
    updateEdges()
    setReady(true)
    const observer = new ResizeObserver(updateEdges)
    observer.observe(el)
    return () => observer.disconnect()
  }, [current, updateEdges])
  function scroll(direction: number) {
    const el = track.current
    if (!el) return
    const step = (el.firstElementChild?.getBoundingClientRect().width || el.clientWidth) + parseFloat(getComputedStyle(el).gap || "0")
    el.scrollBy({ left: step * direction, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })
  }
  function keyboard(event: KeyboardEvent<HTMLOListElement>) {
    if (event.target !== event.currentTarget) return
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); scroll(event.key === "ArrowLeft" ? -1 : 1) }
    if (event.key === "Home" || event.key === "End") { event.preventDefault(); event.currentTarget.scrollLeft = event.key === "Home" ? 0 : event.currentTarget.scrollWidth }
  }
  return (
    <section id="project-browser" className="project-next project-browser" aria-label="Browse projects" role="region">
      <header className="project-browser-header">
        <div><p className="project-section-label">Continue exploring · {items.length} projects</p><h2><Link href={`/projects/${next.slug}`} prefetch={false}>{next.title}<ArrowRight size={28} aria-hidden /></Link></h2></div>
        {ready && <div className="project-browser-controls"><button type="button" onClick={() => scroll(-1)} disabled={edges.start} aria-label="Scroll projects left" aria-controls="project-choices"><ArrowLeft size={21} aria-hidden /></button><button type="button" onClick={() => scroll(1)} disabled={edges.end} aria-label="Scroll projects right" aria-controls="project-choices"><ArrowRight size={21} aria-hidden /></button></div>}
      </header>
      <ol ref={track} id="project-choices" className="project-browser-track" aria-label="Project choices" tabIndex={0} onScroll={updateEdges} onKeyDown={keyboard}>
        {items.map(item => <li key={item.slug}><Link href={`/projects/${item.slug}`} prefetch={false} aria-current={item.slug === current ? "page" : undefined}>
          <div className="project-choice-image"><Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 767px) 80vw, 360px" /></div>
          <div className="project-choice-copy"><p>{item.category}{item.slug === current && <span>Viewing</span>}</p><h3>{item.title}</h3></div>
        </Link></li>)}
      </ol>
      <Link className="project-return" href="/#project-catalogue">All projects <ArrowUpRight size={18} aria-hidden /></Link>
    </section>
  )
}
