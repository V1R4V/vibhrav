import dynamic from 'next/dynamic'
import { Hero } from "@/components/hero"
import { Nav } from "@/components/nav"
import { Analytics } from '@vercel/analytics/next';

const TechStack = dynamic(() => import('@/components/tech-stack'))

const CredentialsShowcase = dynamic(
  () => import('@/components/credentials-showcase').then((mod) => mod.CredentialsShowcase),
  {
    loading: () => <section className="h-32" aria-hidden="true" />,
  }
)

const InteractiveBackground = dynamic(
  () => import('@/components/interactive-background').then((mod) => mod.InteractiveBackground),
  { ssr: false }
)

const Projects = dynamic(
  async () => {
    const mod = await import('@/components/projects')
    return mod.Projects
  },
  {
    loading: () => <section className="h-40" aria-hidden="true" />,
  }
)

export default function Home() {
  return (
    <main>
      <InteractiveBackground />
      <Nav />
      <Hero />
      <CredentialsShowcase />
      <TechStack />
      <Projects />
      <Analytics />
    </main>
   
  )
}

