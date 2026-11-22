import "server-only"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import snapshots from "@/content/project-readmes/index.json"

export type ProjectReadme = { content: string; sourceUrl: string; rawUrl: string; captured: string; images?: { src: string; alt: string }[] }
type Snapshot = Omit<ProjectReadme, "content"> & { file: string }

export function getProjectReadme(slug: string): ProjectReadme | null {
  const entry = (snapshots.entries as Record<string, Snapshot>)[slug]
  if (!entry) return null
  return {
    content: readFileSync(join(process.cwd(), "content/project-readmes", entry.file), "utf8"),
    sourceUrl: entry.sourceUrl, rawUrl: entry.rawUrl, captured: entry.captured, images: entry.images,
  }
}
