import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({
      request,
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Refresh session if expired - required for Server Components
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Public routes that don't require authentication
    const publicRoutes = ['/products', '/product']
    const isPublicRoute = publicRoutes.some(route => 
      request.nextUrl.pathname === route || 
      request.nextUrl.pathname.startsWith(route + '/')
    )

    // Allow API routes and auth pages without authentication
    const isApiRoute = request.nextUrl.pathname.startsWith('/api')
    const isAuthPage = request.nextUrl.pathname.startsWith('/auth')

    // Protected routes - redirect to login if not authenticated
    if (!user && !isAuthPage && !isApiRoute && !isPublicRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      url.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // Redirect authenticated users away from auth pages
    if (user && request.nextUrl.pathname.startsWith('/auth')) {
      const redirect = request.nextUrl.searchParams.get('redirect') || '/'
      return NextResponse.redirect(new URL(redirect, request.url))
    }

    return supabaseResponse
  } catch (error) {
    // If middleware fails, allow the request to proceed
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

