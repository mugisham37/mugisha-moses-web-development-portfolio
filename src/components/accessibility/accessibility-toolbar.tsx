"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Contrast,
  MousePointer,
  Keyboard,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccessibility } from "./accessibility-provider";
import {
  runAccessibilityAudit,
  logAccessibilityReport,
  AccessibilityReport,
} from "@/lib/accessibility-testing";
import { cn } from "@/lib/utils";

interface AccessibilityToolbarProps {
  className?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export function AccessibilityToolbar({
  className = "",
  position = "bottom-right",
}: AccessibilityToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditReport, setAuditReport] = useState<AccessibilityReport | null>(
    null
  );
  const [showReport, setShowReport] = useState(false);

  const { settings, updateSetting, announce } = useAccessibility();

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const handleAudit = async () => {
    setIsAuditing(true);
    announce("Running accessibility audit", "polite");

    try {
      const report = await runAccessibilityAudit();
      setAuditReport(report);
      logAccessibilityReport(report);
      announce(
        `Audit complete. Found ${report.summary.total} issues.`,
        "polite"
      );
    } catch (error) {
      console.error("Accessibility audit failed:", error);
      announce("Audit failed", "assertive");
    } finally {
      setIsAuditing(false);
    }
  };

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  return (
    <div className={cn("fixed z-[9999]", positionClasses[position], className)}>
      {/* Main Toggle Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="relative"
      >
        <Button
          variant="accent"
          size="md"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-12 w-12 rounded-full p-0 shadow-lg",
            "hover:scale-110 active:scale-95",
            "border-4 border-black"
          )}
          aria-label={
            isOpen
              ? "Close accessibility toolbar"
              : "Open accessibility toolbar"
          }
          aria-expanded={isOpen}
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Settings className="h-5 w-5" />
            )}
          </motion.div>
        </Button>

        {/* Notification Badge */}
        {auditReport && auditReport.summary.errors > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
          >
            {auditReport.summary.errors}
          </motion.div>
        )}
      </motion.div>

      {/* Toolbar Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute min-w-[300px] border-4 border-black bg-white p-4 shadow-lg",
              position.includes("right") ? "right-0" : "left-0",
              position.includes("bottom") ? "bottom-16" : "top-16"
            )}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-mono font-bold text-black uppercase">
                  A11Y Tools
                </h3>
                {auditReport && (
                  <div
                    className={cn(
                      "rounded px-2 py-1 font-mono text-xs font-bold",
                      auditReport.score >= 80
                        ? "bg-green-100 text-green-800"
                        : auditReport.score >= 60
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    )}
                  >
                    Score: {auditReport.score}/100
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAudit}
                  disabled={isAuditing}
                  className="justify-start border-2 border-black text-black"
                >
                  {isAuditing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Zap className="mr-2 h-4 w-4" />
                    </motion.div>
                  ) : (
                    <Zap className="mr-2 h-4 w-4" />
                  )}
                  {isAuditing ? "Auditing..." : "Audit"}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReport(!showReport)}
                  disabled={!auditReport}
                  className="justify-start border-2 border-black text-black"
                >
                  <Info className="mr-2 h-4 w-4" />
                  Report
                </Button>
              </div>

              {/* Settings */}
              <div className="space-y-3">
                <h4 className="font-mono text-sm font-semibold text-black uppercase">
                  Settings
                </h4>

                {/* Reduced Motion */}
                <label className="flex items-center justify-between">
                  <span className="font-mono text-sm text-black">
                    Reduced Motion
                  </span>
                  <button
                    onClick={() =>
                      updateSetting("reducedMotion", !settings.reducedMotion)
                    }
                    className={cn(
                      "relative h-6 w-10 rounded-full border-2 border-black transition-colors",
                      settings.reducedMotion ? "bg-green-400" : "bg-gray-300"
                    )}
                    aria-pressed={settings.reducedMotion}
                  >
                    <motion.div
                      className="absolute top-0.5 h-4 w-4 rounded-full bg-black"
                      animate={{ x: settings.reducedMotion ? 16 : 2 }}
                      transition={{ duration: 0.2 }}
                    />
                  </button>
                </label>

