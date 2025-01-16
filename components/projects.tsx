'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// TODO: Replace with your actual projects
const projects = [
  {
    title: 'Recipe Pal',
    description: 'An inventory based Recipe planner',
    tags: ['React', 'Next.js', 'TypeScript'],
    image: '/recipepal.png',
    link: 'https://github.com/V1R4V/RecipePlanner'
  },
  {
    title: 'Campus Navigator',
    description: 'A map based navigation system for UW-Madison',
    tags: ['Java', 'Graph-Theory', 'HTML-CSS'],
    image: '/Campus.png',
    link: 'https://github.com/V1R4V/CampusNavigator'
  },
  // {
  //   title: 'Project Three',
  //   description: 'A brief description of your third project',
  //   tags: ['React', 'Firebase', 'Framer Motion'],
  //   image: '/placeholder.svg?height=400&width=600',
  //   link: '#'
  // }
]

export function Projects() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  return (
    <section ref={containerRef} className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">Projects</h2>
          <p className="text-gray-400 mb-12">Check out some of my recent work</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
                <motion.img
                  src={project.image}
                  alt={project.title}
                  className="w-full aspect-video object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-zinc-800 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

