'use client'

import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

interface StackItem {
  icon: string
  name: string
  description: string
}

interface SkillCategory {
  id: string
  title: string
  summary: string
  colorClass: string
  items: StackItem[]
}

const stackItems: StackItem[] = [
  { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', name: 'React', description: 'Interactive UIs' },
  { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', name: 'React Native', description: 'Mobile App Development' },
  { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', name: 'Node.js', description: 'Backend Runtime' },
  { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', name: 'Python', description: 'AI + APIs' },
  { icon: 'https://cdn.simpleicons.org/snowflake/29B5E8', name: 'Snowflake', description: 'Cloud Data Warehouse' },
  { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', name: 'Docker', description: 'Containerized Delivery' },
  { icon: 'https://cdn.simpleicons.org/anthropic/FFFFFF', name: 'Claude Code', description: 'AI Coding Workflow' },
  { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachespark/apachespark-original.svg', name: 'Apache Spark', description: 'Big Data Processing' },
  { icon: 'https://cdn.simpleicons.org/scikitlearn/F7931E', name: 'Scikit-learn', description: 'Classical ML' },
  { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg', name: 'GitHub Actions', description: 'CI/CD Automation' },
]

const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    summary: 'User-facing web interfaces and interaction systems.',
    colorClass: 'from-cyan-300/35 to-sky-500/20',
    items: [
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', name: 'HTML5', description: 'Semantic Structure' },
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', name: 'CSS3', description: 'Styling Foundation' },
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', name: 'JavaScript', description: 'Interactive Web Logic' },
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', name: 'TypeScript', description: 'Type-Safe Development' },
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', name: 'React', description: 'Component Architecture' },
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', name: 'React Native', description: 'Cross-platform Mobile Apps' },
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', name: 'Next.js', description: 'App Router + SSR' },
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', name: 'Tailwind CSS', description: 'Modern Styling System' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    summary: 'Services, APIs, and database systems.',
    colorClass: 'from-emerald-300/30 to-cyan-500/20',
    items: [
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', name: 'Java', description: 'Service Development' },
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg', name: 'FastAPI', description: 'Python API Services' },
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', name: 'Node.js + Express', description: 'Backend Runtime' },
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', name: 'MySQL + SQLite', description: 'Relational Data' },
      { icon: 'https://cdn.simpleicons.org/snowflake/29B5E8', name: 'Snowflake', description: 'Cloud Data Warehouse' },
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', name: 'MongoDB + Cassandra', description: 'NoSQL Data Models' },
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cassandra/cassandra-original.svg', name: 'Apache Cassandra', description: 'Distributed NoSQL' },
    ],
  },
  {
    id: 'ai',
    title: 'ML & AI',
    summary: 'Practical ML and LLM tooling for production workflows.',
    colorClass: 'from-violet-300/30 to-fuchsia-500/20',
    items: [
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', name: 'Python', description: 'Core AI Language' },
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg', name: 'PyTorch', description: 'Model Training' },
      { icon: 'https://cdn.simpleicons.org/scikitlearn/F7931E', name: 'Scikit-learn', description: 'Classical ML' },
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg', name: 'Pandas', description: 'Data Wrangling' },
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg', name: 'NumPy', description: 'Numerical Compute' },
      { icon: 'https://cdn.simpleicons.org/langchain/FFFFFF', name: 'LangChain', description: 'Agent Orchestration' },
      { icon: 'https://cdn.simpleicons.org/anthropic/FFFFFF', name: 'Claude Code', description: 'Developer Agent Workflow' },
      { icon: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg', name: 'IBM Docling', description: 'Document Intelligence' },
      { icon: 'https://cdn.simpleicons.org/ollama/FFFFFF', name: 'Ollama', description: 'Local LLM Runtime' },
      { icon: 'https://cdn.simpleicons.org/huggingface/FFD21E', name: 'Hugging Face', description: 'Model Ecosystem' },
      { icon: 'https://cdn.simpleicons.org/openai/FFFFFF', name: 'OpenAI API', description: 'LLM Integration' },
    ],
  },
  {
    id: 'deployments',
    title: 'Deployments + Containers',
    summary: 'CI/CD, infra, and distributed processing stack.',
    colorClass: 'from-amber-300/25 to-orange-500/20',
    items: [
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', name: 'Docker', description: 'Containerized Apps' },
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg', name: 'GitHub Actions', description: 'CI/CD Automation' },
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg', name: 'Vercel', description: 'Web Deployments' },
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg', name: 'Apache Kafka', description: 'Streaming Pipelines' },
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachespark/apachespark-original.svg', name: 'Apache Spark', description: 'Distributed Compute' },
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grpc/grpc-original.svg', name: 'gRPC', description: 'Service Communication' },
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/hadoop/hadoop-original.svg', name: 'HDFS / Hadoop', description: 'Data Infrastructure' },
      { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', name: 'Git', description: 'Version Control' },
    ],
  },
]

const frontTrack = [...stackItems, ...stackItems]
const backTrack = [...stackItems.slice(2), ...stackItems.slice(2)]

function StackIcon({ icon, name, sizeClass }: { icon: string; name: string; sizeClass: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={`${sizeClass} rounded-md bg-cyan-300/20 text-cyan-100 text-[10px] font-semibold flex items-center justify-center`}>
        {name.slice(0, 2).toUpperCase()}
      </div>
    )
  }

  return (
    <img
      src={icon}
      alt={name}
      className={`${sizeClass} object-contain`}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}

function TechTile({ item, index }: { item: StackItem; index: number }) {
  return (
    <motion.article
      className="shrink-0 w-[210px] md:w-[240px] apple-surface rounded-2xl p-4 md:p-5"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.04 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, rotateY: 8, scale: 1.02 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-white/10 border border-white/20 p-2.5">
          <StackIcon icon={item.icon} name={item.name} sizeClass="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-slate-100 font-semibold leading-tight">{item.name}</h3>
          <p className="text-xs text-slate-300 mt-1">{item.description}</p>
        </div>
      </div>
    </motion.article>
  )
}

export default function TechStack() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [activeCategory, setActiveCategory] = useState<string>(skillCategories[0].id)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [9, -9]), { stiffness: 110, damping: 22 })
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [-6, 6]), { stiffness: 110, damping: 22 })

  const frontX = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -260])
  const backX = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-180, 90])

  const activeSkills = useMemo(() => {
    return skillCategories.find((category) => category.id === activeCategory) ?? skillCategories[0]
  }, [activeCategory])

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return
    const bounds = stageRef.current?.getBoundingClientRect()
    if (!bounds) return
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const onLeave = () => {
    if (reduceMotion) return
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <section ref={sectionRef} className="relative px-4 py-20 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <p className="text-xs md:text-sm tracking-[0.22em] uppercase text-cyan-200/85 mb-4">TECH STACK</p>
          <h2 className="section-title">Tools I Use to Ship</h2>
        </motion.div>

        <motion.div
          ref={stageRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="relative rounded-[2rem] apple-surface p-5 md:p-7 overflow-hidden"
          style={{ rotateX: reduceMotion ? 0 : rotateX, rotateY: reduceMotion ? 0 : rotateY, transformPerspective: 1200 }}
        >
          <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl" />

          <motion.div className="flex gap-4 md:gap-5 mb-5 md:mb-6 will-change-transform" style={{ x: frontX }}>
            {frontTrack.map((item, index) => (
              <TechTile key={`front-${item.name}-${index}`} item={item} index={index} />
            ))}
          </motion.div>

          <motion.div className="flex gap-4 md:gap-5 will-change-transform" style={{ x: backX }}>
            {backTrack.map((item, index) => (
              <TechTile key={`back-${item.name}-${index}`} item={item} index={index} />
            ))}
          </motion.div>
        </motion.div>

        <div className="mt-10 md:mt-12 grid lg:grid-cols-[280px_minmax(0,1fr)] gap-6 md:gap-8">
          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            viewport={{ once: true }}
            className="apple-surface rounded-3xl p-4 md:p-5"
          >
            <p className="text-[11px] tracking-[0.22em] uppercase text-cyan-200/80 mb-4">SKILL ATLAS</p>
            <div className="space-y-2">
              {skillCategories.map((category) => {
                const isActive = activeCategory === category.id
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left rounded-2xl px-3 py-3 border transition-all ${
                      isActive
                        ? 'bg-white/12 border-cyan-200/45 shadow-[0_10px_24px_rgba(17,160,255,0.22)]'
                        : 'bg-white/4 border-white/10 hover:bg-white/8'
                    }`}
                  >
                    <h3 className="text-sm font-semibold text-slate-100">{category.title}</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{category.summary}</p>
                  </button>
                )
              })}
            </div>
          </motion.aside>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            viewport={{ once: true }}
            className="apple-surface rounded-3xl p-5 md:p-6"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSkills.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-5 md:mb-6">
                  <div className={`inline-flex rounded-full bg-gradient-to-r ${activeSkills.colorClass} px-3 py-1.5 border border-white/20`}>
                    <span className="text-xs tracking-[0.16em] uppercase text-slate-100">{activeSkills.title}</span>
                  </div>
                  <p className="mt-3 text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">{activeSkills.summary}</p>
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {activeSkills.items.map((item, index) => (
                    <motion.article
                      key={`${activeSkills.id}-${item.name}`}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                      whileHover={{ y: -5, scale: 1.01 }}
                      className="rounded-2xl border border-white/12 bg-white/5 p-4"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="rounded-xl bg-white/12 border border-white/20 p-2.5">
                          <StackIcon icon={item.icon} name={item.name} sizeClass="w-7 h-7" />
                        </div>
                        <h4 className="text-slate-100 font-semibold text-sm md:text-base">{item.name}</h4>
                      </div>
                      <p className="text-xs text-slate-300">{item.description}</p>
                    </motion.article>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
