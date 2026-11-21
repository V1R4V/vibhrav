/** Public, reviewed project imagery. Captions describe evidence and demo scope. */
export const projectMedia: Record<string, { src: string; alt: string; caption: string }[]> = {
  "private-data-rag": [
    { src: "/cinematic/diagrams/private-data-rag.svg", alt: "Private-Data RAG architecture from documents through Docling, embeddings and ChromaDB to an answer", caption: "Explanatory architecture of the implemented command-line retrieval pipeline." },
  ],
  dermanet: [
    { src: "/cinematic/projects/dermanet-body-selection.webp", alt: "DermaNet body-area selection interface", caption: "The hackathon prototype’s body-area selection step." },
    { src: "/cinematic/projects/dermanet-upload.webp", alt: "DermaNet image-upload interface", caption: "The image-upload step before exploratory classification." },
    { src: "/cinematic/dermanet.webp", alt: "The three-person DermaNet team presenting the hackathon prototype", caption: "Our three-person team presenting DermaNet. I built the classification API and local language-model service." },
  ],
  vyaya: [
    { src: "/cinematic/projects/vyaya-ledger.webp", alt: "Vyaya transaction ledger populated with synthetic demonstration records", caption: "Transaction review using synthetic demonstration data from the project’s screenshot seed." },
    { src: "/cinematic/projects/vyaya-mobile.webp", alt: "Vyaya mobile dashboard with synthetic demonstration data", caption: "The mobile dashboard, using the same synthetic demonstration data." },
  ],
  "before-it-breaks": [
    { src: "/cinematic/projects/before-it-breaks-pipeline.webp", alt: "Before It Breaks pipeline identifying real, synthetic and estimated data sources", caption: "The project’s pipeline overview distinguishes real weather context, synthetic equipment telemetry and estimated costs." },
  ],
}
