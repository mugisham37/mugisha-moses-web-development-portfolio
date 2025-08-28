"use client";

import React from "react";
import { Navigation } from "@/components/sections/Navigation";
import { Resources } from "@/components/pages/Resources";
import { FooterBottomOnly } from "@/components/sections/Footer";
import { ThemeDetector } from "@/components/theme/ThemeDetector";

export default function ProjectsPage() {
  return (
    <ThemeDetector>
      <Navigation />
      <main className="min-h-screen bg-current text-current">
        <div className="pt-20">
          <Resources />
        </div>
      </main>
      <FooterBottomOnly />
    </ThemeDetector>
  );
}
