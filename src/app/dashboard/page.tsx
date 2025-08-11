import { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { SignOutButton } from "@/components/auth/signout-button"

export const metadata: Metadata = {
  title: "Dashboard | Brutalist Developer Portfolio",
  description: "User dashboard",
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black border-4 border-white p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-mono font-bold text-white uppercase tracking-wider mb-2">
                DASHBOARD
              </h1>
              <p className="text-gray-300 font-mono">
                WELCOME BACK, {session.user.name?.toUpperCase() || "USER"}
              </p>
            </div>
            <SignOutButton />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Info Card */}
            <div className="bg-black border-2 border-yellow-400 p-6">
              <h2 className="text-xl font-mono font-bold text-yellow-400 uppercase mb-4">
                USER INFO
              </h2>
              <div className="space-y-2 text-white font-mono text-sm">
                <p><span className="text-gray-400">NAME:</span> {session.user.name || "N/A"}</p>
                <p><span className="text-gray-400">EMAIL:</span> {session.user.email}</p>
                <p><span className="text-gray-400">ROLE:</span> {session.user.role}</p>
                <p><span className="text-gray-400">ID:</span> {session.user.id}</p>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-black border-2 border-white p-6">
              <h2 className="text-xl font-mono font-bold text-white uppercase mb-4">
                QUICK ACTIONS
              </h2>
              <div className="space-y-3">
                <a
                  href="/"
                  className="block w-full bg-transparent text-white font-mono font-bold py-2 px-4 text-center uppercase tracking-wider hover:bg-white hover:text-black transition-colors border border-white text-sm"
                >
                  VIEW SITE
                </a>
                {session.user.role === "ADMIN" && (
                  <a
                    href="/admin"
                    className="block w-full bg-yellow-400 text-black font-mono font-bold py-2 px-4 text-center uppercase tracking-wider hover:bg-yellow-300 transition-colors text-sm"
                  >
                    ADMIN PANEL
                  </a>
                )}
              </div>
            </div>

            {/* Session Info Card */}
            <div className="bg-black border-2 border-gray-600 p-6">
              <h2 className="text-xl font-mono font-bold text-gray-400 uppercase mb-4">
                SESSION
              </h2>
              <div className="space-y-2 text-white font-mono text-sm">
                <p><span className="text-gray-400">STATUS:</span> ACTIVE</p>
                <p><span className="text-gray-400">EXPIRES:</span> {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                <p><span className="text-gray-400">SECURE:</span> YES</p>
              </div>
            </div>
          </div>

          {session.user.role === "ADMIN" && (
            <div className="mt-8 bg-red-500/10 border-2 border-red-500 p-6">
              <h2 className="text-xl font-mono font-bold text-red-400 uppercase mb-4">
                ADMIN PRIVILEGES
              </h2>
              <p className="text-red-400 font-mono text-sm mb-4">
                You have administrative access to this system.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="/admin/users"
                  className="block bg-transparent text-red-400 font-mono font-bold py-2 px-4 text-center uppercase tracking-wider hover:bg-red-400 hover:text-black transition-colors border border-red-400 text-sm"
                >
                  MANAGE USERS
                </a>
                <a
                  href="/admin/content"
                  className="block bg-transparent text-red-400 font-mono font-bold py-2 px-4 text-center uppercase tracking-wider hover:bg-red-400 hover:text-black transition-colors border border-red-400 text-sm"
                >
                  MANAGE CONTENT
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}