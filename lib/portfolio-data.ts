// Public-facing copy approved for integration in docs/portfolio/copy.md.
// Source IDs are opaque review identifiers. Private evidence and paths stay out of runtime data.

export type Project = {
  slug: string
  title: string
  category: string
  categories: string[]
  featured: boolean
  eyebrow: string
  summary: string
  role: string
  status: string
  stack: string[]
  image: string
  imageAlt: string
  href?: string
  demo?: string
  problem: string
  approach: string
  outcome: string
  detail: string
  sourceIds: string[]
}

export type Experience = {
  slug: string
  org: string
  role: string
  period: string
  mark: string
  logo?: string
  summary: string
  detail: string
  bullets: string[]
  sourceIds: string[]
}

export type Leadership = {
  org: string
  role: string
  period?: string
  previousRole?: string
  heading: string
  summary: string
  scope: string
  bullets: string[]
  sourceIds: string[]
}

export type Profile = {
  name: string
  email: string
  github: string
  linkedin: string
  education: string
  location: string
}

export { publicCopy } from "./public-copy"

export const profile: Profile = {
  "name": "Vibhrav Jha",
  "email": "vibhrav@gmail.com",
  "github": "https://github.com/V1R4V",
  "linkedin": "https://www.linkedin.com/in/vibhrav-jha-4846a3275/",
  "education": "Computer Sciences, Data Science and Economics at UW-Madison. Expected graduation: May 2027.",
  "location": "Madison, Wisconsin"
}

