"use client";

import React from "react";
import { MainHeader } from "./header";
import { MainFooter } from "./footer";
import { ScrollProgress } from "./scroll-progress";
import { SkipNav } from "./skip-nav";

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showScrollProgress?: boolean;
  className?: string;
}

export function MainLayout({
  children,
  showHeader = true,
  showFooter = true,
  showScrollProgress = true,
  className = "",
}: MainLayoutProps) {
  return (
    <div className={`min-h-screen bg-black text-white ${className}`}>
      {/* Skip Navigation */}
      <SkipNav />

      {/* Scroll Progress */}
      {showScrollProgress && <ScrollProgress />}

      {/* Header */}
      {showHeader && <MainHeader />}

      {/* Main Content */}
      <main id="main-content" className="flex-1" role="main">
        {children}
      </main>

      {/* Footer */}
      {showFooter && <MainFooter />}
    </div>
  );
}
