"use client"

import { useEffect } from "react"
import type { RefObject } from "react"

export function MotionDirector({ root, paused }: { root: RefObject<HTMLDivElement>; paused: boolean }) {
  useEffect(() => {
    const node = root.current
    if (!node) return
    let frame = 0
    const progress = node.querySelector<HTMLElement>("[data-reading-progress]")
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - innerHeight
      if (progress) progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`
      node.dataset.scrolled = scrollY > 32 ? "true" : "false"
    }
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    addEventListener("scroll", scroll, { passive: true })
    addEventListener("resize", scroll)
    update()
    return () => { removeEventListener("scroll", scroll); removeEventListener("resize", scroll); cancelAnimationFrame(frame) }
  }, [root])

  useEffect(() => {
    if (!root.current) return
    if (paused) { root.current.dataset.motionEngine = "static"; return }
    let cancelled = false
    let revert = () => {}
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled || !root.current) return
      gsap.registerPlugin(ScrollTrigger)
      const context = gsap.context(() => {
        const hero = root.current!.querySelector("[data-cinematic-hero]")
        const stage = root.current!.querySelector(".cinematic-stage")
        if (hero && stage && innerHeight > 500) {
          // The seven letters leave at different depths as work covers the stage.
          gsap.to(hero.querySelectorAll(".hero-letter-drift"), {
            y: index => -(index % 2 ? 80 + index * 17 : 160 + index * 22),
            opacity: .08,
            ease: "none",
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom 25%", scrub: .45 },
          })
          gsap.to(hero.querySelector(".hero-name-foot"), { y: -60, opacity: 0, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "center top", scrub: .45 } })
        }
        const workIntro = root.current!.querySelector("[data-work-intro]")
        if (workIntro) gsap.fromTo(workIntro.querySelectorAll(".work-title-letter"), { yPercent: 110, opacity: .15 }, {
          yPercent: 0, opacity: 1, stagger: .045, ease: "power2.out",
          scrollTrigger: { trigger: workIntro, start: "top 85%", end: "center 58%", scrub: .45 },
        })
        root.current!.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element, index) => {
          gsap.fromTo(element, { y: 24, opacity: .15 }, { y: 0, opacity: 1, duration: .85, ease: "power3.out", delay: index % 2 * .04, scrollTrigger: { trigger: element, start: "top 92%", once: true } })
        })
        root.current!.querySelectorAll<HTMLElement>("[data-exhibit]").forEach(element => {
          const picture = element.querySelector("img")
          // Stack-card imagery owns its hover transform in CSS.
          if (picture && !element.closest("[data-stack-card]")) gsap.fromTo(picture, { scale: 1.045 }, { scale: 1, ease: "none", scrollTrigger: { trigger: element, start: "top bottom", end: "center center", scrub: 0.5 } })
        })
        const leadership = root.current!.querySelector("#leadership")
        if (leadership) gsap.fromTo(leadership.querySelectorAll("[data-gold-line]"), { strokeDashoffset: 600 }, { strokeDashoffset: 0, duration: 1.6, stagger: 0.18, ease: "power2.out", scrollTrigger: { trigger: leadership, start: "top 70%", once: true } })
        const ledger = root.current!.querySelector(".p-ledger")
        if (ledger) {
          const line = ledger.querySelector("[data-timeline-line]")
          if (line) gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ledger, start: "top 65%", end: "bottom 65%", scrub: 0.4 } })
          ledger.querySelectorAll(".p-ledger-item").forEach(role => ScrollTrigger.create({ trigger: role, start: "top 65%", end: "bottom 30%", toggleClass: "role-in-view" }))
        }
        root.current!.querySelectorAll<HTMLElement>("[data-chapter]").forEach(section => {
          ScrollTrigger.create({ trigger: section, start: "top 55%", end: "bottom 55%", toggleClass: "chapter-active" })
        })
      }, root.current)
      revert = () => context.revert()
      ScrollTrigger.refresh()
      root.current.dataset.motionEngine = "ready"
    }).catch(() => {
      if (root.current && !cancelled) root.current.dataset.motionEngine = "unavailable"
    })
    return () => { cancelled = true; revert() }
  }, [root, paused])
  return null
}
