'use client'

import Link from 'next/link'
import { Linkedin, Github } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { RainbowButton } from '@/components/ui/rainbow-button'

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center relative px-4 pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto w-full relative">
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <h3 className="text-slate-300/85 mb-4 text-xs md:text-sm tracking-[0.22em] uppercase">Say Hello</h3>
          <div className="flex gap-4 text-slate-300">
            <Link href="https://www.linkedin.com/in/vibhrav-jha-4846a3275/" target="_blank" className="text-[#0A66C2] hover:opacity-80 transition-opacity">
              <Linkedin className="w-6 h-6" />
            </Link>
            <Link href="https://github.com/V1R4V" target="_blank" className="text-[#f5f5f5] hover:opacity-80 transition-opacity">
              <Github className="w-6 h-6" />
            </Link>
          </div>
        </motion.div>

        <div className="space-y-5 md:space-y-6">
          <motion.h1
            className="text-6xl md:text-8xl font-bold leading-tight tracking-tighter flex flex-wrap items-center gap-4 md:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
          >
            <span className="relative inline-block mr-2 md:mr-4">
              FULLSTACK &
              <motion.span
                className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-lg"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
              />
            </span>

            <span className="relative inline-block">
              AI
              <motion.span
                className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 blur-lg"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 3, delay: 1.5, repeat: Infinity, repeatType: 'reverse' }}
              />
            </span>

            <Link href="/about" className="inline-block">
              <motion.div
                className="relative w-24 h-24 md:w-32 md:h-32 rounded-[2rem] overflow-hidden border border-cyan-200/35"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, delay: 0.55 }}
                whileHover={{ scale: 1.04, rotate: 1 }}
                style={{ boxShadow: '0 18px 42px rgba(4, 15, 37, 0.55)' }}
              >
                <Image src="/IMG_0950.jpg" alt="Vibhrav" fill className="object-cover" sizes="(max-width: 768px) 96px, 128px" />
              </motion.div>
            </Link>
          </motion.h1>

          <motion.p
            className="max-w-3xl text-base md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="inline-block font-medium text-[#d0e8ff] leading-[1.55]">
              Hey there! I&apos;m Vibhrav, a tech explorer navigating the exciting intersection of web development and
              artificial intelligence at UW-Madison.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            whileHover={{ y: -2 }}
          >
            <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="inline-block">
                <RainbowButton className="mt-16">Check Out My Resume!</RainbowButton>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
