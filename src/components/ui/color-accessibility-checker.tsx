"use client";

import React, { useEffect, useState } from "react";
import {
  calculateContrast,
  isWCAGCompliant,
  isWCAGAAACompliant,
  validateColorScheme,
  type ColorSchemeValidation,
} from "@/lib/color-utils";

interface ColorAccessibilityCheckerProps {
  foreground: string;
  background: string;
  accent?: string;
  showDetails?: boolean;
  className?: string;
}

export function ColorAccessibilityChecker({
  foreground,
  background,
  accent,
  showDetails = false,
  className = "",
}: ColorAccessibilityCheckerProps) {
  const [validation, setValidation] = useState<ColorSchemeValidation | null>(
    null
  );
  const [contrast, setContrast] = useState<number>(0);

  useEffect(() => {
    const contrastRatio = calculateContrast(foreground, background);
    setContrast(contrastRatio);

    if (accent) {
      const schemeValidation = validateColorScheme(
        foreground,
        background,
        accent
      );
      setValidation(schemeValidation);
    }
  }, [foreground, background, accent]);

  const isAACompliant = isWCAGCompliant(foreground, background);
  const isAAACompliant = isWCAGAAACompliant(foreground, background);

  if (!showDetails) {
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        <div
          className={`h-3 w-3 rounded-full ${
            isAAACompliant
              ? "bg-green-500"
              : isAACompliant
                ? "bg-yellow-500"
                : "bg-red-500"
          }`}
          title={`Contrast ratio: ${contrast.toFixed(2)}:1`}
        />
        <span className="font-mono text-xs">{contrast.toFixed(2)}:1</span>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border-2 border-gray-300 p-4 ${className}`}>
      <h3 className="mb-3 text-lg font-bold">Color Accessibility Report</h3>

      {/* Contrast Ratio */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-semibold">Contrast Ratio:</span>
          <span className="font-mono text-lg">{contrast.toFixed(2)}:1</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div
              className={`h-3 w-3 rounded-full ${isAACompliant ? "bg-green-500" : "bg-red-500"}`}
            />
            <span className={isAACompliant ? "text-green-700" : "text-red-700"}>
              WCAG AA {isAACompliant ? "Pass" : "Fail"} (4.5:1 required)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div
              className={`h-3 w-3 rounded-full ${isAAACompliant ? "bg-green-500" : "bg-red-500"}`}
            />
            <span
              className={isAAACompliant ? "text-green-700" : "text-red-700"}
            >
              WCAG AAA {isAAACompliant ? "Pass" : "Fail"} (7:1 required)
            </span>
          </div>
        </div>
      </div>

      {/* Color Samples */}
      <div className="mb-4">
        <h4 className="mb-2 font-semibold">Color Preview:</h4>
        <div className="grid grid-cols-2 gap-2">
          <div
            className="rounded border p-3"
            style={{ backgroundColor: background, color: foreground }}
          >
            <span className="font-mono text-sm">Sample Text</span>
          </div>
          {accent && (
            <div
              className="rounded border p-3"
              style={{ backgroundColor: accent, color: foreground }}
            >
              <span className="font-mono text-sm">Accent Text</span>
            </div>
          )}
        </div>
      </div>

      {/* Validation Results */}
      {validation && (
        <div className="space-y-3">
          {validation.issues.length > 0 && (
            <div>
              <h4 className="mb-2 font-semibold text-red-700">Issues Found:</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-red-600">
                {validation.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {validation.suggestions.length > 0 && (
            <div>
              <h4 className="mb-2 font-semibold text-blue-700">Suggestions:</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-blue-600">
                {validation.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          {validation.isValid && (
            <div className="font-semibold text-green-700">
              ✓ Color scheme meets accessibility requirements
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Simplified inline checker for development
export function InlineAccessibilityChecker({
  foreground,
  background,
  className = "",
}: {
  foreground: string;
  background: string;
  className?: string;
}) {
  const contrast = calculateContrast(foreground, background);
  const isCompliant = isWCAGCompliant(foreground, background);

  return (
    <div className={`inline-flex items-center space-x-1 text-xs ${className}`}>
      <div
        className={`h-2 w-2 rounded-full ${isCompliant ? "bg-green-400" : "bg-red-400"}`}
      />
      <span className="font-mono">{contrast.toFixed(1)}:1</span>
    </div>
  );
}
