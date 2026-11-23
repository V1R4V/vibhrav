import { browserContactConfiguration } from '@/lib/contact/browser.mjs'
import { createContactHandlers } from '@/lib/contact/server.mjs'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const handlers = createContactHandlers()
export async function GET(request: Request) {
  const browser = browserContactConfiguration(process.env)
  if (!browser) return handlers.GET(request)
  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(request.url).origin) return new Response(null, { status: 403 })
  return Response.json(browser, { headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } })
}
export const POST = handlers.POST
