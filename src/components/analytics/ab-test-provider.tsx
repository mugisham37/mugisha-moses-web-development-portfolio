"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAnalytics } from "./analytics-provider";

interface ABTestContextType {
  getVariant: (experimentName: string) => "control" | "variant";
  trackConversion: (experimentName: string) => void;
}

const ABTestContext = createContext<ABTestContextType | null>(null);

export function useABTest() {
  const context = useContext(ABTestContext);
  if (!context) {
    throw new Error("useABTest must be used within ABTestProvider");
  }
  return context;
}

interface ABTestProviderProps {
  children: React.ReactNode;
}

export function ABTestProvider({ children }: ABTestProviderProps) {
  const { sessionId, hasConsent } = useAnalytics();
  const [assignments, setAssignments] = useState<
    Record<string, "control" | "variant">
  >({});

  const getVariant = (experimentName: string): "control" | "variant" => {
    if (!hasConsent) return "control";

    // Check if we already have an assignment for this experiment
    if (assignments[experimentName]) {
      return assignments[experimentName];
    }

    // Generate assignment based on session ID
    const hash = hashString(`${sessionId}-${experimentName}`);
    const variant = hash % 100 < 50 ? "control" : "variant"; // 50/50 split

    // Store assignment
    setAssignments((prev) => ({ ...prev, [experimentName]: variant }));

    // Send assignment to server
    if (hasConsent) {
      fetch("/api/analytics/ab-test/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          experimentName,
          variant,
        }),
      }).catch(console.error);
    }

    return variant;
  };

  const trackConversion = (experimentName: string) => {
    if (!hasConsent) return;

    const variant = assignments[experimentName];
    if (!variant) return;

    fetch("/api/analytics/ab-test/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        experimentName,
        variant,
      }),
    }).catch(console.error);
  };

  const contextValue: ABTestContextType = {
    getVariant,
    trackConversion,
  };

  return (
    <ABTestContext.Provider value={contextValue}>
      {children}
    </ABTestContext.Provider>
  );
}

// Simple hash function for consistent assignment
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}
