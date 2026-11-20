import type { Metadata } from "next"
import CinematicPage from "./cinematic/page"

export const metadata: Metadata = {
  title: "Vibhrav Jha — Software engineer",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
}

export default CinematicPage
