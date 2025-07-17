'use client'

import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { InteractiveBackground } from './interactive-background'
import { Nav } from '@/components/nav'
import { TypeAnimation } from 'react-type-animation'
import HyperText from '@/components/ui/hyper-text'

const AnimatedText = () => (
  <TypeAnimation
    sequence={[
      "I'm Vibhrav Jha, from New Delhi, India🇮🇳.",
      2000,
      "Currently based in Madison, WI🇺🇸.",
      2000,
      "I'm looking forward to making a career in Software Development and Engineering🛠️.",
      2000,
      "Hopefully we can connect after you know a bit more about me🤝!",
      2000,
      "Keep Scrolling!🚀",
      8000,
    ]}
    wrapper="span"
    cursor={true}
    repeat={Infinity}
    speed={65}
    omitDeletionAnimation={true}
    style={{
      fontSize: '1.5em',
      display: 'inline-block',
      whiteSpace: 'pre-line',
      fontFamily: '"Roboto", sans-serif',
      fontWeight: '500',
      color: 'white',
      lineHeight: '1.5',
      textShadow: '2px 2px 8px rgba(0, 180, 255, 0.5)',
      letterSpacing: '0.01em',
    }}
  />
)

interface PillarCardProps {
  title: string
  description: string
  icon: string
  gradient: string
}

function PillarCard({ title, description, icon, gradient }: PillarCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [0, 300], [8, -8])
  const rotateY = useTransform(x, [0, 300], [-8, 8])

  const handleMouseMove = (e: React.MouseEvent) => {
    const bounds = ref.current?.getBoundingClientRect()
    if (!bounds) return
    const xPos = e.clientX - bounds.left
    const yPos = e.clientY - bounds.top
    x.set(xPos)
    y.set(yPos)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`relative p-8 rounded-3xl shadow-lg text-white bg-gradient-to-br ${gradient} overflow-hidden transition-all duration-300`}
      style={{ rotateX, rotateY }}
      whileHover={{
        scale: 1.05,
        transition: { type: 'spring', stiffness: 300, damping: 24 }
      }}
    >
      <motion.div
        className="absolute -inset-1 rounded-3xl blur-xl opacity-50 pointer-events-none z-0"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />
      <div className="relative z-10">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-blue-100 leading-relaxed text-sm">{description}</p>
      </div>
    </motion.div>
  )
}

export function About() {
  const pillars = [
    {
      icon: '💡',
      title: 'Creative Engineering',
      description: 'Combining design thinking and code to deliver visually intuitive, user-first digital experiences.',
      gradient: 'from-blue-700 via-cyan-600 to-blue-400'
    },
    {
      icon: '🌐',
      title: 'Full-Stack Builder',
      description: 'Crafting robust web apps with scalable backends and performant frontends. React, Next.js, Spring Boot.',
      gradient: 'from-cyan-700 via-blue-600 to-cyan-400'
    },
    {
      icon: '🧠',
      title: 'AI + Data',
      description: 'Deep interest in LLMs, embeddings, vector databases, and frameworks like LangChain & HuggingFace.',
      gradient: 'from-blue-500 via-cyan-400 to-blue-300'
    }
  ]

  const hobbies = [
    {
      title: '⚽️ Football',
      description: 'Once a pro footballer and forever a die-hard Real Madrid fan!',
      gradient: 'from-blue-700 via-cyan-600 to-blue-400'
    },
    {
      title: '🏋️ Gym',
      description: 'Passionate about fitness and hitting the gym to build strength and discipline.',
      gradient: 'from-cyan-700 via-blue-600 to-cyan-400'
    },
    {
      title: '👨‍🍳 Cooking',
      description: 'Mastering the art of Indian cuisine, from buttery curries to sizzling tandoori.',
      gradient: 'from-blue-500 via-cyan-400 to-blue-300'
    },
    {
      title: '🛫 Travelling',
      description: 'Exploring unique and untouched destinations like the serene A&N Islands in India.',
      gradient: 'from-cyan-800 via-blue-700 to-cyan-500'
    },
    {
      title: '🎮 Gaming',
      description: 'From clutch plays in Valorant to scoring screamers in FIFA, gaming fuels adrenaline.',
      gradient: 'from-blue-800 via-cyan-700 to-blue-500'
    },
    {
      title: '📚 Reading',
      description: 'Currently diving into *Leaders Eat Last* by Simon Sinek.',
      gradient: 'from-cyan-700 via-blue-500 to-cyan-300'
    }
  ]

  return (
    <div>
      <Nav />
      <InteractiveBackground />
      <div className="relative">

        {/* Hero Section */}
        <div
          className="relative h-[40vh] md:h-[60vh] w-full bg-center flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: 'url("A (8).jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-cyan-700/50 to-blue-400/40"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: [0.7, 0.9, 0.7] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          />
          <motion.img
            src="/IMG_0950.jpg"
            alt="Vibhrav Jha"
            className="relative z-10 w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-cyan-300 shadow-2xl"
            initial={{ y: 60, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            style={{ boxShadow: "0 8px 32px 0 rgba(0,180,255,0.37)" }}
          />
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 py-16">
          <motion.h2
            className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-700 bg-clip-text text-transparent drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring" }}
            viewport={{ once: true }}
          >
            <HyperText>About Me ✨</HyperText>
          </motion.h2>

          <motion.div
            className="my-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, type: "spring" }}
            viewport={{ once: true }}
          >
          </motion.div>

          {/* Pillars */}
          <motion.div
            className="grid gap-8 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.18 } } }}
          >
            {pillars.map((pillar, idx) => (
              <PillarCard key={idx} {...pillar} />
            ))}
          </motion.div>

          {/* Hobbies Section */}
          <motion.div
            className="mt-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, type: "spring" }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-700 bg-clip-text text-transparent">
              My Hobbies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hobbies.map((hobby, index) => (
                <motion.div
                  key={index}
                  className={`relative p-8 rounded-2xl shadow-xl text-white bg-gradient-to-br ${hobby.gradient} overflow-hidden group`}
                  whileHover={{
                    scale: 1.07,
                    rotate: [0, 2, -2, 0],
                    boxShadow: "0 8px 32px 0 rgba(58,133,255,0.37)"
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-700 blur-lg opacity-60 group-hover:opacity-90 transition-all duration-500 pointer-events-none z-0"
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  />
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold drop-shadow-lg">{hobby.title}</h3>
                    <p className="text-base mt-3 text-blue-100">{hobby.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
