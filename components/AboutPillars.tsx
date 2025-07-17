'use client'
import { useMotionValue, useTransform, motion } from 'framer-motion'
import { useRef } from 'react'

interface PillarCardProps {
  title: string
  description: string
  icon: string
  gradient: string
}

export function AboutPillarCard({ title, description, icon, gradient }: PillarCardProps) {
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
        className="absolute -inset-1 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 pointer-events-none z-0"
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
