"use client"

import { useEffect, useRef, useState } from "react"
import type { Dispatch, RefObject, SetStateAction } from "react"

export type IntroPhase = "pending" | "opening" | "complete"
const sessionKey = "vibhrav:introduction:v2"

/** A short first-visit entrance. The counter follows fonts, document and scene readiness. */
export function CurtainLoader({ root, onPhase }: { root: RefObject<HTMLDivElement>; onPhase: Dispatch<SetStateAction<IntroPhase>> }) {
  const [phase, setPhase] = useState<IntroPhase>("complete")
  const [progress, setProgress] = useState(0)
  const skip = useRef<HTMLButtonElement>(null)
  const finishRef = useRef<() => void>(() => {})

  useEffect(() => {
    const node = root.current
    if (!node) return
    const media = matchMedia("(prefers-reduced-motion: reduce)")
    let visited = false
    try { visited = sessionStorage.getItem(sessionKey) === "seen" } catch { /* Storage is optional. */ }
    if (visited || media.matches || location.hash) { onPhase("complete"); return }

    let disposed = false
    let opening = false
    let frame = 0
    let releaseTimer: ReturnType<typeof setTimeout>
    let focusTimer: ReturnType<typeof setTimeout>
    const start = performance.now()
    let previous = start
    let displayed = 0
    const ready = new Set<string>()
    const oldOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = "hidden"
    setPhase("pending")
    onPhase("pending")

    const restoreInteraction = () => {
      node.querySelectorAll<HTMLElement>("[data-intro-inert]").forEach(element => {
        element.inert = false
        delete element.dataset.introInert
      })
      document.documentElement.style.overflow = oldOverflow
    }
    const finish = (immediate = false) => {
      if (disposed || opening) return
      opening = true
      cancelAnimationFrame(frame)
      try { sessionStorage.setItem(sessionKey, "seen") } catch { /* Continue in private contexts. */ }
      restoreInteraction()
      if (document.activeElement === skip.current) skip.current?.blur()
      setPhase(immediate ? "complete" : "opening")
      onPhase(immediate ? "complete" : "opening")
      if (!immediate) releaseTimer = setTimeout(() => { setPhase("complete"); onPhase("complete") }, 1100)
    }
    finishRef.current = () => finish(true)
    const preference = () => { if (media.matches) finish(true) }
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish(true)
      if (event.key === "Tab" && !opening) { event.preventDefault(); skip.current?.focus() }
    }
    const markDocument = () => ready.add("document")
    if (document.readyState === "complete") markDocument()
    else addEventListener("load", markDocument, { once: true })
    void document.fonts.ready.then(() => { if (!disposed) ready.add("fonts") })
    const checkScene = () => {
      const scene = node.querySelector<HTMLElement>(".gold-sculpture")
      if (scene && /ready|fallback/.test(scene.dataset.sceneState || "")) ready.add("scene")
    }
    const observer = new MutationObserver(checkScene)
    observer.observe(node, { subtree: true, attributes: true, attributeFilter: ["data-scene-state"] })
    checkScene()
    const tick = (now: number) => {
      const target = ready.size / 3 * 100
      displayed = Math.min(target, displayed + (now - previous) * .13)
      previous = now
      setProgress(Math.floor(displayed))
      if (displayed >= 100 && now - start >= 900) finish()
      else frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    // Failed/slow assets must never prevent access to the portfolio.
    const timeout = setTimeout(() => finish(), 4000)
    focusTimer = setTimeout(() => {
      if (opening || disposed) return
      for (const child of Array.from(node.children)) {
        if (child instanceof HTMLElement && !child.classList.contains("curtain-loader")) {
          child.inert = true
          child.dataset.introInert = ""
        }
      }
      skip.current?.focus({ preventScroll: true })
    }, 0)
    media.addEventListener("change", preference)
    document.addEventListener("keydown", escape)
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      clearTimeout(timeout)
      clearTimeout(focusTimer)
      clearTimeout(releaseTimer)
      observer.disconnect()
      restoreInteraction()
      removeEventListener("load", markDocument)
      document.removeEventListener("keydown", escape)
      media.removeEventListener("change", preference)
    }
  }, [root, onPhase])

  if (phase === "complete") return null
  return (
    <div className="curtain-loader" data-phase={phase} role="dialog" aria-modal={phase === "pending" ? true : undefined} aria-label="Opening portfolio">
      <div className="curtain-sheet curtain-red" aria-hidden />
      <div className="curtain-sheet curtain-black">
        <span className="curtain-signature" aria-hidden>Vibhrav Jha</span>
        <div className="curtain-count" aria-hidden>{String(progress).padStart(3, "0")}<span>%</span></div>
        <div className="curtain-bottom"><span>Engineering, in motion.</span><button ref={skip} type="button" onClick={() => finishRef.current()}>Skip introduction</button></div>
      </div>
    </div>
  )
}
