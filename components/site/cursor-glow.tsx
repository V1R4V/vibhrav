"use client"

import { useEffect, useRef } from "react"

/**
 * A warm gold spotlight that follows the pointer across the entire page.
 * Writes the cursor position to CSS vars (--cx / --cy) consumed by the
 * `.cursor-glow` radial gradient in globals.css. Fixed + pointer-events none,
 * rAF-throttled, and disabled on touch / reduced-motion.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (window.matchMedia("(pointer: coarse)").matches) return

    let raf = 0
    let x = -200
    let y = -200

    const apply = () => {
      raf = 0
      el.style.setProperty("--cx", `${x}px`)
      el.style.setProperty("--cy", `${y}px`)
    }
    const onMove = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
      if (!raf) raf = requestAnimationFrame(apply)
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    return () => {
      window.removeEventListener("mousemove", onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={ref} className="cursor-glow" aria-hidden />
}
