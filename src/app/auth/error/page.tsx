import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Authentication Error | Brutalist Developer Portfolio",
  description: "Authentication error occurred",
}

interface AuthErrorPageProps {
  searchParams: {
    error?: string
  }
}

const errorMessages = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An error occurred during authentication.",
}

export default function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const error = searchParams.error as keyof typeof errorMessages
  const message = errorMessages[error] || errorMessages.Default

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-black border-4 border-red-500 p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-mono font-bold text-red-500 uppercase tracking-wider mb-2">
              ERROR
            </h1>
            <p className="text-gray-300 font-mono">
              AUTHENTICATION FAILED
            </p>
          </div>

          <div className="bg-red-500/10 border-2 border-red-500 p-4 mb-6">
            <p className="text-red-400 font-mono text-sm text-center">
              {message}
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/auth/signin"
              className="block w-full bg-white text-black font-mono font-bold py-3 px-4 text-center uppercase tracking-wider hover:bg-gray-200 transition-colors border-2 border-white"
            >
              TRY AGAIN
            </Link>
            
            <Link
              href="/"
              className="block w-full bg-transparent text-white font-mono font-bold py-3 px-4 text-center uppercase tracking-wider hover:bg-white hover:text-black transition-colors border-2 border-white"
            >
              GO HOME
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}