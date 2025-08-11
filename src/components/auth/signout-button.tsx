"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <Button
      onClick={handleSignOut}
      className="bg-red-500 text-white font-mono font-bold py-2 px-4 uppercase tracking-wider hover:bg-red-400 transition-colors border-2 border-red-500"
    >
      SIGN OUT
    </Button>
  )
}