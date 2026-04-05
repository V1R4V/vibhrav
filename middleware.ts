import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // In this workspace, some dev chunk URLs are requested without `v` and 404.
  // Rewriting with a lightweight query parameter consistently resolves them.
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.next()
  }

  const { pathname, searchParams } = request.nextUrl
  const isChunkJs = pathname.startsWith('/_next/static/chunks/') && pathname.endsWith('.js')

  if (isChunkJs && !searchParams.has('v')) {
    const url = request.nextUrl.clone()
    url.searchParams.set('v', '1')
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/_next/static/chunks/:path*'],
}
