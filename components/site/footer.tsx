import { Github, Linkedin, Mail, FileText } from "lucide-react"
import { profile } from "@/lib/site-data"
import { ContactButton } from "@/components/site/contact-form"

const NAV = [
  ["Experience", "#experience"],
  ["Work", "#work"],
  ["Stack", "#stack"],
  ["About", "#about"],
  ["Top", "#top"],
] as const

export function Footer() {
  return (
    <footer
      id="contact"
      className="relative isolate overflow-hidden bg-[#0E0D0A] px-5 py-20 text-[#F4F1EA] sm:px-8 sm:py-28"
    >
      {/* Accent glow — Badger red, kept dark so the CTA is always legible */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 80% at 88% 8%, hsl(var(--grad-2) / 0.35), transparent 60%), radial-gradient(60% 70% at 0% 100%, hsl(var(--grad-1) / 0.22), transparent 62%)",
        }}
      />
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-burgundy">
          Say hello
        </p>

        {/* Big CTA headline */}
        <p className="mt-5 font-display text-[clamp(2.5rem,9vw,7rem)] font-semibold leading-[0.92] tracking-[-0.03em] text-[#F4F1EA]">
          Let&apos;s build
          <br />
          something<span className="text-gold">.</span>
        </p>

        {/* Obvious contact CTA — a clearly labelled button, not a bare arrow. */}
        <div className="mt-9">
          <ContactButton
            label="Get in touch"
            showIcon
            iconClassName="text-[#EA4335]"
            variant="ghost"
            className="group h-auto gap-3 rounded-full border border-white/30 bg-white/[0.05] px-7 py-4 font-mono text-sm uppercase tracking-[0.14em] text-white transition-colors hover:border-white hover:bg-white hover:text-[#0B0A08]"
          />
        </div>

        {/* Columns */}
        <div className="mt-16 grid gap-10 border-t border-white/15 pt-10 sm:grid-cols-3">
          <div>
            <h4 className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-white/45">
              Connect
            </h4>
            <div className="flex flex-wrap gap-3 py-1">
              {[
                {
                  href: "mailto:vibhrav@gmail.com",
                  Icon: Mail,
                  label: "Email",
                  colorClass: "text-[#EA4335]",
                },
                {
                  href: profile.socials.linkedin,
                  Icon: Linkedin,
                  label: "LinkedIn",
                  colorClass: "text-[#0A66C2]",
                },
                {
                  href: profile.socials.github,
                  Icon: Github,
                  label: "GitHub",
                  colorClass: "text-[#f5f5f5]",
                },
                {
                  href: profile.socials.resume,
                  Icon: FileText,
                  label: "Résumé",
                  colorClass: "text-white/70",
                },
              ].map(({ href, Icon, label, colorClass }) => (
                <a
                  key={label}
                  href={href}
                  target={
                    href.startsWith("http") || href === profile.socials.resume
                      ? "_blank"
                      : undefined
                  }
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className={`rounded-md p-2 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${colorClass}`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-white/45">
              Navigate
            </h4>
            {NAV.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="block py-1 text-[0.95rem] text-white/80 transition-opacity hover:opacity-60"
              >
                {label}
              </a>
            ))}
          </div>

          <div>
            <h4 className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-white/45">
              Currently
            </h4>
            <p className="flex items-center gap-2 py-1 text-[0.95rem] text-white/80">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-burgundy opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-burgundy" />
              </span>
              {profile.availability}
            </p>
            <p className="py-1 text-[0.95rem] text-white/80">{profile.location}</p>
          </div>
        </div>

        {/* Base row */}
        <div className="mt-14 flex flex-wrap justify-between gap-4 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-white/45">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
        </div>
      </div>
    </footer>
  )
}