export const projects: Project[] = [
  {
    "slug": "aranyaka",
    "title": "Aranyaka",
    "category": "Fullstack",
    "categories": [
      "Fullstack",
      "Distributed Systems",
      "ML & AI",
      "Data Engineering"
    ],
    "featured": true,
    "eyebrow": "Turning camera-trap images into reviewable observations",
    "summary": "Researchers need an observation they can inspect, correct and trace to its source image. I built a wildlife-image workflow that separates upload, background classification and observation review, with explicit job states and retry-safe writes.",
    "role": "Built the application workflow across the React interface, APIs, inference worker and observation model.",
    "status": "Personal project · deployed demo",
    "stack": [
      "React",
      "FastAPI",
      "Celery",
      "PostgreSQL",
      "Supabase",
      "Redis",
      "Hugging Face"
    ],
    "image": "/cinematic/aranyaka.webp",
    "imageAlt": "Aranyaka wildlife-image application interface",
    "problem": "Researchers need an observation they can inspect, correct and trace to its source image. I built a wildlife-image workflow that separates upload, background classification and observation review, with explicit job states and retry-safe writes.",
    "approach": "FastAPI accepts uploads while Celery workers run inference. Each observation retains its source image, species prediction, confidence and top-five alternatives. A unique upload ID prevents duplicate observation inserts, and queue backpressure rejects excess work before processing becomes overloaded. Low-confidence results enter a human-review queue.",
    "outcome": "An upload-to-review application with asynchronous processing, traceable predictions and human correction.",
    "detail": "Separate accepting an image from classifying it, with source identity preserved through retries.",
    "sourceIds": [
      "PR01"
    ],
    "href": "https://github.com/V1R4V/Aranyaka",
    "demo": "https://aranyaka.vercel.app"
  },
  {
    "slug": "dermanet",
    "title": "DermaNet",
    "category": "ML & AI",
    "categories": [
      "ML & AI",
      "Fullstack"
    ],
    "featured": true,
    "eyebrow": "Connecting a lesion prediction with an understandable explanation",
    "summary": "An image classifier returns probabilities, but a person still needs help interpreting the result. In a three-person team, I built the classification API and local language-model service for an offline skin-lesion analysis prototype with summaries and follow-up questions.",
    "role": "ONNX classification service and local LLM-serving layer. Teammates built the frontend, segmentation and orchestration.",
    "status": "Team hackathon prototype · exploratory skin-lesion analysis",
    "stack": [
      "Python",
      "FastAPI",
      "ONNX Runtime",
      "Ollama",
      "Qwen2.5-3B"
    ],
    "image": "/cinematic/dermanet.webp",
    "imageAlt": "The DermaNet team prototype running on a monitor at the hackathon",
    "problem": "An image classifier returns probabilities, but a person still needs help interpreting the result. In a three-person team, I built the classification API and local language-model service for an offline skin-lesion analysis prototype with summaries and follow-up questions.",
    "approach": "The classification endpoint exposes ONNX inference through FastAPI. A separate OpenAI-compatible service wraps Ollama and Qwen2.5-3B, with a Python client and CLI for testing the conversation flow. Keeping model serving behind a defined API let the team connect image analysis and language generation while developing the services independently.",
    "outcome": "Classification and local conversation services integrated into the team’s image-to-summary prototype.",
    "detail": "Use a local model behind an OpenAI-compatible interface so the explanation service fits into the wider application.",
    "sourceIds": [
      "PR02"
    ],
    "href": "https://github.com/quincysorrentino/MadData2026"
  },
  {
    "slug": "private-data-rag",
    "title": "Private-Data RAG",
    "category": "ML & AI",
    "categories": [
      "ML & AI",
      "Data Engineering"
    ],
    "featured": true,
    "eyebrow": "Keeping the answer connected to the source",
    "summary": "A public adaptation of my enterprise proposal work, showing how document structure, retrieval and generation fit together. It demonstrates the workflow with confidential company material excluded.",
    "role": "Implemented the retrieval workflow and adapted the demonstration for public use.",
    "status": "Public sanitized demonstration",
    "stack": [
      "Python",
      "IBM Docling",
      "Sentence-Transformers",
      "ChromaDB",
      "Ollama",
      "Hugging Face"
    ],
    "image": "/cinematic/diagrams/private-data-rag.svg",
    "imageAlt": "Keeping answers connected to sources — explanatory architecture diagram",
    "problem": "A public adaptation of my enterprise proposal work, showing how document structure, retrieval and generation fit together. It demonstrates the workflow with confidential company material excluded.",
    "approach": "Docling converts documents for ingestion, Sentence-Transformers embeds the retrieval units, and ChromaDB stores them for similarity search. A CLI supports questions through local Ollama or Hugging Face model paths. The important decision is what enters retrieval: preserving a complete question-and-answer pair keeps the business context attached to the answer.",
    "outcome": "An inspectable document-to-answer demonstration. The enterprise workflow’s adoption and turnaround results appear under VDart.",
    "detail": "Preserve meaningful document units before embedding rather than treating chunk size as the only retrieval choice.",
    "sourceIds": [
      "PR03"
    ],
    "href": "https://github.com/V1R4V/rag-for-private_data"
  },
  {
    "slug": "before-it-breaks",
    "title": "Before It Breaks",
    "category": "ML & AI",
    "categories": [
      "ML & AI",
      "Data Engineering",
      "Fullstack"
    ],
    "featured": true,
    "eyebrow": "Turning maintenance signals into an inspection decision",
    "summary": "Facilities teams need to know which asset deserves attention and why. I built the risk, forecast and agent backend for a team prototype that combines weather-adjusted baselines with equipment signals, ranks inspection priorities and drafts work orders for human approval.",
    "role": "Risk and forecast models, backend types and APIs, agent workflow and integration within the team product.",
    "status": "Personal team project · research prototype",
    "stack": [
      "Python",
      "NumPy",
      "pandas",
      "SciPy",
      "C3 AI",
      "React",
      "TypeScript"
    ],
    "image": "/cinematic/diagrams/before-it-breaks.svg",
    "imageAlt": "From equipment signals to inspection decisions — explanatory architecture diagram",
    "problem": "Facilities teams need to know which asset deserves attention and why. I built the risk, forecast and agent backend for a team prototype that combines weather-adjusted baselines with equipment signals, ranks inspection priorities and drafts work orders for human approval.",
    "approach": "Four forecasting methods compare calibrated risk, logistic classification, Monte Carlo risk drift and an age-based Weibull baseline over 7-, 14- and 30-day horizons. I also defined backend contracts and integrated the forecasts into the application. The energy baseline declines to extrapolate beyond its fitted temperature range, avoiding misleading alerts when the weather changes.",
    "outcome": "In the saved interim backtest, all five planted failures were flagged 6–9 days ahead, with two false-alarm days at the tested threshold. That experiment used synthetic sensor and failure data alongside real weather records.",
    "detail": "Make model disagreement visible and retain human approval between a recommendation and a work order.",
    "sourceIds": [
      "PR04"
    ],
    "href": "https://github.com/V1R4V/CampusReliability_HVAC-R"
  },
  {
    "slug": "stock-streaming",
    "title": "Stock Streaming Engine",
    "category": "Distributed Systems",
    "categories": [
      "Distributed Systems",
      "Data Engineering"
    ],
    "featured": true,
    "eyebrow": "Making the recovery path part of the pipeline",
    "summary": "A streaming pipeline has to account for the moment between reading a record and publishing its output. I implemented a course-built system that sends typed, simulated stock records through Kafka into HDFS and Parquet, with explicit offsets and checkpoint recovery.",
    "role": "Producer and consumer implementation, serialization, offset management and persisted output within the course project.",
    "status": "Academic project · simulated market data",
    "stack": [
      "Python",
      "Kafka",
      "Protobuf",
      "MySQL",
      "HDFS",
      "Parquet",
      "Docker"
    ],
    "image": "/stock-streaming-architecture.svg",
    "imageAlt": "Architecture diagram of simulated stock records flowing through Kafka to HDFS",
    "problem": "A streaming pipeline has to account for the moment between reading a record and publishing its output. I implemented a course-built system that sends typed, simulated stock records through Kafka into HDFS and Parquet, with explicit offsets and checkpoint recovery.",
    "approach": "Protobuf defines the record format. The consumer resumes from saved partition offsets and uses deterministic batch names and temporary-file replacement when publishing output. Making data and checkpoint writes explicit exposes the failure boundaries that a replay strategy has to handle.",
    "outcome": "A partitioned stream-to-storage workflow with a concrete restart and checkpoint path.",
    "detail": "Make replay inspectable through recorded offsets and predictable output identity.",
    "sourceIds": [
      "PR05"
    ],
    "href": "https://github.com/V1R4V/Real-Time-Stock-Data-Streaming-Kafka"
  },
  {
    "slug": "vyaya",
    "title": "Vyaya",
    "category": "Fullstack",
    "categories": [
      "Fullstack"
    ],
    "featured": true,
    "eyebrow": "Making everyday spending visible beneath the large transactions",
    "summary": "Tuition, family funding and repayments made a single spending total difficult to interpret. I built Vyaya to separate everyday activity from large obligations and settlements, so a monthly comparison answers the question I actually care about.",
    "role": "Product framing, React/TypeScript application, financial calculations, import handling and visualizations.",
    "status": "Personal project · own-use application",
    "stack": [
      "React",
      "TypeScript",
      "Firestore",
      "SVG"
    ],
    "image": "/cinematic/diagrams/vyaya.svg",
    "imageAlt": "Separate the meaning before adding the amount — explanatory architecture diagram",
    "problem": "Tuition, family funding and repayments made a single spending total difficult to interpret. I built Vyaya to separate everyday activity from large obligations and settlements, so a monthly comparison answers the question I actually care about.",
    "approach": "Amounts use integer cents. Unrecognized imports are quarantined for review, and comparisons use equivalent elapsed periods rather than comparing an unfinished month with a complete one. Custom SVG charts expose those distinctions without combining unrelated money movements.",
    "outcome": "A personal-use finance application with separate activity lanes and a recorded 84-test suite.",
    "detail": "Define the meaning of a transaction before aggregating it.",
    "sourceIds": [
      "PR06"
    ]
  },
  {
    "slug": "exam-prep-assistant",
    "title": "Fine-Tuning vs. RAG",
    "category": "ML & AI",
    "categories": [
      "ML & AI",
      "Data Engineering"
    ],
    "featured": false,
    "eyebrow": "Keep retrieved passages and scores visible in the Streamlit interface, and evaluate language modeling separately from retrieval.",
    "summary": "I built parallel fine-tuning and retrieval paths over 23 lecture transcripts to investigate what each contributes to study assistance.",
    "role": "Prepared the corpus, fine-tuned the model, implemented retrieval and built the inspection interface.",
    "status": "Academic experiment",
    "stack": [
      "PyTorch",
      "Hugging Face",
      "LoRA",
      "Haystack",
      "Elasticsearch",
      "Streamlit"
    ],
    "image": "/cinematic/exam-prep-assistant.webp",
    "imageAlt": "Study assistant interface with retrieved source context",
    "problem": "I built parallel fine-tuning and retrieval paths over 23 lecture transcripts to investigate what each contributes to study assistance.",
    "approach": "Keep retrieved passages and scores visible in the Streamlit interface, and evaluate language modeling separately from retrieval.",
    "outcome": "Recorded held-out perplexity fell from 48.85 to 2.49 after LoRA adaptation.",
    "detail": "Keep retrieved passages and scores visible in the Streamlit interface, and evaluate language modeling separately from retrieval.",
    "sourceIds": [
      "PR07"
    ],
    "href": "https://github.com/V1R4V/LLM-LoRA-Finetuning-vs-RAG"
  },
  {
    "slug": "distributed-weather",
    "title": "Distributed Weather Data System",
    "category": "Distributed Systems",
    "categories": [
      "Distributed Systems",
      "Data Engineering"
    ],
    "featured": false,
    "eyebrow": "Model partition and clustering keys around weather queries, with read-consistency fallback when replicas become unavailable.",
    "summary": "Implemented a gRPC service over a three-node Cassandra cluster for NOAA time-series data.",
    "role": "Cassandra data modeling, gRPC service implementation and failure testing within the course project.",
    "status": "Academic project",
    "stack": [
      "Python",
      "Cassandra",
      "gRPC",
      "Protobuf",
      "Spark",
      "Docker"
    ],
    "image": "/weather-cassandra-system.svg",
    "imageAlt": "Architecture diagram of NOAA data, a Cassandra cluster and a query service",
    "problem": "Implemented a gRPC service over a three-node Cassandra cluster for NOAA time-series data.",
    "approach": "Model partition and clustering keys around weather queries, with read-consistency fallback when replicas become unavailable.",
    "outcome": "Writes continued during the recorded single-node-loss test. Reads could fall back from two replicas to one.",
    "detail": "Model partition and clustering keys around weather queries, with read-consistency fallback when replicas become unavailable.",
    "sourceIds": [
      "PR08"
    ],
    "href": "https://github.com/V1R4V/Distributed-Weather-Data-System-with-Cassandra"
  },
  {
    "slug": "property-lookup",
    "title": "Distributed Property Lookup Service",
    "category": "Distributed Systems",
    "categories": [
      "Distributed Systems",
      "Fullstack"
    ],
    "featured": false,
    "eyebrow": "Separate LRU caching from the dataset tier and expose response sources alongside retries and backoff.",
    "summary": "Implemented lookup and cache services with two data replicas and three cache replicas.",
    "role": "Lookup and cache service implementation within the course project.",
    "status": "Academic project",
    "stack": [
      "Python",
      "Flask",
      "gRPC",
      "Docker"
    ],
    "image": "/grpc.png",
    "imageAlt": "Distributed Property Lookup Service project image",
    "problem": "Implemented lookup and cache services with two data replicas and three cache replicas.",
    "approach": "Separate LRU caching from the dataset tier and expose response sources alongside retries and backoff.",
    "outcome": "A replicated lookup workflow with inspectable cache hits, misses and failover paths.",
    "detail": "Separate LRU caching from the dataset tier and expose response sources alongside retries and backoff.",
    "sourceIds": [
      "PR09"
    ],
    "href": "https://github.com/V1R4V/Distributed-Property-Lookup-Service"
  },
  {
    "slug": "hdfs-sql",
    "title": "HDFS & SQL Pipeline",
    "category": "Distributed Systems",
    "categories": [
      "Distributed Systems",
      "Data Engineering"
    ],
    "featured": false,
    "eyebrow": "Partition by county code and read selected columns, with a recovery path for DataNode loss.",
    "summary": "Implemented a MySQL-to-HDFS pipeline with gRPC access, Parquet storage and query caching.",
    "role": "Data movement, query service and storage-recovery implementation within the course project.",
    "status": "Academic project",
    "stack": [
      "Python",
      "MySQL",
      "HDFS",
      "gRPC",
      "Parquet",
      "Docker"
    ],
    "image": "/hdfs-sql-pipeline.svg",
    "imageAlt": "Architecture diagram connecting MySQL, a gRPC service and HDFS storage",
    "problem": "Implemented a MySQL-to-HDFS pipeline with gRPC access, Parquet storage and query caching.",
    "approach": "Partition by county code and read selected columns, with a recovery path for DataNode loss.",
    "outcome": "A queryable distributed dataset with cached results and explicit storage-recovery behavior.",
    "detail": "Partition by county code and read selected columns, with a recovery path for DataNode loss.",
    "sourceIds": [
      "PR10"
    ],
    "href": "https://github.com/V1R4V/Data-Pipeline-with-HDFS-SQL-Integration"
  },
  {
    "slug": "spark-analytics",
    "title": "Spark Analytics",
    "category": "Distributed Systems",
    "categories": [
      "Distributed Systems",
      "Data Engineering",
      "ML & AI"
    ],
    "featured": false,
    "eyebrow": "Use compatible bucketing and caching for repeated analysis, keeping query layout part of the performance reasoning.",
    "summary": "Analyzed 8,573 CodeContests problems through Spark RDDs, DataFrames and SQL, with a difficulty model and model-assisted querying.",
    "role": "Spark analysis, query preparation and difficulty-model experimentation.",
    "status": "Academic project",
    "stack": [
      "Python",
      "Spark",
      "Hive",
      "HDFS",
      "MLlib",
      "Gemini"
    ],
    "image": "/spark-analytics-system.svg",
    "imageAlt": "Architecture diagram of Spark processing, SQL and analysis",
    "problem": "Analyzed 8,573 CodeContests problems through Spark RDDs, DataFrames and SQL, with a difficulty model and model-assisted querying.",
    "approach": "Use compatible bucketing and caching for repeated analysis, keeping query layout part of the performance reasoning.",
    "outcome": "A shared dataset explored through multiple Spark APIs, an MLlib regressor and a schema-aware SQL interface.",
    "detail": "Use compatible bucketing and caching for repeated analysis, keeping query layout part of the performance reasoning.",
    "sourceIds": [
      "PR11"
    ],
    "href": "https://github.com/V1R4V/Competitive-Programming-Analytics-with-Apache-Spark"
  },
  {
    "slug": "multi-source-elt",
    "title": "Multi-Source ELT Pipeline",
    "category": "Data Engineering",
    "categories": [
      "Data Engineering"
    ],
    "featured": false,
    "eyebrow": "Use six staging models and point-in-time joins before calculating trade values and profit rates.",
    "summary": "Built an Airbyte, Snowflake and dbt workflow joining survey, trade and price data for desk-level analysis.",
    "role": "Source integration, SQL transformations and analytical modeling.",
    "status": "Academic project",
    "stack": [
      "Airbyte",
      "Snowflake",
      "dbt",
      "SQL"
    ],
    "image": "/snowflake.png",
    "imageAlt": "Multi-Source ELT Pipeline project image",
    "problem": "Built an Airbyte, Snowflake and dbt workflow joining survey, trade and price data for desk-level analysis.",
    "approach": "Use six staging models and point-in-time joins before calculating trade values and profit rates.",
    "outcome": "A fact table with cleaned ticker/date combinations, guarded profit calculations and traceable source transformations.",
    "detail": "Use six staging models and point-in-time joins before calculating trade values and profit rates.",
    "sourceIds": [
      "PR12"
    ],
    "href": "https://github.com/V1R4V/Snowflake-dbt-ELT-Pipeline"
  },
  {
    "slug": "gcp-geospatial",
    "title": "GCP Geospatial Pipeline",
    "category": "Data Engineering",
    "categories": [
      "Data Engineering"
    ],
    "featured": false,
    "eyebrow": "Express spatial joins as dependency-managed SQLX transformations and inspect bytes scanned for query-cost context.",
    "summary": "Built a Cloud Storage-to-Dataform-to-BigQuery workflow relating Wisconsin schools to county geography.",
    "role": "Cloud ingestion, Dataform transformations and spatial SQL analysis.",
    "status": "Academic project",
    "stack": [
      "Google Cloud Storage",
      "Dataform",
      "BigQuery",
      "SQL"
    ],
    "image": "/cinematic/diagrams/gcp-geospatial.svg",
    "imageAlt": "Wisconsin schools in their geographic context — explanatory architecture diagram",
    "problem": "Built a Cloud Storage-to-Dataform-to-BigQuery workflow relating Wisconsin schools to county geography.",
    "approach": "Express spatial joins as dependency-managed SQLX transformations and inspect bytes scanned for query-cost context.",
    "outcome": "Spatially matched 2,116 public schools against 72 county polygons and explored nearest-school questions.",
    "detail": "Express spatial joins as dependency-managed SQLX transformations and inspect bytes scanned for query-cost context.",
    "sourceIds": [
      "PR13"
    ],
    "href": "https://github.com/V1R4V/GCP-BigQuery-Geospatial-Pipeline"
  },
  {
    "slug": "chinook-analytics",
    "title": "Chinook Music Store SQL Analytics",
    "category": "Data Engineering",
    "categories": [
      "Data Engineering"
    ],
    "featured": false,
    "eyebrow": "Keep relational grain and time windows explicit when moving from joins to revenue aggregation.",
    "summary": "Loaded a music-store dataset into Dockerized MySQL and wrote 30 analytical queries.",
    "role": "Database loading, SQL query design and revenue analysis.",
    "status": "Academic project",
    "stack": [
      "MySQL",
      "SQL",
      "SQLAlchemy",
      "Python",
      "Docker"
    ],
    "image": "/chinook.png",
    "imageAlt": "Chinook Music Store SQL Analytics project image",
    "problem": "Loaded a music-store dataset into Dockerized MySQL and wrote 30 analytical queries.",
    "approach": "Keep relational grain and time windows explicit when moving from joins to revenue aggregation.",
    "outcome": "Revenue analysis using correlated subqueries, ranking and a three-month moving average.",
    "detail": "Keep relational grain and time windows explicit when moving from joins to revenue aggregation.",
    "sourceIds": [
      "PR14"
    ],
    "href": "https://github.com/V1R4V/Chinook-SQL-Analytics"
  },
  {
    "slug": "yelp-geospatial",
    "title": "Yelp Geospatial Analytics",
    "category": "Data Engineering",
    "categories": [
      "Data Engineering"
    ],
    "featured": false,
    "eyebrow": "Use a 2dsphere index for containment, nearest-neighbor and radius searches, with map overlays for inspection.",
    "summary": "Implemented 30 MongoDB queries connecting business information with geographic questions.",
    "role": "MongoDB query implementation and geographic visualization.",
    "status": "Academic project",
    "stack": [
      "MongoDB",
      "PyMongo",
      "GeoPandas",
      "Python",
      "Docker"
    ],
    "image": "/yelp.png",
    "imageAlt": "Yelp Geospatial Analytics project image",
    "problem": "Implemented 30 MongoDB queries connecting business information with geographic questions.",
    "approach": "Use a 2dsphere index for containment, nearest-neighbor and radius searches, with map overlays for inspection.",
    "outcome": "Aggregation pipelines and GeoPandas visualizations over Santa Barbara business and boundary data.",
    "detail": "Use a 2dsphere index for containment, nearest-neighbor and radius searches, with map overlays for inspection.",
    "sourceIds": [
      "PR15"
    ],
    "href": "https://github.com/V1R4V/Yelp-MongoDB-Geospatial-Analytics"
  },
  {
    "slug": "semantic-search",
    "title": "E-Commerce Semantic Search Engine",
    "category": "Data Engineering",
    "categories": [
      "Data Engineering",
      "ML & AI"
    ],
    "featured": false,
    "eyebrow": "Separate exact keyword fields from analyzed text and combine availability filters with lexical and vector retrieval.",
    "summary": "Built search and exploratory dashboards over 300+ products across 13 categories.",
    "role": "Search mappings, retrieval queries and Kibana exploration.",
    "status": "Academic project",
    "stack": [
      "Elasticsearch",
      "Kibana",
      "Python",
      "Docker"
    ],
    "image": "/elasticsearch_install.jpg",
    "imageAlt": "E-Commerce Semantic Search Engine project image",
    "problem": "Built search and exploratory dashboards over 300+ products across 13 categories.",
    "approach": "Separate exact keyword fields from analyzed text and combine availability filters with lexical and vector retrieval.",
    "outcome": "A product-search workflow supporting text, fuzzy, phrase and 384-dimensional nearest-neighbor queries.",
    "detail": "Separate exact keyword fields from analyzed text and combine availability filters with lexical and vector retrieval.",
    "sourceIds": [
      "PR16"
    ]
  },
  {
    "slug": "retail-forecasting",
    "title": "Retail Sales Forecasting",
    "category": "ML & AI",
    "categories": [
      "ML & AI",
      "Data Engineering"
    ],
    "featured": false,
    "eyebrow": "Preserve time order with a contiguous validation window and persist feature preparation for repeatable comparisons.",
    "summary": "Combined five Favorita data sources and compared gradient-boosted demand models against Ridge.",
    "role": "Data preparation, feature engineering and model comparison.",
    "status": "Academic experiment",
    "stack": [
      "Python",
      "pandas",
      "XGBoost",
      "LightGBM",
      "CatBoost",
      "Optuna"
    ],
    "image": "/ds.png",
    "imageAlt": "Retail Sales Forecasting project image",
    "problem": "Combined five Favorita data sources and compared gradient-boosted demand models against Ridge.",
    "approach": "Preserve time order with a contiguous validation window and persist feature preparation for repeatable comparisons.",
    "outcome": "XGBoost recorded 0.4841 validation RMSLE versus 0.9884 for Ridge on the July 17–31, 2017 split.",
    "detail": "Preserve time order with a contiguous validation window and persist feature preparation for repeatable comparisons.",
    "sourceIds": [
      "PR17"
    ],
    "href": "https://github.com/V1R4V/Retail-Sales-Forecasting"
  },
  {
    "slug": "agent-tool-graph",
    "title": "AI Agent Tool Dependency Graph",
    "category": "ML & AI",
    "categories": [
      "ML & AI",
      "Fullstack"
    ],
    "featured": false,
    "eyebrow": "Link required inputs to tools that can produce the corresponding entity IDs.",
    "summary": "Built a TypeScript analysis and interactive graph of dependencies across 1,309 Google Workspace and GitHub tool schemas.",
    "role": "TypeScript dependency-analysis workflow and interactive graph.",
    "status": "Hiring-challenge prototype",
    "stack": [
      "TypeScript",
      "Bun",
      "LLM extraction",
      "vis-network"
    ],
    "image": "/cinematic/diagrams/agent-tool-graph.svg",
    "imageAlt": "Making tool dependencies inspectable — explanatory architecture diagram",
    "problem": "Built a TypeScript analysis and interactive graph of dependencies across 1,309 Google Workspace and GitHub tool schemas.",
    "approach": "Link required inputs to tools that can produce the corresponding entity IDs.",
    "outcome": "An inspectable dependency graph for reasoning about tool-call order.",
    "detail": "Link required inputs to tools that can produce the corresponding entity IDs.",
    "sourceIds": [
      "PR18"
    ]
  },
  {
    "slug": "palantir-build",
    "title": "Palantir Foundry and AIP Build Challenge",
    "category": "Data Engineering",
    "categories": [
      "Data Engineering",
      "ML & AI"
    ],
    "featured": false,
    "eyebrow": "Connect cleaned USASpending.gov and SIPRI records with ontology objects and agent questions.",
    "summary": "Prepared public contract data and organized it into a Foundry/AIP demonstration.",
    "role": "Public-data preparation scripts, ontology and agent-prompt design, and demonstration recording.",
    "status": "Hiring-challenge demonstration",
    "stack": [
      "Python",
      "Palantir Foundry",
      "AIP"
    ],
    "image": "/cinematic/diagrams/palantir-build.svg",
    "imageAlt": "From public records to operational questions — explanatory architecture diagram",
    "problem": "Prepared public contract data and organized it into a Foundry/AIP demonstration.",
    "approach": "Connect cleaned USASpending.gov and SIPRI records with ontology objects and agent questions.",
    "outcome": "A demonstrable contract-data workflow with preparation scripts, ontology design and a recorded walkthrough.",
    "detail": "Connect cleaned USASpending.gov and SIPRI records with ontology objects and agent questions.",
    "sourceIds": [
      "PR19"
    ]
  },
  {
    "slug": "studyflow",
    "title": "StudyFlow",
    "category": "Fullstack",
    "categories": [
      "Fullstack"
    ],
    "featured": false,
    "eyebrow": "Combine authenticated Firestore synchronization with local reads so a session history remains useful across connectivity changes.",
    "summary": "Built a study tracker with stopwatch and Pomodoro modes, subject management and editable session history.",
    "role": "Tracker interface, session logic, data persistence and analytical views.",
    "status": "Personal project · deployed application",
    "stack": [
      "React",
      "Vite",
      "Firestore",
      "Recharts",
      "localStorage"
    ],
    "image": "/cinematic/studyflow.webp",
    "imageAlt": "StudyFlow study-session dashboard",
    "problem": "Built a study tracker with stopwatch and Pomodoro modes, subject management and editable session history.",
    "approach": "Combine authenticated Firestore synchronization with local reads so a session history remains useful across connectivity changes.",
    "outcome": "A study dashboard with daily totals, weekly trends and calendar-heatmap exploration.",
    "detail": "Combine authenticated Firestore synchronization with local reads so a session history remains useful across connectivity changes.",
    "sourceIds": [
      "PR20"
    ],
    "href": "https://github.com/V1R4V/StudyFlow"
  },
  {
    "slug": "habit-command-center",
    "title": "Habit Command Center",
    "category": "Fullstack",
    "categories": [
      "Fullstack"
    ],
    "featured": false,
    "eyebrow": "Keep planning, execution and review in one data model, with JSON export for portability.",
    "summary": "Built a weekly-planning dashboard that connects habits, daily logs, tasks and weighted grades.",
    "role": "Planning interface, task/log workflows and weighted scoring.",
    "status": "Personal project · private-use dashboard",
    "stack": [
      "Next.js",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Recharts"
    ],
    "image": "/cinematic/habit-command-center.webp",
    "imageAlt": "Habit Command Center planning dashboard",
    "problem": "Built a weekly-planning dashboard that connects habits, daily logs, tasks and weighted grades.",
    "approach": "Keep planning, execution and review in one data model, with JSON export for portability.",
    "outcome": "Daily, weekly and monthly views backed by Supabase authentication and Postgres.",
    "detail": "Keep planning, execution and review in one data model, with JSON export for portability.",
    "sourceIds": [
      "PR21"
    ],
    "href": "https://github.com/V1R4V/HabitTracker"
  },
  {
    "slug": "react-web-mobile",
    "title": "React Web & Mobile",
    "category": "Fullstack",
    "categories": [
      "Fullstack"
    ],
    "featured": false,
    "eyebrow": "Separate navigation, data access and interface state, with secure token storage in the mobile chat app.",
    "summary": "Built four React web applications and three Expo/mobile applications covering chat, news, shopping and tool-assisted conversation.",
    "role": "Web and mobile application implementations across the recorded suite.",
    "status": "Personal portfolio suite · coursework-built applications",
    "stack": [
      "React",
      "React Router",
      "React Native",
      "Expo",
      "React Navigation",
      "SecureStore"
    ],
    "image": "/cinematic/diagrams/react-web-mobile.svg",
    "imageAlt": "Interfaces across web and mobile — explanatory architecture diagram",
    "problem": "Built four React web applications and three Expo/mobile applications covering chat, news, shopping and tool-assisted conversation.",
    "approach": "Separate navigation, data access and interface state, with secure token storage in the mobile chat app.",
    "outcome": "Seven applications exploring web/mobile interaction, including an agent with seven tools.",
    "detail": "Separate navigation, data access and interface state, with secure token storage in the mobile chat app.",
    "sourceIds": [
      "PR22"
    ],
    "href": "https://github.com/V1R4V/React-Web-and-Mobile-Apps"
  },
  {
    "slug": "startup-scout",
    "title": "Startup Scout",
    "category": "Fullstack",
    "categories": [
      "Fullstack",
      "Data Engineering"
    ],
    "featured": false,
    "eyebrow": "Connect parsed company data with funding and valuation views so profiles can be compared.",
    "summary": "Built startup-discovery filtering and visual exploration over 1,000+ company profiles.",
    "role": "Startup-discovery interface and company-data exploration within the hackathon project.",
    "status": "Personal hackathon project",
    "stack": [
      "React",
      "TypeScript",
      "SQLite",
      "Python",
      "Firecrawl",
      "Recharts"
    ],
    "image": "/sscout.jpg",
    "imageAlt": "Startup Scout project image",
    "problem": "Built startup-discovery filtering and visual exploration over 1,000+ company profiles.",
    "approach": "Connect parsed company data with funding and valuation views so profiles can be compared.",
    "outcome": "An investor/startup-discovery prototype with searchable profiles and analytical charts.",
    "detail": "Connect parsed company data with funding and valuation views so profiles can be compared.",
    "sourceIds": [
      "PR23"
    ],
    "href": "https://github.com/V1R4V/Startupscout"
  },
  {
    "slug": "recipe-planner",
    "title": "Inventory-Based Recipe Planner",
    "category": "Fullstack",
    "categories": [
      "Fullstack"
    ],
    "featured": false,
    "eyebrow": "Carry a recipe choice into saved favorites and grocery-list workflows rather than ending at search results.",
    "summary": "Built an inventory-aware planner connecting available ingredients and dietary constraints with recipe choices.",
    "role": "Inventory, recipe discovery and planning workflows.",
    "status": "Personal project",
    "stack": [
      "React",
      "Next.js",
      "TypeScript",
      "recipe APIs"
    ],
    "image": "/recipepal.png",
    "imageAlt": "Inventory-Based Recipe Planner project image",
    "problem": "Built an inventory-aware planner connecting available ingredients and dietary constraints with recipe choices.",
    "approach": "Carry a recipe choice into saved favorites and grocery-list workflows rather than ending at search results.",
    "outcome": "A recipe-planning interface with barcode and receipt flows and access to an API catalogue of 10,000+ recipes.",
    "detail": "Carry a recipe choice into saved favorites and grocery-list workflows rather than ending at search results.",
    "sourceIds": [
      "PR24"
    ]
  },
  {
    "slug": "concurrent-wordcount",
    "title": "Concurrent Word Count",
    "category": "Data Engineering",
    "categories": [
      "Data Engineering"
    ],
    "featured": false,
    "eyebrow": "Compare synchronization and output formats under explicitly chosen Python runtime conditions.",
    "summary": "Implemented configurable thread-pool processing and benchmark reporting for word-count workloads.",
    "role": "Thread-pool processing, synchronization and benchmark tooling within the course project.",
    "status": "Academic benchmark project",
    "stack": [
      "Python 3.13",
      "threading",
      "Parquet",
      "Apache Arrow"
    ],
    "image": "/concurrent-wordcount-benchmark.svg",
    "imageAlt": "Concurrent Word Count and Performance Benchmarking project image",
    "problem": "Implemented configurable thread-pool processing and benchmark reporting for word-count workloads.",
    "approach": "Compare synchronization and output formats under explicitly chosen Python runtime conditions.",
    "outcome": "A benchmark harness for CSV, Parquet and Arrow, including GIL and no-GIL comparisons.",
    "detail": "Compare synchronization and output formats under explicitly chosen Python runtime conditions.",
    "sourceIds": [
      "PR25"
    ],
    "href": "https://github.com/V1R4V/Concurrent-Word-Count-Performance-Benchmarking-System"
  },
  {
    "slug": "algorithm-design",
    "title": "Algorithm Design",
    "category": "Computing Foundations",
    "categories": [
      "Computing Foundations"
    ],
    "featured": false,
    "eyebrow": "Match each data structure to its information assumptions, including future-access knowledge for Belady’s policy.",
    "summary": "Implemented graph traversal, offline cache eviction and inversion counting as separate algorithm exercises.",
    "role": "Algorithm implementation and complexity analysis.",
    "status": "Academic foundations exercises",
    "stack": [
      "Python",
      "graphs",
      "Fenwick trees"
    ],
    "image": "/cinematic/diagrams/algorithm-design.svg",
    "imageAlt": "Data structures matched to their assumptions — explanatory architecture diagram",
    "problem": "Implemented graph traversal, offline cache eviction and inversion counting as separate algorithm exercises.",
    "approach": "Match each data structure to its information assumptions, including future-access knowledge for Belady’s policy.",
    "outcome": "Iterative DFS in O(V+E), furthest-in-future eviction and Fenwick-tree inversion counting.",
    "detail": "Match each data structure to its information assumptions, including future-access knowledge for Belady’s policy.",
    "sourceIds": [
      "PR26"
    ],
    "href": "https://github.com/V1R4V/Algorithm-Design-Python"
  },
  {
    "slug": "campus-navigator",
    "title": "Campus Navigator",
    "category": "Fullstack",
    "categories": [
      "Fullstack"
    ],
    "featured": false,
    "eyebrow": "Represent travel as a weighted graph and separate shortest-path computation from the HTML interface.",
    "summary": "Built a Java route-query application over 160+ UW-Madison locations.",
    "role": "Graph-based route queries and application integration within the course project.",
    "status": "Academic project",
    "stack": [
      "Java",
      "Dijkstra",
      "weighted graphs",
      "HTML"
    ],
    "image": "/Campus.png",
    "imageAlt": "Campus Navigator project image",
    "problem": "Built a Java route-query application over 160+ UW-Madison locations.",
    "approach": "Represent travel as a weighted graph and separate shortest-path computation from the HTML interface.",
    "outcome": "Dijkstra routes, travel-time output and queries for the ten closest destinations.",
    "detail": "Represent travel as a weighted graph and separate shortest-path computation from the HTML interface.",
    "sourceIds": [
      "PR27"
    ],
    "href": "https://github.com/V1R4V/CampusNavigator"
  },
  {
    "slug": "i-songly",
    "title": "i-Songly",
    "category": "Fullstack",
    "categories": [
      "Fullstack"
    ],
    "featured": false,
    "eyebrow": "Separate the CLI, query logic and self-balancing tree through object-oriented interfaces.",
    "summary": "Implemented ordered song storage and filtering behind a command-line interface.",
    "role": "Tree-based song-query implementation within the course project.",
    "status": "Academic project",
    "stack": [
      "Java",
      "red-black trees",
      "comparators",
      "CLI"
    ],
    "image": "/isongly.png",
    "imageAlt": "i-Songly: Song Management Engine project image",
    "problem": "Implemented ordered song storage and filtering behind a command-line interface.",
    "approach": "Separate the CLI, query logic and self-balancing tree through object-oriented interfaces.",
    "outcome": "Insertion, ordered search and energy-range queries over a song catalogue.",
    "detail": "Separate the CLI, query logic and self-balancing tree through object-oriented interfaces.",
    "sourceIds": [
      "PR28"
    ],
    "href": "https://github.com/V1R4V/iSongLy"
  },
  {
    "slug": "cifar100-lenet",
    "title": "CIFAR-100 with LeNet",
    "category": "ML & AI",
    "categories": [
      "ML & AI"
    ],
    "featured": false,
    "eyebrow": "Save the best model and support resuming training so experimentation does not depend on one uninterrupted run.",
    "summary": "Implemented a LeNet-style classifier for 100 image classes, including training and per-epoch evaluation.",
    "role": "Network, training loop, evaluation and checkpoint handling.",
    "status": "Academic experiment",
    "stack": [
      "PyTorch",
      "Python",
      "CIFAR-100"
    ],
    "image": "/cinematic/diagrams/cifar100-lenet.svg",
    "imageAlt": "An experiment that can resume — explanatory architecture diagram",
    "problem": "Implemented a LeNet-style classifier for 100 image classes, including training and per-epoch evaluation.",
    "approach": "Save the best model and support resuming training so experimentation does not depend on one uninterrupted run.",
    "outcome": "A roughly 151,000-parameter model with checkpointed SGD/momentum training.",
    "detail": "Save the best model and support resuming training so experimentation does not depend on one uninterrupted run.",
    "sourceIds": [
      "PR29"
    ],
    "href": "https://github.com/V1R4V/CIFAR100-LeNet-PyTorch"
  },
  {
    "slug": "fashion-mnist",
    "title": "Fashion-MNIST Classifier",
    "category": "ML & AI",
    "categories": [
      "ML & AI"
    ],
    "featured": false,
    "eyebrow": "Expose top-three Softmax probabilities alongside the predicted class.",
    "summary": "Implemented a PyTorch training and evaluation pipeline for clothing-image classification.",
    "role": "Preprocessing, training, evaluation and probability output.",
    "status": "Academic experiment",
    "stack": [
      "PyTorch",
      "Python",
      "SGD",
      "cross-entropy"
    ],
    "image": "/fashionmnist-pytorch.svg",
    "imageAlt": "Fashion-MNIST Neural Network Classifier project image",
    "problem": "Implemented a PyTorch training and evaluation pipeline for clothing-image classification.",
    "approach": "Expose top-three Softmax probabilities alongside the predicted class.",
    "outcome": "The recorded course experiment exceeded 85% accuracy within five epochs.",
    "detail": "Expose top-three Softmax probabilities alongside the predicted class.",
    "sourceIds": [
      "PR30"
    ],
    "href": "https://github.com/V1R4V/FashionMNIST-PyTorch-CNN"
  },
  {
    "slug": "pca-eigenfaces",
    "title": "PCA Eigenfaces",
    "category": "ML & AI",
    "categories": [
      "ML & AI"
    ],
    "featured": false,
    "eyebrow": "Explore how retained components trade representation size against reconstructed image detail.",
    "summary": "Implemented PCA over 1,000 celebrity images represented by 3,000-dimensional vectors.",
    "role": "PCA, reconstruction and perturbation analysis.",
    "status": "Academic experiment",
    "stack": [
      "Python",
      "NumPy",
      "SciPy"
    ],
    "image": "/f1.png",
    "imageAlt": "PCA Eigenfaces and Image Reconstruction project image",
    "problem": "Implemented PCA over 1,000 celebrity images represented by 3,000-dimensional vectors.",
    "approach": "Explore how retained components trade representation size against reconstructed image detail.",
    "outcome": "Eigenface visualizations, lower-dimensional reconstructions and noise-perturbation analysis.",
    "detail": "Explore how retained components trade representation size against reconstructed image detail.",
    "sourceIds": [
      "PR31"
    ],
    "href": "https://github.com/V1R4V/image_compression_pca"
  },
  {
    "slug": "lake-mendota",
    "title": "Lake Mendota Ice Regression",
    "category": "ML & AI",
    "categories": [
      "ML & AI",
      "Data Engineering"
    ],
    "featured": false,
    "eyebrow": "Compare the same objective through closed-form and iterative optimization.",
    "summary": "Implemented regression with NumPy using both an analytical solution and gradient descent.",
    "role": "Closed-form and gradient-descent regression implementations.",
    "status": "Academic foundations exercise",
    "stack": [
      "Python",
      "NumPy",
      "linear regression"
    ],
    "image": "/cinematic/diagrams/lake-mendota.svg",
    "imageAlt": "Two routes to the same regression objective — explanatory architecture diagram",
    "problem": "Implemented regression with NumPy using both an analytical solution and gradient descent.",
    "approach": "Compare the same objective through closed-form and iterative optimization.",
    "outcome": "A compact implementation for examining fitted relationships and optimization behavior.",
    "detail": "Compare the same objective through closed-form and iterative optimization.",
    "sourceIds": [
      "PR32"
    ],
    "href": "https://github.com/V1R4V/Lake-Mendota-Ice-Regression"
  },
  {
    "slug": "bayesian-language",
    "title": "Bayesian Language Detection",
    "category": "ML & AI",
    "categories": [
      "ML & AI"
    ],
    "featured": false,
    "eyebrow": "Convert observed letter counts into posterior scores through Bayes’ rule.",
    "summary": "Implemented English-versus-Spanish inference from character-frequency evidence.",
    "role": "Character-count evidence and posterior-probability implementation.",
    "status": "Academic foundations exercise",
    "stack": [
      "Python",
      "Bayesian inference"
    ],
    "image": "/bayesian-language-detection.svg",
    "imageAlt": "Bayesian Language Detection project image",
    "problem": "Implemented English-versus-Spanish inference from character-frequency evidence.",
    "approach": "Convert observed letter counts into posterior scores through Bayes’ rule.",
    "outcome": "A transparent probability-based classification pipeline.",
    "detail": "Convert observed letter counts into posterior scores through Bayes’ rule.",
    "sourceIds": [
      "PR33"
    ],
    "href": "https://github.com/V1R4V/language_detection"
  }
]

