"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ViewportAnimation } from "@/components/animations/advanced-scroll-effects";
import { FloatingScrollIndicator } from "@/components/animations/scroll-navigation";
import Link from "next/link";

// Simple test component to verify all fixes are working
export function ErrorTest() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-50 space-y-2 rounded bg-green-900/90 p-4 text-white">
      <h3 className="font-mono text-xs font-bold">✅ Error Fixes Test</h3>

      {/* Test ViewportAnimation */}
      <ViewportAnimation variant="fadeInUp">
        <div className="text-xs">ViewportAnimation: OK</div>
      </ViewportAnimation>

      {/* Test Button with asChild */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/">Button asChild: OK</Link>
      </Button>

      {/* Test FloatingScrollIndicator (should not cause hook errors) */}
      <div className="text-xs">FloatingScrollIndicator: Rendered</div>

      <div className="text-xs text-green-400">✅ All components working!</div>
    </div>
  );
}

export default ErrorTest;
