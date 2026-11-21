// Public-facing copy approved for integration in docs/portfolio/copy.md.
// Source IDs are opaque review identifiers. Private evidence and paths stay out of runtime data.

export type ImpactMetric = { value: string; label: string; context?: string }

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
  imageCaption?: string
  href?: string
  demo?: string
  problem: string
  approach: string
  outcome: string
  detail: string
  sourceIds: string[]
  metrics?: ImpactMetric[]
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
  metrics?: ImpactMetric[]
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
  metrics?: ImpactMetric[]
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
    "eyebrow": "Traceable observations, from upload to human review",
    "summary": "Turned camera-trap images into traceable species observations through an asynchronous upload, inference and human-review workflow, with retry-safe records and visible job states.",
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
  ,
    "metrics": [
      {
        "value": "100 jobs",
        "label": "Queue backpressure threshold",
        "context": "The API rejects excess queued work before processing is overloaded."
      },
      {
        "value": "Top 5",
        "label": "Prediction context retained",
        "context": "Alternatives accompany confidence and the source image."
      }
    ]
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
    "eyebrow": "Offline classification and follow-up explanations",
    "summary": "Enabled offline lesion classification and follow-up explanations by building the ONNX classification API and local LLM service within a three-person team prototype.",
    "role": "ONNX classification service and local LLM-serving layer. Teammates built the frontend, segmentation and orchestration.",
    "status": "Team hackathon prototype · exploratory skin-lesion analysis",
    "stack": [
      "Python",
      "FastAPI",
      "ONNX Runtime",
      "Ollama",
      "Qwen2.5-3B"
    ],
    "image": "/cinematic/projects/dermanet-analysis.webp",
    "imageAlt": "DermaNet hackathon prototype showing classification output and a generated explanation",
    "problem": "An image classifier returns probabilities, but a person still needs help interpreting the result. In a three-person team, I built the classification API and local language-model service for an offline skin-lesion analysis prototype with summaries and follow-up questions.",
    "approach": "The classification endpoint exposes ONNX inference through FastAPI. A separate OpenAI-compatible service wraps Ollama and Qwen2.5-3B, with a Python client and CLI for testing the conversation flow. Keeping model serving behind a defined API let the team connect image analysis and language generation while developing the services independently.",
    "outcome": "Classification and local conversation services integrated into the team’s image-to-summary prototype.",
    "detail": "Use a local model behind an OpenAI-compatible interface so the explanation service fits into the wider application.",
    "sourceIds": [
      "PR02"
    ],
    "href": "https://github.com/quincysorrentino/MadData2026"
  ,
    "metrics": [
      {
        "value": "2 services",
        "label": "My implementation",
        "context": "Classification API and local LLM serving within a 3-person team."
      }
    ]
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
    "eyebrow": "Public proof of the retrieval workflow behind VDart",
    "summary": "Demonstrates the retrieval workflow behind my VDart application, where first-draft preparation fell from about two weeks to under 24 hours. I adapted the public version to exclude confidential assets.",
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
    "image": "/cinematic/projects/private-data-rag-concept.webp",
    "imageAlt": "AI-generated concept illustration of source documents connected to retrieved evidence and an answer",
    "imageCaption": "Concept illustration · command-line retrieval pipeline",
    "problem": "A public adaptation of my enterprise proposal work, showing how document structure, retrieval and generation fit together. It demonstrates the workflow with confidential company material excluded.",
    "approach": "Docling converts documents for ingestion, Sentence-Transformers embeds the retrieval units, and ChromaDB stores them for similarity search. A CLI supports questions through local Ollama or Hugging Face model paths. The important decision is what enters retrieval: preserving a complete question-and-answer pair keeps the business context attached to the answer.",
    "outcome": "An inspectable document-to-answer demonstration. The enterprise workflow’s adoption and turnaround results appear under VDart.",
    "detail": "Preserve meaningful document units before embedding rather than treating chunk size as the only retrieval choice.",
    "sourceIds": [
      "PR03"
    ],
    "href": "https://github.com/V1R4V/rag-for-private_data"
  ,
    "metrics": [
      {
        "value": "Under 24 hours",
        "label": "Original VDart workflow",
        "context": "From about 2 weeks for enterprise first-draft preparation. This public demo is a sanitized adaptation."
      }
    ]
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
    "eyebrow": "Earlier inspection signals, tested on synthetic failures",
    "summary": "Flagged all five planted failures 6–9 days ahead in an interim synthetic backtest, with two false-alarm days. I built the risk, forecast and agent backend within the campus-maintenance team prototype.",
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
    "image": "/cinematic/projects/before-it-breaks-overview.webp",
    "imageAlt": "Before It Breaks dashboard separating real weather from synthetic equipment telemetry and estimated costs",
    "problem": "Facilities teams need to know which asset deserves attention and why. I built the risk, forecast and agent backend for a team prototype that combines weather-adjusted baselines with equipment signals, ranks inspection priorities and drafts work orders for human approval.",
    "approach": "Four forecasting methods compare calibrated risk, logistic classification, Monte Carlo risk drift and an age-based Weibull baseline over 7-, 14- and 30-day horizons. I also defined backend contracts and integrated the forecasts into the application. The energy baseline declines to extrapolate beyond its fitted temperature range, avoiding misleading alerts when the weather changes.",
    "outcome": "In the saved interim backtest, all five planted failures were flagged 6–9 days ahead, with two false-alarm days at the tested threshold. That experiment used synthetic sensor and failure data alongside real weather records.",
    "detail": "Make model disagreement visible and retain human approval between a recommendation and a work order.",
    "sourceIds": [
      "PR04"
    ],
    "href": "https://github.com/V1R4V/CampusReliability_HVAC-R"
  ,
    "metrics": [
      {
        "value": "6–9 days",
        "label": "Warning before planted failures",
        "context": "All 5 planted failures in the interim synthetic backtest."
      },
      {
        "value": "2 days",
        "label": "False-alarm days",
        "context": "At threshold 3.0 on that synthetic sensor/failure seed."
      }
    ]
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
    "eyebrow": "Stream-to-storage recovery with explicit checkpoints",
    "summary": "Made stream recovery inspectable through saved partition offsets and predictable batch files, carrying typed, simulated stock records from Kafka into HDFS and Parquet.",
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
    "eyebrow": "A spending view that separates everyday activity from large obligations",
    "summary": "Made everyday spending easier to interpret by separating it from tuition, funding and settlements. I built the personal finance app around integer-cent calculations, quarantined imports and a recorded 84-test suite.",
    "role": "Product framing, React/TypeScript application, financial calculations, import handling and visualizations.",
    "status": "Personal project · own-use application",
    "stack": [
      "React",
      "TypeScript",
      "Firestore",
      "SVG"
    ],
    "image": "/cinematic/projects/vyaya-dashboard.webp",
    "imageAlt": "Vyaya dashboard with clearly labeled synthetic demonstration data",
    "problem": "Tuition, family funding and repayments made a single spending total difficult to interpret. I built Vyaya to separate everyday activity from large obligations and settlements, so a monthly comparison answers the question I actually care about.",
    "approach": "Amounts use integer cents. Unrecognized imports are quarantined for review, and comparisons use equivalent elapsed periods rather than comparing an unfinished month with a complete one. Custom SVG charts expose those distinctions without combining unrelated money movements.",
    "outcome": "A personal-use finance application with separate activity lanes and a recorded 84-test suite.",
    "detail": "Define the meaning of a transaction before aggregating it.",
    "sourceIds": [
      "PR06"
    ]
  ,
    "metrics": [
      {
        "value": "84",
        "label": "Recorded tests",
        "context": "Recorded project test suite."
      },
      {
        "value": "3",
        "label": "Activity lanes",
        "context": "Everyday spending, obligations and funding, and settlements."
      }
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
    "eyebrow": "Comparing model adaptation with source-grounded retrieval",
    "summary": "Reduced held-out language-model perplexity from 48.85 to 2.49 through LoRA adaptation, alongside a separate retrieval workflow over 23 lecture transcripts.",
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
  ,
    "metrics": [
      {
        "value": "48.85 → 2.49",
        "label": "Held-out perplexity",
        "context": "LoRA adaptation on held-out project material."
      }
    ]
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
    "eyebrow": "Weather queries through a tested node failure",
    "summary": "Kept writes available during the tested loss of one Cassandra node, with read-consistency fallback in a three-node NOAA weather-data service.",
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
    "eyebrow": "Replicated lookups with visible cache and fallback behavior",
    "summary": "Made property lookups inspectable across two data replicas and three cache replicas, using LRU caching, source-tagged responses and retry backoff.",
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
    "eyebrow": "Queryable distributed data with storage recovery",
    "summary": "Made MySQL data queryable as partitioned Parquet in HDFS, with caching, selective column reads and a recovery path for DataNode loss.",
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
    "eyebrow": "From programming-problem records to reusable analysis",
    "summary": "Turned 8,573 programming problems into a queryable Spark dataset, with cached analysis, difficulty modeling and schema-aware model-assisted SQL.",
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
    "eyebrow": "A fact table whose joins preserve the meaning of a trade",
    "summary": "Produced a trade-analysis fact table by cleaning three source types through six dbt staging models, with point-in-time price joins and guarded profit calculations.",
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
    "eyebrow": "Spatial answers over 2,116 schools and 72 counties",
    "summary": "Matched 2,116 Wisconsin schools to 72 county polygons through a dependency-managed Cloud Storage, Dataform and BigQuery pipeline.",
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
    "eyebrow": "Revenue analysis with explicit relational grain and time windows",
    "summary": "Answered revenue and customer questions through 30 SQL queries, including ranking and a three-month revenue moving average over Dockerized MySQL.",
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
    "eyebrow": "Business data explored through aggregation and geography",
    "summary": "Connected business records with geographic questions through 30 MongoDB queries, indexed spatial searches and map-based inspection.",
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
    "eyebrow": "Product discovery across text, filters and semantic similarity",
    "summary": "Made 300+ products across 13 categories searchable through exact filters, lexical matching and 384-dimensional vector retrieval.",
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
    "eyebrow": "Demand-model comparison with time order preserved",
    "summary": "Recorded 0.4841 validation RMSLE with XGBoost versus 0.9884 for Ridge after combining five Favorita datasets on a contiguous time-based split.",
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
  ,
    "metrics": [
      {
        "value": "0.4841",
        "label": "XGBoost validation RMSLE",
        "context": "Against Ridge at 0.9884 on the July 17–31, 2017 split."
      }
    ]
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
    "eyebrow": "An inspectable graph of tool-call prerequisites",
    "summary": "Made dependencies across 1,309 tool schemas inspectable by linking produced entity IDs to tools that need them, with an interactive TypeScript graph.",
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
    "eyebrow": "Public records organized into an operational-data demonstration",
    "summary": "Turned public contract records into a Foundry/AIP demonstration through data preparation, ontology design and an agent-question workflow.",
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
    "eyebrow": "A session history that supports planning and review",
    "summary": "Made study sessions easier to track and review through timers, editable history and daily/weekly analytics, with authenticated cloud sync and local reads.",
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
    "eyebrow": "A single view from weekly goals to daily review",
    "summary": "Connected weekly goals with daily execution through one dashboard for habits, logs, tasks and weighted review, backed by Supabase authentication and Postgres.",
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
    "eyebrow": "Seven applications across web and mobile interaction",
    "summary": "Built seven web and mobile applications exploring navigation, chat and data access, including a seven-tool conversation agent and secure mobile token storage.",
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
    "eyebrow": "Startup discovery through searchable profiles and comparisons",
    "summary": "Made 1,000+ company profiles searchable and comparable through startup filters and visual funding/valuation exploration in a hackathon prototype.",
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
    "eyebrow": "From ingredients on hand to a practical meal plan",
    "summary": "Connected available ingredients and dietary constraints with a 10,000+ recipe API catalogue, carrying recipe choices into favorites and grocery-list workflows.",
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
    "eyebrow": "A benchmark for examining runtime and workload tradeoffs",
    "summary": "Made concurrency tradeoffs measurable through a configurable word-count benchmark comparing thread pools, synchronization and CSV/Parquet/Arrow output.",
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
    "eyebrow": "Algorithm choices explained through their constraints",
    "summary": "Implemented linear-time graph traversal, offline optimal cache eviction and Fenwick-tree inversion counting, with each algorithm’s information assumptions explicit.",
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
    "eyebrow": "Routes and nearby destinations over a campus graph",
    "summary": "Enabled route and nearest-destination queries across 160+ UW-Madison locations through weighted graph modeling, Dijkstra’s algorithm and an HTML interface.",
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
    "eyebrow": "Ordered music queries backed by tree-based indexing",
    "summary": "Enabled ordered song search and energy-range filtering through a layered Java application backed by a self-balancing red-black tree.",
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
    "eyebrow": "Image classification with repeatable training and evaluation",
    "summary": "Made a 100-class image-training experiment resumable through best-model checkpoints and per-epoch evaluation in a roughly 151,000-parameter LeNet implementation.",
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
    "eyebrow": "A clothing-image classifier with an inspectable training loop",
    "summary": "Exceeded 85% accuracy within five epochs in the recorded Fashion-MNIST course experiment, with an implemented PyTorch training/evaluation loop and top-three probability output.",
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
    "eyebrow": "Image representation made visible through reconstruction",
    "summary": "Reconstructed 1,000 face images from lower-dimensional PCA representations, examining how component count and noise affect retained detail.",
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
    "eyebrow": "Two optimization paths through one regression objective",
    "summary": "Compared closed-form and gradient-descent solutions to the same ice-cover regression problem, implementing both directly in NumPy.",
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
    "eyebrow": "Language inference with the probability calculation exposed",
    "summary": "Turned character-frequency evidence into English-versus-Spanish posterior scores through a transparent implementation of Bayes’ rule.",
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
  },
  {
    "slug": "video-fingerprint-benchmark",
    "title": "Video-Fingerprint Benchmark",
    "category": "ML & AI",
    "categories": [
      "ML & AI",
      "Computing Foundations"
    ],
    "featured": false,
    "eyebrow": "Controlled comparisons that explain a fingerprint-error improvement",
    "summary": "Reduced 720p median Hamming error from 0.225 to 0.025 in an exploratory in-sample benchmark, using common-resolution preprocessing across 25 sources and 1,875 pair comparisons.",
    "role": "Transformation tooling, experiment manifests, controlled comparisons and evaluation analysis in a continuing research collaboration.",
    "status": "Ongoing research collaboration · exploratory results",
    "stack": [
      "Python",
      "OpenCV",
      "FFmpeg",
      "Video fingerprinting"
    ],
    "image": "/ssim-benchmark.svg",
    "imageAlt": "Explanatory diagram of the video-fingerprint benchmark: 25 sources, 75 transformed variants and 1,875 comparisons.",
    "problem": "Changes in resolution, encoding, timing and overlays can alter a video fingerprint. A useful experiment needs repeatable transformations and non-matched controls, as well as matching source-copy pairs.",
    "approach": "Built transformation tooling across two phases, with manifests and parameter records for resolution, encoding, timing, cropping, noise, color, watermarks and reframing, followed by emoji, subtitle and frame-effect protocols.",
    "outcome": "In the earlier exploratory, in-sample benchmark, common-resolution preprocessing reduced median Hamming error on 720p copies from 0.225 to 0.025. A later transformation demonstration produced 30 outputs from 6 sources; it is a separate result, not an expanded matching evaluation.",
    "detail": "The controlled benchmark used 25 sources, 75 transformed variants and 1,875 pair comparisons. Transformation validation and fingerprint-matching evaluation remain separate, and the recorded in-sample improvement is not a held-out accuracy claim.",
    "sourceIds": [
      "E12",
      "E13"
    ]
  ,
    "metrics": [
      {
        "value": "0.225 → 0.025",
        "label": "720p median Hamming error",
        "context": "Exploratory, in-sample controlled benchmark."
      },
      {
        "value": "1,875",
        "label": "Pair comparisons",
        "context": "25 sources and 75 variants in the earlier benchmark."
      }
    ]
  }
]

