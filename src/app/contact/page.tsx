"use client";

import React from "react";
import { Navigation } from "@/components/sections/Navigation";
import { Newsletter } from "@/components/sections/Footer/Newsletter";
import { FooterBottomOnly } from "@/components/sections/Footer";
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
      <FooterBottomOnly />
    </ThemeDetector>
  );
}
