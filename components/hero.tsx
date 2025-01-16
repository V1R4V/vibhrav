'use client'
import { RainbowButton } from '@/components/ui/rainbow-button'
import { TypeAnimation } from 'react-type-animation'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Linkedin, Instagram, Github } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'


const AnimatedText = () => {
  return (
    <TypeAnimation
      sequence={[
        "Hey there! 👋 I'm Vibhrav, a tech explorer navigating the exciting intersection of web development and artificial intelligence at UW-Madison🏫", 
        2000, 
        "When I'm not diving into code or training models🧑🏽‍💻, you'll find me turning creative ideas into reality and scalable products💫", 
        2000, 
        "My superpower🦸? Bridging the gap between innovative tech solutions and real-world impact👼.I believe in building products that make a difference💪",
        2000,  
        "Want to collaborate on something amazing or chat about the future of tech? Let's connect!🚀", 
        2000,
        "Currently seeking opportunities to bring my blend of technical skills, entrepreneurial spirit, and passion for AI to dynamic tech teams.",
        () => {
          console.log('Sequence completed');
        },
      ]}
      wrapper="span"
      cursor={true}
      repeat={Infinity}
      speed={65}
      style={{
        fontSize: '1.5em', 
        display: 'inline-block', 
        whiteSpace: 'pre-line', 
        fontFamily: '"Roboto", sans-serif', // Modern font
        fontWeight: '500', // Slightly bolder text
        color: 'white',
        lineHeight: '1.5',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)', // Adds a shadow for better readability
      }}
    />
  );
};

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center relative px-4">
      <div className="max-w-7xl mx-auto w-full relative">
        {/* Social Links */}
        <motion.div 
          className="mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-gray-400 mb-4">SAY HELLO👋</h3>
          <div className="flex gap-4">
            <Link href="https://www.linkedin.com/in/vibhrav-jha-4846a3275/" target="_blank" className="hover:text-gray-300 transition-colors">
              <Linkedin className="w-6 h-6" />
            </Link>
    
            <Link href="https://www.instagram.com/iam_vibhrav/" target="_blank" className="hover:text-gray-300 transition-colors">
              <Instagram className="w-6 h-6" />
            </Link>

            <Link href="https://github.com/V1R4V" target="_blank" className="hover:text-gray-300 transition-colors">
              <Github className="w-6 h-6" />
            </Link>
          </div>
        </motion.div>

        {/* Main Title */}
        <div className="space-y-4">
          <motion.h1 
            className="text-6xl md:text-8xl font-bold leading-tight tracking-tighter flex items-center" // Added flex and items-center
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="relative inline-block mr-6"> {/* Adjusted margin to create more space */}
              WEB DEV &
              <motion.span
                className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-lg"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </span>

            <span className="relative inline-block">
              AI
              <motion.span
                className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 blur-lg"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{ 
                  duration: 3,
                  delay: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </span>

            {/* Profile Picture inline with text */}
            <Link href="/about" passHref>
            <motion.div
              className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 ml-8" 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Image
                src="/IMG_0950.jpg"
                alt="vibhrav"
                layout="fill"
                objectFit="cover"
              />
            </motion.div>
            </Link>
          </motion.h1>
          
          {/* Animated Text */}
          <motion.p 
            className="max-w-2xl text-gray-400 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <AnimatedText />
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {/* Use RainbowButton instead of Button */}
            <RainbowButton className="mt-16">
              <Link href="/Vibhrav’s_Resume.pdf" target="_blank">Check Out My Resume!</Link>
            </RainbowButton>
          </motion.div>
        </div>
      </div>
    </section>
  )
}