"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { usePortfolioMotion } from "./portfolio-frame"

const model = "8e7158c8d6814294a5d688e6a0507af3"
const source = `https://sketchfab.com/3d-models/santiago-bernabeu-stadium-3d-model-${model}`
const poster = "https://media.sketchfab.com/models/8e7158c8d6814294a5d688e6a0507af3/thumbnails/5bd0465a391444e49a6aa02b33add73e/c5468c19ed174d05a0cce6ace6f9390b.jpeg"

export function BernabeuViewer() {
  const host = useRef<HTMLDivElement>(null)
  const { paused } = usePortfolioMotion()
  const [visible, setVisible] = useState(false)
  const [documentVisible, setDocumentVisible] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const active = visible && documentVisible && !paused

  useEffect(() => {
    const element = host.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "120px" })
    observer.observe(element)
    const sync = () => setDocumentVisible(!document.hidden)
    document.addEventListener("visibilitychange", sync)
    sync()
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync) }
  }, [])

  useEffect(() => { if (!active) setLoaded(false) }, [active])

  return <>
    <div ref={host} className="bernabeu-viewer" data-viewer-state={active ? loaded ? "loaded" : "loading" : "poster"}>
      <Image className="bernabeu-viewer-poster" src={poster} alt="Detailed silver facade and retractable roof of Santiago Bernabéu stadium" fill sizes="(max-width: 900px) 100vw, 55vw" unoptimized />
      {active && <iframe title="Explore Santiago Bernabéu in 3D" src={`https://sketchfab.com/models/${model}/embed?autostart=1&autospin=0.12&ui_infos=0&ui_theme=dark&dnt=1&scrollwheel=0`} allow="autoplay; fullscreen; xr-spatial-tracking" allowFullScreen onLoad={() => setLoaded(true)} />}
    </div>
    <figcaption className="bernabeu-credit">Santiago Bernabéu · <a href={source} target="_blank" rel="noopener noreferrer">3D model by nuralam018 on Sketchfab</a></figcaption>
  </>
}
