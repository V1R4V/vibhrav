import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { profile } from "@/lib/portfolio-data"
import { SpeedInsights } from "@vercel/speed-insights/next"

// Body / UI — clean technical grotesque.
const spaceGrotesk = localFont({
  src: "../node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2",
  variable: "--font-sans",
  weight: "300 700",
  display: "swap",
})

// Editorial contrast for the contact close.
const newsreader = localFont({
  src: [
    { path: "../node_modules/@fontsource-variable/newsreader/files/newsreader-latin-standard-normal.woff2", style: "normal" },
    { path: "../node_modules/@fontsource-variable/newsreader/files/newsreader-latin-standard-italic.woff2", style: "italic" },
  ],
  variable: "--font-hero",
  weight: "200 800",
  display: "swap",
  adjustFontFallback: false,
})

const jetbrainsMono = localFont({
  src: "../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-mono",
  weight: "100 800",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://vibhrav.vercel.app"),
  title: { default: "Vibhrav Jha — Software engineer", template: "%s · Vibhrav Jha" },
  description: "Software engineering across AI, web and systems. Selected projects, experience and leadership by Vibhrav Jha.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: profile.name,
    description: "Engineering across AI, web and systems. Work, decisions and leadership.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${newsreader.variable} ${jetbrainsMono.variable} bg-paper text-ink antialiased`}
      >
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
