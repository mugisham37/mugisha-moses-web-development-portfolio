import { auth } from "@/lib/auth"
import { Role } from "@prisma/client"
import { redirect } from "next/navigation"

export async function requireAuth() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/auth/signin")
  }
  
  return session
}

export async function requireAdmin() {
  const session = await requireAuth()
  
  if (session.user.role !== Role.ADMIN) {
    redirect("/unauthorized")
  }
  
  return session
}

export async function requireRole(role: Role) {
  const session = await requireAuth()
  
  if (session.user.role !== role) {
    redirect("/unauthorized")
  }
  
  return session
}

export async function requireRoles(roles: Role[]) {
  const session = await requireAuth()
  
  if (!roles.includes(session.user.role)) {
    redirect("/unauthorized")
  }
  
  return session
}

export async function getOptionalAuth() {
  try {
    const session = await auth()
    return session
  } catch {
    return null
  }
}

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  if (requiredRole === Role.USER) {
    return userRole === Role.USER || userRole === Role.ADMIN
  }
  
  if (requiredRole === Role.ADMIN) {
    return userRole === Role.ADMIN
  }
  
  return false
}

export function hasAnyRole(userRole: Role, requiredRoles: Role[]): boolean {
  return requiredRoles.some(role => hasRole(userRole, role))
}