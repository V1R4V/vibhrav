"use client"

import { ReactLenis } from "lenis/react"
import { useEffect, useState } from "react"

/**
 * Buttery momentum scrolling via Lenis. Disabled automatically when the user
 * prefers reduced motion, so the page falls back to native scroll.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  if (reduced) return <>{children}</>

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.1,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
