"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export function SignUpForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setFormError(null)
    setFieldErrors({})

    try {
      // Validate form data
      const validatedData = signUpSchema.parse(formData)

      // Submit registration
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: validatedData.name,
          email: validatedData.email,
          password: validatedData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.details) {
          // Handle validation errors from server
          const errors: Record<string, string> = {}
          data.details.forEach((error: any) => {
            if (error.path[0]) {
              errors[error.path[0]] = error.message
            }
          })
          setFieldErrors(errors)
        } else {
          setFormError(data.error || "Registration failed")
        }
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push("/auth/signin?message=Registration successful")
        }, 2000)
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            errors[issue.path[0] as string] = issue.message
          }
        })
        setFieldErrors(errors)
      } else {
        setFormError("An unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-500/10 border-2 border-green-500 p-6 text-center">
        <h3 className="text-green-400 font-mono font-bold text-lg mb-2">
          REGISTRATION SUCCESSFUL!
        </h3>
        <p className="text-green-400 font-mono text-sm">
          Redirecting to sign in page...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {formError && (
        <div className="bg-red-500/10 border-2 border-red-500 p-4">
          <p className="text-red-400 font-mono text-sm text-center">
            {formError}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-white font-mono uppercase text-sm">
            NAME
          </Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 bg-black border-2 border-white text-white font-mono focus:border-yellow-400"
            disabled={isLoading}
          />
          {fieldErrors.name && (
            <p className="text-red-400 font-mono text-xs mt-1">{fieldErrors.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="text-white font-mono uppercase text-sm">
            EMAIL
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 bg-black border-2 border-white text-white font-mono focus:border-yellow-400"
            disabled={isLoading}
          />
          {fieldErrors.email && (
            <p className="text-red-400 font-mono text-xs mt-1">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password" className="text-white font-mono uppercase text-sm">
            PASSWORD
          </Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="mt-1 bg-black border-2 border-white text-white font-mono focus:border-yellow-400"
            disabled={isLoading}
          />
          {fieldErrors.password && (
            <p className="text-red-400 font-mono text-xs mt-1">{fieldErrors.password}</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-white font-mono uppercase text-sm">
            CONFIRM PASSWORD
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="mt-1 bg-black border-2 border-white text-white font-mono focus:border-yellow-400"
            disabled={isLoading}
          />
          {fieldErrors.confirmPassword && (
            <p className="text-red-400 font-mono text-xs mt-1">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-yellow-400 text-black font-mono font-bold py-3 uppercase tracking-wider hover:bg-yellow-300 disabled:opacity-50"
        >
          {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
        </Button>
      </form>

      <div className="bg-gray-800/50 border border-gray-600 p-4">
        <p className="text-gray-400 font-mono text-xs">
          PASSWORD REQUIREMENTS:
        </p>
        <ul className="text-gray-400 font-mono text-xs mt-2 space-y-1">
          <li>• At least 8 characters</li>
          <li>• One uppercase letter</li>
          <li>• One lowercase letter</li>
          <li>• One number</li>
          <li>• One special character</li>
        </ul>
      </div>
    </div>
  )
}