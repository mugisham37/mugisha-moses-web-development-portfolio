import { hash } from "bcryptjs"
import { db } from "@/lib/db"
import { Role } from "@prisma/client"

export interface AdminUserData {
  name: string
  email: string
  password: string
}

export async function createAdminUser(userData: AdminUserData) {
  try {
    // Check if admin user already exists
    const existingAdmin = await db.user.findFirst({
      where: { role: Role.ADMIN },
    })

    if (existingAdmin) {
      console.log("Admin user already exists")
      return existingAdmin
    }

    // Check if user with this email already exists
    const existingUser = await db.user.findUnique({
      where: { email: userData.email },
    })

    if (existingUser) {
      // Upgrade existing user to admin
      const adminUser = await db.user.update({
        where: { id: existingUser.id },
        data: { role: Role.ADMIN },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      })

      console.log(`Upgraded existing user ${userData.email} to admin`)
      return adminUser
    }

    // Hash password
    const hashedPassword = await hash(userData.password, 12)

    // Create new admin user
    const adminUser = await db.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: Role.ADMIN,
        emailVerified: new Date(), // Auto-verify admin user
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    console.log(`Created admin user: ${userData.email}`)
    return adminUser
  } catch (error) {
    console.error("Error creating admin user:", error)
    throw error
  }
}

export async function seedDefaultAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!@#"

  if (!adminEmail) {
    console.warn("ADMIN_EMAIL environment variable not set, skipping admin user creation")
    return null
  }

  return createAdminUser({
    name: "Administrator",
    email: adminEmail,
    password: adminPassword,
  })
}

export async function listAdminUsers() {
  try {
    const adminUsers = await db.user.findMany({
      where: { role: Role.ADMIN },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "asc" },
    })

    return adminUsers
  } catch (error) {
    console.error("Error listing admin users:", error)
    throw error
  }
}

export async function promoteUserToAdmin(userId: string) {
  try {
    const user = await db.user.update({
      where: { id: userId },
      data: { role: Role.ADMIN },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    })

    console.log(`Promoted user ${user.email} to admin`)
    return user
  } catch (error) {
    console.error("Error promoting user to admin:", error)
    throw error
  }
}

export async function demoteAdminToUser(userId: string) {
  try {
    // Ensure we don't demote the last admin
    const adminCount = await db.user.count({
      where: { role: Role.ADMIN },
    })

    if (adminCount <= 1) {
      throw new Error("Cannot demote the last admin user")
    }

    const user = await db.user.update({
      where: { id: userId },
      data: { role: Role.USER },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    })

    console.log(`Demoted admin ${user.email} to user`)
    return user
  } catch (error) {
    console.error("Error demoting admin to user:", error)
    throw error
  }
}