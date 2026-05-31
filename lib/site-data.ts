// Single source of truth for site content.
// Seeded from content.md — edit here when LinkedIn / resume changes.

export const profile = {
  name: "Vibhrav Jha",
  initials: "VJ",
  role: "Software Engineer",
  tagline: "building across web, AI & systems",
  location: "Madison, WI",
  origin: "New Delhi, India",
  availability: "Open to 2026 · SWE & Applied AI roles",
  status: {
    label: "Open to 2026",
    org: "SWE & Applied AI roles",
  },
  socials: {
    github: "https://github.com/V1R4V",
    linkedin: "https://www.linkedin.com/in/vibhrav-jha-4846a3275/",
    resume: "/resume.pdf",
  },
} as const

export type TimelineEntry = {
  kind: "experience" | "education"
  period: string
  title: string
  org: string
  location?: string
  logo?: string
  summary: string
  bullets: string[]
  tools?: string[]
}

// Newest first — drives the center-spine timeline (alternating sides).
export const timeline: TimelineEntry[] = [
  {
    kind: "experience",
    period: "Jan 2026 — Present",
    title: "Undergraduate Research Assistant",
    org: "UW–Madison People & Robots Lab",
    location: "Madison, WI",
    logo: "/company-logos/wisc.png",
    summary:
      "Building an Android overlay app that delivers real-time, context-aware security and privacy guidance to adults with intellectual and developmental disabilities (IDD), as part of an IRB-approved HCI study on interdependent security support.",
    bullets: [
      "Multimodal screen-analysis pipeline",
      "Deterministic risk safety floor",
      "Gemini API + JSON risk schema",
    ],
    tools: ["Kotlin", "Android", "Gemini API"],
  },
  {
    kind: "experience",
    period: "May 2025 — Aug 2025",
    title: "Software Engineering Intern",
    org: "VDart Inc.",
    location: "Atlanta, GA",
    logo: "/company-logos/vdart.png",
    summary:
      "Engineered an automated RFI/RFP generation pipeline with IBM Docling, Llama 3, and Gemini, cutting proposal turnaround from two weeks to under 24 hours and shipping a full-stack React + FastAPI chat interface to 50+ users.",
    bullets: ["3x proposal capacity", "96% retrieval accuracy", "50+ active users"],
    tools: ["React", "FastAPI", "IBM Docling"],
  },
  {
    kind: "experience",
    period: "Jan 2022 — Mar 2023",
    title: "Software Development Intern",
    org: "Pink City Expressways",
    location: "Jaipur, India",
    logo: "/company-logos/pinkcity.gif",
    summary:
      "Built a Python and SQL CRM to track 30+ business leads plus an automated contractor-management tool, lifting successful partnerships from 15 to 19 and adding $18K in revenue through better resource allocation.",
    bullets: ["15 → 19 partnerships", "+$18K added revenue", "30+ leads tracked"],
    tools: ["Python", "SQL", "JavaScript"],
  },
  {
    kind: "education",
    period: "Sep 2023 — May 2027",
    title: "B.S. Computer Science, Data Science & Economics",
    org: "University of Wisconsin–Madison",
    location: "Madison, WI",
    logo: "/company-logos/wisc.png",
    summary:
      "Dean's List (3x) · GPA 3.755 / 4.0. Coursework spanning algorithms, big data systems, AI, and applied quantitative analysis.",
    bullets: [
      "Data Structures & Algorithms",
      "Introduction to Algorithms",
      "Machine Organization & Programming",
      "Artificial Intelligence",
      "Big Data Systems",
      "Building User Interfaces",
      "Data Management for Data Science",
      "Discrete Mathematics",
      "Data Science Modeling",
      "Linear Algebra",
      "Statistics for Economics",
      "Data Analytics for Economics",
    ],
    tools: ["CS", "Data Science", "Economics"],
  },
]

// Headline metrics surfaced near the hero / experience for instant credibility.
export const metrics = [
  { value: "3x", label: "proposal capacity shipped" },
  { value: "27", label: "projects across 4 domains" },
  { value: "$18K", label: "revenue impact delivered" },
] as const

export type Project = {
  title: string
  subtitle: string
  description: string
  tags: string[]
  link: string
  image?: string
  categories: ProjectCategory[]
}

export type ProjectCategory =
  | "Fullstack"
  | "Distributed Systems"
  | "ML & AI"
  | "Data Engineering"

