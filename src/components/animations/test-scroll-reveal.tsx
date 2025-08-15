"use client";

import React from "react";
import { ScrollReveal, ScrollRevealStagger } from "./scroll-reveal-system";

export function TestScrollReveal() {
  return (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold">Animation Tests</h2>

      {/* Test basic ScrollReveal */}
      <ScrollReveal animation="fadeInUp">
        <div className="rounded bg-blue-100 p-4">Basic fadeInUp animation</div>
      </ScrollReveal>

      {/* Test ScrollReveal with valid animation */}
      <ScrollReveal animation="scaleIn">
        <div className="rounded bg-green-100 p-4">ScaleIn animation</div>
      </ScrollReveal>

      {/* Test ScrollReveal with invalid animation (should fallback) */}
      <ScrollReveal animation="nonExistentAnimation" as any>
        <div className="rounded bg-yellow-100 p-4">
          Invalid animation (should fallback to fadeInUp)
        </div>
      </ScrollReveal>

      {/* Test ScrollRevealStagger with valid animation */}
      <ScrollRevealStagger animation="scale" className="space-y-4">
        <div className="rounded bg-purple-100 p-4">Stagger item 1</div>
        <div className="rounded bg-purple-100 p-4">Stagger item 2</div>
        <div className="rounded bg-purple-100 p-4">Stagger item 3</div>
      </ScrollRevealStagger>

      {/* Test ScrollRevealStagger with invalid animation */}
      <ScrollRevealStagger
        animation="invalidAnimation"
        as
        any
        className="space-y-4"
      >
        <div className="rounded bg-red-100 p-4">Invalid stagger item 1</div>
        <div className="rounded bg-red-100 p-4">Invalid stagger item 2</div>
        <div className="rounded bg-red-100 p-4">Invalid stagger item 3</div>
      </ScrollRevealStagger>
    </div>
  );
}
