"use client";

import { CyclingTypewriter } from "@/components/animations/typewriter-text";

const testSpecialties = [
  "FULL-STACK DEVELOPER",
  "REACT SPECIALIST",
  "NODE.JS EXPERT",
  "TYPESCRIPT MASTER",
];

export default function TypewriterTestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-8">
      <div className="space-y-8 text-center">
        <h1 className="mb-8 text-4xl font-bold text-white">
          Typewriter Animation Test
        </h1>

        <div className="rounded-lg bg-gray-900 p-8">
          <h2 className="mb-4 text-xl text-white">
            Enhanced Cycling Typewriter:
          </h2>
          <CyclingTypewriter
            specialties={testSpecialties}
            className="font-mono text-2xl font-bold tracking-wide text-white uppercase"
            speed={75}
            deleteSpeed={35}
            pauseDuration={2000}
            startDelay={500}
            showCursor={true}
            cursorClassName="bg-yellow-400 shadow-lg"
            onSpecialtyChange={(specialty, index) => {
              console.log(
                `Specialty changed to: ${specialty} (index: ${index})`
              );
            }}
          />
        </div>

        <div className="max-w-md text-sm text-gray-400">
          <p>
            This test page demonstrates the enhanced typewriter animation system
            with:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Realistic character-by-character typing</li>
            <li>Smooth transitions between specialties</li>
            <li>Accessibility support for reduced motion</li>
            <li>Pause on hover functionality</li>
            <li>Enhanced cursor animation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
