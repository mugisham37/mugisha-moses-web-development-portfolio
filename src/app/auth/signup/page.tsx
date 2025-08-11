import { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { SignUpForm } from "@/components/auth/signup-form"

export const metadata: Metadata = {
  title: "Sign Up | Brutalist Developer Portfolio",
  description: "Create your account",
}

export default async function SignUpPage() {
  const session = await auth()
  
  // Redirect if already authenticated
  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-black border-4 border-white p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-mono font-bold text-white uppercase tracking-wider mb-2">
              SIGN UP
            </h1>
            <p className="text-gray-300 font-mono">
              CREATE YOUR ACCOUNT
            </p>
          </div>

          <SignUpForm />

          <div className="mt-8 text-center">
            <p className="text-gray-400 font-mono text-sm">
              ALREADY HAVE AN ACCOUNT?{" "}
              <a 
                href="/auth/signin" 
                className="text-yellow-400 hover:text-yellow-300 underline font-bold"
              >
                SIGN IN
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}