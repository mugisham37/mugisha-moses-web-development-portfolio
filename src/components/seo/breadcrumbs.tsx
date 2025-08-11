"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { BreadcrumbsStructuredData } from "./structured-data";

export interface BreadcrumbItem {
  name: string;
  url: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const allItems = [{ name: "Home", url: "/" }, ...items];

  return (
    <>
      <BreadcrumbsStructuredData items={allItems} />
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center space-x-2 text-sm ${className}`}
      >
        <Link
          href="/"
          className="flex items-center text-white/70 transition-colors duration-200 hover:text-yellow-400"
        >
          <Home className="h-4 w-4" />
          <span className="sr-only">Home</span>
        </Link>

        {items.map((item, index) => (
          <div key={item.url} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4 text-white/50" />
            {item.current || index === items.length - 1 ? (
              <span className="font-mono tracking-wider text-yellow-400 uppercase">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.url}
                className="font-mono tracking-wider text-white/70 uppercase transition-colors duration-200 hover:text-yellow-400"
              >
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
