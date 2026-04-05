'use client'

import Image from 'next/image'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GenericTool, StreamingMarkdown } from '@21st-sdk/react'
import { BrainCircuit, CodeXml, ShieldCheck, WandSparkles } from 'lucide-react'
import { Nav } from '@/components/nav'
import { InteractiveBackground } from './interactive-background'

const valueCards = [
  {
    icon: CodeXml,
    title: 'Product Engineering',
    subtitle: 'From UX to API architecture',
    text: 'I ship complete features across frontend and backend with an emphasis on user clarity, clean abstractions, and maintainable delivery.',
    accent: 'from-cyan-400/35 to-sky-500/20',
  },
  {
    icon: BrainCircuit,
    title: 'Applied AI',
    subtitle: 'Practical systems over demos',
    text: 'I build AI workflows that are measurable and production-ready, using retrieval, automation, and robust backend orchestration.',
    accent: 'from-violet-400/35 to-fuchsia-500/20',
  },
  {
    icon: ShieldCheck,
    title: 'Execution Discipline',
    subtitle: 'Reliability + communication',
    text: 'I move fast with high ownership, document decisions clearly, and optimize for long-term engineering velocity and quality.',
    accent: 'from-emerald-400/35 to-cyan-500/20',
  },
]

const focusModes = [
  {
    id: 'roles',
    label: 'ROLES',
    content:
      'I am targeting Software Engineer and Product Engineer opportunities where I can own meaningful features and collaborate closely with product + design.',
  },
  {
    id: 'impact',
    label: 'IMPACT',
    content:
      'I deliver outcomes with clear metrics, fast iteration loops, and implementation quality that scales with team and product complexity.',
  },
  {
    id: 'culture',
    label: 'CULTURE',
    content:
      'I thrive in ambitious teams that value craftsmanship, feedback, and execution standards as much as speed.',
  },
]

const personal = [
  { label: 'LOCATION', value: 'Madison, WI (originally New Delhi, India)' },
  { label: 'CURRENT FOCUS', value: 'High-quality product engineering with real user impact.' },
  { label: 'OUTSIDE WORK', value: 'Football, gym, cooking, gaming, and reading.' },
]

export function About() {
  const [activeFocus, setActiveFocus] = useState(focusModes[0].id)
  const currentFocus = focusModes.find((item) => item.id === activeFocus) ?? focusModes[0]

  return (
    <div>
      <Nav />
      <InteractiveBackground />

      <section className="relative px-4 pt-28 md:pt-32 pb-14 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 right-10 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 left-6 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="apple-surface rounded-[2rem] p-7 md:p-10"
          >
            <p className="text-xs md:text-sm tracking-[0.22em] uppercase text-cyan-200/85 mb-3">ABOUT</p>
            <h1 className="section-title text-5xl md:text-6xl">Engineer, Builder, Collaborator</h1>

            <div className="mt-7 rounded-2xl border border-white/15 bg-black/25 p-5 md:p-6">
              <StreamingMarkdown
                className="text-slate-200 text-base md:text-xl leading-relaxed"
                content="I am Vibhrav Jha, a full-stack engineer focused on building software that is useful, fast, and production-ready. I enjoy owning features end-to-end, from interface polish to backend logic. I am currently looking for opportunities where I can contribute to product growth and solve meaningful engineering problems."
              />
            </div>

            <div className="mt-6 grid sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-cyan-200/25 bg-cyan-500/10 px-4 py-3">
                <p className="text-xs tracking-[0.16em] text-cyan-100/90 uppercase">Core</p>
                <p className="mt-1 text-slate-100 font-semibold">Fullstack + AI</p>
              </div>
              <div className="rounded-xl border border-violet-200/25 bg-violet-500/10 px-4 py-3">
                <p className="text-xs tracking-[0.16em] text-violet-100/90 uppercase">Focus</p>
                <p className="mt-1 text-slate-100 font-semibold">Product Impact</p>
              </div>
              <div className="rounded-xl border border-emerald-200/25 bg-emerald-500/10 px-4 py-3">
                <p className="text-xs tracking-[0.16em] text-emerald-100/90 uppercase">Style</p>
                <p className="mt-1 text-slate-100 font-semibold">High Ownership</p>
              </div>
            </div>
          </motion.article>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            viewport={{ once: true }}
            className="apple-surface rounded-[2rem] p-5 md:p-6"
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/15 h-[340px] md:h-[420px]">
              <Image
                src="/IMG_0950.jpg"
                alt="Vibhrav Jha"
                fill
                sizes="(max-width: 1280px) 100vw, 30vw"
                className="object-cover"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="relative px-4 pb-14 md:pb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-100 mb-7 tracking-tight">WORK STYLE</h2>

          <div className="grid gap-5 md:grid-cols-3">
            {valueCards.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: 0.05 * index }}
                viewport={{ once: true, margin: '-90px' }}
                whileHover={{ y: -5, scale: 1.012 }}
                className="apple-surface rounded-[1.65rem] p-5"
              >
                <div className={`inline-flex rounded-full bg-gradient-to-r ${item.accent} px-3 py-1.5 border border-white/20 mb-3`}>
                  <item.icon className="w-4 h-4 text-slate-100" />
                </div>

                <GenericTool
                  icon={item.icon}
                  title={item.title}
                  subtitle={item.subtitle}
                  isPending={false}
                  isError={false}
                  size="compact"
                />

                <p className="mt-4 text-sm md:text-base text-slate-200 leading-relaxed">{item.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-14 md:pb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-100 mb-6 tracking-tight">FOCUS</h2>

          <div className="apple-surface rounded-[1.8rem] p-5 md:p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {focusModes.map((mode) => {
                const active = mode.id === activeFocus
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setActiveFocus(mode.id)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs md:text-sm tracking-[0.12em] transition-all ${
                      active
                        ? 'border-cyan-200/45 bg-cyan-400/12 text-cyan-100 shadow-[0_8px_18px_rgba(35,160,255,0.2)]'
                        : 'border-white/15 text-slate-300 hover:bg-white/8'
                    }`}
                  >
                    {mode.label}
                  </button>
                )
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentFocus.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="rounded-xl border border-white/12 bg-white/8 p-4 md:p-5"
              >
                <div className="flex items-start gap-2">
                  <WandSparkles className="w-4 h-4 mt-1 text-cyan-200" />
                  <p className="text-slate-100 leading-relaxed text-sm md:text-base">{currentFocus.content}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-20 md:pb-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-100 mb-6 tracking-tight">PERSONAL</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {personal.map((item, index) => (
              <motion.article
                key={item.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="rounded-2xl border border-white/15 bg-slate-950/75 p-5"
              >
                <p className="text-xs tracking-[0.2em] text-cyan-200/90 uppercase">{item.label}</p>
                <p className="mt-3 text-slate-100 leading-relaxed">{item.value}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
