'use client'
import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface StackItem {
  icon: string
  name: string
  description: string
}

// Updated with your tech stack
const stackItems: StackItem[] = [
  {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", 
    name: "Java",
    description: "Programming Language"
  },
  {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    name: "JavaScript",
    description: "Web Development"
  },
  {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    name: "Python",
    description: "Programming Language"
  },
  {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    name: "HTML",
    description: "Markup Language"
  },
  {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    name: "CSS",
    description: "Style Sheet Language"
  },
  {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    name: "SQL",
    description: "Structured Query Language"
  },
  {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    name: "React",
    description: "JavaScript Library for UI"
  },
  {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    name: "Next.js",
    description: "React Framework for SSR"
  },
  {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
    name: "Spring Boot",
    description: "Backend Development"
  },
  {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/junit/junit-original.svg",
    name: "JUnit",
    description: "Testing Framework for Java"
  },
  {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    name: "Git + GitHub",
    description: "Version Control & Repository Hosting"
  },
  {
    icon: "/icons8-excel.svg",
    name: "Excel",
    description: "Spreadsheet Tool for Data Analysis"
  }
]

export default function TechStack() {
  return (
    <section className="py-4 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Tech Stack Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stackItems.map((item, index) => (
            <motion.div 
              key={item.name} 
              className="group relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ rotate: -8 }}  // Add this line for rotation
            >
              <Card className="bg-zinc-900 p-6 rounded-xl shadow-lg hover:bg-zinc-800 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <motion.img
                    src={item.icon}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg bg-white/10 p-2 group-hover:scale-110 transition-all duration-300"
                    // Add this line for icon rotation whileHover={{ rotate: 360 }}
                  />
                  <div>
                    <h3 className="font-semibold text-white">{item.name}</h3>
                    <p className="text-sm text-gray-300">{item.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}