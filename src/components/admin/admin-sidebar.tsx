"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Upload,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "DASHBOARD",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "PROJECTS",
    href: "/admin/projects",
    icon: FolderOpen,
  },
  {
    name: "BLOG POSTS",
    href: "/admin/blog",
    icon: FileText,
  },
  {
    name: "MEDIA",
    href: "/admin/media",
    icon: Upload,
  },
  {
    name: "USERS",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "TESTIMONIALS",
    href: "/admin/testimonials",
    icon: MessageSquare,
  },
  {
    name: "ANALYTICS",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "SCHEDULER",
    href: "/admin/scheduler",
    icon: Calendar,
  },
  {
    name: "SETTINGS",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="min-h-screen w-64 border-r-4 border-white bg-black">
      <div className="border-b-4 border-white p-6">
        <h1 className="font-mono text-2xl font-bold tracking-wider text-yellow-400 uppercase">
          ADMIN
        </h1>
        <p className="mt-1 font-mono text-sm text-gray-400">
          CONTENT MANAGEMENT
        </p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center border-2 px-4 py-3 font-mono text-sm font-bold tracking-wider uppercase transition-colors",
                    isActive
                      ? "border-yellow-400 bg-yellow-400 text-black"
                      : "border-transparent text-white hover:border-white hover:bg-white hover:text-black"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