                {/* High Contrast */}
                <label className="flex items-center justify-between">
                  <span className="font-mono text-sm text-black">
                    High Contrast
                  </span>
                  <button
                    onClick={() =>
                      updateSetting("highContrast", !settings.highContrast)
                    }
                    className={cn(
                      "relative h-6 w-10 rounded-full border-2 border-black transition-colors",
                      settings.highContrast ? "bg-green-400" : "bg-gray-300"
                    )}
                    aria-pressed={settings.highContrast}
                  >
                    <motion.div
                      className="absolute top-0.5 h-4 w-4 rounded-full bg-black"
                      animate={{ x: settings.highContrast ? 16 : 2 }}
                      transition={{ duration: 0.2 }}
                    />
                  </button>
                </label>

                {/* Focus Indicators */}
                <label className="flex items-center justify-between">
                  <span className="font-mono text-sm text-black">
                    Focus Indicators
                  </span>
                  <button
                    onClick={() =>
                      updateSetting("focusVisible", !settings.focusVisible)
                    }
                    className={cn(
                      "relative h-6 w-10 rounded-full border-2 border-black transition-colors",
                      settings.focusVisible ? "bg-green-400" : "bg-gray-300"
                    )}
                    aria-pressed={settings.focusVisible}
                  >
                    <motion.div
                      className="absolute top-0.5 h-4 w-4 rounded-full bg-black"
                      animate={{ x: settings.focusVisible ? 16 : 2 }}
                      transition={{ duration: 0.2 }}
                    />
                  </button>
                </label>

                {/* Announcements */}
                <label className="flex items-center justify-between">
                  <span className="font-mono text-sm text-black">
                    Announcements
                  </span>
                  <button
                    onClick={() =>
                      updateSetting("announcements", !settings.announcements)
                    }
                    className={cn(
                      "relative h-6 w-10 rounded-full border-2 border-black transition-colors",
                      settings.announcements ? "bg-green-400" : "bg-gray-300"
                    )}
                    aria-pressed={settings.announcements}
                  >
                    <motion.div
                      className="absolute top-0.5 h-4 w-4 rounded-full bg-black"
                      animate={{ x: settings.announcements ? 16 : 2 }}
                      transition={{ duration: 0.2 }}
                    />
                  </button>
                </label>

                {/* Font Size */}
                <div>
                  <label className="mb-2 block font-mono text-sm text-black">
                    Font Size
                  </label>
                  <select
                    value={settings.fontSize}
                    onChange={(e) =>
                      updateSetting("fontSize", e.target.value as any)
                    }
                    className="w-full border-2 border-black bg-white p-2 font-mono text-sm"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="extra-large">Extra Large</option>
                  </select>
                </div>
              </div>

              {/* Audit Report */}
              <AnimatePresence>
                {showReport && auditReport && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t-2 border-black pt-4"
                  >
                    <h4 className="mb-3 font-mono text-sm font-semibold text-black uppercase">
                      Audit Report
                    </h4>

                    <div className="mb-3 grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <div className="flex items-center justify-center text-red-600">
                          <AlertTriangle className="mr-1 h-4 w-4" />
                          {auditReport.summary.errors}
                        </div>
                        <div className="font-mono text-xs">Errors</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center text-yellow-600">
                          <AlertTriangle className="mr-1 h-4 w-4" />
                          {auditReport.summary.warnings}
                        </div>
                        <div className="font-mono text-xs">Warnings</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center text-blue-600">
                          <Info className="mr-1 h-4 w-4" />
                          {auditReport.summary.info}
                        </div>
                        <div className="font-mono text-xs">Info</div>
                      </div>
                    </div>

                    <div className="max-h-40 space-y-2 overflow-y-auto">
                      {auditReport.issues.slice(0, 5).map((issue, index) => (
                        <div
                          key={index}
                          className={cn(
                            "border-l-4 p-2 text-xs",
                            issue.type === "error"
                              ? "border-red-500 bg-red-50"
                              : issue.type === "warning"
                                ? "border-yellow-500 bg-yellow-50"
                                : "border-blue-500 bg-blue-50"
                          )}
                        >
                          <div className="font-mono font-semibold">
                            {issue.rule}
                          </div>
                          <div className="text-gray-700">{issue.message}</div>
                        </div>
                      ))}
                      {auditReport.issues.length > 5 && (
                        <div className="text-center text-xs text-gray-500">
                          +{auditReport.issues.length - 5} more issues
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Keyboard shortcut to toggle toolbar
export function useAccessibilityToolbarShortcut() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + Shift + A to toggle toolbar
      if (event.altKey && event.shiftKey && event.key === "A") {
        event.preventDefault();
        setIsVisible((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return isVisible;
}
