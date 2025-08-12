"use client";

import { useRef, useCallback, useEffect } from "react";

interface TouchGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  onPinch?: (scale: number) => void;
  swipeThreshold?: number;
  longPressDelay?: number;
  doubleTapDelay?: number;
  preventScroll?: boolean;
}

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

/**
 * Hook for handling touch gestures with brutalist precision
 * Provides comprehensive touch interaction support for mobile devices
 */
export function useTouchGestures(options: TouchGestureOptions = {}) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onTap,
    onDoubleTap,
    onLongPress,
    onPinch,
    swipeThreshold = 50,
    longPressDelay = 500,
    doubleTapDelay = 300,
    preventScroll = false,
  } = options;

  const touchStartRef = useRef<TouchPoint | null>(null);
  const touchEndRef = useRef<TouchPoint | null>(null);
  const lastTapRef = useRef<number>(0);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialDistanceRef = useRef<number>(0);

  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (preventScroll) {
        event.preventDefault();
      }

      const touch = event.touches[0];
      const touchPoint: TouchPoint = {
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now(),
      };

      touchStartRef.current = touchPoint;

      // Handle multi-touch for pinch gestures
      if (event.touches.length === 2 && onPinch) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        initialDistanceRef.current = distance;
      }

      // Start long press timer
      if (onLongPress) {
        longPressTimerRef.current = setTimeout(() => {
          onLongPress();
        }, longPressDelay);
      }
    },
    [onLongPress, longPressDelay, preventScroll, onPinch]
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (preventScroll) {
        event.preventDefault();
      }

      // Cancel long press on move
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }

      // Handle pinch gesture
      if (event.touches.length === 2 && onPinch && initialDistanceRef.current) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const currentDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        const scale = currentDistance / initialDistanceRef.current;
        onPinch(scale);
      }
    },
    [onPinch, preventScroll]
  );

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (preventScroll) {
        event.preventDefault();
      }

      // Clear long press timer
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }

      if (!touchStartRef.current) return;

      const touch = event.changedTouches[0];
      const touchPoint: TouchPoint = {
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now(),
      };

      touchEndRef.current = touchPoint;

      const deltaX = touchPoint.x - touchStartRef.current.x;
      const deltaY = touchPoint.y - touchStartRef.current.y;
      const deltaTime = touchPoint.timestamp - touchStartRef.current.timestamp;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Handle tap gestures
      if (distance < 10 && deltaTime < 300) {
        const now = Date.now();
        const timeSinceLastTap = now - lastTapRef.current;

        if (timeSinceLastTap < doubleTapDelay && onDoubleTap) {
          onDoubleTap();
          lastTapRef.current = 0; // Reset to prevent triple tap
        } else {
          lastTapRef.current = now;
          // Delay single tap to check for double tap
          setTimeout(() => {
            if (lastTapRef.current === now && onTap) {
              onTap();
            }
          }, doubleTapDelay);
        }
        return;
      }

      // Handle swipe gestures
      if (distance > swipeThreshold) {
        const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);

        if (isHorizontal) {
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        } else {
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown();
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp();
          }
        }
      }

      // Reset touch points
      touchStartRef.current = null;
      touchEndRef.current = null;
      initialDistanceRef.current = 0;
    },
    [
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown,
      onTap,
      onDoubleTap,
      swipeThreshold,
      doubleTapDelay,
      preventScroll,
    ]
  );

  const attachGestures = useCallback(
    (element: HTMLElement | null) => {
      if (!element) return;

      element.addEventListener("touchstart", handleTouchStart, {
        passive: !preventScroll,
      });
      element.addEventListener("touchmove", handleTouchMove, {
        passive: !preventScroll,
      });
      element.addEventListener("touchend", handleTouchEnd, {
        passive: !preventScroll,
      });

      return () => {
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("touchmove", handleTouchMove);
        element.removeEventListener("touchend", handleTouchEnd);
      };
    },
    [handleTouchStart, handleTouchMove, handleTouchEnd, preventScroll]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  return { attachGestures };
}

/**
 * Hook for simple swipe detection
 * Simplified version for basic swipe interactions
 */
export function useSwipeGestures(options: {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}) {
  return useTouchGestures({
    onSwipeLeft: options.onSwipeLeft,
    onSwipeRight: options.onSwipeRight,
    swipeThreshold: options.threshold || 50,
  });
}
