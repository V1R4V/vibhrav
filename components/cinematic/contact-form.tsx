"use client"

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react"
import { ArrowUpRight } from "lucide-react"
import { publicCopy } from "@/lib/portfolio-data"
import { sendBrowserContact } from "@/lib/contact/browser.mjs"
import "./contact.css"

type Field = "name" | "email" | "message"
type FieldErrors = Partial<Record<Field, string>>
const fallback = "The form is temporarily unavailable. Please email me directly."

export function ContactForm() {
  const browserProvider = useRef("")
  const [deliveryUncertain, setDeliveryUncertain] = useState(false)
  const [challenge, setChallenge] = useState("")
  const [preparing, setPreparing] = useState(true)
  const [pending, setPending] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState("")
  const [outcome, setOutcome] = useState<"success" | "error" | "">("")
  const [challengeError, setChallengeError] = useState("")
  const challengeController = useRef<AbortController | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const readyTimer = useRef<number>()
  const expiryTimer = useRef<number>()
  const readyAt = useRef(0)
  const expiresAt = useRef(0)
  const pendingRef = useRef(false)
  const focusError = useRef<Field>()
  const uncertain = useRef(false)

  const prepare = useCallback(async function prepareChallenge() {
    challengeController.current?.abort()
    window.clearTimeout(readyTimer.current)
    window.clearTimeout(expiryTimer.current)
    const controller = new AbortController()
    challengeController.current = controller
    const timeout = window.setTimeout(() => controller.abort(), 10000)
    setPreparing(true)
    setChallenge("")
    let scheduled = false
    try {
      const response = await fetch("/api/contact", { cache: "no-store", signal: controller.signal })
      const data = await response.json()
      if (!response.ok || typeof data.challenge !== "string") throw new Error("Unavailable")
      if (challengeController.current !== controller) return
      const wait = typeof data.readyAfterMs === "number" ? Math.max(1500, data.readyAfterMs) : 1500
      const lifetime = typeof data.expiresAfterMs === "number" ? Math.min(600000, data.expiresAfterMs) : 600000
      uncertain.current = false
      browserProvider.current = data.provider === "web3forms" && typeof data.accessKey === "string" ? data.accessKey : ""
      readyAt.current = Date.now() + wait
      expiresAt.current = Date.now() + lifetime
      setChallenge(data.challenge)
      setChallengeError("")
      scheduled = true
      readyTimer.current = window.setTimeout(() => setPreparing(false), wait)
      const renew = () => {
        if (pendingRef.current || (uncertain.current && Date.now() < expiresAt.current)) {
          expiryTimer.current = window.setTimeout(renew, Math.max(1000, expiresAt.current - Date.now()))
        } else void prepareChallenge()
      }
      expiryTimer.current = window.setTimeout(renew, Math.max(wait, lifetime - 10000))
    } catch {
      if (challengeController.current === controller) setChallengeError(fallback)
    } finally {
      window.clearTimeout(timeout)
      if (!scheduled && challengeController.current === controller) setPreparing(false)
    }
  }, [])

  useEffect(() => {
    void prepare()
    const renewOnFocus = () => { if (!pendingRef.current && Date.now() >= expiresAt.current - (uncertain.current ? 0 : 10000)) void prepare() }
    window.addEventListener("focus", renewOnFocus)
    return () => {
      challengeController.current?.abort()
      window.clearTimeout(readyTimer.current)
      window.clearTimeout(expiryTimer.current)
      window.removeEventListener("focus", renewOnFocus)
    }
  }, [prepare])

  useEffect(() => {
    if (pending) return
    const first = focusError.current
    if (first && fieldErrors[first]) {
      (formRef.current?.elements.namedItem(first) as HTMLInputElement | null)?.focus()
      focusError.current = undefined
    }
  }, [pending, fieldErrors])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending || preparing || !challenge || deliveryUncertain) return
    if (Date.now() >= expiresAt.current) { void prepare(); return }
    if (Date.now() < readyAt.current) return
    const form = event.currentTarget
    const values = new FormData(form)
    setPending(true)
    pendingRef.current = true
    uncertain.current = true
    setFieldErrors({})
    setOutcome("")
    setStatus("Sending your message…")
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 15000)
    let sent = false
    try {
      const payload = { name: values.get("name"), email: values.get("email"), message: values.get("message"), website: values.get("website") }
      const response = browserProvider.current ? await sendBrowserContact(browserProvider.current, payload, controller.signal) : await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({ ...payload, challenge }),
      })
      const data = await response.json()
      if (response.status === 202) {
        sent = true
        setOutcome("success")
        setStatus(publicCopy.contact.success)
        form.reset()
      } else {
        if ([400, 403, 413, 415, 429].includes(response.status)) uncertain.current = false
        const errors: FieldErrors = {}
        for (const field of ["name", "email", "message"] as const) {
          if (typeof data.fieldErrors?.[field] === "string") errors[field] = data.fieldErrors[field]
        }
        focusError.current = (["name", "email", "message"] as const).find((field) => errors[field])
        setFieldErrors(errors)
        setOutcome("error")
        if (browserProvider.current && uncertain.current) setDeliveryUncertain(true)
        setStatus(response.status === 429 ? "Too many messages. Please try again later or email me directly." : response.status === 400 ? "Please check your details and try again. Your message has not been sent." : response.status === 409 ? "This message cannot be retried safely. Please email me directly." : browserProvider.current ? "Delivery could not be confirmed. Please email me directly before resending." : "Sending could not be confirmed. Retry without editing your message, or email me directly.")
      }
    } catch {
      setOutcome("error")
      if (browserProvider.current) setDeliveryUncertain(true)
      setStatus(browserProvider.current ? "Delivery could not be confirmed. Please email me directly before resending." : "Sending could not be confirmed. Retry without editing your message, or email me directly.")
    } finally {
      window.clearTimeout(timeout)
      setPending(false)
      pendingRef.current = false
      if (sent || Date.now() >= expiresAt.current) void prepare()
    }
  }

  return (
    <section id="contact" className="cinematic-contact-section" data-chapter aria-labelledby="cinematic-contact-title">
      <div className="cinematic-contact-intro">
        <h2 id="cinematic-contact-title" data-reveal>{publicCopy.contact.heading}</h2>
        <p>{publicCopy.contact.body}</p>
        <a className="cinematic-email-link" href="mailto:vibhrav@gmail.com">Email me directly <ArrowUpRight size={18} aria-hidden /></a>
      </div>
      <form ref={formRef} className="cinematic-contact-form" onSubmit={submit} onInvalid={(event) => {
        const field = event.target as HTMLInputElement
        if (["name", "email", "message"].includes(field.name)) setFieldErrors((current) => ({ ...current, [field.name]: field.validationMessage }))
      }}>
        <div className="cinematic-contact-pair">
          <div className="cinematic-contact-field">
            <label htmlFor="cinematic-contact-name">Name</label>
            <input id="cinematic-contact-name" name="name" autoComplete="name" required minLength={2} maxLength={100} disabled={pending} aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? "contact-name-error" : undefined} onChange={() => setFieldErrors((current) => ({ ...current, name: undefined }))} />
            {fieldErrors.name && <p id="contact-name-error" className="cinematic-field-error">{fieldErrors.name}</p>}
          </div>
          <div className="cinematic-contact-field">
            <label htmlFor="cinematic-contact-email">Email</label>
            <input id="cinematic-contact-email" name="email" type="email" spellCheck={false} autoComplete="email" required maxLength={254} disabled={pending} aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? "contact-email-error" : undefined} onChange={() => setFieldErrors((current) => ({ ...current, email: undefined }))} />
            {fieldErrors.email && <p id="contact-email-error" className="cinematic-field-error">{fieldErrors.email}</p>}
          </div>
        </div>
        <div className="cinematic-contact-field cinematic-message-field">
          <label htmlFor="cinematic-contact-message">Message</label>
          <textarea id="cinematic-contact-message" name="message" required minLength={20} maxLength={5000} rows={5} disabled={pending} aria-invalid={Boolean(fieldErrors.message)} aria-describedby={`contact-message-hint${fieldErrors.message ? " contact-message-error" : ""}`} onChange={() => setFieldErrors((current) => ({ ...current, message: undefined }))} />
          <p id="contact-message-hint" className="cinematic-field-hint">20–5,000 characters.</p>
          {fieldErrors.message && <p id="contact-message-error" className="cinematic-field-error">{fieldErrors.message}</p>}
        </div>
        <div className="cinematic-contact-trap" aria-hidden="true">
          <label htmlFor="cinematic-contact-website">Website</label>
          <input id="cinematic-contact-website" name="website" tabIndex={-1} autoComplete="off" disabled={pending} />
        </div>
        <div className="cinematic-contact-actions">
          <button type="submit" disabled={pending || preparing || !challenge || deliveryUncertain}>{pending ? "Sending…" : "Send message"} <ArrowUpRight size={18} aria-hidden /></button>
          <span className="cinematic-contact-note">Straight to my email.</span>
        </div>
        <p className="cinematic-contact-status" data-outcome={outcome} role="status" aria-live="polite" aria-atomic="true">{status}</p>
        {challengeError && <div className="cinematic-contact-unavailable" role="status"><p>{challengeError}</p><button type="button" onClick={() => void prepare()} disabled={preparing}>{preparing ? "Checking…" : "Try the form again"}</button></div>}
        <noscript><p className="cinematic-contact-unavailable">This form needs JavaScript. Please <a href="mailto:vibhrav@gmail.com">email vibhrav@gmail.com</a>.</p></noscript>
      </form>
    </section>
  )
}
