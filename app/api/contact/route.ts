import { createContactHandlers } from '@/lib/contact/server.mjs'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const handlers = createContactHandlers()
export const GET = handlers.GET
export const POST = handlers.POST
