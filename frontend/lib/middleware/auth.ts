import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware protects routes that require authentication
export function authMiddleware(request: NextRequest) {
  // Check for the auth-storage cookie
  const authCookie = request.cookies.get('auth-storage')
  
  // Check if user is authenticated
  let isAuthenticated = false
  if (authCookie) {
    try {
      // The zustand persist middleware stores data as a JSON string
      const authData = JSON.parse(decodeURIComponent(authCookie.value))
      // Check if we have a token in the state
      isAuthenticated = !!(authData?.state?.token)
    } catch (e) {
      // If we can't parse the cookie, treat as unauthenticated
      isAuthenticated = false
    }
  }
  
  // If not authenticated and trying to access protected routes, redirect to login
  if (!isAuthenticated && request.nextUrl.pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // If authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthenticated && (request.nextUrl.pathname.startsWith('/auth/login') || 
                request.nextUrl.pathname.startsWith('/auth/register'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}