export const experiences: Experience[] = [
  {
    "slug": "cs574",
    "org": "UW–Madison · CS 574",
    "role": "Peer Mentor",
    "period": "August 2026–present",
    "mark": "UW–Madison · CS 574",
    "summary": "Teaching and assignment development for Data Management for Data Science.",
    "detail": "Taught SQL, MongoDB, Elasticsearch, ETL/ELT, RAG and fine-tuning in weekly office hours, helping students connect underlying concepts with implementation and debugging.",
    "bullets": [
      "Taught SQL, MongoDB, Elasticsearch, ETL/ELT, RAG and fine-tuning in weekly office hours, helping students connect underlying concepts with implementation and debugging.",
      "Designed approximately 4–6 new questions for each of the SQL, Elasticsearch/Kibana and RAG projects to test deeper understanding of query behavior, data systems and model workflows.",
      "Introduced a Snowflake Dynamic Tables question and wrote a five-page instructional guide. Reviewed lecture coverage across 36 topics and contributed three adopted fixes to the Airbyte/Snowflake/dbt assignment.",
      "Proposed analyzing database query logs to examine query execution and support academic-integrity review, including concerns about uncritical AI use. Helped the teaching team monitor database-reading activity.",
      "Consolidated submission status, autograder scores and deadline information for approximately 140 students through an independently built Python tool. Produced four Kibana walkthrough sets adopted as staff grading references.",
      "Provisioned 434 private GitLab repositories across three assignment releases by adapting automation for starter code, student access and grading-pipeline setup."
    ],
    "sourceIds": [
      "E14",
      "E15"
    ],
    "logo": "/company-logos/wisc.png",
    "metrics": [
      {
        "value": "4–6",
        "label": "New questions per project",
        "context": "Approximately, across SQL, Elasticsearch/Kibana and P6 RAG."
      },
      {
        "value": "36",
        "label": "Lecture topics reviewed",
        "context": "Mapped against assignment requirements."
      },
      {
        "value": "434",
        "label": "Private GitLab repositories",
        "context": "Across 3 project releases, approximately 140 students per project."
      }
    ]
  },
  {
    "slug": "people-robots",
    "org": "UW–Madison People & Robots Lab",
    "role": "Undergraduate Research Assistant",
    "period": "January 2026–present",
    "mark": "People & Robots Lab",
    "summary": "Accessible security guidance within everyday mobile apps. I lead code implementation; the PI leads research and study design.",
    "detail": "Lead Kotlin/Android development of an assistive security application for adults with intellectual and developmental disabilities, supporting a controlled study with 18+ participants.",
    "bullets": [
      "Lead Kotlin/Android development of an assistive security application for adults with intellectual and developmental disabilities, supporting a controlled study with 18+ participants.",
      "Built the model harness connecting captured screen context, structured prompts and Gemini JSON responses, giving the application a consistent format for interpreting notifications and presenting available choices.",
      "Applied MoRA threat factors, C-HIP warning-comprehension principles and TETs explanation requirements to address likely misunderstandings, explain consequences and preserve the user’s control over decisions.",
      "Applied human-centered design principles to reduce cognitive effort through clear visual cues, concrete explanations and progressive disclosure, while keeping users in control of security decisions.",
      "Translated research feedback and collaborative Miro design reviews into concise, layered explanations, clear visual cues and predictable interactions, with additional detail available when needed.",
      "Resolved permission-dialog detection by tracing Android’s accessibility-window behavior, distinguishing system permission prompts from the assistant’s overlay."
    ],
    "sourceIds": [
      "E08",
      "E09",
      "E10"
    ],
    "logo": "/company-logos/wisc.png",
    "metrics": [
      {
        "value": "18+",
        "label": "Controlled-study participants",
        "context": "Controlled study of accessible security and privacy guidance."
      }
    ]
  },
  {
    "slug": "cornell-acert",
    "org": "Cornell University, ACERT",
    "role": "Undergraduate Research Intern",
    "period": "July 8–August 15, 2026",
    "mark": "Cornell University · ACERT",
    "summary": "Video-fingerprinting research and ESR commercialization within the same Cornell project. The SSIM collaboration is continuing.",
    "detail": "Reduced median video-fingerprint Hamming error from 0.225 to 0.025 for 720p copies in the recorded benchmark by normalizing input resolution before fingerprint comparison.",
    "bullets": [
      "Reduced median video-fingerprint Hamming error from 0.225 to 0.025 for 720p copies in the recorded benchmark by normalizing input resolution before fingerprint comparison.",
      "Built a reproducible Python/OpenCV/FFmpeg benchmark covering 25 source videos, 75 transformed variants and 1,875 matched/non-matched comparisons to evaluate fingerprint behavior.",
      "Extended the video-transformation toolkit with seeded emoji overlays, timed subtitles and inward white borders, producing 30 variants across six source videos with reproducible configurations and validation records.",
      "Converted notebook experiments into repeatable generation and evaluation workflows with configuration records, manifests, validation checks and CLI tooling.",
      "Evaluated commercialization opportunities for the project’s portable ESR drug-identification technology through market sizing, customer segmentation and competitive pricing analysis.",
      "Revised pitch decks and created new slides covering TAM/SAM/SOM, competitive positioning, product-market-fit analysis and technology benchmarks against competing solutions to support commercialization planning."
    ],
    "sourceIds": [
      "E11"
    ],
    "metrics": [
      {
        "value": "0.225 → 0.025",
        "label": "Median fingerprint Hamming error",
        "context": "Recorded 720p-copy benchmark, exploratory in-sample result."
      },
      {
        "value": "1,875",
        "label": "Matched/non-matched comparisons",
        "context": "25 source videos and 75 transformed variants."
      }
    ]
  },
  {
    "slug": "darukaa",
    "org": "Darukaa.Earth",
    "role": "Software Engineer Intern, Platform",
    "period": "May–July 2026",
    "mark": "Darukaa.Earth",
    "logo": "/company-logos/darukaa.webp",
    "summary": "Biodiversity infrastructure connecting field recordings, cloud inference and researcher workflows. I led the workstream under senior engineering supervision.",
    "detail": "Increased audio-inference throughput 8–10× and reduced infrastructure costs by $80–$95 per environment per month by migrating synchronous Vertex AI processing to Batch Prediction.",
    "bullets": [
      "Increased audio-inference throughput 8–10× and reduced infrastructure costs by $80–$95 per environment per month by migrating synchronous Vertex AI processing to Batch Prediction.",
      "Built FastAPI and asynchronous SQLAlchemy orchestration for 500-file audio batches, preserving source-file identities and geographic metadata from upload through inference and result delivery.",
      "Made batch processing recoverable through retry-safe orchestration and per-file failure isolation, preventing a corrupt upload from aborting the remaining workload.",
      "Moved approximately 18-minute spectrogram-processing jobs outside interactive requests and integrated OIDC-authenticated completion callbacks, allowing analysis to continue without holding client connections open.",
      "Designed a SpeciesNet camera-trap inference service and database schema for biodiversity analysis, with local validation on 25 photographs, including 11 Indian field images.",
      "Verified the upload-to-result workflow across 500 test files and added 15 unit tests covering orchestration and output parsing.",
      "Clarified requirements for custom API integration, species-confidence reporting and human review of low-confidence predictions through two discussions with an enterprise client’s engineering team."
    ],
    "sourceIds": [
      "E05",
      "E06",
      "E07"
    ],
    "metrics": [
      {
        "value": "8–10×",
        "label": "Audio-inference throughput",
        "context": "Audio workload in the recorded batch comparison."
      },
      {
        "value": "500 files",
        "label": "End-to-end validation",
        "context": "Upload, processing and source-linked results."
      },
      {
        "value": "15",
        "label": "Unit tests",
        "context": "Orchestration and output-parsing coverage."
      }
    ]
  },
  {
    "slug": "vdart",
    "org": "VDart Inc.",
    "role": "Software Engineering Intern",
    "period": "May–August 2025",
    "mark": "VDart",
    "summary": "Enterprise proposal drafting grounded in the BI team’s approved historical answers.",
    "detail": "Cut RFI/RFP first-draft preparation from about two weeks to under 24 hours, supporting roughly 3× proposal capacity for the internal BI team.",
    "bullets": [
      "Cut RFI/RFP first-draft preparation from about two weeks to under 24 hours, supporting roughly 3× proposal capacity for the internal BI team.",
      "Independently built a production-ready RAG application spanning a React interface, FastAPI backend, document ingestion, vector retrieval and streamed model responses.",
      "Resolved incomplete retrieval by tracing returned context and preserving complete historical question-and-answer pairs, keeping approved answers attached to the questions they addressed.",
      "Translated BI workflow discussions into application requirements and evaluated RAG against rule-based matching, curated repositories and fine-tuning with business and technical stakeholders.",
      "Delivered the application through BI and technical review, followed by team-led production deployment and confirmed use across 50+ internal BI users."
    ],
    "sourceIds": [
      "E01",
      "E02",
      "E03",
      "E04"
    ],
    "logo": "/company-logos/vdart.png",
    "metrics": [
      {
        "value": "Under 24 hours",
        "label": "Proposal first-draft preparation",
        "context": "From about 2 weeks before the RAG workflow."
      },
      {
        "value": "~3×",
        "label": "Proposal capacity",
        "context": "Reported internal BI workflow improvement."
      },
      {
        "value": "50+",
        "label": "Internal BI users",
        "context": "Production use after team-led deployment."
      }
    ]
  },
  {
    "slug": "pinkcity",
    "org": "Pink City Expressways",
    "role": "Software Development Intern",
    "period": "January 2022–March 2023",
    "mark": "PCE",
    "summary": "Software for lead management, machinery allocation and a logistics business’s online presence.",
    "detail": "Built a Python contractor-allocation tool that matched machinery availability with operational demand, contributing $18,000 in additional revenue.",
    "bullets": [
      "Built a Python contractor-allocation tool that matched machinery availability with operational demand, contributing $18,000 in additional revenue.",
      "Replaced scattered lead records with a Python/SQL CRM tracking 30+ business leads, supporting organized follow-up as recorded successful partnerships grew from 15 to 19 over eight months.",
      "Built a responsive HTML, CSS and JavaScript website that presented the company’s services and gave prospective clients a clear path to make inquiries."
    ],
    "sourceIds": [
      "E16"
    ],
    "logo": "/company-logos/pinkcity.gif",
    "metrics": [
      {
        "value": "30+",
        "label": "Business leads tracked",
        "context": "Queryable lead, contractor and partnership records."
      },
      {
        "value": "15 → 19",
        "label": "Recorded business partnerships",
        "context": "Over 8 months in the business record."
      }
    ]
  }
]

