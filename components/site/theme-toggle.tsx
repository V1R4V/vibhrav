"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

/**
 * Compact sun/moon switch. Renders a stable placeholder until mounted so the
 * server and client markup match (next-themes resolves the theme on the client).
 */
export function ThemeToggle({ onDark = false }: { onDark?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`group relative grid h-9 w-9 place-items-center rounded-full border transition-colors ${
        onDark
          ? "border-white/25 text-white/80 hover:border-white hover:text-white"
          : "border-line-strong text-ink-soft hover:border-burgundy hover:text-burgundy"
      }`}
    >
      {/* Until mounted, show a neutral dot to avoid hydration mismatch */}
      {!mounted ? (
        <span className="h-3.5 w-3.5 rounded-full border border-current opacity-60" />
      ) : (
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="block"
        >
          {isDark ? <MoonIcon /> : <SunIcon />}
        </motion.span>
      )}
    </button>
  )
}

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
)

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)
