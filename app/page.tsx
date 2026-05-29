import { Nav } from "@/components/site/nav"
import { Hero } from "@/components/site/hero"
import { Experience } from "@/components/site/experience"
import { Work } from "@/components/site/work"
import { Stack } from "@/components/site/stack"
import { About } from "@/components/site/about"
import { Footer } from "@/components/site/footer"

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Experience />
        <Work />
        <Stack />
        <About />
      </main>
      <Footer />
    </>
  )
}
