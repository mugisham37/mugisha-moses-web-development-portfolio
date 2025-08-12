"use client";

import React, { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
  MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

// Custom hook for layer transforms
function useLayerTransforms(
  scrollYProgress: MotionValue<number>,
  layers: Array<{ speed: number }>
) {
  const transforms = layers.map((layer) => {
    const y = useTransform(scrollYProgress, [0, 1], [0, layer.speed * -100]);
    return useSpring(y, { stiffness: 100, damping: 30 });
  });
  return transforms;
}

// Custom hook for shape transforms
function useShapeTransforms(
  scrollYProgress: MotionValue<number>,
  shapes: Array<{ speed: number }>
) {
  const transforms = shapes.map((shape) => {
    const y = useTransform(scrollYProgress, [0, 1], [0, shape.speed * -200]);
    const rotate = useTransform(
      scrollYProgress,
      [0, 1],
      [0, shape.speed * 360]
    );

    const springY = useSpring(y, { stiffness: 100, damping: 30 });
    const springRotate = useSpring(rotate, { stiffness: 100, damping: 30 });

    return { y: springY, rotate: springRotate };
  });
  return transforms;
}

interface ParallaxContainerProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: "vertical" | "horizontal";
  offset?: [string, string];
}

export function ParallaxContainer({
  children,
  className = "",
  speed = 0.5,
  direction = "vertical",
  offset = ["start end", "end start"],
}: ParallaxContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset,
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "vertical" ? [0, speed * -100] : [0, 0]
  );
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "horizontal" ? [0, speed * -100] : [0, 0]
  );

  // Spring animation for smoother motion
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const springX = useSpring(x, { stiffness: 100, damping: 30 });

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div
        style={{
          y: direction === "vertical" ? springY : 0,
          x: direction === "horizontal" ? springX : 0,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Background parallax with multiple layers
interface BackgroundParallaxProps {
  layers: Array<{
    content: React.ReactNode;
    speed: number;
    zIndex?: number;
    opacity?: number;
  }>;
  className?: string;
  height?: string;
}

export function BackgroundParallax({
  layers,
  className = "",
  height = "100vh",
}: BackgroundParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Use custom hook for layer transforms
  const layerTransforms = useLayerTransforms(scrollYProgress, layers);

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      style={{ height }}
    >
      {layers.map((layer, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          style={{
            y: layerTransforms[index],
            zIndex: layer.zIndex || index,
            opacity: layer.opacity || 1,
          }}
        >
          {layer.content}
        </motion.div>
      ))}
    </div>
  );
}

// Parallax text with 3D effect
interface ParallaxTextProps {
  text: string;
  className?: string;
  speed?: number;
  depth?: number;
  brutalistStyle?: boolean;
}

export function ParallaxText({
  text,
  className = "",
  speed = 0.5,
  depth = 50,
  brutalistStyle = true,
}: ParallaxTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * -100]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, depth]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.2]);

  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div
        className={cn(
          "transform-gpu",
          brutalistStyle && "font-mono font-bold tracking-wider uppercase"
        )}
        style={{
          y: springY,
          rotateX: springRotateX,
          scale: springScale,
          perspective: 1000,
          transformStyle: "preserve-3d",
        }}
      >
        {text}
      </motion.div>
    </div>
  );
}

// Velocity-based parallax
interface VelocityParallaxProps {
  children: React.ReactNode;
  className?: string;
  factor?: number;
  direction?: "vertical" | "horizontal";
}

