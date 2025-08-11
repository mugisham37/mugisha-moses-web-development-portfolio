import { NextRequest } from "next/server"

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: Date
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class RateLimiter {
  private store: RateLimitStore = {}
  private maxRequests: number
  private windowMs: number

  constructor(limit: number = 10, windowMs: number = 15 * 60 * 1000) {
    this.maxRequests = limit
    this.windowMs = windowMs
  }

  async limit(identifier: string): Promise<RateLimitResult> {
    const now = Date.now()
    const windowStart = now - this.windowMs

    // Clean up old entries
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime < windowStart) {
        delete this.store[key]
      }
    })

    // Get or create entry for this identifier
    if (!this.store[identifier]) {
      this.store[identifier] = {
        count: 0,
        resetTime: now + this.windowMs
      }
    }

    const entry = this.store[identifier]

    // Reset if window has passed
    if (entry.resetTime < now) {
      entry.count = 0
      entry.resetTime = now + this.windowMs
    }

    // Increment count
    entry.count++

    const success = entry.count <= this.maxRequests
    const remaining = Math.max(0, this.maxRequests - entry.count)
    const reset = new Date(entry.resetTime)

    return {
      success,
      limit: this.maxRequests,
      remaining,
      reset
    }
  }
}

// Create rate limiter instances for different use cases
export const rateLimit = new RateLimiter(10, 15 * 60 * 1000) // 10 requests per 15 minutes
export const authRateLimit = new RateLimiter(5, 15 * 60 * 1000) // 5 auth attempts per 15 minutes
export const apiRateLimit = new RateLimiter(100, 60 * 1000) // 100 API requests per minute

// Utility to get client IP from request
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  // Fallback to a default identifier
  return "unknown"
}

// CSRF protection utility
export function generateCSRFToken(): string {
  return crypto.randomUUID()
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  // In a real implementation, you'd store and validate CSRF tokens
  // For now, we'll use a simple validation
  return Boolean(token && sessionToken && token.length > 0)
}