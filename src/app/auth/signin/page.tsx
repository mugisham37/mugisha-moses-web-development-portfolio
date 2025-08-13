import { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { SignInForm } from "@/components/auth/signin-form"

export const metadata: Metadata = {
  title: "Sign In | Brutalist Developer Portfolio",
  description: "Sign in to access your account",
}

interface SignInPageProps {
  searchParams: Promise<{
    callbackUrl?: string
    error?: string
  }>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await auth()
  const params = await searchParams
  
  // Redirect if already authenticated
  if (session?.user) {
    redirect(params.callbackUrl || "/dashboard")
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-black border-4 border-white p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-mono font-bold text-white uppercase tracking-wider mb-2">
              SIGN IN
            </h1>
            <p className="text-gray-300 font-mono">
              ACCESS YOUR ACCOUNT
            </p>
          </div>

          <SignInForm 
            callbackUrl={params.callbackUrl}
            error={params.error}
          />

          <div className="mt-8 text-center">
            <p className="text-gray-400 font-mono text-sm">
              DON&apos;T HAVE AN ACCOUNT?{" "}
              <a 
                href="/auth/signup" 
                className="text-yellow-400 hover:text-yellow-300 underline font-bold"
              >
                SIGN UP
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}