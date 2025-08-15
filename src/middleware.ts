import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Import auth and types conditionally to avoid Prisma dependency issues
let auth: any = null;
let Role: any = null;
let shouldRedirect: any = null;

// Lazy load dependencies
async function loadDependencies() {
  if (!auth) {
    try {
      const authModule = await import("@/lib/auth");
      auth = authModule.auth;

      const prismaModule = await import("@prisma/client");
      Role = prismaModule.Role;

      const canonicalModule = await import("@/lib/canonical");
      shouldRedirect = canonicalModule.shouldRedirect;
    } catch (error) {
      console.warn("Some middleware dependencies not available:", error);
    }
  }
}

// Define protected routes and their required roles (using string constants to avoid Prisma dependency)
const protectedRoutes: Record<string, string[]> = {
  "/admin": ["ADMIN"],
  "/dashboard": ["USER", "ADMIN"],
  "/api/admin": ["ADMIN"],
  "/api/projects": ["ADMIN"], // For creating/updating projects
  "/api/blog": ["ADMIN"], // For creating/updating blog posts
};

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
];

// API routes that need rate limiting
const rateLimitedRoutes = [
  "/api/auth/register",
  "/api/contact",
  "/api/newsletter",
];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => {
    if (route === pathname) return true;
    if (route.endsWith("*")) {
      return pathname.startsWith(route.slice(0, -1));
    }
    if (pathname.startsWith(route + "/")) return true;
    return false;
  });
}

function getRequiredRoles(pathname: string): string[] | null {
  for (const [route, roles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      return roles;
    }
  }
  return null;
}

function isRateLimitedRoute(pathname: string): boolean {
  return rateLimitedRoutes.some((route) => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  ) {
    return NextResponse.next();
  }

  // Load dependencies
  await loadDependencies();

  // Handle SEO redirects (if available)
  if (shouldRedirect) {
    try {
      const redirectCheck = shouldRedirect(pathname);
      if (redirectCheck.redirect && redirectCheck.destination) {
        return NextResponse.redirect(
          new URL(redirectCheck.destination, request.url),
          301
        );
      }
    } catch (error) {
      console.warn("SEO redirect check failed:", error);
    }
  }

  // Add comprehensive security headers
  const response = NextResponse.next();

  // Core security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Strict Transport Security (HTTPS enforcement)
  if (request.nextUrl.protocol === "https:") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  // Content Security Policy
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https: wss:",
    "media-src 'self' https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ];
  response.headers.set("Content-Security-Policy", cspDirectives.join("; "));

  // Permissions Policy (Feature Policy)
  const permissionsPolicy = [
    "camera=()",
    "microphone=()",
    "geolocation=()",
    "browsing-topics=()",
    "interest-cohort=()",
  ];
  response.headers.set("Permissions-Policy", permissionsPolicy.join(", "));

  // Additional security headers
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");

  // Performance and caching headers for static assets
  if (pathname.startsWith("/_next/static/") || pathname.includes(".")) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
  }

  // Rate limiting for specific routes
  if (isRateLimitedRoute(pathname)) {
    // Rate limiting is handled in individual API routes
    // This is just a placeholder for additional middleware logic
  }

  // Check if route is public
  if (isPublicRoute(pathname)) {
    return response;
  }

  // Get session for protected routes (if auth is available)
  if (auth) {
    try {
      const session = await auth();

      // Check if user is authenticated
      if (!session?.user) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            { error: "Authentication required" },
            { status: 401 }
          );
        }

        // Redirect to sign in page
        const signInUrl = new URL("/auth/signin", request.url);
        signInUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(signInUrl);
      }

      // Check role-based access
      const requiredRoles = getRequiredRoles(pathname);
      if (requiredRoles && !requiredRoles.includes(session.user.role)) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            { error: "Insufficient permissions" },
            { status: 403 }
          );
        }

        // Redirect to unauthorized page
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch (error) {
      console.warn("Authentication check failed:", error);
      // Continue without authentication if there's an error
    }
  }

  return response;
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
};
