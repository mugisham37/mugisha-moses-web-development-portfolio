"use client";

import Link from "next/link";
import { SignOutButton } from "@/components/auth/signout-button";
import { ExternalLink, Home } from "lucide-react";

interface AdminHeaderProps {
  user: {
    id: string;
    email: string;
    name?: string | null;
    role: string;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="border-b-4 border-white bg-black p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex items-center border-2 border-white px-3 py-2 font-mono text-sm font-bold tracking-wider text-white uppercase transition-colors hover:bg-white hover:text-black"
          >
            <Home className="mr-2 h-4 w-4" />
            VIEW SITE
            <ExternalLink className="ml-2 h-3 w-3" />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-mono text-sm font-bold text-white uppercase">
              {user.name || "ADMIN"}
            </p>
            <p className="font-mono text-xs text-gray-400">{user.email}</p>
          </div>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