export const projectCategories: ProjectCategory[] = [
  "Fullstack",
  "Distributed Systems",
  "ML & AI",
  "Data Engineering",
]

export const projects: Project[] = [
  {
    title: "Aranyaka",
    subtitle: "Wildlife camera-trap classification pipeline",
    description:
      "Microservices system that turns camera-trap photos into structured biodiversity records: a React + Vite frontend plus independent FastAPI services for upload handling, Celery-based async inference (HuggingFace), and observation management over Supabase and Upstash Redis.",
    tags: ["React", "FastAPI", "Celery", "Supabase", "HuggingFace"],
    link: "https://github.com/V1R4V/Aranyaka",
    image: "/aranyaka.png",
    categories: ["Fullstack", "ML & AI", "Distributed Systems"],
  },
  {
    title: "DermaNet",
    subtitle: "Offline AI skin-cancer screening",
    description:
      "React + Vite diagnosis workflow (body-area selection, lesion upload, AI summary, follow-up chat) backed by three swappable FastAPI services for classification, orchestration, and a local Ollama LLM, wiring ONNX outputs into patient-friendly explanations.",
    tags: ["React", "FastAPI", "Ollama", "ONNX", "REST APIs"],
    link: "https://github.com/V1R4V",
    image: "hackathon.jpeg",
    categories: ["ML & AI", "Fullstack"],
  },
  {
    title: "LLM Fine-Tuning & RAG Exam Prep",
    subtitle: "LoRA distillation + Elasticsearch retrieval",
    description:
      "Distilled 895 QA pairs from lecture transcripts with a Qwen2.5-7B teacher, fine-tuned Llama-3.2-1B with LoRA (perplexity 48.85 → 2.49), and shipped a Streamlit chatbot over an Elasticsearch BM25 RAG pipeline benchmarked at Precision@3 0.87.",
    tags: ["PyTorch", "LoRA", "HuggingFace", "Elasticsearch", "Streamlit"],
    link: "https://github.com/V1R4V",
    image: "/course-chatbot.png",
    categories: ["ML & AI"],
  },
  {
    title: "RAG Automation Platform",
    subtitle: "Production retrieval + generation workflow",
    description:
      "End-to-end RAG pipeline for RFI/RFP automation: layout-aware document ingestion, semantic chunking, and vector retrieval feeding an LLM, wired to a React chat UI with token streaming over a FastAPI backend.",
    tags: ["Python", "RAG", "ChromaDB", "FastAPI", "React"],
    link: "https://github.com/V1R4V/rag-for-private_data",
    image: "f3.png",
    categories: ["ML & AI", "Fullstack"],
  },
  {
    title: "Real-Time Stock Data Streaming Pipeline",
    subtitle: "High-throughput Kafka ingestion + crash-safe checkpointing",
    description:
      "Streams stock ticks from MySQL into Kafka partitions and persists atomic Parquet batches to HDFS with checkpoint-based crash recovery.",
    tags: ["Kafka", "MySQL", "HDFS", "Parquet", "Protocol Buffers"],
    link: "https://github.com/V1R4V/Real-Time-Stock-Data-Streaming-Kafka",
    image: "/stock-streaming-architecture.svg",
    categories: ["Distributed Systems", "Data Engineering"],
  },
  {
    title: "Distributed Weather Data System",
    subtitle: "Fault-tolerant ingestion with tunable consistency",
    description:
      "Ingests NOAA weather data into a 3-node Cassandra cluster (RF=3) over a gRPC API, with tunable read/write consistency and automatic R=2 to R=1 read failover verified through docker-kill fault injection.",
    tags: ["Cassandra", "Distributed DB", "NOAA", "Fault Tolerance"],
    link: "https://github.com/V1R4V/Distributed-Weather-Data-System-with-Cassandra",
    image: "/weather-cassandra-system.svg",
    categories: ["Distributed Systems"],
  },
  {
    title: "Distributed Property Lookup Service",
    subtitle: "Fault-tolerant gRPC address lookup",
    description:
      "High-performance address-lookup microservice in Python with gRPC and Protocol Buffers, featuring round-robin load balancing, automatic failover with exponential backoff, and an LRU cache, all orchestrated with Docker Compose.",
    tags: ["Python", "gRPC", "Protobuf", "Docker", "Flask"],
    link: "https://github.com/V1R4V/Distributed-Property-Lookup-Service",
    image:"grpc.png",
        categories: ["Distributed Systems"],
  },
  {
    title: "Competitive Programming Analytics",
    subtitle: "Spark SQL + ML pipelines + LLM query interface",
    description:
      "Analyzes large-scale CodeContests data with Spark RDD/DataFrame/SQL APIs, optimized bucketing/caching, and natural-language query translation.",
    tags: ["Apache Spark", "Spark SQL", "ML", "HDFS", "Gemini"],
    link: "https://github.com/V1R4V/Competitive-Programming-Analytics-with-Apache-Spark",
    image: "/spark-analytics-system.svg",
    categories: ["Data Engineering", "ML & AI"],
  },
  {
    title: "Multi-Source ELT Data Pipeline",
    subtitle: "Airbyte → Snowflake → dbt",
    description:
      "Multi-source ELT pipeline ingesting survey, trading-book, and stock/FX time-series data into Snowflake, with 6 dbt staging models and a fact table that validate ticker-date pairs, join point-in-time prices, and compute desk-level profit and loss.",
    tags: ["Airbyte", "Snowflake", "dbt", "Python", "SQL"],
    link: "https://github.com/V1R4V",
    image: "/snowflake.png",
    categories: ["Data Engineering"],
  },
  {
    title: "E-Commerce Semantic Search Engine",
    subtitle: "BM25 + kNN vector search on Elasticsearch",
    description:
      "Explicit Elasticsearch mappings for 300+ products across 13 categories with a multi-modal query layer (BM25, fuzzy typo tolerance, phrase, boosted multi-field, boolean filters, 384-dim kNN) plus Kibana dashboards for price, ratings, and geospatial density.",
    tags: ["Elasticsearch", "Kibana", "Python", "Docker", "kNN"],
    link: "https://github.com/V1R4V",
    image: 'elasticsearch_install.jpg',
    categories: ["Data Engineering", "ML & AI"],
  },
  {
    title: "HDFS + SQL Data Pipeline",
    subtitle: "MySQL to HDFS pipeline with gRPC failover logic",
    description:
      "Builds partition-aware analytics workflows with replication-aware recovery, intelligent caching, and production-style gRPC APIs.",
    tags: ["MySQL", "HDFS", "gRPC", "Parquet", "Docker"],
    link: "https://github.com/V1R4V/Data-Pipeline-with-HDFS-SQL-Integration",
    image: "/hdfs-sql-pipeline.svg",
    categories: ["Data Engineering", "Distributed Systems"],
  },
  {
    title: "Store Sales Time-Series Forecasting",
    subtitle: "Gradient-boosted demand forecasting",
    description:
      "Merged 5 heterogeneous datasets into a unified time-series matrix, engineered calendar, holiday, oil, and transaction features, and compared LightGBM, CatBoost, and XGBoost on a time-based split with Optuna tuning, scored on the Kaggle RMSLE leaderboard.",
    tags: ["LightGBM", "CatBoost", "XGBoost", "Optuna", "pandas"],
    link: "https://github.com/V1R4V",
    image: "ds.png",
    categories: ["ML & AI", "Data Engineering"],
  },
  {
    title: "Startup Scout",
    subtitle: "Investor-startup matching + analytics platform",
    description:
      "Investor-startup matching platform over 1,000+ company profiles scraped with Firecrawl and a custom Python parser, with smart filtering on a React + Express + SQLite stack and Recharts dashboards for valuations and funding trends.",
    tags: ["React", "TypeScript", "SQLite", "Recharts", "Express"],
    link: "https://github.com/V1R4V/Startupscout",
    image: "/sscout.jpg",
    categories: ["Fullstack"],
  },
  {
    title: "Habit Command Center",
    subtitle: "Weekly-goal planning & execution dashboard",
    description:
      "Next.js App Router productivity dashboard that turns weekly goals into daily action with habit scheduling, task tracking, weighted scoring, daily/weekly/monthly grades, and a Recharts calendar heatmap, backed by Supabase auth and Postgres.",
    tags: ["Next.js", "TypeScript", "Supabase", "Recharts", "Vercel"],
    link: "https://github.com/V1R4V/HabitTracker",
    image: "habit.png",
    categories: ["Fullstack"],
  },
  {
    title: "StudyFlow",
    subtitle: "Study-habit tracker + analytics",
    description:
      "Study tracker with a dual-mode timer, subject manager, editable session history, and a Recharts dashboard (daily totals, weekly trends, productivity scores, calendar heatmap), with hybrid Firestore + localStorage persistence and per-user security rules.",
    tags: ["React", "Vite", "Firebase", "Recharts", "Vercel"],
    link: "https://github.com/V1R4V/StudyFlow",
    image: "flow.png",
    categories: ["Fullstack"],
  },
  {
    title: "Concurrent Word Count Benchmark",
    subtitle: "Multi-threaded processing + GIL benchmark analysis",
    description:
      "High-performance concurrent word-count pipeline with configurable thread pools and benchmark suites comparing GIL/no-GIL scaling across CSV, Parquet, and Arrow.",
    tags: ["Python 3.13", "Threading", "Parquet", "Apache Arrow"],
    link: "https://github.com/V1R4V/Concurrent-Word-Count-Performance-Benchmarking-System",
    image: "/concurrent-wordcount-benchmark.svg",
    categories: ["Data Engineering"],
  },
  {
    title: "Yelp CA Geospatial Analytics",
    subtitle: "MongoDB aggregation + geospatial queries",
    description:
      "30 MongoDB queries spanning multi-stage lookup/unwind aggregation pipelines and a 2dsphere geospatial layer (polygon containment, nearest-neighbor, radial filters), visualized over Santa Barbara city-limit GeoJSON with GeoPandas.",
    tags: ["MongoDB", "PyMongo", "GeoPandas", "Python", "Docker"],
    link: "https://github.com/V1R4V",
    image: 'yelp.png',
    categories: ["Data Engineering"],
  },
  {
    title: "Autoflow.ai",
    subtitle: "Automation startup website + product surface",
    description:
      "Marketing and product site for an automation startup, built with Next.js and TypeScript: responsive landing pages, animated sections, and a reusable component system, deployed on Vercel.",
    tags: ["Next.js", "TypeScript", "UI Engineering"],
    link: "https://aiautoflow.vercel.app/",
    image: "/autoflow.png",
    categories: ["Fullstack"],
  },
  {
    title: "Chinook Music Store SQL Analytics",
    subtitle: "Window functions + moving averages",
    description:
      "30 SQL queries across correlated subqueries, multi-table joins, GROUP BY/HAVING, and window functions (RANK, ROW_NUMBER), including a 3-month moving-average revenue analysis over a Dockerized MySQL schema loaded via SQLAlchemy.",
    tags: ["MySQL", "SQLAlchemy", "Docker", "pandas", "SQL"],
    link: "https://github.com/V1R4V",
    image: 'chinook.png',
    categories: ["Data Engineering"],
  },
  {
    title: "Recipe Pal",
    subtitle: "Inventory-aware consumer planning app",
    description:
      "React + Next.js meal planner that suggests recipes from your on-hand inventory across a 10,000+ recipe API, with dietary filters, saved favorites, grocery lists, and barcode and receipt scanning.",
    tags: ["Next.js", "TypeScript", "Product UX"],
    link: "https://github.com/V1R4V/RecipePlanner",
    image: "/recipepal.png",
    categories: ["Fullstack"],
  },
  {
    title: "House Price Predictor",
    subtitle: "Regression benchmarking + residual analysis",
    description:
      "Compares Linear, Ridge, Lasso, Random Forest, and XGBoost regressors after correlation-guided feature selection, log transforms, scaling, and residual plotting.",
    tags: ["XGBoost", "Random Forest", "Ridge", "Regression"],
    link: "https://github.com/V1R4V/HousePricePredictor",
    image: "/house-price-predictor.svg",
    categories: ["ML & AI"],
  },
  {
    title: "Country Data Clustering",
    subtitle: "Unsupervised segmentation + dendrogram analysis",
    description:
      "Clusters country-level indicators into interpretable groups using unsupervised learning and dendrogram visualizations to compare development patterns.",
    tags: ["Clustering", "Dendrograms", "Scikit-learn", "Pandas"],
    link: "https://github.com/V1R4V/country-data-clustering_dendograms",
    image: "/country-clustering-dendrogram.svg",
    categories: ["ML & AI"],
  },
  {
    title: "FashionMNIST PyTorch Classifier",
    subtitle: "Normalized pipeline + train/eval + top-3 output",
    description:
      "Feedforward PyTorch classifier for FashionMNIST that reaches 85%+ accuracy in 5 epochs, with a normalized data pipeline, SGD + cross-entropy training, and top-3 Softmax class probabilities at inference.",
    tags: ["PyTorch", "Deep Learning", "SGD", "Model Evaluation"],
    link: "https://github.com/V1R4V/FashionMNIST-PyTorch-CNN",
    image: "/fashionmnist-pytorch.svg",
    categories: ["ML & AI"],
  },
  {
    title: "Bayesian Language Detection",
    subtitle: "Posterior classification for English vs Spanish",
    description:
      "Implements Bayes theorem over letter-frequency distributions to classify shredded text, with a clear inference pipeline from character counts to language posterior scores.",
    tags: ["Python", "Bayesian Inference", "NLP", "Probability"],
    link: "https://github.com/V1R4V/language_detection",
    image: "/bayesian-language-detection.svg",
    categories: ["ML & AI"],
  },
  {
    title: "Facial Analysis System",
    subtitle: "PCA-based computer vision pipeline",
    description:
      "PCA pipeline over 1,000 celebrity images that reduces 3,000-dimensional face vectors into compact eigenfaces, with image reconstruction, eigenface visualization, and noise-perturbation analysis in NumPy and SciPy.",
    tags: ["Python", "NumPy", "SciPy", "Computer Vision", "PCA"],
    link: "https://github.com/V1R4V/image_compression_pca",
    image: "f1.png",
    categories: ["ML & AI"],
  },
  {
    title: "Campus Navigator",
    subtitle: "Graph-powered navigation engine",
    description:
      "Java routing app over 160+ UW–Madison locations using Dijkstra's algorithm on a hashtable-backed graph, with an HTML interface for shortest paths, travel times, and the 10 nearest destinations from any point.",
    tags: ["Java", "Graph Theory", "Algorithms"],
    link: "https://github.com/V1R4V/CampusNavigator",
    image: "/Campus.png",
    categories: ["Fullstack"],
  },
  {
    title: "iSongLy",
    subtitle: "BST / red-black tree song explorer",
    description:
      "Java command-line app that loads song catalogs from CSV and supports attribute filtering (danceability, energy) plus efficient range and recency queries using custom binary search tree and red-black tree implementations.",
    tags: ["Java", "Red-Black Trees", "BST", "Algorithms"],
    link: "https://github.com/V1R4V/iSongLy",
    image: "/isongly.png",
    categories: ["Fullstack"],
  },
]

