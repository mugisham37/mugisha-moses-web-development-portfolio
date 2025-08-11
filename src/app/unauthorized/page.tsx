import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Unauthorized | Brutalist Developer Portfolio",
  description: "You don't have permission to access this page",
}

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-black border-4 border-yellow-400 p-8">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-mono font-bold text-yellow-400 uppercase tracking-wider mb-2">
              403
            </h1>
            <h2 className="text-2xl font-mono font-bold text-white uppercase tracking-wider mb-2">
              UNAUTHORIZED
            </h2>
            <p className="text-gray-300 font-mono">
              ACCESS DENIED
            </p>
          </div>

          <div className="bg-yellow-400/10 border-2 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-400 font-mono text-sm text-center">
              YOU DON&apos;T HAVE PERMISSION TO ACCESS THIS RESOURCE
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="block w-full bg-yellow-400 text-black font-mono font-bold py-3 px-4 text-center uppercase tracking-wider hover:bg-yellow-300 transition-colors border-2 border-yellow-400"
            >
              GO HOME
            </Link>
            
            <Link
              href="/auth/signin"
              className="block w-full bg-transparent text-white font-mono font-bold py-3 px-4 text-center uppercase tracking-wider hover:bg-white hover:text-black transition-colors border-2 border-white"
            >
              SIGN IN
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}