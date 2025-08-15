"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface DevErrorHandlerProps {
  children: React.ReactNode;
}

export function DevErrorHandler({ children }: DevErrorHandlerProps) {
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    // Capture console errors
    const originalError = console.error;
    console.error = (...args) => {
      const errorMessage = args
        .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
        .join(" ");

      // Filter out common development warnings that aren't critical
      if (
        !errorMessage.includes("Warning:") &&
        !errorMessage.includes("validateDOMNesting") &&
        !errorMessage.includes("React does not recognize")
      ) {
        setErrors((prev) => [...prev.slice(-4), errorMessage]); // Keep last 5 errors
      }

      originalError.apply(console, args);
    };

    // Capture unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setErrors((prev) => [
        ...prev.slice(-4),
        `Unhandled Promise: ${event.reason}`,
      ]);
    };

    // Capture global errors
    const handleError = (event: ErrorEvent) => {
      setErrors((prev) => [
        ...prev.slice(-4),
        `Global Error: ${event.message}`,
      ]);
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      console.error = originalError;
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
      window.removeEventListener("error", handleError);
    };
  }, []);

  const clearErrors = () => setErrors([]);

  if (process.env.NODE_ENV !== "development") {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {errors.length > 0 && (
        <div className="fixed right-4 bottom-4 z-50 max-w-md rounded bg-red-900/90 p-4 text-white shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-mono text-sm font-bold">Development Errors</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearErrors}
              className="h-6 w-6 p-0 text-white hover:bg-red-800"
            >
              ×
            </Button>
          </div>
          <div className="max-h-40 space-y-1 overflow-y-auto">
            {errors.map((error, index) => (
              <div key={index} className="font-mono text-xs break-words">
                {error.length > 100 ? `${error.substring(0, 100)}...` : error}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default DevErrorHandler;
