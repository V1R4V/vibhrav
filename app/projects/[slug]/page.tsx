import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
import { ImpactMetrics } from "@/components/cinematic/impact-metrics"
import { projects } from "@/lib/portfolio-data"
import { projectMedia } from "@/lib/project-media"
import { getProductFilm } from "@/lib/project-films"
import { FilmPlayer } from "@/components/cinematic/project-film"
import { PortfolioFrame } from "@/components/cinematic/portfolio-frame"
import { ProjectReadme } from "@/components/cinematic/project-readme"
import { ProjectBrowser } from "@/components/cinematic/project-browser"
import { getProjectReadme } from "@/lib/project-readmes"
import "../../cinematic/cinematic.css"
import "./project.css"

type Props = { params: Promise<{ slug: string }> }
export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })) }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find(item => item.slug === slug)
  return project ? { title: project.title, description: project.summary, alternates: { canonical: `/projects/${slug}` }, openGraph: { title: project.title, description: project.summary, images: [project.image] } } : { title: "Project not found" }
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const index = projects.findIndex(item => item.slug === slug)
  if (index < 0) notFound()
  const project = projects[index]
  const film = getProductFilm(slug)
  const document = getProjectReadme(slug)
  const stories = [["The result", project.outcome], ["The problem", project.problem], ["A decision worth examining", project.detail], ["The approach", project.approach]].filter(([, content], storyIndex, all) => content && content !== project.summary && !all.slice(0, storyIndex).some(([, earlier]) => earlier === content))
  return (
    <PortfolioFrame>
      <main id="introduction" tabIndex={-1} className="project-page">
        <section className="project-opening" data-chapter>
          <div className="project-title-stage">
            <div className="project-opening-top"><Link className="project-back" href="/#project-catalogue"><ArrowLeft size={16} aria-hidden /> All projects</Link><span>{project.category}</span></div>
            <div className="project-title-composition">
              <h1 className={project.title.length > 20 ? "project-title-long" : project.title.length <= 10 ? "project-title-short" : undefined} data-reveal>{project.title.split(" ").map((word, wordIndex, words) => <span className="project-title-word" key={wordIndex}>{word}{wordIndex === words.length - 1 ? <span className="project-title-period" aria-hidden>.</span> : " "}</span>)}</h1>
              <p className="project-deck">{project.eyebrow}</p>
            </div>
            <ImpactMetrics metrics={project.metrics} title={project.title} />
            <div className="project-meta"><p><span>My contribution</span>{project.role}</p><p><span>Field</span>{project.categories.join(" / ")}</p>{project.href && <a href={project.href} target="_blank" rel="noopener noreferrer">View repository <ArrowUpRight size={18} aria-hidden /></a>}</div>
            <div className="project-publication"><p>{project.status}</p>{project.demo && <a href={project.demo} target="_blank" rel="noopener noreferrer">Open demo <ArrowUpRight size={18} aria-hidden /></a>}</div>
            <nav className="project-reading-links" aria-label="Project detail navigation">{film && <a href="#project-film">Watch film <ArrowRight size={16} aria-hidden /></a>}<a href={document ? "#project-readme" : "#project-overview"}>{document ? "Read README" : "Read project notes"} <ArrowRight size={16} aria-hidden /></a><a href="#project-browser">Browse projects <ArrowRight size={16} aria-hidden /></a></nav>
          </div>
          <div className="project-image-stage">{film ? <div id="project-film" className="project-film-opening"><FilmPlayer film={film} /></div> : <><div className="project-main-image" data-exhibit><Image src={project.image} alt={project.imageAlt} fill priority sizes="(max-width: 767px) 94vw, 92vw" /></div>{project.imageCaption && <p className="project-image-note">{project.imageCaption}. This image is generated concept artwork.</p>}</>}</div>
        </section>
        <section className="project-narrative" data-chapter aria-labelledby="project-overview">
          <div className="project-overview"><h2 id="project-overview" data-reveal>The work<br />behind the interface.</h2><p>{project.summary}</p><ul aria-label="Technologies">{project.stack.map(tool => <li key={tool}>{tool}</li>)}</ul></div>
          <div className="project-stories">{stories.map(([heading, content]) => <article key={heading}><h3>{heading}</h3><p>{content}</p></article>)}</div>
        </section>
        {projectMedia[slug] && <section className="project-evidence" aria-labelledby="project-evidence-title">
          <div className="project-evidence-heading"><h2 id="project-evidence-title">A closer look.</h2><p>Interface details and context from the project.</p></div>
          <div className="project-evidence-grid">{projectMedia[slug].map(media => <figure key={media.src}>
            <div className="project-evidence-image"><Image src={media.src} alt={media.alt} fill sizes="(max-width: 767px) 88vw, 44vw" /></div><figcaption>{media.caption}</figcaption>
          </figure>)}</div>
        </section>}
        {document && <ProjectReadme document={document} />}
        <ProjectBrowser current={slug} items={projects.map(({ slug, title, category, image, imageAlt }) => ({ slug, title, category, image, imageAlt }))} />
      </main>
    </PortfolioFrame>
  )
}
