import { profile } from "@/lib/site-data"

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

        {/* Big CTA */}
        <a
          href="mailto:vjha3@wisc.edu"
          className="group mt-5 block font-display text-[clamp(2.5rem,9vw,7rem)] font-semibold leading-[0.92] tracking-[-0.03em] transition-opacity hover:opacity-70"
        >
          Let&apos;s build
          <br />
          something{" "}
          <span className="inline-block font-hero font-normal italic transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-1">
            ↗
          </span>
        </a>

        {/* Columns */}
        <div className="mt-16 grid gap-10 border-t border-white/15 pt-10 sm:grid-cols-3">
          <div>
            <h4 className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-white/45">
              Connect
            </h4>
            {[
              ["Email", "mailto:vjha3@wisc.edu"],
              ["LinkedIn", profile.socials.linkedin],
              ["GitHub", profile.socials.github],
              ["Instagram", profile.socials.instagram],
              ["Résumé", profile.socials.resume],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="block py-1 text-[0.95rem] text-white/80 transition-opacity hover:opacity-60"
              >
                {label}
              </a>
            ))}
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
            <p className="py-1 text-[0.95rem] text-white/80">
              Open to 2026 · SWE &amp; Applied AI
            </p>
            <p className="py-1 text-[0.95rem] text-white/80">{profile.location}</p>
            <p className="py-1 text-[0.95rem] text-white/80">
              {profile.status.label} @ {profile.status.org}
            </p>
          </div>
        </div>

        {/* Base row */}
        <div className="mt-14 flex flex-wrap justify-between gap-4 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-white/45">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span>Web Dev &amp; AI · UW–Madison</span>
          <span>Built in {profile.location}</span>
        </div>
      </div>
    </footer>
  )
}
