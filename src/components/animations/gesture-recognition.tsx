"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  PanInfo,
  useMotionValue,
  useTransform,
  useAnimation,
} from "framer-motion";
import { cn } from "@/lib/utils";

// Swipe gesture handler
interface SwipeGestureProps {
  children: React.ReactNode;
  className?: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  disabled?: boolean;
}

export function SwipeGesture({
  children,
  className = "",
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  disabled = false,
}: SwipeGestureProps) {
  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (disabled) return;

    const { offset, velocity } = info;
    const swipeThreshold = threshold;
    const swipeVelocityThreshold = 500;

    // Horizontal swipes
    if (
      Math.abs(offset.x) > swipeThreshold ||
      Math.abs(velocity.x) > swipeVelocityThreshold
    ) {
      if (offset.x > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (offset.x < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    // Vertical swipes
    if (
      Math.abs(offset.y) > swipeThreshold ||
      Math.abs(velocity.y) > swipeVelocityThreshold
    ) {
      if (offset.y > 0 && onSwipeDown) {
        onSwipeDown();
      } else if (offset.y < 0 && onSwipeUp) {
        onSwipeUp();
      }
    }
  };

  return (
    <motion.div
      className={cn("touch-pan-y", className)}
      drag={disabled ? false : true}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}

// Pull to refresh gesture
interface PullToRefreshProps {
  children: React.ReactNode;
  className?: string;
  onRefresh: () => Promise<void>;
  threshold?: number;
  disabled?: boolean;
}

export function PullToRefresh({
  children,
  className = "",
  onRefresh,
  threshold = 100,
  disabled = false,
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const controls = useAnimation();

  const handleDrag = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (disabled || isRefreshing) return;

    const { offset } = info;
    if (offset.y > 0) {
      setPullDistance(Math.min(offset.y, threshold * 1.5));
    }
  };

  const handleDragEnd = async (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (disabled || isRefreshing) return;

    const { offset } = info;

    if (offset.y > threshold) {
      setIsRefreshing(true);
      await controls.start({ y: threshold });

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
        await controls.start({ y: 0 });
      }
    } else {
      setPullDistance(0);
      await controls.start({ y: 0 });
    }
  };

  const refreshProgress = Math.min(pullDistance / threshold, 1);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center"
        style={{
          y: pullDistance - 60,
          opacity: refreshProgress,
        }}
      >
        <div className="flex items-center space-x-2 rounded bg-black/90 px-4 py-2 backdrop-blur-sm">
          <motion.div
            className="border-brutalist-yellow h-4 w-4 border-2 border-t-transparent"
            animate={isRefreshing ? { rotate: 360 } : {}}
            transition={
              isRefreshing
                ? { duration: 1, repeat: Infinity, ease: "linear" }
                : {}
            }
          />
          <span className="font-mono text-xs font-bold text-white">
            {isRefreshing ? "REFRESHING..." : "PULL TO REFRESH"}
          </span>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={controls}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Long press gesture
interface LongPressGestureProps {
  children: React.ReactNode;
  className?: string;
  onLongPress: () => void;
  duration?: number;
  disabled?: boolean;
}

export function LongPressGesture({
  children,
  className = "",
  onLongPress,
  duration = 500,
  disabled = false,
}: LongPressGestureProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startLongPress = () => {
    if (disabled) return;

    setIsPressed(true);
    setProgress(0);

    // Progress animation
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / (duration / 10);
        return Math.min(newProgress, 100);
      });
    }, 10);

    // Long press trigger
    timeoutRef.current = setTimeout(() => {
      onLongPress();
      setIsPressed(false);
      setProgress(0);
    }, duration);
  };

  const cancelLongPress = () => {
    setIsPressed(false);
    setProgress(0);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <motion.div
      className={cn("relative touch-manipulation", className)}
      onPointerDown={startLongPress}
      onPointerUp={cancelLongPress}
      onPointerLeave={cancelLongPress}
      whileTap={{ scale: 0.95 }}
    >
      {children}

      {/* Progress indicator */}
      {isPressed && (
        <motion.div
          className="border-brutalist-yellow bg-brutalist-yellow/20 absolute inset-0 border-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-brutalist-yellow/40 h-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}

// Pinch to zoom gesture
interface PinchZoomProps {
  children: React.ReactNode;
  className?: string;
  minZoom?: number;
  maxZoom?: number;
  disabled?: boolean;
}

export function PinchZoom({
  children,
  className = "",
  minZoom = 0.5,
  maxZoom = 3,
  disabled = false,
}: PinchZoomProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleWheel = (event: React.WheelEvent) => {
    if (disabled) return;

    event.preventDefault();
    const delta = event.deltaY * -0.01;
    const newScale = Math.min(Math.max(scale + delta, minZoom), maxZoom);
    setScale(newScale);
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      className={cn("relative touch-none overflow-hidden", className)}
      onWheel={handleWheel}
    >
      <motion.div
        drag={scale > 1}
        dragConstraints={{
          left: -100,
          right: 100,
          top: -100,
          bottom: 100,
        }}
        dragElastic={0.1}
        style={{
          scale,
          x: position.x,
          y: position.y,
        }}
        onDoubleClick={resetZoom}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>

      {/* Zoom controls */}
      {scale !== 1 && (
        <motion.div
          className="absolute right-4 bottom-4 flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            className="border-2 border-white bg-black px-3 py-1 font-mono text-xs font-bold text-white hover:bg-white hover:text-black"
            onClick={resetZoom}
          >
            RESET
          </button>
        </motion.div>
      )}
    </div>
  );
}

// Drag to dismiss gesture
interface DragToDismissProps {
  children: React.ReactNode;
  className?: string;
  onDismiss: () => void;
  threshold?: number;
  direction?: "horizontal" | "vertical";
  disabled?: boolean;
}

export function DragToDismiss({
  children,
  className = "",
  onDismiss,
  threshold = 100,
  direction = "horizontal",
  disabled = false,
}: DragToDismissProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useTransform(
    direction === "horizontal" ? x : y,
    [-threshold, 0, threshold],
    [0.5, 1, 0.5]
  );

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (disabled) return;

    const { offset } = info;
    const dismissThreshold = threshold;

    if (direction === "horizontal") {
      if (Math.abs(offset.x) > dismissThreshold) {
        onDismiss();
      } else {
        x.set(0);
      }
    } else {
      if (Math.abs(offset.y) > dismissThreshold) {
        onDismiss();
      } else {
        y.set(0);
      }
    }
  };

  return (
    <motion.div
      className={cn("touch-pan-y", className)}
      drag={disabled ? false : direction === "horizontal" ? "x" : "y"}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      style={{
        x: direction === "horizontal" ? x : 0,
        y: direction === "vertical" ? y : 0,
        opacity,
      }}
      onDragEnd={handleDragEnd}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}

// Multi-touch gesture container
interface MultiTouchGestureProps {
  children: React.ReactNode;
  className?: string;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  onSwipe?: (direction: "left" | "right" | "up" | "down") => void;
  disabled?: boolean;
}

export function MultiTouchGesture({
  children,
  className = "",
  onTap,
  onDoubleTap,
  onLongPress,
  onSwipe,
  disabled = false,
}: MultiTouchGestureProps) {
  const [tapCount, setTapCount] = useState(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTapStart = () => {
    if (disabled) return;

    // Long press detection
    if (onLongPress) {
      longPressTimeoutRef.current = setTimeout(() => {
        onLongPress();
      }, 500);
    }
  };

  const handleTapEnd = () => {
    if (disabled) return;

    // Clear long press timeout
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }

    // Handle tap/double tap
    setTapCount((prev) => prev + 1);

    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    tapTimeoutRef.current = setTimeout(() => {
      if (tapCount === 0 && onTap) {
        onTap();
      } else if (tapCount === 1 && onDoubleTap) {
        onDoubleTap();
      }
      setTapCount(0);
    }, 300);
  };

  const handleSwipe = (direction: "left" | "right" | "up" | "down") => {
    if (disabled || !onSwipe) return;
    onSwipe(direction);
  };

  useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
      if (longPressTimeoutRef.current)
        clearTimeout(longPressTimeoutRef.current);
    };
  }, []);

  return (
    <SwipeGesture
      className={cn("touch-manipulation", className)}
      onSwipeLeft={() => handleSwipe("left")}
      onSwipeRight={() => handleSwipe("right")}
      onSwipeUp={() => handleSwipe("up")}
      onSwipeDown={() => handleSwipe("down")}
      disabled={disabled}
    >
      <motion.div
        onPointerDown={handleTapStart}
        onPointerUp={handleTapEnd}
        onPointerLeave={() => {
          if (longPressTimeoutRef.current) {
            clearTimeout(longPressTimeoutRef.current);
          }
        }}
      >
        {children}
      </motion.div>
    </SwipeGesture>
  );
}
