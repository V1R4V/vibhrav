import type { Metadata } from "next"
import {
  Bricolage_Grotesque,
  Space_Grotesk,
  Newsreader,
  JetBrains_Mono,
} from "next/font/google"
import "./globals.css"
import { SmoothScroll } from "@/components/site/smooth-scroll"
import { ThemeProvider } from "@/components/site/theme-provider"
import { Ambient } from "@/components/site/ambient"
import { Toaster } from "@/components/ui/sonner"
import { profile } from "@/lib/site-data"

// Body / UI — clean technical grotesque.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

// Section headlines — contemporary grotesque with character + impact.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
})

// Hero title + the one italic emphasis word per section — editorial serif.
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-hero",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  // Newsreader has no metrics in Next's fallback DB; skip the override so the
  // dev server stops logging "Failed to find font override values".
  adjustFontFallback: false,
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: profile.name,
  description: `${profile.name}, software engineer ${profile.tagline}. Web development, applied AI, and distributed systems.`,
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: profile.name,
    description: `Software engineer ${profile.tagline}.`,
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${bricolage.variable} ${newsreader.variable} ${jetbrainsMono.variable} grain bg-paper text-ink antialiased`}
      >
        <ThemeProvider>
          <Ambient />
          <SmoothScroll>{children}</SmoothScroll>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
