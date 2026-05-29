"use client"

import createGlobe from "cobe"
import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { places, travelStats, type Place } from "@/lib/site-data"

const HOME = places.filter((p) => p.home)

type Mode = "journey" | "travels"

// Convert a [lat, lng] into cobe's [phi, theta] so we can spin the globe to face it.
const locationToAngles = (lat: number, lng: number): [number, number] => [
  Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2),
  (lat * Math.PI) / 180,
]

type RGB = [number, number, number]
// Marker accents tuned per theme to match the dusk-rose / cyan token values.
const ROSE_DARK: RGB = [0.93, 0.36, 0.57]
const ROSE_LIGHT: RGB = [0.68, 0.16, 0.31]
const TEAL_DARK: RGB = [0.18, 0.78, 0.83]
const TEAL_LIGHT: RGB = [0.12, 0.46, 0.49]

export function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== "light" // dark is the default identity
  const [mounted, setMounted] = useState(false)
  const [mode, setMode] = useState<Mode>("journey")
  const [activeCity, setActiveCity] = useState<string | null>(null)

  // Persist rotation state across globe re-creation (mode switches recreate it).
  const phiRef = useRef(4.4) // start roughly facing India
  const thetaRef = useRef(0.42)
  const targetPhi = useRef<number | null>(null)
  const targetTheta = useRef<number | null>(null)
  const spinning = useRef(true)

  // Only spin up WebGL once the globe scrolls into view.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true)
          io.disconnect()
        }
      },
      { rootMargin: "200px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Reset to free-spin whenever the filter changes.
  useEffect(() => {
    spinning.current = true
    targetPhi.current = null
    targetTheta.current = null
    setActiveCity(null)
  }, [mode])

  // Spin the globe to face a place, and pause auto-rotation.
  const focusOn = (p: Place) => {
    const [phi, theta] = locationToAngles(p.coords[0], p.coords[1])
    let target = phi
    // shortest angular path from the current phi
    while (target - phiRef.current > Math.PI) target -= 2 * Math.PI
    while (target - phiRef.current < -Math.PI) target += 2 * Math.PI
    targetPhi.current = target
    targetTheta.current = theta
    spinning.current = false
    setActiveCity(p.city)
  }

  const resume = () => {
    spinning.current = true
    targetPhi.current = null
    targetTheta.current = null
    setActiveCity(null)
  }

  useEffect(() => {
    if (!mounted || !canvasRef.current) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let width = 0
    const onResize = () => {
      if (canvasRef.current) width = canvasRef.current.offsetWidth
    }
    window.addEventListener("resize", onResize)
    onResize()

    const visible = mode === "journey" ? HOME : places

    const rose = isDark ? ROSE_DARK : ROSE_LIGHT
    const teal = isDark ? TEAL_DARK : TEAL_LIGHT

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: isDark ? 1 : 0,
      diffuse: isDark ? 1.4 : 1.1,
      mapSamples: 16000,
      mapBrightness: isDark ? 5.2 : 6.5,
      mapBaseBrightness: isDark ? 0.05 : 0.12,
      baseColor: isDark ? [0.32, 0.3, 0.36] : [0.83, 0.77, 0.67],
      markerColor: mode === "journey" ? rose : teal,
      glowColor: isDark ? [0.16, 0.14, 0.2] : [0.9, 0.86, 0.78],
      opacity: 0.95,
      markers: visible.map((p) => ({
        location: p.coords,
        size: p.home ? 0.1 : 0.07,
      })),
      onRender: (state) => {
        if (spinning.current && !reduced) {
          phiRef.current += 0.0035
        } else if (targetPhi.current !== null && targetTheta.current !== null) {
          // ease toward the focused location
          phiRef.current += (targetPhi.current - phiRef.current) * 0.085
          thetaRef.current += (targetTheta.current - thetaRef.current) * 0.085
        }
        state.phi = phiRef.current
        state.theta = thetaRef.current
        state.width = width * 2
        state.height = width * 2
      },
    })

    // Pause rendering when offscreen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
      },
      { threshold: 0 },
    )
    if (wrapRef.current) io.observe(wrapRef.current)

    return () => {
      globe.destroy()
      io.disconnect()
      window.removeEventListener("resize", onResize)
    }
  }, [mounted, mode, isDark])

  const travels = places.filter((p) => !p.home)

  return (
    <div className="flex flex-col items-center">
      {/* Segmented filter */}
      <div
        role="tablist"
        aria-label="Globe view"
        className="mb-7 inline-flex rounded-full border border-line bg-paper-2/60 p-1 font-mono text-[0.7rem] uppercase tracking-[0.12em]"
      >
        {(
          [
            ["journey", "My journey"],
            ["travels", "Places I've been"],
          ] as const
        ).map(([key, label]) => {
          const on = mode === key
          return (
            <button
              key={key}
              role="tab"
              aria-selected={on}
              onClick={() => setMode(key)}
              className={`rounded-full px-3.5 py-1.5 transition-colors ${
                on
                  ? key === "journey"
                    ? "bg-burgundy text-paper"
                    : "bg-teal text-paper"
                  : "text-ink-faint hover:text-ink"
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Globe */}
      <div
        ref={wrapRef}
        className="relative mx-auto aspect-square w-full max-w-[340px]"
      >
        <div
          aria-hidden
          className="absolute inset-[8%] rounded-full transition-colors duration-500"
          style={{
            background:
              mode === "journey"
                ? "radial-gradient(circle at 50% 45%, hsl(var(--ember)/0.10), transparent 70%)"
                : "radial-gradient(circle at 50% 45%, hsl(var(--teal)/0.14), transparent 70%)",
          }}
        />
        <canvas
          ref={canvasRef}
          className="relative h-full w-full [filter:drop-shadow(0_18px_30px_hsl(24_40%_30%/0.18))]"
          style={{ contain: "layout paint size" }}
          aria-hidden
        />

        {/* Journey labels — readable regardless of rotation / reduced motion */}
        {mode === "journey" && (
          <div className="pointer-events-none absolute inset-0">
            <span className="absolute left-1 top-6 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink-faint">
              New Delhi
            </span>
            <span className="absolute bottom-8 right-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-burgundy">
              Madison, WI
            </span>
          </div>
        )}
      </div>

      {/* Caption */}
      {mode === "journey" ? (
        <p className="mt-5 max-w-xs text-center text-sm leading-relaxed text-ink-soft">
          <span className="text-burgundy">New Delhi</span> to{" "}
          <span className="text-burgundy">Madison</span> — 12,000&nbsp;km from
          where I grew up to where I build now.
        </p>
      ) : (
        <div className="mt-5 flex flex-col items-center">
          <div className="flex items-center gap-5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-faint tnum">
            <span>
              <span className="text-teal">{travelStats.countries}</span> countries
            </span>
            <span className="h-3 w-px bg-line-strong" />
            <span>
              <span className="text-teal">{travelStats.continents}</span> continents
            </span>
            <span className="h-3 w-px bg-line-strong" />
            <span>
              <span className="text-burgundy">{travelStats.homes}</span> homes
            </span>
          </div>

          {/* Flag legend — click to spin the globe there */}
          <div className="mt-5 flex max-w-md flex-wrap justify-center gap-2">
            {travels.map((p) => {
              const on = activeCity === p.city
              return (
                <button
                  key={p.city}
                  onClick={() => focusOn(p)}
                  title={`${p.city}, ${p.country}`}
                  className={`group inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-all ${
                    on
                      ? "border-teal bg-teal/10 text-ink"
                      : "border-line text-ink-soft hover:border-teal-soft hover:text-ink"
                  }`}
                >
                  <img
                    src={`https://flagcdn.com/${p.iso}.svg`}
                    alt=""
                    width={16}
                    height={12}
                    loading="lazy"
                    className="h-3 w-4 rounded-[1px] object-cover ring-1 ring-black/5"
                  />
                  <span>{p.country}</span>
                </button>
              )
            })}
          </div>

          {activeCity && (
            <button
              onClick={resume}
              className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-teal underline-offset-4 hover:underline"
            >
              ↻ resume spin
            </button>
          )}
        </div>
      )}
    </div>
  )
}