export const experiences: Experience[] = [
  {
    "slug": "vdart",
    "org": "VDart Inc.",
    "role": "Software Engineering Intern",
    "period": "May–August 2025",
    "mark": "VDART",
    "summary": "An internal proposal tool that made approved company knowledge easier to find and reuse.",
    "detail": "Brought RFI/RFP first-draft preparation from about two weeks to under 24 hours through a production-ready RAG application I independently built with the BI team’s input. The recorded workflow supported roughly 3× proposal capacity.",
    "bullets": [
      "Brought RFI/RFP first-draft preparation from about two weeks to under 24 hours through a production-ready RAG application I independently built with the BI team’s input. The recorded workflow supported roughly 3× proposal capacity.",
      "Built the React interface, FastAPI backend, document ingestion and retrieval. Inspecting incomplete answers led me to preserve whole historical Q&A pairs, keeping the question’s context attached to the evidence.",
      "Delivered the application through BI and technical review. The team deployed it after my internship, with later production use confirmed across 50+ internal BI users."
    ],
    "sourceIds": [
      "E01",
      "E02",
      "E03",
      "E04"
    ],
    "logo": "/company-logos/vdart.png"
  },
  {
    "slug": "darukaa",
    "org": "Darukaa.Earth",
    "role": "Software Engineer Intern, Platform",
    "period": "May–July 2026",
    "mark": "EARTH",
    "summary": "Biodiversity infrastructure connecting field recordings, batch inference and results researchers could use.",
    "detail": "Increased audio-inference throughput 8–10× in the recorded batch comparison by moving synchronous Vertex AI calls to Batch Prediction. I led the batch-upload and inference implementation under senior engineering supervision.",
    "bullets": [
      "Increased audio-inference throughput 8–10× in the recorded batch comparison by moving synchronous Vertex AI calls to Batch Prediction. I led the batch-upload and inference implementation under senior engineering supervision.",
      "Built FastAPI and asynchronous database orchestration for 500-file batches, preserving source-file IDs and spatial metadata through submission, output reconciliation and result delivery. Per-file isolation kept one corrupt upload from aborting the rest.",
      "Validated the upload-to-result path across 500 test files and covered orchestration with 15 unit tests. Decoupled long-running processing from interactive requests and integrated authenticated completion callbacks."
    ],
    "sourceIds": [
      "E05",
      "E06",
      "E07"
    ]
  },
  {
    "slug": "people-robots",
    "org": "UW-Madison People & Robots Lab",
    "role": "Undergraduate Research Assistant",
    "period": "January 2026–present",
    "mark": "UW",
    "summary": "Android research software helping adults with intellectual and developmental disabilities understand security and privacy events.",
    "detail": "Lead code implementation of a Kotlin overlay that brings screen context and structured Gemini output into concise guidance within the app a person is using. The PI leads research and design.",
    "bullets": [
      "Lead code implementation of a Kotlin overlay that brings screen context and structured Gemini output into concise guidance within the app a person is using. The PI leads research and design.",
      "Reworked an explanation-heavy prototype after advisor feedback, moving toward a clear warning, one recommended action and an optional explanation. The revision made recognizing the risk the first step in the interaction.",
      "Resolved permission-dialog detection by inspecting Android’s available accessibility windows, excluding the assistant’s overlay and identifying the permission-controller window."
    ],
    "sourceIds": [
      "E08",
      "E09",
      "E10"
    ],
    "logo": "/company-logos/wisc.png"
  },
  {
    "slug": "cornell-acert",
    "org": "Cornell University, ACERT",
    "role": "Undergraduate Research Intern",
    "period": "July 8–August 15, 2026",
    "mark": "ACERT",
    "summary": "Commercialization analysis for a portable electron-spin-resonance drug-identification technology.",
    "detail": "Assessed five priority customer segments using government data, procurement records, equipment prices and testing-volume context to develop market estimates and identify practical entry points.",
    "bullets": [
      "Assessed five priority customer segments using government data, procurement records, equipment prices and testing-volume context to develop market estimates and identify practical entry points.",
      "Benchmarked four competing technology families, including Raman, FTIR, portable mass spectrometry and ion mobility. Compared customer need, purchasing capacity, workflows and procurement complexity to inform go-to-market priorities.",
      "Synthesized market, pricing, patent, licensing and sponsored-research findings into slide decks and recommendations, giving the research team a clearer basis for commercialization discussions."
    ],
    "sourceIds": [
      "E11"
    ]
  },
  {
    "slug": "ssim",
    "org": "Continuing SSIM collaboration",
    "role": "Video-fingerprinting research collaboration",
    "period": "ongoing",
    "mark": "SSIM",
    "summary": "Repeatable transformation tooling and controlled experiments on video-fingerprint comparisons.",
    "detail": "Built transformation tooling across two phases, spanning resolution, encoding, timing, cropping, noise, color, watermarks and white-padding/reframing experiments, followed by emoji, subtitle and frame-effect protocols.",
    "bullets": [
      "Built transformation tooling across two phases, spanning resolution, encoding, timing, cropping, noise, color, watermarks and white-padding/reframing experiments, followed by emoji, subtitle and frame-effect protocols.",
      "Created an earlier controlled benchmark of 25 source videos, 75 variants and 1,875 pair comparisons. Common-resolution preprocessing reduced median Hamming error on 720p copies from 0.225 to 0.025 in that exploratory, in-sample experiment.",
      "Made runs traceable through manifests, parameters and validation records. A later protocol demonstration generated 30 outputs from six sources, keeping transformation correctness checks separate from fingerprint-matching results."
    ],
    "sourceIds": [
      "E12",
      "E13"
    ]
  },
  {
    "slug": "cs574",
    "org": "UW-Madison, CS 574: Data Management for Data Science",
    "role": "Peer Mentor",
    "period": "Fall 2026",
    "mark": "CS 574",
    "summary": "Course infrastructure, assignment quality and technical explanations for approximately 140 students per project.",
    "detail": "Adapted and ran provisioning for 434 private GitLab repositories across three project releases, handling starter material, access and project organization. Diagnosed approximately 31 protected-branch restrictions and wrote a reusable repair script to restore submission access.",
    "bullets": [
      "Adapted and ran provisioning for 434 private GitLab repositories across three project releases, handling starter material, access and project organization. Diagnosed approximately 31 protected-branch restrictions and wrote a reusable repair script to restore submission access.",
      "Independently built a score-export tool that consolidated submission status and autograder results into a staff CSV. It distinguished real submissions from initialization activity, giving the teaching team cleaner evidence for follow-up.",
      "Recorded four Kibana walkthrough sets adopted as grading references, tested assignments from the student’s perspective and contributed three adopted fixes to the Airbyte/Snowflake/dbt handout. Office hours connected those systems with explanations students could use."
    ],
    "sourceIds": [
      "E14",
      "E15"
    ],
    "logo": "/company-logos/wisc.png"
  },
  {
    "slug": "pinkcity",
    "org": "Pink City Expressways",
    "role": "Software Development Intern",
    "period": "January 2022–March 2023",
    "mark": "PCE",
    "summary": "Earlier software work supporting logistics relationships and resource allocation.",
    "detail": "Built a Python/SQL CRM for 30+ business leads, organizing lead, contractor and partnership records into a queryable workflow for follow-up.",
    "bullets": [
      "Built a Python/SQL CRM for 30+ business leads, organizing lead, contractor and partnership records into a queryable workflow for follow-up.",
      "Implemented contractor-allocation tooling to match machinery availability with operational demand, alongside a responsive business website."
    ],
    "sourceIds": [
      "E16"
    ],
    "logo": "/company-logos/pinkcity.gif"
  },
  {
    "slug": "science-centre",
    "org": "National Science Centre, New Delhi",
    "role": "Summer Intern",
    "period": "three summer placements, 2017–2019",
    "mark": "NSC",
    "summary": "Early exposure to astrophysics, robotics and circuit design.",
    "detail": "Explored scientific and engineering topics across three summer placements, establishing an early foundation for later computing projects.",
    "bullets": [
      "Explored scientific and engineering topics across three summer placements, establishing an early foundation for later computing projects."
    ],
    "sourceIds": [
      "E18"
    ]
  }
]

