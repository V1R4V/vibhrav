'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

type ProjectCategory = 'fullstack' | 'distributed-systems' | 'applied-ai' | 'data-engineering'

type ProjectItem = {
  title: string
  subtitle: string
  description: string
  tags: string[]
  categories: ProjectCategory[]
  image: string
  link?: string
}

const categoryTabs: Array<{ id: 'all' | ProjectCategory; label: string }> = [
  { id: 'all', label: 'All Projects' },
  { id: 'fullstack', label: 'Fullstack Projects' },
  { id: 'distributed-systems', label: 'Distributed Systems' },
  { id: 'applied-ai', label: 'ML & AI' },
  { id: 'data-engineering', label: 'Data Engineering' },
]

const showcase: ProjectItem[] = [
  {
    title: 'Real-Time Stock Data Streaming Pipeline',
    subtitle: 'High-throughput Kafka ingestion + exactly-once semantics',
    description:
      'Streams stock ticks from MySQL into Kafka partitions and persists atomic Parquet batches to HDFS with checkpoint-based crash recovery.',
    tags: ['Kafka', 'MySQL', 'HDFS', 'Parquet', 'Protocol Buffers'],
    categories: ['distributed-systems', 'data-engineering'],
    image: '/stock-streaming-architecture.svg',
    link: 'https://github.com/V1R4V/Real-Time-Stock-Data-Streaming-Kafka',
  },
  {
    title: 'Distributed Weather Data System with Cassandra',
    subtitle: 'Fault-tolerant ingestion with tunable consistency',
    description:
      'Processes NOAA weather streams in a distributed Cassandra cluster with configurable read/write consistency and automatic failover behavior.',
    tags: ['Cassandra', 'Distributed DB', 'NOAA', 'Fault Tolerance'],
    categories: ['distributed-systems', 'data-engineering'],
    image: '/weather-cassandra-system.svg',
    link: 'https://github.com/V1R4V/Distributed-Weather-Data-System-with-Cassandra',
  },
  {
    title: 'Competitive Programming Analytics with Apache Spark',
    subtitle: 'Spark SQL + ML pipelines + LLM query interface',
    description:
      'Analyzes large-scale CodeContests data with Spark RDD/DataFrame/SQL APIs, optimized bucketing/caching, and natural-language query translation.',
    tags: ['Apache Spark', 'Spark SQL', 'ML', 'HDFS', 'Gemini'],
    categories: ['distributed-systems', 'applied-ai', 'data-engineering'],
    image: '/spark-analytics-system.svg',
    link: 'https://github.com/V1R4V/Competitive-Programming-Analytics-with-Apache-Spark',
  },
  {
    title: 'Distributed Data Pipeline with HDFS + SQL Integration',
    subtitle: 'MySQL to HDFS pipeline with gRPC failover logic',
    description:
      'Builds partition-aware analytics workflows with replication-aware recovery, intelligent caching, and production-style gRPC APIs.',
    tags: ['MySQL', 'HDFS', 'gRPC', 'Parquet', 'Docker'],
    categories: ['distributed-systems', 'data-engineering', 'fullstack'],
    image: '/hdfs-sql-pipeline.svg',
    link: 'https://github.com/V1R4V/Data-Pipeline-with-HDFS-SQL-Integration',
  },
  {
    title: 'Concurrent Word Count & Performance Benchmarking System',
    subtitle: 'Multi-threaded processing + GIL benchmark analysis',
    description:
      'A high-performance concurrent word-count pipeline with configurable thread pools and benchmark suites comparing GIL/no-GIL scaling plus CSV, Parquet, and Arrow format performance.',
    tags: ['Python 3.13', 'Threading', 'Parquet', 'Apache Arrow', 'Benchmarking'],
    categories: ['distributed-systems', 'data-engineering'],
    image: '/concurrent-wordcount-benchmark.svg',
    link: 'https://github.com/V1R4V/Concurrent-Word-Count-Performance-Benchmarking-System',
  },
  {
    title: 'Bayesian Language Detection',
    subtitle: 'Posterior probability classification for English vs Spanish',
    description:
      'Implements Bayes theorem over letter-frequency distributions to classify shredded text as English or Spanish, with a clear inference pipeline from character counts to language posterior scores.',
    tags: ['Python', 'Bayesian Inference', 'Language Detection', 'NLP', 'Probability'],
    categories: ['applied-ai'],
    image: '/bayesian-language-detection.svg',
    link: 'https://github.com/V1R4V/language_detection',
  },
  {
    title: 'Country Data Clustering with Dendrograms',
    subtitle: 'Unsupervised country segmentation + hierarchical cluster analysis',
    description:
      'Clusters country-level indicators into interpretable groups using unsupervised learning and dendrogram visualizations, making it easier to compare development patterns and macroeconomic similarity.',
    tags: ['Clustering', 'Dendrograms', 'Scikit-learn', 'Pandas', 'Data Visualization'],
    categories: ['applied-ai', 'data-engineering'],
    image: '/country-clustering-dendrogram.svg',
    link: 'https://github.com/V1R4V/country-data-clustering_dendograms',
  },
  {
    title: 'FashionMNIST PyTorch Classifier',
    subtitle: 'Normalized data pipeline + train/eval loops + top-3 prediction output',
    description:
      'Builds FashionMNIST loaders with normalization, trains baseline and deeper feedforward PyTorch models using SGD + cross-entropy, evaluates test accuracy, and prints top-3 class probabilities for inference.',
    tags: ['PyTorch', 'FashionMNIST', 'Deep Learning', 'SGD', 'Model Evaluation'],
    categories: ['applied-ai'],
    image: '/fashionmnist-pytorch.svg',
    link: 'https://github.com/V1R4V/FashionMNIST-PyTorch-CNN',
  },
  {
    title: 'House Price Predictor',
    subtitle: 'Regression benchmarking with feature engineering and residual analysis',
    description:
      'Compares Linear, Ridge, Lasso, Random Forest, and XGBoost regressors on real-estate data after correlation-guided feature selection, log transforms, scaling, and diagnostic residual plotting.',
    tags: ['XGBoost', 'Random Forest', 'Ridge', 'Lasso', 'Regression'],
    categories: ['applied-ai', 'data-engineering'],
    image: '/house-price-predictor.svg',
    link: 'https://github.com/V1R4V/HousePricePredictor',
  },
  {
    title: 'RAG Automation Platform',
    subtitle: 'Production retrieval + generation workflow',
    description:
      'End-to-end RAG system for RFI/RFP automation with quality-focused retrieval and practical delivery through a usable product interface.',
    tags: ['Python', 'RAG', 'ChromaDB', 'FastAPI', 'React'],
    categories: ['applied-ai', 'fullstack'],
    image: '/f3.png',
    link: 'https://github.com/V1R4V/rag-for-private_data',
  },
  {
    title: 'Autflow.ai',
    subtitle: 'Automation startup website and product surface',
    description:
      'Built a polished, conversion-friendly web experience with production-ready architecture and performance-focused frontend implementation.',
    tags: ['Next.js', 'TypeScript', 'UI Engineering'],
    categories: ['fullstack'],
    image: '/autoflow.png',
    link: 'https://aiautoflow.vercel.app/',
  },
  {
    title: 'Startup Scout',
    subtitle: 'Investor-startup matching and analytics platform',
    description:
      'Combines scraping, filtering, and visual analytics to help users discover startups through data-backed ranking and exploration.',
    tags: ['React', 'TypeScript', 'SQLite', 'Recharts', 'Express'],
    categories: ['fullstack', 'data-engineering'],
    image: '/sscout.jpg',
    link: 'https://github.com/V1R4V/Startupscout',
  },
  {
    title: 'Recipe Pal',
    subtitle: 'Inventory-aware consumer planning app',
    description:
      'Transforms available ingredients into practical meal planning workflows with a clean user experience and rapid frontend interactions.',
    tags: ['Next.js', 'TypeScript', 'Product UX'],
    categories: ['fullstack'],
    image: '/recipepal.png',
    link: 'https://github.com/V1R4V/RecipePlanner',
  },
  {
    title: 'Facial Analysis System',
    subtitle: 'PCA-based computer vision pipeline',
    description:
      'Implements dimensionality reduction and eigenface techniques for image compression and face-analysis experimentation.',
    tags: ['Python', 'NumPy', 'SciPy', 'Computer Vision', 'PCA'],
    categories: ['applied-ai'],
    image: '/f1.png',
    link: 'https://github.com/V1R4V/image_compression_pca',
  },
  {
    title: 'Campus Navigator',
    subtitle: 'Graph-powered navigation engine',
    description:
      'Developed a Java-based map and routing system for UW-Madison, applying graph-theory algorithms for pathfinding at campus scale.',
    tags: ['Java', 'Graph Theory', 'Algorithms'],
    categories: ['fullstack'],
    image: '/Campus.png',
    link: 'https://github.com/V1R4V/CampusNavigator',
  },
]

