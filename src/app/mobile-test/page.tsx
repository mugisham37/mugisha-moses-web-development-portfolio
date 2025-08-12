"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Smartphone,
  Tablet,
  Monitor,
  TouchIcon,
  Gesture,
  RefreshCw,
  Menu,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import {
  TouchTarget,
  TouchButton,
  TouchIconButton,
} from "@/components/mobile/touch-target";
import { PullToRefresh } from "@/components/mobile/pull-to-refresh";
import { useMobile } from "@/hooks/use-mobile";
import { useTouchGestures } from "@/hooks/use-touch-gestures";

/**
 * Mobile test page to verify all mobile optimizations
 * This page should only be accessible in development
 */
export default function MobileTestPage() {
  const mobile = useMobile();
  const [gestureLog, setGestureLog] = useState<string[]>([]);
  const [refreshCount, setRefreshCount] = useState(0);

  const addGestureLog = (gesture: string) => {
    setGestureLog((prev) => [
      `${new Date().toLocaleTimeString()}: ${gesture}`,
      ...prev.slice(0, 9),
    ]);
  };

  const { attachGestures } = useTouchGestures({
    onSwipeLeft: () => addGestureLog("Swipe Left"),
    onSwipeRight: () => addGestureLog("Swipe Right"),
    onSwipeUp: () => addGestureLog("Swipe Up"),
    onSwipeDown: () => addGestureLog("Swipe Down"),
    onTap: () => addGestureLog("Tap"),
    onDoubleTap: () => addGestureLog("Double Tap"),
    onLongPress: () => addGestureLog("Long Press"),
    onPinch: (scale) => addGestureLog(`Pinch: ${scale.toFixed(2)}x`),
  });

  const handleRefresh = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRefreshCount((prev) => prev + 1);
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-black py-20 text-white">
        <Container>
          <div className="space-y-12">
            {/* Header */}
            <div className="text-center">
              <Typography variant="display" className="mb-4">
                MOBILE TEST
              </Typography>
              <Typography variant="body" className="text-white/60">
                Testing mobile responsiveness and touch optimization
              </Typography>
              {refreshCount > 0 && (
                <Typography variant="caption" className="mt-2 text-yellow-400">
                  Refreshed {refreshCount} times
                </Typography>
              )}
            </div>

            {/* Device Detection */}
            <div className="border-4 border-white p-6">
              <Typography variant="h2" className="mb-6">
                DEVICE DETECTION
              </Typography>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {mobile.isMobile ? (
                      <Smartphone className="h-6 w-6 text-yellow-400" />
                    ) : mobile.isTablet ? (
                      <Tablet className="h-6 w-6 text-yellow-400" />
                    ) : (
                      <Monitor className="h-6 w-6 text-yellow-400" />
                    )}
                    <Typography variant="body" className="font-mono">
                      Screen: {mobile.screenSize.toUpperCase()}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <TouchIcon
                      className={`h-6 w-6 ${mobile.isTouchDevice ? "text-yellow-400" : "text-white/40"}`}
                    />
                    <Typography variant="body" className="font-mono">
                      Touch:{" "}
                      {mobile.isTouchDevice ? "SUPPORTED" : "NOT SUPPORTED"}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <Gesture className="h-6 w-6 text-white" />
                    <Typography variant="body" className="font-mono">
                      Orientation: {mobile.orientation.toUpperCase()}
                    </Typography>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 border-2 border-white bg-yellow-400" />
                    <Typography variant="body" className="font-mono">
                      iOS: {mobile.isIOS ? "YES" : "NO"}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 border-2 border-white bg-green-400" />
                    <Typography variant="body" className="font-mono">
                      Android: {mobile.isAndroid ? "YES" : "NO"}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            {/* Touch Targets */}
            <div className="border-4 border-white p-6">
              <Typography variant="h2" className="mb-6">
                TOUCH TARGETS
              </Typography>
              <div className="space-y-6">
                <div>
                  <Typography variant="h4" className="mb-4">
                    Button Sizes
                  </Typography>
                  <div className="flex flex-wrap gap-4">
                    <Button size="sm">SMALL</Button>
                    <Button size="md">MEDIUM</Button>
                    <Button size="lg">LARGE</Button>
                    <Button size="xl">EXTRA LARGE</Button>
                  </div>
                </div>

                <div>
                  <Typography variant="h4" className="mb-4">
                    Touch Components
                  </Typography>
                  <div className="flex flex-wrap gap-4">
                    <TouchButton
                      size="minimum"
                      onClick={() => addGestureLog("Touch Button (Min)")}
                    >
                      MIN
                    </TouchButton>
                    <TouchButton
                      size="recommended"
                      onClick={() => addGestureLog("Touch Button (Rec)")}
                    >
                      RECOMMENDED
                    </TouchButton>
                    <TouchButton
                      size="large"
                      onClick={() => addGestureLog("Touch Button (Large)")}
                    >
                      LARGE
                    </TouchButton>
                  </div>
                </div>

                <div>
                  <Typography variant="h4" className="mb-4">
                    Icon Buttons
                  </Typography>
                  <div className="flex flex-wrap gap-4">
                    <TouchIconButton onClick={() => addGestureLog("Menu Icon")}>
                      <Menu className="h-6 w-6" />
                    </TouchIconButton>
                    <TouchIconButton
                      onClick={() => addGestureLog("Refresh Icon")}
                    >
                      <RefreshCw className="h-6 w-6" />
                    </TouchIconButton>
                  </div>
                </div>
              </div>
            </div>

            {/* Gesture Testing */}
            <div className="border-4 border-white p-6">
              <Typography variant="h2" className="mb-6">
                GESTURE TESTING
              </Typography>
              <div className="space-y-6">
                <div
                  ref={attachGestures}
                  className="flex min-h-[200px] items-center justify-center border-4 border-yellow-400 bg-yellow-400/10 p-8 text-center"
                >
                  <div>
                    <Typography variant="h3" className="mb-4">
                      GESTURE AREA
                    </Typography>
                    <Typography variant="body" className="text-white/60">
                      Try swiping, tapping, double-tapping, long-pressing, or
                      pinching
                    </Typography>
                  </div>
                </div>

                <div>
                  <Typography variant="h4" className="mb-4">
                    Gesture Log
                  </Typography>
                  <div className="max-h-48 overflow-y-auto border-2 border-white/20 p-4">
                    {gestureLog.length === 0 ? (
                      <Typography
                        variant="body"
                        className="font-mono text-white/40"
                      >
                        No gestures detected yet...
                      </Typography>
                    ) : (
                      <div className="space-y-1">
                        {gestureLog.map((log, index) => (
                          <Typography
                            key={index}
                            variant="caption"
                            className="font-mono text-yellow-400"
                          >
                            {log}
                          </Typography>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Swipe Navigation Demo */}
            <div className="border-4 border-white p-6">
              <Typography variant="h2" className="mb-6">
                SWIPE NAVIGATION
              </Typography>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <motion.div
                  className="border-2 border-white/20 p-6 text-center transition-colors hover:border-white"
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="mx-auto mb-2 h-8 w-8" />
                  <Typography variant="caption" className="font-mono">
                    SWIPE LEFT
                  </Typography>
                </motion.div>
                <motion.div
                  className="border-2 border-white/20 p-6 text-center transition-colors hover:border-white"
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowRight className="mx-auto mb-2 h-8 w-8" />
                  <Typography variant="caption" className="font-mono">
                    SWIPE RIGHT
                  </Typography>
                </motion.div>
                <motion.div
                  className="border-2 border-white/20 p-6 text-center transition-colors hover:border-white"
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowUp className="mx-auto mb-2 h-8 w-8" />
                  <Typography variant="caption" className="font-mono">
                    SWIPE UP
                  </Typography>
                </motion.div>
                <motion.div
                  className="border-2 border-white/20 p-6 text-center transition-colors hover:border-white"
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowDown className="mx-auto mb-2 h-8 w-8" />
                  <Typography variant="caption" className="font-mono">
                    SWIPE DOWN
                  </Typography>
                </motion.div>
              </div>
            </div>

            {/* Performance Info */}
            <div className="border-4 border-white p-6">
              <Typography variant="h2" className="mb-6">
                PERFORMANCE INFO
              </Typography>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Typography variant="body" className="font-mono">
                    Viewport:{" "}
                    {typeof window !== "undefined"
                      ? `${window.innerWidth}x${window.innerHeight}`
                      : "N/A"}
                  </Typography>
                  <Typography variant="body" className="font-mono">
                    Device Pixel Ratio:{" "}
                    {typeof window !== "undefined"
                      ? window.devicePixelRatio
                      : "N/A"}
                  </Typography>
                  <Typography variant="body" className="font-mono">
                    Connection:{" "}
                    {typeof navigator !== "undefined" &&
                    "connection" in navigator
                      ? // @ts-ignore
                        navigator.connection?.effectiveType || "Unknown"
                      : "N/A"}
                  </Typography>
                </div>
                <div className="space-y-2">
                  <Typography variant="body" className="font-mono">
                    Memory:{" "}
                    {typeof performance !== "undefined" &&
                    "memory" in performance
                      ? // @ts-ignore
                        `${Math.round(performance.memory?.usedJSHeapSize / 1024 / 1024)}MB`
                      : "N/A"}
                  </Typography>
                  <Typography variant="body" className="font-mono">
                    Hardware Concurrency:{" "}
                    {typeof navigator !== "undefined"
                      ? navigator.hardwareConcurrency
                      : "N/A"}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="border-4 border-yellow-400 bg-yellow-400/10 p-6">
              <Typography variant="h2" className="mb-6 text-yellow-400">
                TESTING INSTRUCTIONS
              </Typography>
              <div className="space-y-4">
                <Typography variant="body">
                  • Pull down from the top to test pull-to-refresh functionality
                </Typography>
                <Typography variant="body">
                  • Test touch targets by tapping buttons and interactive
                  elements
                </Typography>
                <Typography variant="body">
                  • Try various gestures in the gesture testing area
                </Typography>
                <Typography variant="body">
                  • Check mobile navigation by tapping the menu button (mobile
                  only)
                </Typography>
                <Typography variant="body">
                  • Verify safe area handling on devices with notches
                </Typography>
                <Typography variant="body">
                  • Test orientation changes by rotating your device
                </Typography>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </PullToRefresh>
  );
}
