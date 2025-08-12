"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// Brutalist hover effect variants
const brutalistHoverVariants: Variants = {
  rest: {
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    boxShadow: "4px 4px 0px 0px #000000",
  },
  hover: {
    x: -4,
    y: -4,
    scale: 1.02,
    rotate: 0,
    boxShadow: "8px 8px 0px 0px #000000",
    transition: {
      type: "tween",
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  tap: {
    x: 2,
    y: 2,
    scale: 0.98,
    boxShadow: "2px 2px 0px 0px #000000",
    transition: {
      type: "tween",
      duration: 0.1,
    },
  },
};

const glitchHoverVariants: Variants = {
  rest: {
    x: 0,
    y: 0,
    skewX: 0,
    skewY: 0,
  },
  hover: {
    x: [0, -2, 2, -1, 1, 0],
    y: [0, 1, -1, 2, -2, 0],
    skewX: [0, -1, 1, -0.5, 0.5, 0],
    skewY: [0, 0.5, -0.5, 1, -1, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "loop",
    },
  },
};

const mechanicalHoverVariants: Variants = {
  rest: {
    rotateX: 0,
    rotateY: 0,
    z: 0,
  },
  hover: {
    rotateX: -5,
    rotateY: 5,
    z: 20,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

const shakeHoverVariants: Variants = {
  rest: { x: 0 },
  hover: {
    x: [-2, 2, -2, 2, 0],
    transition: {
      duration: 0.4,
      repeat: Infinity,
      repeatType: "loop",
    },
  },
};

interface BrutalistHoverProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "glitch" | "mechanical" | "shake";
  disabled?: boolean;
  onClick?: () => void;
}

export function BrutalistHover({
  children,
  className = "",
  variant = "default",
  disabled = false,
  onClick,
}: BrutalistHoverProps) {
  const getVariants = () => {
    switch (variant) {
      case "glitch":
        return glitchHoverVariants;
      case "mechanical":
        return mechanicalHoverVariants;
      case "shake":
        return shakeHoverVariants;
      default:
        return brutalistHoverVariants;
    }
  };

  return (
    <motion.div
      className={cn(
        "cursor-pointer select-none",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      variants={getVariants()}
      initial="rest"
      whileHover={disabled ? "rest" : "hover"}
      whileTap={disabled ? "rest" : "tap"}
      onClick={disabled ? undefined : onClick}
      style={{
        perspective: variant === "mechanical" ? 1000 : undefined,
      }}
    >
      {children}
    </motion.div>
  );
}

// Interactive card with multiple hover states
interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: "lift" | "tilt" | "glow" | "invert" | "scale";
  clickable?: boolean;
  onClick?: () => void;
}

export function InteractiveCard({
  children,
  className = "",
  hoverEffect = "lift",
  clickable = false,
  onClick,
}: InteractiveCardProps) {
  const [_isHovered, setIsHovered] = useState(false);

  const getHoverAnimation = () => {
    switch (hoverEffect) {
      case "lift":
        return {
          y: -8,
          boxShadow: "8px 8px 0px 0px #FFFF00",
          borderColor: "#FFFF00",
        };
      case "tilt":
        return {
          rotateX: -5,
          rotateY: 5,
          scale: 1.02,
          boxShadow: "12px 12px 0px 0px #000000",
        };
      case "glow":
        return {
          boxShadow: "0px 0px 20px 0px #FFFF00",
          borderColor: "#FFFF00",
        };
      case "invert":
        return {
          backgroundColor: "#FFFFFF",
          color: "#000000",
          borderColor: "#000000",
        };
      case "scale":
        return {
          scale: 1.05,
          boxShadow: "8px 8px 0px 0px #FFFF00",
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className={cn(
        "border-4 border-white bg-black p-6 transition-colors duration-300",
        clickable && "cursor-pointer",
        className
      )}
      initial={{
        y: 0,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        boxShadow: "4px 4px 0px 0px #000000",
      }}
      whileHover={getHoverAnimation()}
      whileTap={clickable ? { scale: 0.98 } : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={clickable ? onClick : undefined}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      style={{
        perspective: hoverEffect === "tilt" ? 1000 : undefined,
      }}
    >
      {children}
    </motion.div>
  );
}

// Magnetic hover effect for buttons and interactive elements
interface MagneticHoverProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  disabled?: boolean;
}

export function MagneticHover({
  children,
  className = "",
  strength = 0.3,
  disabled = false,
}: MagneticHoverProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [_isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setMousePosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      className={cn("cursor-pointer", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
}

// Ripple effect on click
interface RippleEffectProps {
  children: React.ReactNode;
  className?: string;
  rippleColor?: string;
  onClick?: () => void;
}

export function RippleEffect({
  children,
  className = "",
  rippleColor = "#FFFF00",
  onClick,
}: RippleEffectProps) {
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);

    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={cn("relative cursor-pointer overflow-hidden", className)}
      onClick={handleClick}
    >
      {children}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            backgroundColor: rippleColor,
          }}
          initial={{
            width: 0,
            height: 0,
            opacity: 0.6,
            x: "-50%",
            y: "-50%",
          }}
          animate={{
            width: 300,
            height: 300,
            opacity: 0,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// Floating action button with enhanced hover effects
interface FloatingActionButtonProps {
  children: React.ReactNode;
  className?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  onClick?: () => void;
}

export function FloatingActionButton({
  children,
  className = "",
  position = "bottom-right",
  onClick,
}: FloatingActionButtonProps) {
  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "bottom-6 left-6";
      case "top-right":
        return "top-6 right-6";
      case "top-left":
        return "top-6 left-6";
      default:
        return "bottom-6 right-6";
    }
  };

  return (
    <motion.button
      className={cn(
        "bg-brutalist-yellow shadow-brutalist-lg fixed z-50 flex h-14 w-14 items-center justify-center border-4 border-white text-black",
        getPositionClasses(),
        className
      )}
      whileHover={{
        scale: 1.1,
        rotate: 5,
        boxShadow: "12px 12px 0px 0px #000000",
      }}
      whileTap={{
        scale: 0.9,
        rotate: -5,
      }}
      initial={{
        scale: 0,
        rotate: -180,
      }}
      animate={{
        scale: 1,
        rotate: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

// Text hover effects
interface TextHoverEffectProps {
  text: string;
  className?: string;
  effect?: "glitch" | "wave" | "bounce" | "typewriter";
}

export function TextHoverEffect({
  text,
  className = "",
  effect = "glitch",
}: TextHoverEffectProps) {
  const [isHovered, setIsHovered] = useState(false);

  const renderGlitchEffect = () => (
    <motion.span
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text}
      {isHovered && (
        <>
          <motion.span
            className="absolute top-0 left-0 text-red-500"
            animate={{
              x: [-1, 1, -1],
              opacity: [0.8, 0.6, 0.8],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            {text}
          </motion.span>
          <motion.span
            className="absolute top-0 left-0 text-blue-500"
            animate={{
              x: [1, -1, 1],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            {text}
          </motion.span>
        </>
      )}
    </motion.span>
  );

  const renderWaveEffect = () => (
    <motion.span
      className={cn("inline-block", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          animate={
            isHovered
              ? {
                  y: [0, -10, 0],
                  transition: {
                    duration: 0.5,
                    delay: index * 0.05,
                    repeat: Infinity,
                    repeatType: "loop",
                  },
                }
              : { y: 0 }
          }
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );

  const renderBounceEffect = () => (
    <motion.span
      className={cn("inline-block cursor-pointer", className)}
      whileHover={{
        scale: 1.1,
        y: -5,
      }}
      whileTap={{
        scale: 0.95,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      {text}
    </motion.span>
  );

  switch (effect) {
    case "wave":
      return renderWaveEffect();
    case "bounce":
      return renderBounceEffect();
    case "glitch":
    default:
      return renderGlitchEffect();
  }
}