export function Projects() {
  const [activeCategory, setActiveCategory] = useState<'all' | ProjectCategory>('all')

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return showcase
    return showcase.filter((item) => item.categories.includes(activeCategory))
  }, [activeCategory])

  return (
    <section className="relative px-4 py-24 md:py-28">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <p className="text-xs md:text-sm tracking-[0.22em] uppercase text-cyan-200/80 mb-4">PROJECTS</p>
          <h2 className="section-title">Build Archive</h2>
          <p className="mt-5 max-w-3xl text-slate-300/95 text-base md:text-lg leading-relaxed">
            Explore projects by category. Some systems intentionally live under multiple umbrellas, like RAG products that are both ML & AI and Fullstack.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          viewport={{ once: true }}
          className="mb-8 flex flex-wrap gap-2"
        >
          {categoryTabs.map((tab) => {
            const active = tab.id === activeCategory
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`rounded-full border px-4 py-2 text-sm md:text-base transition-all ${
                  active
                    ? 'border-cyan-200/50 bg-cyan-300/18 text-cyan-100 shadow-[0_10px_26px_rgba(62,175,255,0.24)]'
                    : 'border-white/16 bg-white/6 text-slate-200 hover:bg-white/12'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-7">
          {filteredProjects.map((item, index) => (
            <motion.article
              key={`${item.title}-${activeCategory}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: (index % 6) * 0.04 }}
              viewport={{ once: true }}
              className="apple-surface rounded-[2rem] p-3 md:p-4"
            >
              <div className="rounded-[1.6rem] overflow-hidden border border-white/12 bg-slate-950/80 h-full flex flex-col">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                </div>

                <div className="p-5 md:p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">{item.subtitle}</p>

                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-2xl md:text-3xl font-semibold text-slate-100 hover:text-cyan-100 transition-colors"
                    >
                      {item.title}
                      <ArrowUpRight className="h-5 w-5" />
                    </a>
                  ) : (
                    <h3 className="mt-3 text-2xl md:text-3xl font-semibold text-slate-100">{item.title}</h3>
                  )}

                  <p className="mt-4 text-slate-300 text-sm md:text-base leading-relaxed">{item.description}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="apple-chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
