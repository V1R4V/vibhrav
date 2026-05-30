"use client"

import { useState } from "react"
import { Mail } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ContactButtonProps {
  label?: string
  /** Extra classes forwarded to the trigger Button */
  className?: string
  /** Variant forwarded to the shadcn Button */
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link"
  /** Whether to show the Mail icon */
  showIcon?: boolean
}

export function ContactButton({
  label = "Contact me",
  className,
  variant = "default",
  showIcon = true,
}: ContactButtonProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const reset = () => {
    setName("")
    setEmail("")
    setMessage("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY

    if (!accessKey) {
      // Graceful fallback: open mailto link pre-filled with the message.
      const body = encodeURIComponent(`Name: ${name}\n\n${message}`)
      const subject = encodeURIComponent(`Portfolio contact from ${name}`)
      window.open(
        `mailto:vibhrav@gmail.com?subject=${subject}&body=${body}`,
        "_blank",
      )
      toast.info("Email client opened — your default mail app should launch with the message pre-filled.")
      setLoading(false)
      setOpen(false)
      reset()
      return
    }

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name,
          email,
          message,
          subject: `New portfolio contact from ${name}`,
          from_name: name,
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success("Thanks — your message is on its way!")
        setOpen(false)
        reset()
      } else {
        toast.error("Something went wrong. Please try again or email vibhrav@gmail.com directly.")
      }
    } catch {
      toast.error("Network error. Please try again or email vibhrav@gmail.com directly.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button variant={variant} className={className} onClick={() => setOpen(true)}>
        {showIcon && <Mail className="h-4 w-4" />}
        {label}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-paper text-ink border-line sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-ink">Get in touch</DialogTitle>
            <DialogDescription className="text-ink-soft">
              Fill out the form below and I&apos;ll get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-name" className="text-sm font-medium text-ink">
                Name
              </label>
              <Input
                id="contact-name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="bg-paper-2 border-line text-ink placeholder:text-ink-faint focus-visible:ring-burgundy"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-email" className="text-sm font-medium text-ink">
                Email
              </label>
              <Input
                id="contact-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="bg-paper-2 border-line text-ink placeholder:text-ink-faint focus-visible:ring-burgundy"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-message" className="text-sm font-medium text-ink">
                Message
              </label>
              <Textarea
                id="contact-message"
                placeholder="What's on your mind?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={loading}
                rows={5}
                className="bg-paper-2 border-line text-ink placeholder:text-ink-faint focus-visible:ring-burgundy resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-1 bg-burgundy text-white hover:bg-burgundy/90"
            >
              {loading ? "Sending…" : "Send message"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