// Retained history, excluded from the active website chronology by user request.
export const archivedExperiences: Experience[] = [
  {
    "slug": "science-centre",
    "org": "National Science Centre, New Delhi",
    "role": "Summer Intern",
    "period": "Three summers · 2017–2019",
    "mark": "National Science Centre",
    "summary": "Built an early scientific foundation through three summer placements in astrophysics, robotics and circuit design.",
    "detail": "Completed 3 summer placements spanning astrophysics, robotics and electrical-circuit design, building an early foundation for later computing work.",
    "bullets": [
      "Completed 3 summer placements spanning astrophysics, robotics and electrical-circuit design, building an early foundation for later computing work."
    ],
    "sourceIds": [
      "E18"
    ],
    "metrics": [
      {
        "value": "3",
        "label": "Summer placements",
        "context": "Scientific and engineering exposure, 2017–2019."
      }
    ]
  }
]

export const leadership: Leadership[] = [
  {
    "org": "Recreation and Wellbeing, UW-Madison",
    "role": "Intramural Sports Lead",
    "heading": "Higher participation. Better participant experiences.",
    "summary": "Recorded program improvements of 30% in participation and 35% in satisfaction, alongside staff development and operations across 50+ programs.",
    "scope": "Staff development, scheduling and on-site operations across 50+ intramural programs.",
    "bullets": [
      "Expanded the program around participant demand by using surveys to identify and launch cricket and pickleball leagues. The reported participation and satisfaction gains reflect the broader program work.",
      "Improved staff preparation through station-based field clinics for rules, positioning, communication and difficult game situations, plus check-ins before playoffs.",
      "Made development needs actionable through Green/Yellow/Red readiness tracking and targeted feedback. Led 10–15 staff in high-volume windows, matching preparation and assignments to the demands of the games."
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
  ,
    "metrics": [
      {
        "value": "250+",
        "label": "Referee program scope",
        "context": "Referees cumulatively over two years."
      },
      {
        "value": "+30%",
        "label": "Participation",
        "context": "Reported program-level increase."
      },
      {
        "value": "+35%",
        "label": "Participant satisfaction",
        "context": "Reported program-level increase."
      }
    ]
  },
  {
    "org": "Badger VC",
    "role": "Vice President of External Relations",
    "heading": "15+ venture events connecting founders and investment practitioners",
    "summary": "Connected 20+ student founders with the venture community and coordinated 15+ events designed as a continuing learning series.",
    "scope": "Founder relationships and a connected learning series with venture-capital practitioners, including managing partners.",
    "bullets": [
      "Built relationships with 20+ student founders and coordinated 15+ venture events, connecting members with founders, industry partners and investment professionals.",
      "Shaped events to build on one another, bringing managing partners’ practical experience into discussions of due diligence, VC concepts and VC math.",
      "Coordinated speaker relationships, follow-up and logistics around what members could learn and apply, making the series useful beyond an individual guest talk."
    ],
    "sourceIds": [
      "L06",
      "L07"
    ]
  ,
    "metrics": [
      {
        "value": "15+",
        "label": "Venture events coordinated",
        "context": "Connected discussions of VC, due diligence and VC math."
      },
      {
        "value": "20+",
        "label": "Student-founder relationships",
        "context": "External engagement across the student venture community."
      }
    ]
  },
  {
    "org": "Strato VC",
    "role": "Investment Analyst",
    "heading": "Investment decisions grounded in market and technical evidence",
    "summary": "Turned research on 10+ startups per quarter into investment memos testing market, financial and technical assumptions.",
    "scope": "Market, financial, competitive and technical diligence supporting the investment team’s decisions.",
    "bullets": [
      "Analyzed 10+ startups per quarter, using PitchBook, company financials and competitive research to test market opportunity and business assumptions.",
      "Developed investment memos that connected market evidence with financial projections, product architecture and technical roadmaps, giving the investment team a clearer view of the case and its risks."
    ],
    "sourceIds": [
      "L08"
    ]
  ,
    "metrics": [
      {
        "value": "10+",
        "label": "Startups analyzed per quarter",
        "context": "Diligence workload supporting investment memos."
      }
    ]
  },
  {
    "org": "DapperFits",
    "role": "Founder",
    "heading": "600+ apparel sales from a five-person venture",
    "summary": "Generated 600+ apparel sales with a five-person team spanning product design, marketing and fulfillment.",
    "scope": "A custom-apparel venture connecting product decisions, supplier coordination, launches and customer feedback.",
    "bullets": [
      "Generated 600+ apparel sales after founding the brand and leading a five-person team across design, marketing and fulfillment.",
      "Connected designs, supplier decisions and product drops with customer feedback, carrying responsibility from the first mockup through delivery and repeat business."
    ],
    "sourceIds": [
      "E17"
    ],
    "period": "June 2022–June 2023"
  ,
    "metrics": [
      {
        "value": "600+",
        "label": "Apparel sales",
        "context": "Team business outcome, June 2022–June 2023."
      },
      {
        "value": "5",
        "label": "Team members",
        "context": "Design, marketing and fulfillment."
      }
    ]
  },
  {
    "org": "Earlier school sports leadership",
    "role": "Sports events and coaching",
    "heading": "Sports programs for 900+ students",
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
  ,
    "metrics": [
      {
        "value": "900+",
        "label": "Students in sports-event scope",
        "context": "School leadership, separate from RecWell program counts."
      }
    ]
  }
]
