'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Briefcase, GraduationCap, Trophy } from 'lucide-react'

const education = {
  school: 'University of Wisconsin-Madison',
  degree: 'B.S. Computer Science, Data Science, and Economics',
  duration: 'Sep 2023 - Expected May 2027',
  gpa: '3.719 / 4.0 (Dean\'s List)',
}

type CourseworkItem = {
  label: string
  focus: string
  toneClass: string
}

const coursework: CourseworkItem[] = [
  { label: 'Algorithms', focus: 'Data Structures + Complexity', toneClass: 'border-cyan-200/25 bg-cyan-500/10' },
  { label: 'Big Data Systems', focus: 'Distributed Data Processing', toneClass: 'border-indigo-200/25 bg-indigo-500/10' },
  { label: 'Artificial Intelligence', focus: 'Search + Reasoning + ML Foundations', toneClass: 'border-fuchsia-200/25 bg-fuchsia-500/10' },
  { label: 'Data Science Modeling', focus: 'Predictive Modeling', toneClass: 'border-emerald-200/25 bg-emerald-500/10' },
  { label: 'Object-Oriented Software Development', focus: 'OOP Principles + Design Patterns + Modular Architecture', toneClass: 'border-sky-200/25 bg-sky-500/10' },
  { label: 'Discrete Mathematics', focus: 'Proofs + Logic + Graphs', toneClass: 'border-violet-200/25 bg-violet-500/10' },
  { label: 'Statistics in Economics', focus: 'Applied Quantitative Analysis', toneClass: 'border-amber-200/25 bg-amber-500/10' },
  { label: 'Linear Algebra', focus: 'Matrices + Vector Spaces', toneClass: 'border-teal-200/25 bg-teal-500/10' },
  { label: 'Advanced Mathematical Methods', focus: 'Multivariable Analysis + Optimization Techniques', toneClass: 'border-blue-200/25 bg-blue-500/10' },
  { label: 'Web + Mobile Development', focus: 'React + React Native Delivery', toneClass: 'border-rose-200/25 bg-rose-500/10' },
]

type ExperienceItem = {
  id: string
  logo: string
  logoScale?: number
  logoWidth?: number
  company: string
  role: string
  period: string
  summary: string
  tools: Array<{ name: string; icon: string }>
  impact: string[]
}

