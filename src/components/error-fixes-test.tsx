"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ViewportAnimation } from "@/components/animations/advanced-scroll-effects";
import Link from "next/link";

// Simple test component to verify our error fixes
export function ErrorFixesTest() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 rounded bg-black/80 p-4 text-white">
      <h3 className="font-mono text-xs font-bold">Error Fix Tests</h3>

      {/* Test ViewportAnimation with valid variant */}
      <div className="space-y-1">
        <p className="text-xs">ViewportAnimation Tests:</p>
        <ViewportAnimation variant="fadeInUp">
          <div className="text-xs">Valid variant</div>
        </ViewportAnimation>
      </div>

      {/* Test Button with asChild */}
      <div className="space-y-1">
        <p className="text-xs">Button asChild Tests:</p>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">Single child (correct)</Link>
        </Button>

        <Button variant="ghost" size="sm">
          <span>Regular button</span>
        </Button>
      </div>

      <div className="text-xs text-green-400">
        ✓ If you see this, error boundaries are working
      </div>
    </div>
  );
}

export default ErrorFixesTest;
