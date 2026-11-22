import Image from "next/image"
import { Children, isValidElement, type ReactNode } from "react"
import Markdown, { defaultUrlTransform, type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { ArrowUpRight, ChevronDown } from "lucide-react"
import type { ProjectReadme as Readme } from "@/lib/project-readmes"

function plainText(children: ReactNode): string {
  return Children.toArray(children).map(child => {
    if (typeof child === "string" || typeof child === "number") return String(child)
    return isValidElement<{ children?: ReactNode }>(child) ? plainText(child.props.children) : ""
  }).join("")
}
function headingSlug(text: string): string {
  return text.trim().toLowerCase().replace(/[^\p{L}\p{N}_\s-]/gu, "").replace(/\s/g, "-")
}

export function ProjectReadme({ document }: { document: Readme }) {
  const seen = new Map<string, number>()
  function heading(Tag: "h3" | "h4" | "h5" | "h6") {
    return function ReadmeHeading({ children }: { children?: ReactNode }) {
      const slug = headingSlug(plainText(children)), count = seen.get(slug) || 0
      seen.set(slug, count + 1)
      return <Tag id={`readme-${slug}${count ? `-${count}` : ""}`}>{children}</Tag>
    }
  }
  const components: Components = {
    h1: heading("h3"), h2: heading("h3"), h3: heading("h4"), h4: heading("h5"), h5: heading("h6"), h6: heading("h6"),
    a({ href, children }) {
      const external = /^https?:\/\//.test(href || "")
      return <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>{children}</a>
    },
    img({ src, alt }) { return src ? <Image src={src} alt={alt || ""} width={1200} height={750} unoptimized className="readme-image" /> : null },
    table({ children }) { return <div className="readme-table" role="region" aria-label="README table" tabIndex={0}><table>{children}</table></div> },
    pre({ children }) { return <pre tabIndex={0}>{children}</pre> },
  }
  return (
    <section className="project-documentation" aria-labelledby="project-documentation-title">
      <header className="project-documentation-header">
        <div><p className="project-section-label">From the repository</p><h2 id="project-documentation-title">Read the README.</h2></div>
        <a href={document.sourceUrl} target="_blank" rel="noopener noreferrer">View original README <ArrowUpRight size={16} aria-hidden /></a>
      </header>
      <details className="project-readme-disclosure">
        <summary><span>README</span><span>Architecture, setup and usage <ChevronDown size={18} aria-hidden /></span></summary>
        <div id="project-readme" className="project-readme-content" role="region" aria-label="Repository README">
          {document.images ? document.images.map(image => <p key={image.src}><Image src={image.src} alt={image.alt} width={1200} height={750} unoptimized className="readme-image" /></p>) : <Markdown remarkPlugins={[remarkGfm]} skipHtml components={components} urlTransform={(value, key) => {
            const safe = defaultUrlTransform(value)
            if (!safe) return ""
            if (safe.startsWith("#")) return safe.startsWith("#user-content-") ? safe : `#readme-${safe.slice(1)}`
            if (/^[a-z][a-z\d+.-]*:/i.test(safe)) return safe
            return new URL(safe, key === "src" ? document.rawUrl : document.sourceUrl).href
          }}>{document.content}</Markdown>}
        </div>
      </details>
    </section>
  )
}