const experiences: ExperienceItem[] = [
  {
    id: 'uw-lab',
    logo: '/company-logos/wisc.png',
    logoScale: 1.3,
    company: 'UW-Madison People & Robots Lab',
    role: 'Undergraduate Research Assistant',
    period: 'Jan 2026 - Present',
    summary:
      'Building a browser safety assistant for adults with IDD using multimodal OCR + DOM context parsing, with guidance generated in plain language for risky web interactions.',
    tools: [
      { name: 'Chrome', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg' },
      { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
      { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    ],
    impact: ['Browser-safety copilot prototype', 'OCR + DOM risk signal pipeline', 'Accessibility-first evaluation loop'],
  },
  {
    id: 'vdart',
    logo: '/company-logos/vdart.png',
    logoScale: 1.15,
    company: 'VDart Inc.',
    role: 'Software Engineering Intern',
    period: 'May 2025 - Aug 2025',
    summary:
      'Led an automated RFI/RFP generation pipeline with IBM Docling and Gemini, reducing proposal turnaround from two weeks to under 24 hours and increasing capacity 3x.',
    tools: [
      { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
      { name: 'FastAPI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
      { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    ],
    impact: ['3x proposal capacity', '<24h turnaround', '50+ active users'],
  },
  {
    id: 'pink-city',
    logo: '/company-logos/pinkcity.gif',
    logoScale: 1.15,
    logoWidth: 78,
    company: 'Pink City Expressways',
    role: 'Software Development Intern',
    period: 'Jan 2022 - Mar 2023',
    summary:
      'Developed analytics and CRM improvements that increased machinery utilization, drove +$18K monthly revenue impact, and improved lead-to-partnership conversion.',
    tools: [
      { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
      { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
      { name: 'HTML/CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    ],
    impact: ['+$18K monthly impact', '+27% conversion lift', '40% faster response'],
  },
]

function ToolLogos({ tools }: { tools: ExperienceItem['tools'] }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {tools.map((tool) => (
        <span key={tool.name} className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-2.5 py-1.5">
          <img src={tool.icon} alt={tool.name} className="w-4 h-4 object-contain" loading="lazy" decoding="async" />
          <span className="text-xs text-slate-100">{tool.name}</span>
        </span>
      ))}
    </div>
  )
}

export function CredentialsShowcase() {
  const [activeExperienceId, setActiveExperienceId] = useState(experiences[0].id)
  const activeExperience = experiences.find((item) => item.id === activeExperienceId) ?? experiences[0]

  return (
    <section className="relative px-4 py-14 md:py-16 overflow-hidden">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/15 blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          viewport={{ once: true }}
          className="mb-7 md:mb-9"
        >
          <p className="text-xs md:text-sm tracking-[0.22em] uppercase text-cyan-200/85 mb-3">CREDENTIALS</p>
          <h2 className="section-title">Education + Experience</h2>
        </motion.div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            viewport={{ once: true }}
            className="apple-surface rounded-[1.95rem] p-6 md:p-7"
          >
            <div className="mb-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-500/10 px-3 py-1.5">
                <GraduationCap className="w-4 h-4 text-cyan-200" />
                <span className="text-xs tracking-[0.16em] uppercase text-cyan-100">Education</span>
              </div>
              <h3 className="mt-3 text-2xl md:text-3xl font-semibold text-slate-100">University + Academics</h3>
            </div>

            <h3 className="text-slate-100 text-xl md:text-2xl font-semibold leading-tight">{education.school}</h3>
            <p className="text-slate-200 mt-2 text-sm md:text-base">{education.degree}</p>
            <p className="text-sm text-cyan-100 mt-3">{education.duration}</p>

            <div className="mt-4">
              <div className="rounded-2xl border border-cyan-200/25 bg-cyan-500/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/90">GPA + Standing</p>
                <p className="text-slate-100 text-lg font-semibold mt-1">{education.gpa}</p>
              </div>
            </div>

            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              {coursework.map((course) => (
                <motion.div
                  key={course.label}
                  whileHover={{ y: -2 }}
                  className={`rounded-2xl border px-3.5 py-3 ${course.toneClass}`}
                >
                  <p className="text-sm font-semibold text-slate-100">{course.label}</p>
                  <p className="text-xs text-slate-200 mt-1">{course.focus}</p>
                </motion.div>
              ))}
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.04 }}
            viewport={{ once: true }}
            className="apple-surface rounded-[1.95rem] p-6 md:p-7"
          >
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/30 bg-emerald-500/10 px-3 py-1.5">
                <Briefcase className="w-4 h-4 text-emerald-200" />
                <span className="text-xs tracking-[0.16em] uppercase text-emerald-100">Experience</span>
              </div>
              <h3 className="mt-3 text-2xl md:text-3xl font-semibold text-slate-100">Experience</h3>
              <p className="text-sm text-slate-300 mt-2">Select a role to inspect impact.</p>
            </div>

            <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-3">
                {experiences.map((exp) => {
                  const active = exp.id === activeExperienceId
                  return (
                    <button
                      key={exp.id}
                      type="button"
                      onClick={() => setActiveExperienceId(exp.id)}
                      className={`w-full text-left rounded-2xl border px-4 py-3 transition-all ${
                        active
                          ? 'border-cyan-200/55 bg-cyan-400/12 shadow-[0_12px_28px_rgba(35,160,255,0.18)]'
                          : 'border-white/14 bg-white/5 hover:bg-white/8'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="inline-flex h-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-white/10"
                          style={{ width: exp.logoWidth ?? 56 }}
                        >
                          <img
                            src={exp.logo}
                            alt={exp.company}
                            className="h-full w-full rounded-[0.65rem] bg-white object-contain"
                            style={{ transform: `scale(${exp.logoScale ?? 1.15})` }}
                            loading="lazy"
                            decoding="async"
                          />
                        </span>
                        <div>
                          <p className="text-base font-semibold text-slate-100 leading-tight">{exp.company}</p>
                          <p className="text-xs text-slate-300 mt-1">{exp.period}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeExperience.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl border border-white/15 bg-white/8 p-5 md:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-slate-100 text-xl font-semibold leading-tight">{activeExperience.role}</h3>
                      <p className="text-cyan-100 text-sm mt-1">{activeExperience.company} • {activeExperience.period}</p>
                    </div>
                    <span
                      className="inline-flex h-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-white/10"
                      style={{ width: activeExperience.logoWidth ?? 56 }}
                    >
                      <img
                        src={activeExperience.logo}
                        alt={activeExperience.company}
                        className="h-full w-full rounded-[0.65rem] bg-white object-contain"
                        style={{ transform: `scale(${activeExperience.logoScale ?? 1.15})` }}
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                  </div>

                  <p className="mt-4 text-sm md:text-base text-slate-200 leading-relaxed">{activeExperience.summary}</p>

                  <ToolLogos tools={activeExperience.tools} />

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {activeExperience.impact.map((metric) => (
                      <div key={metric} className="rounded-xl border border-white/15 bg-white/7 px-3 py-2 flex items-center gap-2">
                        <Trophy className="w-3.5 h-3.5 text-cyan-200" />
                        <span className="text-xs text-slate-100">{metric}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  )
}
