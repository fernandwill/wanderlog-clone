import { authMiddleware } from '@/lib/middleware/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Apply auth middleware
  return authMiddleware(request)
}

// Configure which routes to run middleware on
export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*']
}