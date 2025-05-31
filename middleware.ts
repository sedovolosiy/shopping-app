import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Log all API requests
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log(`[MIDDLEWARE] ${request.method} Request to ${request.nextUrl.pathname}`)
  }

  // Check if Gemini API key exists for AI endpoint
  if (request.nextUrl.pathname === '/api/shopping-list' && request.method === 'POST') {
    const hasKey = process.env.GOOGLE_GEMINI_API_KEY?.length > 0
    console.log(`[MIDDLEWARE] Gemini API key available: ${hasKey ? 'Yes' : 'No'}`)
    
    if (!hasKey) {
      console.warn('[MIDDLEWARE] Google Gemini API key not configured')
      // Could return warning header but allowing request to proceed to use fallback
      // return NextResponse.json({ error: 'API key not configured' }, { status: 503 })
    }
  }

  return NextResponse.next()
}

// Only run middleware on API routes
export const config = {
  matcher: '/api/:path*',
}