// ── Travels ───────────────────────────────────────────────────────────────
// Drives the About globe. `home` markers (Delhi ↔ Madison) render in burgundy;
// the rest render in teal as "places I've been". iso = flagcdn.com code.
export type Place = {
  city: string
  country: string
  iso: string
  coords: [number, number] // [lat, lng]
  home?: boolean
}

export const places: Place[] = [
  { city: "New Delhi", country: "India", iso: "in", coords: [28.6139, 77.209], home: true },
  { city: "Madison", country: "United States", iso: "us", coords: [43.0731, -89.4012], home: true },
  { city: "London", country: "United Kingdom", iso: "gb", coords: [51.5074, -0.1278] },
  { city: "Edinburgh", country: "Scotland", iso: "gb-sct", coords: [55.9533, -3.1883] },
  { city: "Paris", country: "France", iso: "fr", coords: [48.8566, 2.3522] },
  { city: "Berlin", country: "Germany", iso: "de", coords: [52.52, 13.405] },
  { city: "Vienna", country: "Austria", iso: "at", coords: [48.2082, 16.3738] },
  { city: "Prague", country: "Czechia", iso: "cz", coords: [50.0755, 14.4378] },
  { city: "Bangkok", country: "Thailand", iso: "th", coords: [13.7563, 100.5018] },
  { city: "Kathmandu", country: "Nepal", iso: "np", coords: [27.7172, 85.324] },
]

