"use client"

import Image from "next/image"
import Link from "next/link"
import * as Dialog from "@radix-ui/react-dialog"
import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowUpRight, Play, X } from "lucide-react"
import { productFilms, filmLength } from "@/lib/project-films"
import type { ProductFilm } from "@/lib/project-films"
import "./project-film.css"

export function FilmPlayer({ film, autoStart = false }: { film: ProductFilm; autoStart?: boolean }) {
  const video = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const play = useCallback(async () => {
    const node = video.current
    if (!node) return
    setStarted(true)
    setLoading(true)
    setFailed(false)
    try {
      await node.play()
      node.focus({ preventScroll: true })
    } catch {
      setStarted(false)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const node = video.current
    if (autoStart) void play()
    return () => { node?.pause() }
  }, [autoStart, play])

  return (
    <div className="film-player" data-film-player={film.slug} data-started={started} aria-busy={loading}>
      <video ref={video} controls preload="none" playsInline poster={film.poster} tabIndex={0}
        aria-label={`${film.name} product film`}
        onPlaying={() => { setStarted(true); setLoading(false) }}
        onLoadedData={() => setLoading(false)}
        onError={() => { setLoading(false); setFailed(true) }}>
        <source src={film.src} type="video/mp4" />
        <track kind="captions" src={film.captions} srcLang="en" label="English" />
        Your browser cannot play this film. <a href={film.src}>Download the MP4</a>.
      </video>
      <button className="film-start" type="button" onClick={() => void play()} tabIndex={started ? -1 : 0}
        aria-hidden={started} aria-label={`Watch ${film.name} film, ${filmLength(film.duration)}`}>
        <span className="film-start-control"><Play size={23} fill="currentColor" aria-hidden /><span>Watch film <span className="film-start-time">{filmLength(film.duration)}</span></span></span>
      </button>
      {loading && <span className="film-loading" role="status">Loading film…</span>}
      {failed && <p className="film-error" role="alert">The film could not load. <a href={film.src}>Download the MP4</a>.</p>}
      <noscript><style>{`.film-start { display: none !important; }`}</style></noscript>
    </div>
  )
}

function FilmLaunch({ film }: { film: ProductFilm }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="film-card" type="button" aria-label={`Watch ${film.name} film, ${filmLength(film.duration)}`}>
          <span className="film-card-heading"><span><Image src={film.mark} alt="" width={30} height={30} />{film.name}</span><span>{filmLength(film.duration)}</span></span>
          <span className="film-card-picture"><Image src={film.poster} alt={`${film.name} product preview`} fill sizes="(max-width: 767px) 88vw, 29vw" /><span className="film-card-play"><Play size={24} fill="currentColor" aria-hidden /></span></span>
        </button>
      </Dialog.Trigger>
      {open && <Dialog.Portal>
        <Dialog.Overlay className="film-overlay" />
        <Dialog.Content className="film-dialog" aria-describedby={undefined}>
          <div className="film-dialog-toolbar"><Dialog.Title>{film.name} film <span>{filmLength(film.duration)}</span></Dialog.Title><Dialog.Close className="film-close" aria-label="Close film"><X size={24} aria-hidden /></Dialog.Close></div>
          <FilmPlayer film={film} autoStart />
          <div className="film-dialog-links"><Link href={`/films/${film.slug}`}>Open film page <ArrowUpRight size={15} aria-hidden /></Link>{film.appUrl && <a href={film.appUrl} target="_blank" rel="noopener noreferrer">Try {film.name} <ArrowUpRight size={15} aria-hidden /></a>}</div>
        </Dialog.Content>
      </Dialog.Portal>}
    </Dialog.Root>
  )
}

export function FilmShelf() {
  return (
    <section id="product-films" className="film-shelf p-wrap" aria-labelledby="product-films-title">
      <div className="film-shelf-heading"><div><p className="film-eyebrow">Product films</p><h3 id="product-films-title">See how<br />the apps work.</h3></div><p>From the first action to the details behind it.</p></div>
      <div className="film-shelf-grid">{productFilms.map(film => <FilmLaunch key={film.slug} film={film} />)}</div>
      <noscript><p className="film-static-links">{productFilms.map(film => <a key={film.slug} href={`/films/${film.slug}`}>Watch {film.name} <ArrowUpRight size={15} aria-hidden /></a>)}</p></noscript>
    </section>
  )
}
