import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { Role } from "@prisma/client"

// Define protected routes and their required roles
const protectedRoutes: Record<string, Role[]> = {
  "/admin": [Role.ADMIN],
  "/dashboard": [Role.USER, Role.ADMIN],
  "/api/admin": [Role.ADMIN],
  "/api/projects": [Role.ADMIN], // For creating/updating projects
  "/api/blog": [Role.ADMIN], // For creating/updating blog posts
}

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/projects",
  "/blog",
  "/contact",
  "/auth/signin",
  "/auth/signup",
  "/auth/error",
  "/api/auth",
  "/api/contact",
  "/api/github",
]

// API routes that need rate limiting
const rateLimitedRoutes = [
  "/api/auth/register",
  "/api/contact",
  "/api/newsletter",
]

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => {
    if (route === pathname) return true
    if (route.endsWith("*")) {
      return pathname.startsWith(route.slice(0, -1))
    }
    if (pathname.startsWith(route + "/")) return true
    return false
  })
}

function getRequiredRoles(pathname: string): Role[] | null {
  for (const [route, roles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      return roles
    }
  }
  return null
}

function isRateLimitedRoute(pathname: string): boolean {
  return rateLimitedRoutes.some(route => pathname.startsWith(route))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  // Add security headers
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
  )

  // Rate limiting for specific routes
  if (isRateLimitedRoute(pathname)) {
    // Rate limiting is handled in individual API routes
    // This is just a placeholder for additional middleware logic
  }

  // Check if route is public
  if (isPublicRoute(pathname)) {
    return response
  }

  // Get session for protected routes
  const session = await auth()

  // Check if user is authenticated
  if (!session?.user) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }
    
    // Redirect to sign in page
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Check role-based access
  const requiredRoles = getRequiredRoles(pathname)
  if (requiredRoles && !requiredRoles.includes(session.user.role)) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      )
    }
    
    // Redirect to unauthorized page
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}