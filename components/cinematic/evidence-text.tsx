/** Emphasize recorded numeric facts without rewriting their scope or qualifiers. */
export function EvidenceText({ text }: { text: string }) {
  return text.split(/(\$?\b\d[\d,.]*(?:[–−-]\$?\d[\d,.]*)?(?:\+|%|×)?(?:\s(?:hours?|files?|users?|students?|repositories|unit tests?|project releases?))?)/g)
    .map((part, index) => /^\$?\d/.test(part) ? <strong key={index}>{part}</strong> : part)
}
