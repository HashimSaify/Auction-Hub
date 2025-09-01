import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the path starts with /admin
  if (pathname.startsWith('/admin')) {
    // Get the token from the cookies
    const token = request.cookies.get('auth-token')?.value
    
    // If no token, redirect to signin
    if (!token) {
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }
    
    try {
      // Verify the token and check if user is admin
      const response = await fetch(new URL('/api/auth/me', request.url).toString(), {
        headers: {
          'Cookie': `auth-token=${token}`
        },
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }
      
      const data = await response.json()
      
      // If user is not an admin, redirect to home
      if (!data.user || data.user.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url))
      }
      
      // Allow the request to continue to the admin page
      return NextResponse.next()
    } catch (error) {
      console.error('Admin middleware error:', error)
      // If there's an error, redirect to signin
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth/ (auth routes)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth/).*)',
  ],
}
