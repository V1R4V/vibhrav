import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { PortfolioFrame } from "@/components/cinematic/portfolio-frame"
import { FilmPlayer } from "@/components/cinematic/project-film"
import { productFilms, getProductFilm, filmLength } from "@/lib/project-films"
import "../../cinematic/cinematic.css"

type Props = { params: Promise<{ slug: string }> }
export function generateStaticParams() { return productFilms.map(film => ({ slug: film.slug })) }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const film = getProductFilm(slug)
  return film ? { title: `${film.name} — product film`, description: film.summary, alternates: { canonical: `/films/${slug}` }, openGraph: { title: `${film.name} — product film`, description: film.summary, images: [film.poster] } } : { title: "Film not found" }
}
export default async function FilmPage({ params }: Props) {
  const { slug } = await params
  const film = getProductFilm(slug)
  if (!film) notFound()
  return (
    <PortfolioFrame>
      <main id="introduction" tabIndex={-1} className="film-page">
        <section className="film-page-opening p-wrap">
          <Link className="film-page-back" href="/#product-films"><ArrowLeft size={16} aria-hidden /> Product films</Link>
          <div className="film-page-heading"><h1>{film.name}</h1><p>{film.summary}</p></div>
          <FilmPlayer film={film} />
          <div className="film-page-actions"><span>{filmLength(film.duration)}</span>{film.appUrl && <a href={film.appUrl} target="_blank" rel="noopener noreferrer">Try {film.name} <ArrowUpRight size={17} aria-hidden /></a>}{film.projectHref && <Link href={film.projectHref}>Read the technical details <ArrowUpRight size={17} aria-hidden /></Link>}<a href={film.src} download>Download film <ArrowUpRight size={17} aria-hidden /></a></div>
          <details className="film-transcript"><summary>Read transcript</summary>{film.transcript.map((text, index) => <p key={index}>{text}</p>)}</details>
        </section>
        <div className="p-wrap"><p className="film-credits">Music: {film.slug === "vyaya" ? "Cat Walk — Arulo" : film.slug === "studyflow" ? "Deep Urban — Eugenio Mininni" : "Digital Clouds — Alejandro Magaña (A. M.)"}, <a href="https://mixkit.co/license/modal/musicFree/" target="_blank" rel="noopener noreferrer">Mixkit Stock Music Free License</a>. Interface sounds: <a href="https://kenney.nl/assets/interface-sounds" target="_blank" rel="noopener noreferrer">Kenney</a>, CC0.</p></div>
      </main>
    </PortfolioFrame>
  )
}