export const leadership: Leadership[] = [
  {
    "org": "Recreation and Wellbeing, UW-Madison",
    "role": "Intramural Sports Lead",
    "heading": "Better-prepared officials. A better experience for players.",
    "summary": "Staffing, scheduling, training and on-site coordination across 50+ programs, involving 250+ referees cumulatively over two years.",
    "scope": "Staffing, scheduling, training and on-site coordination across 50+ programs, involving 250+ referees cumulatively over two years.",
    "bullets": [
      "Introduced station-based field clinics so officials could practice rule knowledge, positioning, communication and difficult game situations separately. Pre-playoff staff check-ins improved coordination and preparation before higher-stakes games.",
      "Used Green/Yellow/Red readiness tracking to guide assignments and targeted feedback, making the next development step clearer for each official. Led 10–15 staff during high-volume programming windows, balancing individual support with decisions that could not wait.",
      "Used participant surveys to identify demand and launch cricket and pickleball leagues. Across the broader program work, recorded outcomes included 30% higher participation and 35% higher satisfaction, connecting staff development and program decisions with the experience participants received."
    ],
    "sourceIds": [
      "L01",
      "L02",
      "L03",
      "L04",
      "L05"
    ],
    "period": "November 2025–present",
    "previousRole": "Intramural Sports Supervisor · September 2023–October 2025"
  },
  {
    "org": "Badger VC",
    "role": "Vice President of External Relations",
    "heading": "Building a venture community that learns together",
    "summary": "Founder relationships, practitioner engagement and a connected series of venture events.",
    "scope": "Founder relationships, practitioner engagement and a connected series of venture events.",
    "bullets": [
      "Built relationships with 20+ student founders and coordinated 15+ venture events, bringing founders, industry partners and investment professionals into the student venture community.",
      "Brought venture-capital managing partners into the speaker series and organized events to build on one another, connecting practitioners’ experiences with due diligence, venture-capital concepts and VC math.",
      "Coordinated speaker relationships, follow-up and event logistics around what members could learn and apply, giving the series a progression beyond individual guest talks."
    ],
    "sourceIds": [
      "L06",
      "L07"
    ]
  },
  {
    "org": "Strato VC",
    "role": "Investment Analyst",
    "heading": "Testing the business behind the pitch",
    "summary": "Market, financial, competitive and technical diligence supporting investment decisions.",
    "scope": "Market, financial, competitive and technical diligence supporting investment decisions.",
    "bullets": [
      "Analyzed 10+ startups per quarter, using PitchBook, company financials and competitive research to test market opportunity and business assumptions.",
      "Developed investment memos that connected market evidence with financial projections, product architecture and technical roadmaps, giving the investment team a clearer view of the case and its risks."
    ],
    "sourceIds": [
      "L08"
    ]
  },
  {
    "org": "DapperFits",
    "role": "Founder",
    "heading": "Owning the product beyond the design",
    "summary": "A custom-apparel business spanning design, marketing, suppliers and fulfillment.",
    "scope": "A custom-apparel business spanning design, marketing, suppliers and fulfillment.",
    "bullets": [
      "Founded the brand and led a five-person team across design, marketing and fulfillment, generating 600+ apparel sales.",
      "Coordinated product drops, supplier decisions and customer feedback so designs could move from a mockup to a delivered product. The work connected creative decisions with acquisition, delivery and repeat business."
    ],
    "sourceIds": [
      "E17"
    ],
    "period": "June 2022–June 2023"
  },
  {
    "org": "Earlier school sports leadership",
    "role": "Sports events and coaching",
    "heading": "Earlier school sports leadership",
    "summary": "Coordinated sports events for 900+ students and contributed to facilities planning, extending responsibility beyond the team on the field.",
    "scope": "",
    "bullets": [
      "Coordinated sports events for 900+ students and contributed to facilities planning, extending responsibility beyond the team on the field.",
      "Coached a junior soccer team to its first title, combining skill development with preparation for competition."
    ],
    "sourceIds": [
      "L09"
    ],
    "period": "April 2021–August 2022"
  }
]