export const travelStats = {
  countries: 9,
  continents: 3,
  homes: 2,
} as const

// ── Tech stack (with original-brand-color logos) ────────────────────────────
// Logos render in their real company colors. `icon` = a devicon path
// (multicolor "original" SVG); `slug` = a simpleicons id (brand-color) used as
// a fallback when devicon lacks the icon. If neither resolves, a text glyph in
// the accent shows (matches the design's own fallback). See TechLogo in stack.tsx.
export type TechItem = {
  name: string
  desc: string
  url?: string // local/static image path
  icon?: string // devicon "name/name-original" path
  slug?: string // simpleicons brand-color fallback
}
export type TechCategory = { name: string; summary: string; items: TechItem[] }

export const techStack: TechCategory[] = [
  {
    name: "Frontend",
    summary: "User-facing web interfaces and interaction systems.",
    items: [
      { name: "HTML5", desc: "Semantic Structure", icon: "html5/html5-original" },
      { name: "CSS3", desc: "Styling Foundation", icon: "css3/css3-original" },
      { name: "JavaScript", desc: "Interactive Web Logic", icon: "javascript/javascript-original" },
      { name: "TypeScript", desc: "Type-Safe Development", icon: "typescript/typescript-original" },
      { name: "React", desc: "Component Architecture", icon: "react/react-original" },
      { name: "Next.js", desc: "App Router + SSR", icon: "nextjs/nextjs-original" },
      { name: "Tailwind CSS", desc: "Modern Styling System", icon: "tailwindcss/tailwindcss-original" },
      { name: "Streamlit", desc: "Data App Interfaces", slug: "streamlit" },
    ],
  },
  {
    name: "Backend",
    summary: "Services, APIs, and database systems.",
    items: [
      { name: "Java", desc: "Service Development", icon: "java/java-original" },
      { name: "FastAPI", desc: "Python API Services", icon: "fastapi/fastapi-original" },
      { name: "Node.js", desc: "Backend Runtime", icon: "nodejs/nodejs-original" },
      { name: "Express", desc: "Web Framework", icon: "express/express-original" },
      { name: "REST APIs", desc: "HTTP Services", slug: "openapiinitiative" },
      { name: "gRPC", desc: "Protobuf Services", url: "/grpc.png" },
      { name: "MySQL", desc: "Relational Data", icon: "mysql/mysql-original" },
      { name: "SQLite", desc: "Embedded Database", icon: "sqlite/sqlite-original" },
      { name: "MongoDB", desc: "NoSQL Data Models", icon: "mongodb/mongodb-original" },
      { name: "Apache Cassandra", desc: "Wide-Column NoSQL", icon: "cassandra/cassandra-original" },
      { name: "Snowflake", desc: "Cloud Data Warehouse", slug: "snowflake" },
    ],
  },
  {
    name: "Applied AI",
    summary: "Practical ML and LLM tooling for production workflows.",
    items: [
      { name: "Python", desc: "Core AI Language", icon: "python/python-original" },
      { name: "PyTorch", desc: "Model Training", icon: "pytorch/pytorch-original" },
      { name: "Scikit-learn", desc: "Classical ML", icon: "scikitlearn/scikitlearn-original" },
      { name: "Pandas + NumPy", desc: "Data + Numerical Compute", icon: "pandas/pandas-original" },
      { name: "Hugging Face", desc: "Models + Datasets", slug: "huggingface" },
      { name: "LangChain", desc: "Agent Orchestration", slug: "langchain" },
      { name: "Claude", desc: "Agent + Reasoning", slug: "anthropic" },
      { name: "Codex", desc: "Code Generation", url: "/codex.png" },
      { name: "Cursor", desc: "AI Editor", slug: "cursor" },
      { name: "Copilot", desc: "Pair Programming", slug: "githubcopilot" },
      { name: "Ollama + LoRA", desc: "Local Models + Fine-Tuning", slug: "ollama" },
      { name: "ONNX", desc: "Portable Inference", slug: "onnx" },
    ],
  },
  {
    name: "Data & Infra",
    summary: "Data pipelines, distributed processing, and deployment.",
    items: [
      { name: "Elasticsearch", desc: "Search + Retrieval", icon: "elasticsearch/elasticsearch-original" },
      { name: "dbt + Airbyte", desc: "ELT Transformations", slug: "airbyte" },
      { name: "Apache Kafka", desc: "Streaming Pipelines", icon: "apachekafka/apachekafka-original" },
      { name: "Apache Spark", desc: "Distributed Compute", icon: "apachespark/apachespark-original" },
      { name: "HDFS / Hadoop", desc: "Data Infrastructure", slug: "apachehadoop" },
      { name: "Docker", desc: "Containerized Apps", icon: "docker/docker-original" },
      { name: "Linux", desc: "Server OS", slug: "linux" },
      { name: "macOS", desc: "Developer OS", slug: "apple" },
      { name: "Windows", desc: "Desktop OS", url: "/windows.png" },
      { name: "Google Cloud", desc: "Cloud + BigQuery", slug: "googlecloud" },
      { name: "Git", desc: "Version Control", icon: "git/git-original" },
    ],
  },
]