export function VelocityParallax({
  children,
  className = "",
  factor = 0.5,
  direction = "vertical",
}: VelocityParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const velocityFactor = useTransform(
    smoothVelocity,
    [-1000, 0, 1000],
    [-factor * 50, 0, factor * 50],
    { clamp: false }
  );

  const y = useTransform(velocityFactor, (latest) => `${latest}px`);
  const x = useTransform(velocityFactor, (latest) => `${latest}px`);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div
        style={{
          y: direction === "vertical" ? y : 0,
          x: direction === "horizontal" ? x : 0,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Mouse parallax effect
interface MouseParallaxProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  reverse?: boolean;
}

export function MouseParallax({
  children,
  className = "",
  strength = 0.1,
  reverse = false,
}: MouseParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 100, damping: 30 });
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      x.set(reverse ? -deltaX : deltaX);
      y.set(reverse ? -deltaY : deltaY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y, strength, reverse]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div
        style={{
          x: springX,
          y: springY,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Infinite scroll parallax
interface InfiniteScrollParallaxProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: "left" | "right" | "up" | "down";
}

export function InfiniteScrollParallax({
  children,
  className = "",
  speed = 1,
  direction = "left",
}: InfiniteScrollParallaxProps) {
  const baseX = useMotionValue(0);
  const baseY = useMotionValue(0);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, speed], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${v}px`);
  const y = useTransform(baseY, (v) => `${v}px`);

  const directionFactor = direction === "left" || direction === "up" ? -1 : 1;

  useAnimationFrame((_t, delta) => {
    const moveBy = directionFactor * velocityFactor.get() * (delta / 1000);

    if (direction === "left" || direction === "right") {
      baseX.set(baseX.get() + moveBy);
    } else {
      baseY.set(baseY.get() + moveBy);
    }
  });

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.div
        style={{
          x: direction === "left" || direction === "right" ? x : 0,
          y: direction === "up" || direction === "down" ? y : 0,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Brutalist geometric parallax background
interface BrutalistParallaxBackgroundProps {
  className?: string;
  shapes?: Array<{
    type: "rectangle" | "circle" | "triangle";
    size: number;
    color: string;
    speed: number;
    position: { x: string; y: string };
  }>;
}

export function BrutalistParallaxBackground({
  className = "",
  shapes = [
    {
      type: "rectangle",
      size: 100,
      color: "#FFFF00",
      speed: 0.3,
      position: { x: "10%", y: "20%" },
    },
    {
      type: "circle",
      size: 80,
      color: "#FFFFFF",
      speed: 0.5,
      position: { x: "80%", y: "60%" },
    },
    {
      type: "rectangle",
      size: 60,
      color: "#000000",
      speed: 0.7,
      position: { x: "60%", y: "10%" },
    },
  ],
}: BrutalistParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Use custom hook for shape transforms
  const shapeTransforms = useShapeTransforms(scrollYProgress, shapes);

  return (
    <div
      ref={ref}
      className={cn("absolute inset-0 overflow-hidden", className)}
    >
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className="absolute border-4 border-black"
          style={{
            left: shape.position.x,
            top: shape.position.y,
            width: shape.size,
            height: shape.size,
            backgroundColor: shape.color,
            y: shapeTransforms[index].y,
            rotate: shapeTransforms[index].rotate,
            borderRadius: shape.type === "circle" ? "50%" : "0",
          }}
        />
      ))}
    </div>
  );
}

// Scroll-triggered parallax sections
interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  backgroundContent?: React.ReactNode;
  speed?: number;
  height?: string;
}

export function ParallaxSection({
  children,
  className = "",
  backgroundContent,
  speed = 0.5,
  height = "100vh",
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, speed * -100]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, speed * 50]);

  const springBackgroundY = useSpring(backgroundY, {
    stiffness: 100,
    damping: 30,
  });
  const springContentY = useSpring(contentY, { stiffness: 100, damping: 30 });

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      style={{ height }}
    >
      {/* Background Layer */}
      {backgroundContent && (
        <motion.div
          className="absolute inset-0"
          style={{
            y: springBackgroundY,
          }}
        >
          {backgroundContent}
        </motion.div>
      )}

      {/* Content Layer */}
      <motion.div
        className="relative z-10 flex h-full items-center justify-center"
        style={{
          y: springContentY,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
