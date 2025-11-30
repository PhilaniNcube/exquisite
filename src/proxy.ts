import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { User } from './payload-types'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    // Allow access to the login page to prevent infinite loops
    if (pathname === '/admin/login' || pathname === '/sys-admin/login') {
      return NextResponse.next()
    }

    try {
      const payload = await getPayload({ config: await configPromise })
      const { user } = await payload.auth({ headers: request.headers })

      if (!user) {
        return NextResponse.redirect(new URL('/sys-admin/login', request.url))
      }

      // Check if user is from the 'users' collection (admins)
      if (user.collection !== 'users') {
        return NextResponse.redirect(new URL('/sys-admin/login', request.url))
      }

      // Check for admin role
      const adminUser = user as unknown as User
      if (!adminUser.roles?.includes('admin')) {
        return NextResponse.redirect(new URL('/sys-admin/login', request.url))
      }
    } catch (error) {
      console.error('Middleware auth error:', error)
      return NextResponse.redirect(new URL('/sys-admin/login', request.url))
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

