"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { calculateVisualBalance, type VisualBalance } from "@/lib/color-utils";

interface VisualBalanceContextType {
  balance: VisualBalance;
  getSectionBackground: (index: number) => string;
  updateSectionCount: (count: number) => void;
}

const VisualBalanceContext = createContext<
  VisualBalanceContextType | undefined
>(undefined);

interface VisualBalanceProviderProps {
  children: React.ReactNode;
  initialSectionCount?: number;
}

export function VisualBalanceProvider({
  children,
  initialSectionCount = 6,
}: VisualBalanceProviderProps) {
  const [balance, setBalance] = useState<VisualBalance>(() =>
    calculateVisualBalance(initialSectionCount)
  );

  const getSectionBackground = (index: number): string => {
    return balance.alternatingBackgrounds[
      index % balance.alternatingBackgrounds.length
    ];
  };

  const updateSectionCount = (count: number) => {
    setBalance(calculateVisualBalance(count));
  };

  const contextValue: VisualBalanceContextType = {
    balance,
    getSectionBackground,
    updateSectionCount,
  };

  return (
    <VisualBalanceContext.Provider value={contextValue}>
      {children}
    </VisualBalanceContext.Provider>
  );
}

export function useVisualBalance() {
  const context = useContext(VisualBalanceContext);
  if (context === undefined) {
    throw new Error(
      "useVisualBalance must be used within a VisualBalanceProvider"
    );
  }
  return context;
}

// Hook for automatic section background assignment
export function useSectionBackground(index: number) {
  const { getSectionBackground } = useVisualBalance();
  return getSectionBackground(index);
}

// Component for automatic visual balance application
interface AutoBalancedSectionProps {
  index: number;
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

export function AutoBalancedSection({
  index,
  children,
  className = "",
  padding = "xl",
}: AutoBalancedSectionProps) {
  const background = useSectionBackground(index);

  return (
    <section
      className={` ${padding === "none" ? "py-0" : ""} ${padding === "sm" ? "py-8" : ""} ${padding === "md" ? "py-12" : ""} ${padding === "lg" ? "py-16" : ""} ${padding === "xl" ? "py-24" : ""} ${background === "default" ? "bg-black text-white" : ""} ${background === "textured-light" ? "relative overflow-hidden bg-white text-black" : ""} ${background === "dark-gradient" ? "via-brutalist-charcoal-200 bg-gradient-to-br from-black to-black text-white" : ""} ${background === "light-gradient" ? "via-brutalist-off-white-200 to-brutalist-off-white-100 bg-gradient-to-br from-white text-black" : ""} ${background === "accent-gradient" ? "from-brutalist-yellow via-accent-yellow-light to-brutalist-yellow bg-gradient-to-br text-black" : ""} ${background === "textured-dark" ? "relative overflow-hidden bg-black text-white" : ""} section-transition transition-all duration-500 ${className} `}
    >
      {/* Texture overlays */}
      {background === "textured-light" && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-5" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_49%,rgba(0,0,0,0.05)_50%,transparent_51%)] bg-[length:40px_40px] opacity-3" />
        </>
      )}
      {background === "textured-dark" && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-5" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_49%,rgba(255,255,255,0.05)_50%,transparent_51%)] bg-[length:40px_40px] opacity-3" />
        </>
      )}

      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
