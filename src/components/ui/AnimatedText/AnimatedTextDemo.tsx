"use client";

import React, { useState } from "react";
import { AnimatedText, TypewriterText, GlitchText } from "./index";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useAdaptiveAnimation } from "@/hooks/useAnimationPerformance";

export const AnimatedTextDemo: React.FC = () => {
  const { currentTheme } = useThemeContext();
  const { getOptimizedSettings, shouldReduceMotion } = useAdaptiveAnimation();
  const [glitchActive, setGlitchActive] = useState(false);

  const demoTexts = {
    typewriter: "Building the future with brutal efficiency...",
    glitch: "SYSTEM OVERRIDE",
    animated: "Welcome to the brutalist revolution",
  };

  const animations = [
    "fadeIn",
    "slideUp",
    "slideDown",
    "slideLeft",
    "slideRight",
    "scaleIn",
    "rotateIn",
    "bounceIn",
    "flipIn",
  ] as const;

  if (shouldReduceMotion()) {
    return (
      <div className="animated-text-demo">
        <h2>AnimatedText Components (Reduced Motion)</h2>
        <div className="demo-section">
          <h3>Static Text Display</h3>
          <p>{demoTexts.typewriter}</p>
          <p>{demoTexts.glitch}</p>
          <p>{demoTexts.animated}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`animated-text-demo animated-text-demo--${currentTheme}`}>
      <div className="demo-header">
        <h2 className="demo-title">AnimatedText Components Demo</h2>
        <p className="demo-subtitle">
          Showcasing TypewriterText, GlitchText, and AnimatedText components
        </p>
      </div>

      {/* TypewriterText Demo */}
      <div className="demo-section">
        <h3 className="demo-section-title">TypewriterText Component</h3>
        <div className="demo-examples">
          <div className="demo-example">
            <h4>Basic Typewriter</h4>
            <TypewriterText
              text={demoTexts.typewriter}
              speed={getOptimizedSettings({ duration: 50 }).duration || 50}
              showCursor={true}
            />
          </div>

          <div className="demo-example">
            <h4>Fast Typewriter (No Cursor)</h4>
            <TypewriterText
              text="RAPID DEPLOYMENT INITIATED"
              speed={getOptimizedSettings({ duration: 30 }).duration || 30}
              showCursor={false}
              randomizeSpeed={false}
            />
          </div>

          <div className="demo-example">
            <h4>Custom Cursor</h4>
            <TypewriterText
              text="Custom cursor demonstration ▋"
              speed={getOptimizedSettings({ duration: 60 }).duration || 60}
              cursorChar="▋"
              startDelay={500}
            />
          </div>
        </div>
      </div>

      {/* GlitchText Demo */}
      <div className="demo-section">
        <h3 className="demo-section-title">GlitchText Component</h3>
        <div className="demo-examples">
          <div className="demo-example">
            <h4>Auto Glitch (Low Intensity)</h4>
            <GlitchText
              intensity="low"
              trigger="auto"
              glitchInterval={3000}
              glitchDuration={
                getOptimizedSettings({ duration: 200 }).duration || 200
              }
            >
              {demoTexts.glitch}
            </GlitchText>
          </div>

          <div className="demo-example">
            <h4>Hover Glitch (Medium Intensity)</h4>
            <GlitchText
              intensity="medium"
              trigger="hover"
              glitchDuration={
                getOptimizedSettings({ duration: 300 }).duration || 300
              }
            >
              HOVER TO ACTIVATE
            </GlitchText>
          </div>

          <div className="demo-example">
            <h4>Manual Glitch (High Intensity)</h4>
            <div className="manual-glitch-demo">
              <GlitchText
                intensity="high"
                trigger="manual"
                isActive={glitchActive}
                glitchDuration={
                  getOptimizedSettings({ duration: 500 }).duration || 500
                }
              >
                MANUAL CONTROL
              </GlitchText>
              <button
                className="demo-button"
                onClick={() => setGlitchActive(!glitchActive)}
              >
                {glitchActive ? "Stop Glitch" : "Start Glitch"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AnimatedText Demo */}
      <div className="demo-section">
        <h3 className="demo-section-title">AnimatedText Component</h3>
        <div className="demo-examples">
          {animations.map((animation, index) => (
            <div key={animation} className="demo-example">
              <h4>
                {animation.charAt(0).toUpperCase() + animation.slice(1)}{" "}
                Animation
              </h4>
              <AnimatedText
                animation={animation}
                delay={index * 200}
                duration={
                  getOptimizedSettings({ duration: 600 }).duration || 600
                }
              >
                {demoTexts.animated}
              </AnimatedText>
            </div>
          ))}

          <div className="demo-example">
            <h4>Staggered Animation</h4>
            <AnimatedText
              animation="slideUp"
              stagger={getOptimizedSettings({ stagger: true }).stagger}
              staggerDelay={
                getOptimizedSettings({ staggerDelay: 100 }).staggerDelay || 100
              }
              delay={200}
            >
              This text animates word by word
            </AnimatedText>
          </div>
        </div>
      </div>

      {/* Combined Demo */}
      <div className="demo-section">
        <h3 className="demo-section-title">Combined Effects</h3>
        <div className="demo-examples">
          <div className="demo-example">
            <h4>Typewriter + Glitch</h4>
            <div className="combined-demo">
              <TypewriterText
                text="INITIALIZING SYSTEM... "
                speed={getOptimizedSettings({ duration: 40 }).duration || 40}
                showCursor={false}
                onComplete={() => {
                  setTimeout(() => setGlitchActive(true), 500);
                }}
              />
              <GlitchText
                trigger="manual"
                isActive={glitchActive}
                intensity="medium"
                glitchDuration={
                  getOptimizedSettings({ duration: 400 }).duration || 400
                }
              >
                COMPLETE
              </GlitchText>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedTextDemo;
