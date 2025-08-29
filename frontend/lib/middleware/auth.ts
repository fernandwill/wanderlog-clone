import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware protects routes that require authentication
export function authMiddleware(request: NextRequest) {
  const token = request.cookies.get('token')
  
  // If no token and trying to access protected routes, redirect to login
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // If token exists and trying to access auth pages, redirect to dashboard
  if (token && (request.nextUrl.pathname.startsWith('/auth/login') || 
                request.nextUrl.pathname.startsWith('/auth/register'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}