// Curated, colorful set for the scrolling marquee (big display names + logos).
// Kept to vivid brands so they read on the dark-default background.
export const techMarquee: TechItem[] = [
  { name: "React", desc: "", icon: "react/react-original" },
  { name: "TypeScript", desc: "", icon: "typescript/typescript-original" },
  { name: "Node.js", desc: "", icon: "nodejs/nodejs-original" },
  { name: "Python", desc: "", icon: "python/python-original" },
  { name: "PyTorch", desc: "", icon: "pytorch/pytorch-original" },
  { name: "FastAPI", desc: "", icon: "fastapi/fastapi-original" },
  { name: "MongoDB", desc: "", icon: "mongodb/mongodb-original" },
  { name: "Apache Spark", desc: "", icon: "apachespark/apachespark-original" },
  { name: "Tailwind CSS", desc: "", icon: "tailwindcss/tailwindcss-original" },
  { name: "Docker", desc: "", icon: "docker/docker-original" },
  { name: "Pandas", desc: "", icon: "pandas/pandas-original" },
  { name: "scikit-learn", desc: "", icon: "scikitlearn/scikitlearn-original" },
]

export type SkillGroup = { name: string; summary: string; items: string[] }

export const skillGroups: SkillGroup[] = [
  {
    name: "Frontend",
    summary: "User-facing web interfaces and interaction systems.",
    items: [
      "TypeScript",
      "React",
      "Next.js",
      "Streamlit",
      "Tailwind CSS",
      "JavaScript",
      "HTML5 / CSS3",
    ],
  },
  {
    name: "Backend",
    summary: "Services, APIs, and database systems.",
    items: [
      "FastAPI",
      "Node.js / Express",
      "Java",
      "REST APIs / gRPC",
      "MySQL / SQLite",
      "MongoDB",
      "Cassandra",
      "Snowflake",
    ],
  },
  {
    name: "Applied AI",
    summary: "Practical ML and LLM tooling for production workflows.",
    items: [
      "Python",
      "PyTorch",
      "Scikit-learn",
      "Pandas / NumPy",
      "Hugging Face",
      "LangChain",
      "Ollama / LoRA",
      "ONNX",
    ],
  },
  {
    name: "Infra & Data",
    summary: "CI/CD, containers, and distributed processing.",
    items: [
      "Docker",
      "Apache Kafka",
      "Apache Spark",
      "HDFS / Hadoop",
      "Elasticsearch",
      "dbt / Airbyte",
      "Google Cloud",
      "Git / CI-CD",
    ],
  },
]

