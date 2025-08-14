"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ASCIIPortraitProps {
  imageUrl?: string;
  width?: number;
  height?: number;
  fontSize?: number;
  className?: string;
  autoStart?: boolean;
  loop?: boolean;
  onComplete?: () => void;
  responsive?: boolean;
  accessibilityLabel?: string;
  performanceMode?: "high" | "balanced" | "low";
}

// ASCII character mapping for 9-level brightness detection
const ASCII_CHARS = {
  0: " ", // Empty space (lightest)
  1: ".", // Very light
  2: ":", // Light
  3: "-", // Medium-light
  4: "=", // Medium
  5: "+", // Medium-dark
  6: "*", // Dark
  7: "#", // Very dark
  8: "@", // Darkest (highest contrast)
};

// Animation timeline configuration
const ANIMATION_CONFIG = {
  phase1: { duration: 2000, effect: "randomCharacterCycling" },
  phase2: { duration: 2000, effect: "gradualFormation" },
  phase3: { duration: 1000, effect: "detailRefinement" },
  phase4: { duration: 200, effect: "glitchTransition" },
  phase5: { duration: 1000, effect: "photoReveal" },
};

export function ASCIIPortrait({
  imageUrl = "/images/portrait-placeholder.svg",
  width = 60,
  height = 45,
  fontSize = 10,
  className,
  autoStart = true,
  loop = true,
  onComplete,
  responsive = true,
  accessibilityLabel = "ASCII art portrait of the developer",
  performanceMode = "balanced",
}: ASCIIPortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width, height, fontSize });
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Animation state
  const animationState = useRef({
    currentPhase: 0,
    phaseProgress: 0,
    isAnimating: false,
    startTime: 0,
    frameCount: 0,
  });

  // ASCII data storage
  const asciiData = useRef({
    target: [] as string[][],
    current: [] as string[][],
    random: [] as string[][],
  });

  const imageRef = useRef<HTMLImageElement | null>(null);
  const imageDataRef = useRef<ImageData | null>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Intersection Observer for performance optimization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(canvas);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Responsive sizing
  useEffect(() => {
    if (!responsive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateDimensions = () => {
      const container = canvas.parentElement;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // Calculate responsive dimensions based on container size
      // const aspectRatio = width / height; // Reserved for future use
      // const maxWidth = Math.min(containerWidth * 0.9, 600); // Reserved for future use
      // const maxHeight = Math.min(containerHeight * 0.9, 450); // Reserved for future use

      let newWidth = width;
      let newHeight = height;
      let newFontSize = fontSize;

      if (containerWidth < 768) {
        // Mobile adjustments
        newWidth = Math.floor(width * 0.7);
        newHeight = Math.floor(height * 0.7);
        newFontSize = Math.max(fontSize * 0.8, 8);
      } else if (containerWidth < 1024) {
        // Tablet adjustments
        newWidth = Math.floor(width * 0.85);
        newHeight = Math.floor(height * 0.85);
        newFontSize = Math.max(fontSize * 0.9, 9);
      }

      setDimensions({
        width: newWidth,
        height: newHeight,
        fontSize: newFontSize,
      });
    };

    // Initial sizing
    updateDimensions();

    // Set up ResizeObserver for responsive updates
    resizeObserverRef.current = new ResizeObserver(updateDimensions);
    resizeObserverRef.current.observe(canvas.parentElement || canvas);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [responsive, width, height, fontSize]);

  // Main initialization effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initializeASCII = async () => {
      try {
        await loadImage();
        setupCanvas(canvas, ctx);
        generateASCIIData(ctx);
        generateRandomData();
        setIsLoaded(true);

        if (autoStart && !prefersReducedMotion) {
          startAnimation(ctx);
        } else if (prefersReducedMotion) {
          // Show static final state for reduced motion users
          renderStaticFinal(ctx);
        }
      } catch (err) {
        console.error("ASCII Portrait initialization failed:", err);
        setError("Failed to load portrait");
        showFallback(canvas, ctx);
      }
    };

    initializeASCII();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, dimensions, autoStart, isVisible, prefersReducedMotion]);

  const loadImage = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        imageRef.current = img;
        resolve();
      };

      img.onerror = () => {
        reject(new Error("Failed to load portrait image"));
      };

      img.src = imageUrl;
    });
  }, [imageUrl]);

  const setupCanvas = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) => {
    // Use responsive dimensions
    const {
      width: currentWidth,
      height: currentHeight,
      fontSize: currentFontSize,
    } = dimensions;

    // Set canvas dimensions based on ASCII grid and font size
    const canvasWidth = currentWidth * currentFontSize * 0.6;
    const canvasHeight = currentHeight * currentFontSize;

    // Set actual canvas size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Set display size for responsive scaling
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    canvas.style.maxWidth = `${canvasWidth}px`;

    // Configure context with performance optimizations
    ctx.font = `${currentFontSize}px 'Space Mono', 'JetBrains Mono', monospace`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#ffffff";

    // Performance optimizations
    if (performanceMode === "high") {
      ctx.imageSmoothingEnabled = false;
      // Note: textRenderingOptimization is not a standard property
      // but we'll keep it for potential future browser support
    } else if (performanceMode === "low") {
      ctx.imageSmoothingEnabled = true;
    }
  };

  const generateASCIIData = (ctx: CanvasRenderingContext2D) => {
    if (!imageRef.current) return;

    // Use responsive dimensions
    const { width: currentWidth, height: currentHeight } = dimensions;

    // Create temporary canvas for image processing
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    tempCanvas.width = currentWidth;
    tempCanvas.height = currentHeight;

    // Draw and scale image
    tempCtx.drawImage(
      imageRef.current,
      0,
      0,
      imageRef.current.width,
      imageRef.current.height,
      0,
      0,
      currentWidth,
      currentHeight
    );

    // Get image data
    imageDataRef.current = tempCtx.getImageData(
      0,
      0,
      currentWidth,
      currentHeight
    );

    // Convert to ASCII
    asciiData.current.target = [];
    asciiData.current.current = [];

    for (let y = 0; y < currentHeight; y++) {
      const row: string[] = [];
      const currentRow: string[] = [];

      for (let x = 0; x < currentWidth; x++) {
        const pixelIndex = (y * currentWidth + x) * 4;
        const r = imageDataRef.current!.data[pixelIndex];
        const g = imageDataRef.current!.data[pixelIndex + 1];
        const b = imageDataRef.current!.data[pixelIndex + 2];

        // Calculate brightness (0-255)
        const brightness = (r + g + b) / 3;

        // Map brightness to ASCII character (0-8)
        const charIndex = Math.floor((brightness / 255) * 8);
        const asciiChar =
          ASCII_CHARS[(8 - charIndex) as keyof typeof ASCII_CHARS]; // Invert for proper contrast

        row.push(asciiChar);
        currentRow.push(" "); // Start with empty spaces
      }

      asciiData.current.target.push(row);
      asciiData.current.current.push(currentRow);
    }
  };

  const generateRandomData = () => {
    const { width: currentWidth, height: currentHeight } = dimensions;
    asciiData.current.random = [];
    const chars = Object.values(ASCII_CHARS);

    for (let y = 0; y < currentHeight; y++) {
      const row: string[] = [];
      for (let x = 0; x < currentWidth; x++) {
        const randomChar = chars[Math.floor(Math.random() * chars.length)];
        row.push(randomChar);
      }
      asciiData.current.random.push(row);
    }
  };

  const renderStaticFinal = (_ctx: CanvasRenderingContext2D) => {
    // For users with reduced motion preference, show final state immediately
    const { width: currentWidth, height: currentHeight } = dimensions;

    for (let y = 0; y < currentHeight; y++) {
      for (let x = 0; x < currentWidth; x++) {
        asciiData.current.current[y][x] = asciiData.current.target[y][x];
      }
    }

    render(ctx);
  };

  const startAnimation = (ctx: CanvasRenderingContext2D) => {
    if (animationState.current.isAnimating || !isVisible) return;

    animationState.current.isAnimating = true;
    animationState.current.currentPhase = 1;
    animationState.current.startTime = performance.now();
    animationState.current.frameCount = 0;

    // Performance optimization: reduce frame rate for low performance mode
    const targetFPS =
      performanceMode === "low" ? 30 : performanceMode === "balanced" ? 45 : 60;
    const frameInterval = 1000 / targetFPS;
    let lastFrameTime = 0;

    const animate = (currentTime: number = performance.now()) => {
      if (!animationState.current.isAnimating || !isVisible) return;

      // Frame rate limiting for performance
      if (currentTime - lastFrameTime < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = currentTime;

      const elapsed = currentTime - animationState.current.startTime;
      animationState.current.frameCount++;

      // Determine current phase and progress
      updatePhaseProgress(elapsed);

      // Execute current phase animation
      executePhaseAnimation();

      // Render current state
      render(ctx);

      // Continue animation or finish
      if (animationState.current.currentPhase <= 5) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        finishAnimation(ctx);
      }
    };

    animate();
  };

  const updatePhaseProgress = (elapsed: number) => {
    let totalDuration = 0;
    let currentPhaseDuration = 0;

    // Calculate which phase we're in
    for (let phase = 1; phase <= 5; phase++) {
      const phaseDuration =
        ANIMATION_CONFIG[`phase${phase}` as keyof typeof ANIMATION_CONFIG]
          .duration;

      if (elapsed <= totalDuration + phaseDuration) {
        animationState.current.currentPhase = phase;
        currentPhaseDuration = phaseDuration;
        break;
      }

      totalDuration += phaseDuration;
    }

    // Calculate progress within current phase (0-1)
    const phaseElapsed = elapsed - totalDuration;
    animationState.current.phaseProgress = Math.min(
      phaseElapsed / currentPhaseDuration,
      1
    );
  };

  const executePhaseAnimation = () => {
    const phase = animationState.current.currentPhase;
    const progress = animationState.current.phaseProgress;

    switch (phase) {
      case 1:
        animateRandomCharacterCycling();
        break;
      case 2:
        animateGradualFormation(progress);
        break;
      case 3:
        animateDetailRefinement();
        break;
      case 4:
        animateGlitchTransition(progress);
        break;
      case 5:
        animatePhotoReveal(progress);
        break;
    }
  };

  const animateRandomCharacterCycling = () => {
    // Continuously cycle through random characters
    if (animationState.current.frameCount % 3 === 0) {
      generateRandomData();
    }

    // Copy random data to current display
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        asciiData.current.current[y][x] = asciiData.current.random[y][x];
      }
    }
  };

  const animateGradualFormation = (progress: number) => {
    // Gradually reveal the target image from random
    const { width: currentWidth, height: currentHeight } = dimensions;
    const revealThreshold = progress;

    for (let y = 0; y < currentHeight; y++) {
      for (let x = 0; x < currentWidth; x++) {
        // Use a noise-like pattern for organic reveal
        const noise = (Math.sin(x * 0.1) + Math.cos(y * 0.1)) * 0.5 + 0.5;
        const adjustedThreshold = revealThreshold + (noise - 0.5) * 0.3;

        if (Math.random() < adjustedThreshold) {
          asciiData.current.current[y][x] = asciiData.current.target[y][x];
        } else {
          // Keep some randomness
          if (animationState.current.frameCount % 5 === 0) {
            const chars = Object.values(ASCII_CHARS);
            asciiData.current.current[y][x] =
              chars[Math.floor(Math.random() * chars.length)];
          }
        }
      }
    }
  };

  const animateDetailRefinement = () => {
    // Fine-tune the details, mostly stable with occasional flickers
    const { width: currentWidth, height: currentHeight } = dimensions;

    for (let y = 0; y < currentHeight; y++) {
      for (let x = 0; x < currentWidth; x++) {
        // 95% chance to show target, 5% chance for flicker
        if (Math.random() < 0.95) {
          asciiData.current.current[y][x] = asciiData.current.target[y][x];
        } else {
          // Subtle flicker with similar characters
          const targetChar = asciiData.current.target[y][x];
          const targetIndex = Object.values(ASCII_CHARS).indexOf(targetChar);
          const flickerRange = 1;
          const flickerIndex = Math.max(
            0,
            Math.min(8, targetIndex + (Math.random() - 0.5) * flickerRange * 2)
          );
          asciiData.current.current[y][x] =
            ASCII_CHARS[Math.floor(flickerIndex) as keyof typeof ASCII_CHARS];
        }
      }
    }
  };

  const animateGlitchTransition = (progress: number) => {
    // Intense glitch effect before reveal
    const { width: currentWidth, height: currentHeight } = dimensions;
    const glitchIntensity = Math.sin(progress * Math.PI * 10) * 0.5 + 0.5;

    for (let y = 0; y < currentHeight; y++) {
      for (let x = 0; x < currentWidth; x++) {
        if (Math.random() < glitchIntensity * 0.7) {
          // Heavy glitch
          const chars = Object.values(ASCII_CHARS);
          asciiData.current.current[y][x] =
            chars[Math.floor(Math.random() * chars.length)];
        } else {
          asciiData.current.current[y][x] = asciiData.current.target[y][x];
        }
      }
    }
  };

  const animatePhotoReveal = (progress: number) => {
    // Smooth transition to final state
    const { width: currentWidth, height: currentHeight } = dimensions;
    const stabilityProgress = progress;

    for (let y = 0; y < currentHeight; y++) {
      for (let x = 0; x < currentWidth; x++) {
        if (Math.random() < stabilityProgress) {
          asciiData.current.current[y][x] = asciiData.current.target[y][x];
        }
      }
    }

    // At the end, ensure everything is stable
    if (progress >= 0.9) {
      const { width: currentWidth, height: currentHeight } = dimensions;
      for (let y = 0; y < currentHeight; y++) {
        for (let x = 0; x < currentWidth; x++) {
          asciiData.current.current[y][x] = asciiData.current.target[y][x];
        }
      }
    }
  };

  const render = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const {
      width: currentWidth,
      height: currentHeight,
      fontSize: currentFontSize,
    } = dimensions;

    // Clear canvas
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text color
    ctx.fillStyle = "#ffffff";

    // Render ASCII characters with performance optimization
    const charWidth = currentFontSize * 0.6;
    const charHeight = currentFontSize;

    // Batch rendering for better performance
    ctx.save();

    for (let y = 0; y < currentHeight; y++) {
      for (let x = 0; x < currentWidth; x++) {
        const char = asciiData.current.current[y][x];
        if (char && char !== " ") {
          ctx.fillText(char, x * charWidth, y * charHeight);
        }
      }
    }

    ctx.restore();
  };

  const finishAnimation = (ctx: CanvasRenderingContext2D) => {
    animationState.current.isAnimating = false;

    // Trigger completion callback
    if (onComplete) {
      onComplete();
    }

    // Restart animation if looping is enabled and user doesn't prefer reduced motion
    if (loop && !prefersReducedMotion && isVisible) {
      setTimeout(() => {
        startAnimation(ctx);
      }, 3000); // Wait 3 seconds before restarting
    }
  };

  const showFallback = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) => {
    const { fontSize: currentFontSize } = dimensions;

    // Show fallback content if ASCII animation fails
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.font = `${currentFontSize * 2}px 'Space Mono', monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText("PORTRAIT", canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText("LOADING...", canvas.width / 2, canvas.height / 2 + 20);
  };

  if (error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center border-4 border-white bg-black p-8",
          className
        )}
      >
        <div className="text-center">
          <div className="mb-2 font-mono text-lg font-bold text-white">
            PORTRAIT
          </div>
          <div className="text-brutalist-off-white-100 font-mono text-sm">
            LOADING...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <canvas
        ref={canvasRef}
        className="border-4 border-white bg-black"
        style={{
          imageRendering: "pixelated",
          maxWidth: "100%",
          height: "auto",
        }}
        role="img"
        aria-label={accessibilityLabel}
        aria-describedby="ascii-portrait-description"
      />

      {/* Screen reader description */}
      <div id="ascii-portrait-description" className="sr-only">
        {accessibilityLabel}. This is an animated ASCII art representation that{" "}
        {prefersReducedMotion
          ? "displays a static portrait"
          : "animates from random characters to form a portrait"}
        .
      </div>

      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center border-4 border-white bg-black">
          <div className="text-center">
            <div className="mb-2 font-mono text-lg font-bold text-white">
              PORTRAIT
            </div>
            <div className="text-brutalist-off-white-100 font-mono text-sm">
              LOADING...
            </div>
            {/* Loading spinner for better UX */}
            <div className="mt-4 flex justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            </div>
          </div>
        </div>
      )}

      {/* Reduced motion notice */}
      {prefersReducedMotion && isLoaded && (
        <div className="absolute right-2 bottom-2 rounded bg-black/80 px-2 py-1 text-xs text-white">
          Static mode
        </div>
      )}

      {/* Performance indicator for development */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-2 left-2 rounded bg-black/80 px-2 py-1 text-xs text-white">
          {performanceMode} mode
        </div>
      )}
    </div>
  );
}
