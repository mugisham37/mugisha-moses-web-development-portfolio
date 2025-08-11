"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

interface SignInFormProps {
  callbackUrl?: string
  error?: string
}

export function SignInForm({ callbackUrl, error }: SignInFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setFormError(null)
    setFieldErrors({})

    try {
      // Validate form data
      const validatedData = signInSchema.parse(formData)

      // Attempt sign in
      const result = await signIn("credentials", {
        email: validatedData.email,
        password: validatedData.password,
        redirect: false,
      })

      if (result?.error) {
        setFormError("Invalid email or password")
      } else if (result?.ok) {
        router.push(callbackUrl || "/dashboard")
        router.refresh()
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

  const handleOAuthSignIn = async (provider: "github" | "google") => {
    setIsLoading(true)
    try {
      await signIn(provider, { callbackUrl: callbackUrl || "/dashboard" })
    } catch (error) {
      setFormError("OAuth sign in failed")
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {(error || formError) && (
        <div className="bg-red-500/10 border-2 border-red-500 p-4">
          <p className="text-red-400 font-mono text-sm text-center">
            {error === "CredentialsSignin" ? "Invalid email or password" : formError || "Authentication failed"}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-yellow-400 text-black font-mono font-bold py-3 uppercase tracking-wider hover:bg-yellow-300 disabled:opacity-50"
        >
          {isLoading ? "SIGNING IN..." : "SIGN IN"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-black px-2 text-gray-400 font-mono">OR</span>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          onClick={() => handleOAuthSignIn("github")}
          disabled={isLoading}
          className="w-full bg-transparent text-white font-mono font-bold py-3 uppercase tracking-wider hover:bg-white hover:text-black transition-colors border-2 border-white disabled:opacity-50"
        >
          CONTINUE WITH GITHUB
        </Button>

        <Button
          type="button"
          onClick={() => handleOAuthSignIn("google")}
          disabled={isLoading}
          className="w-full bg-transparent text-white font-mono font-bold py-3 uppercase tracking-wider hover:bg-white hover:text-black transition-colors border-2 border-white disabled:opacity-50"
        >
          CONTINUE WITH GOOGLE
        </Button>
      </div>
    </div>
  )
}