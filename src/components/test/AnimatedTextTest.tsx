"use client";

import React from "react";
import {
  AnimatedText,
  TypewriterText,
  GlitchText,
} from "@/components/ui/AnimatedText";

export const AnimatedTextTest: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">AnimatedText Components Test</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">TypewriterText</h2>
        <TypewriterText
          text="This is a test of the TypewriterText component..."
          speed={50}
          showCursor={true}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">GlitchText</h2>
        <GlitchText trigger="hover" intensity="medium">
          Hover me to see the glitch effect!
        </GlitchText>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">AnimatedText</h2>
        <AnimatedText animation="slideUp" delay={500}>
          This text slides up when it comes into view
        </AnimatedText>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Staggered Animation</h2>
        <AnimatedText animation="fadeIn" stagger={true} staggerDelay={100}>
          Each word appears one by one
        </AnimatedText>
      </div>
    </div>
  );
};

export default AnimatedTextTest;
