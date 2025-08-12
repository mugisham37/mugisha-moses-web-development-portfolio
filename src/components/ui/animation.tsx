"use client";

import * as React from "react";
import { motion, type Variants, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

// Animation variants for different types
const animationVariants: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideInUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  },
  slideInDown: {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  },
  slideInRight: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  brutalistHover: {
    rest: { x: 0, y: 0, boxShadow: "0px 0px 0px 0px #000000" },
    hover: { 
      x: -4, 
      y: -4, 
      boxShadow: "8px 8px 0px 0px #000000",
      transition: { type: "tween", duration: 0.2 }
    },
  },
  brutalistPress: {
    rest: { x: 0, y: 0, boxShadow: "4px 4px 0px 0px #000000" },
    tap: { x: 2, y: 2, boxShadow: "2px 2px 0px 0px #000000" },
  },
  stagger: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  staggerChild: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
};

// Brutalist-specific transitions
const brutalistTransitions: Record<string, Transition> = {
  sharp: {
    type: "tween",
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1],
  },
  mechanical: {
    type: "tween",
    duration: 0.3,
    ease: [0.25, 0.46, 0.45, 0.94],
  },
  bounce: {
    type: "spring",
    damping: 10,
    stiffness: 100,
  },
};

interface AnimationWrapperProps {
  children: React.ReactNode;
  type?: keyof typeof animationVariants;
  delay?: number;
  duration?: number;
  className?: string;
  transition?: keyof typeof brutalistTransitions | Transition;
  viewport?: { once?: boolean; margin?: string; amount?: number };
}

const AnimationWrapper = React.forwardRef<HTMLDivElement, AnimationWrapperProps>(
  ({ 
    children, 
    type = "fadeIn", 
    delay = 0, 
    duration, 
    className,
    transition = "sharp",
    viewport = { once: true, margin: "-100px" },
    ...props 
  }, ref) => {
    const variants = animationVariants[type];
    
    const customTransition = typeof transition === "string" 
      ? { ...brutalistTransitions[transition], delay, ...(duration && { duration }) }
      : { ...transition, delay, ...(duration && { duration }) };

    return (
      <motion.div
        ref={ref}
        className={cn(className)}
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        transition={customTransition}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
AnimationWrapper.displayName = "AnimationWrapper";

interface BrutalistMotionProps {
  children: React.ReactNode;
  hover?: boolean;
  press?: boolean;
  className?: string;
}

const BrutalistMotion = React.forwardRef<HTMLDivElement, BrutalistMotionProps>(
  ({ children, hover = false, press = false, className }, ref) => {
    const motionProps: {
      variants?: Variants;
      initial?: string;
      whileHover?: string;
      whileTap?: string;
    } = {};
    
    if (hover) {
      motionProps.variants = animationVariants.brutalistHover;
      motionProps.initial = "rest";
      motionProps.whileHover = "hover";
    }
    
    if (press) {
      motionProps.variants = animationVariants.brutalistPress;
      motionProps.initial = "rest";
      motionProps.whileTap = "tap";
    }

    return (
      <motion.div
        ref={ref}
        className={cn(className)}
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }
);
BrutalistMotion.displayName = "BrutalistMotion";

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  viewport?: { once?: boolean; margin?: string; amount?: number };
}

const StaggerContainer = React.forwardRef<HTMLDivElement, StaggerContainerProps>(
  ({ 
    children, 
    className, 
    staggerDelay = 0.1,
    viewport = { once: true, margin: "-50px" },
    ...props 
  }, ref) => {
    const variants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    };

    return (
      <motion.div
        ref={ref}
        className={cn(className)}
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
StaggerContainer.displayName = "StaggerContainer";

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

const StaggerItem = React.forwardRef<HTMLDivElement, StaggerItemProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(className)}
        variants={animationVariants.staggerChild}
        transition={brutalistTransitions.sharp}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
StaggerItem.displayName = "StaggerItem";

interface ScrollTriggerProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  onIntersect?: () => void;
}

const ScrollTrigger = React.forwardRef<HTMLDivElement, ScrollTriggerProps>(
  ({ 
    children, 
    className, 
    threshold = 0.1, 
    rootMargin = "0px",
    triggerOnce = true,
    onIntersect,
    ...props 
  }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(className)}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ 
          once: triggerOnce, 
          margin: rootMargin, 
          amount: threshold 
        }}
        transition={brutalistTransitions.sharp}
        onViewportEnter={onIntersect}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
ScrollTrigger.displayName = "ScrollTrigger";

// Export animation utilities
export {
  AnimationWrapper,
  BrutalistMotion,
  StaggerContainer,
  StaggerItem,
  ScrollTrigger,
  animationVariants,
  brutalistTransitions,
};