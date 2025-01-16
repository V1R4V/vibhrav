import { Hero } from "@/components/hero"
import { Nav } from "@/components/nav"
import TechStack from "@/components/tech-stack"
import { Projects } from "@/components/projects"
import { InteractiveBackground } from "@/components/interactive-background"
import Image from 'next/image'
import { Analytics } from '@vercel/analytics/next';

export default function Home() {
  return (
    <main>
      <InteractiveBackground />
      <Nav />
      <Hero />
      <TechStack />
      <Projects />
      <Analytics />
    </main>
   
  )
}

