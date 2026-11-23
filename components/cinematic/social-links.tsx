import { FileText, Github, Linkedin, Mail } from "lucide-react"
import { profile } from "@/lib/portfolio-data"

export function SocialLinks({ label = "Quick links" }: { label?: string }) {
  return (
    <nav className="cinematic-social-links" aria-label={label}>
      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)"><Linkedin size={18} aria-hidden /><span>LinkedIn</span></a>
      <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)"><Github size={18} aria-hidden /><span>GitHub</span></a>
      <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" aria-label="Résumé (opens in a new tab)"><FileText size={18} aria-hidden /><span>Résumé</span></a>
      <a href={`mailto:${profile.email}`}><Mail size={18} aria-hidden /><span>Email</span></a>
    </nav>
  )
}
