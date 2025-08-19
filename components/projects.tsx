'use client'

import { useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpRight } from 'lucide-react'

const projects = [
	
	{
		title: 'Autflow.ai',
		description: 'Custom website for an automation AI based Startup',
		tags: ['React', 'Next.js', 'TypeScript','GsheetsAPI'],
		image: '/autoflow.png',
		link: 'https://aiautoflow.vercel.app/', 
	},
	{
		title: 'RAG Automation Platform',
		description:
			'Production-grade Retrieval-Augmented Generation system for automating RFI/RFP generation with Llama3 and ChromaDB.',
		tags: ['Python', 'Llama3', 'RAG', 'ChromaDB', 'OCR', 'Prompt Engineering'],
		image: '/f3.png', 
		link: 'https://github.com/V1R4V/rag-for-private_data',
	},
	{
		title: 'Startup Scout',
		description:
			'Investor-startup matching platform with dynamic filtering, data scraping, and Recharts-powered visualizations.',
		tags: ['TypeScript', 'React', 'SQLite', 'Firecrawl', 'Express.js', 'Shadcn'],
		image: '/sscout.jpg', 
		link: 'https://github.com/V1R4V/Startupscout', 
	},
	{
		title: 'Facial Analysis System',
		description:
			'PCA-based facial recognition system with dimensionality reduction and eigenface visualization.',
		tags: ['Python', 'NumPy', 'SciPy', 'Computer Vision', 'PCA'],
		image: '/f1.png', // Add this image to your /public folder
		link: 'https://github.com/V1R4V/image_compression_pca', // Replace with actual repo link
	},
	{
		title: 'Recipe Pal',
		description: 'An inventory-based intelligent recipe planner with meal tracking.',
		tags: ['React', 'Next.js', 'TypeScript'],
		image: '/recipepal.png',
		link: 'https://github.com/V1R4V/RecipePlanner',
	},
	{
		title: 'Campus Navigator',
		description: 'A custom Java-based map and navigation system for UW-Madison.',
		tags: ['Java', 'Graph Theory', 'HTML/CSS'],
		image: '/Campus.png',
		link: 'https://github.com/V1R4V/CampusNavigator',
	}
]


export function Projects() {
	const containerRef = useRef<HTMLDivElement>(null)
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ['start end', 'end start'],
	})

	return (
		<section ref={containerRef} className="py-24 px-4 relative overflow-x-clip">
			{/* Animated blue chrome/gradient background blobs */}
			<motion.div
				aria-hidden
				className="pointer-events-none fixed top-0 left-0 w-full h-full z-0"
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.25 }}
				style={{ filter: 'blur(80px)' }}
			>
				<motion.div
					className="absolute top-[-10%] left-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-700 opacity-70"
					animate={{ y: [0, 40, -40, 0], x: [0, 30, -30, 0] }}
					transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
				/>
				<motion.div
					className="absolute bottom-[-10%] right-[10%] w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-blue-700 via-cyan-500 to-blue-300 opacity-60"
					animate={{ y: [0, -30, 30, 0], x: [0, -20, 20, 0] }}
					transition={{ repeat: Infinity, duration: 14, ease: 'easeInOut' }}
				/>
			</motion.div>
			<div className="max-w-7xl mx-auto relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					viewport={{ once: true }}
				>
					<h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-700 bg-clip-text text-transparent drop-shadow-lg">
						Projects
					</h2>
					<p className="text-blue-200 mb-12">Check out some of my recent work</p>
				</motion.div>

				<div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
					{projects.map((project, index) => (
						<motion.div
							key={project.title}
							initial={{ opacity: 0, scale: 0.8, rotateY: 0 }}
							whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
							whileHover={{
								scale: 1.08,
								rotateY: [0, 10, -10, 0],
								boxShadow: '0 8px 32px 0 rgba(58, 133, 255, 0.47)',
							}}
							transition={{ duration: 0.7, delay: index * 0.12, type: 'spring' }}
							viewport={{ once: true }}
							className="relative group"
							style={{
								perspective: 1200,
							}}
						>
							{/* Chrome blue animated border */}
							<motion.div
								className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-700 blur-lg opacity-70 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-0"
								animate={{ scale: [1, 1.04, 1] }}
								transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
							/>
							<Card className="relative z-10 bg-zinc-900/80 border border-blue-600/40 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl group-hover:shadow-blue-500/40 transition-all duration-300">
								<motion.img
									src={project.image}
									alt={project.title}
									className="w-full aspect-video object-cover rounded-t-3xl group-hover:scale-110 transition-all duration-500"
									whileHover={{ scale: 1.08, rotate: 0 }}
									transition={{ duration: 0.4 }}
								/>
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle className="text-lg font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-700 bg-clip-text text-transparent">
											{project.title}
										</CardTitle>
										<a
											href={project.link}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center justify-center rounded-full bg-zinc-800/80 hover:bg-blue-600/80 transition-colors p-2 shadow-lg"
										>
											<ArrowUpRight className="w-5 h-5 text-cyan-300" />
										</a>
									</div>
									<CardDescription className="mt-2 text-blue-200">
										{project.description}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="flex flex-wrap gap-2 mt-2">
										{project.tags.map((tag) => (
											<span
												key={tag}
												className="px-2 py-1 bg-gradient-to-r from-blue-700 via-cyan-700 to-blue-400 text-white/90 rounded-full text-xs shadow"
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

