"use client";

import React from "react";
import { Navigation } from "@/components/sections/Navigation";
import { Newsletter } from "@/components/sections/Footer/Newsletter";
import { ThemeDetector } from "@/components/theme/ThemeDetector";

export default function ContactPage() {
  return (
    <ThemeDetector>
      <Navigation />
      <main className="min-h-screen bg-current text-current">
        <div className="pt-20">
          <Newsletter />
        </div>
      </main>
    </ThemeDetector>
  );
}