// Compact marquee row.
export const marquee = [
  "React",
  "Next.js",
  "TypeScript",
  "Python",
  "PyTorch",
  "FastAPI",
  "Apache Spark",
  "Kafka",
  "Docker",
  "Snowflake",
  "LangChain",
  "Node.js",
] as const

export const about = {
  heading: "Engineer, Builder, Collaborator",
  intro:
    "I'm Vibhrav Jha, a full-stack and applied-AI engineer studying CS, Data Science, and Economics at UW–Madison. I own features end to end, from interface polish to backend APIs and ML pipelines. I've shipped production software at VDart, built a research prototype at the People & Robots Lab, and delivered 27 projects across web, data, and AI. I'm looking for 2026 SWE and Applied AI roles where I can ship work that reaches real users.",
  pillars: [
    {
      title: "Product Engineering",
      subtitle: "From UX to API architecture",
      text: "I ship complete features across React frontends and FastAPI or Node backends, with an emphasis on user clarity, clean abstractions, and maintainable delivery.",
    },
    {
      title: "Applied AI",
      subtitle: "Production systems, not demos",
      text: "I build AI workflows backed by numbers: 96% retrieval accuracy on a production RAG pipeline, and a 20x drop in model perplexity from LoRA fine-tuning.",
    },
    {
      title: "Execution Discipline",
      subtitle: "Reliability and communication",
      text: "I ship fast without cutting corners: deterministic safety floors, fault-injection testing, and CI/CD on every push, with decisions documented as I go.",
    },
  ],
  personal: {
    focus: "High-quality product engineering with real user impact.",
    outside: ["Football", "Gym", "Cooking", "Gaming", "Reading"],
  },
} as const
