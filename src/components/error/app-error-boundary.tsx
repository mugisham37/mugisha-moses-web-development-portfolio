"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { errorMonitoring } from "@/lib/error-monitoring";

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<AppErrorFallbackProps>;
  level?: "page" | "component" | "critical";
  context?: Record<string, any>;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

export interface AppErrorFallbackProps {
  error: Error;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  resetError: () => void;
  level: "page" | "component" | "critical";
}

export class AppErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.setState({
      error,
      errorInfo,
      errorId,
    });

    // Log error with context
    const context = {
      level: this.props.level || "component",
      retryCount: this.retryCount,
      maxRetries: this.maxRetries,
      componentStack: errorInfo.componentStack,
      ...this.props.context,
    };

    // Capture error with monitoring service
    errorMonitoring.captureError(
      error,
      context,
      this.props.level === "critical" ? "error" : "warning"
    );

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.group(`🚨 Error Boundary (${this.props.level || "component"})`);
      console.error("Error:", error);
      console.error("Error Info:", errorInfo);
      console.error("Context:", context);
      console.groupEnd();
    }

    // Send to external error service
    this.logErrorToService(error, errorInfo, errorId, context);
  }

  private logErrorToService = async (
    error: Error,
    errorInfo: ErrorInfo,
    errorId: string,
    context: Record<string, any>
  ) => {
    try {
      await fetch("/api/errors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          critical: this.props.level === "critical",
          errorId,
          context,
        }),
      });
    } catch (fetchError) {
      console.error("Failed to log error to service:", fetchError);
    }
  };

  private resetError = () => {
    this.retryCount++;

    if (this.retryCount <= this.maxRetries) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null,
      });
    } else {
      // Max retries reached, show permanent error state
      console.warn("Max retries reached for error boundary");
    }
  };

  private reloadPage = () => {
    window.location.reload();
  };

  private goHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const { fallback: FallbackComponent, level = "component" } = this.props;

      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            errorId={this.state.errorId}
            resetError={this.resetError}
            level={level}
          />
        );
      }

      // Default fallback based on error level
      switch (level) {
        case "critical":
          return (
            <CriticalErrorFallback
              error={this.state.error}
              errorInfo={this.state.errorInfo}
              errorId={this.state.errorId}
              resetError={this.resetError}
              reloadPage={this.reloadPage}
              goHome={this.goHome}
              retryCount={this.retryCount}
              maxRetries={this.maxRetries}
            />
          );

        case "page":
          return (
            <PageErrorFallback
              error={this.state.error}
              errorInfo={this.state.errorInfo}
              errorId={this.state.errorId}
              resetError={this.resetError}
              reloadPage={this.reloadPage}
              goHome={this.goHome}
              retryCount={this.retryCount}
              maxRetries={this.maxRetries}
            />
          );

        case "component":
        default:
          return (
            <ComponentErrorFallback
              error={this.state.error}
              errorInfo={this.state.errorInfo}
              errorId={this.state.errorId}
              resetError={this.resetError}
              retryCount={this.retryCount}
              maxRetries={this.maxRetries}
            />
          );
      }
    }

    return this.props.children;
  }
}

// Critical Error Fallback (Full Page)
interface ErrorFallbackProps {
  error: Error;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  resetError: () => void;
  reloadPage?: () => void;
  goHome?: () => void;
  retryCount: number;
  maxRetries: number;
}

function CriticalErrorFallback({
  error,
  errorId,
  resetError,
  reloadPage,
  goHome,
  retryCount,
  maxRetries,
}: ErrorFallbackProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 text-white">
      <Card className="w-full max-w-2xl border-red-500 p-8 text-center">
        <div className="mb-8">
          <Typography variant="display" className="mb-4 text-red-400">
            CRITICAL ERROR
          </Typography>
          <Typography variant="h1" className="mb-4">
            APPLICATION FAILURE
          </Typography>
          <Typography variant="body" className="text-muted-foreground mb-6">
            A critical error has occurred that prevents the application from
            functioning properly. Our team has been automatically notified.
          </Typography>
        </div>

        {process.env.NODE_ENV === "development" && (
          <Card className="bg-muted mb-6 p-4 text-left">
            <Typography variant="h4" className="mb-2 text-red-400">
              DEBUG INFO
            </Typography>
            <Typography variant="code" className="mb-2 text-sm break-all">
              {error.message}
            </Typography>
            {errorId && (
              <Typography variant="caption" className="text-muted-foreground">
                Error ID: {errorId}
              </Typography>
            )}
          </Card>
        )}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-4">
            <Typography variant="h4" className="mb-2 text-red-400">
              STATUS
            </Typography>
            <Typography variant="caption">Critical failure detected</Typography>
          </Card>
          <Card className="p-4">
            <Typography variant="h4" className="mb-2 text-red-400">
              RETRIES
            </Typography>
            <Typography variant="caption">
              {retryCount}/{maxRetries}
            </Typography>
          </Card>
          <Card className="p-4">
            <Typography variant="h4" className="mb-2 text-red-400">
              SUPPORT
            </Typography>
            <Typography variant="caption">Team notified</Typography>
          </Card>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          {retryCount < maxRetries && (
            <Button onClick={resetError} variant="primary">
              TRY AGAIN ({maxRetries - retryCount} left)
            </Button>
          )}
          {reloadPage && (
            <Button onClick={reloadPage} variant="secondary">
              RELOAD PAGE
            </Button>
          )}
          {goHome && (
            <Button onClick={goHome} variant="ghost">
              GO HOME
            </Button>
          )}
        </div>

        {errorId && (
          <div className="border-border mt-8 border-t pt-8">
            <Typography variant="caption" className="text-muted-foreground">
              Error ID: {errorId} | Report this to support
            </Typography>
          </div>
        )}
      </Card>
    </div>
  );
}

// Page Error Fallback
function PageErrorFallback({
  error,
  errorId,
  resetError,
  reloadPage,
  goHome,
  retryCount,
  maxRetries,
}: ErrorFallbackProps) {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-xl p-6 text-center">
        <div className="mb-6">
          <Typography variant="h1" className="text-accent mb-4">
            PAGE ERROR
          </Typography>
          <Typography variant="body" className="text-muted-foreground mb-4">
            This page encountered an error and couldn't load properly.
          </Typography>
        </div>

        {process.env.NODE_ENV === "development" && (
          <Card className="bg-muted mb-4 p-3 text-left">
            <Typography variant="code" className="text-xs break-all">
              {error.message}
            </Typography>
          </Card>
        )}

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          {retryCount < maxRetries && (
            <Button onClick={resetError} variant="primary">
              RETRY
            </Button>
          )}
          {reloadPage && (
            <Button onClick={reloadPage} variant="secondary">
              RELOAD
            </Button>
          )}
          {goHome && (
            <Button onClick={goHome} variant="ghost">
              HOME
            </Button>
          )}
        </div>

        {errorId && (
          <Typography variant="caption" className="text-muted-foreground mt-4">
            Error ID: {errorId}
          </Typography>
        )}
      </Card>
    </div>
  );
}

// Component Error Fallback
function ComponentErrorFallback({
  error,
  errorId,
  resetError,
  retryCount,
  maxRetries,
}: Omit<ErrorFallbackProps, "reloadPage" | "goHome">) {
  return (
    <Card className="border-yellow-500 bg-yellow-900/20 p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div className="flex-1">
          <Typography variant="h4" className="mb-2 text-yellow-400">
            COMPONENT ERROR
          </Typography>
          <Typography variant="caption" className="mb-3 text-yellow-200">
            This component encountered an error and couldn't render properly.
          </Typography>

          {process.env.NODE_ENV === "development" && (
            <Typography
              variant="code"
              className="mb-3 block text-xs text-yellow-300"
            >
              {error.message}
            </Typography>
          )}

          <div className="flex items-center gap-3">
            {retryCount < maxRetries && (
              <Button
                onClick={resetError}
                variant="secondary"
                className="text-xs"
              >
                RETRY COMPONENT
              </Button>
            )}
            {errorId && (
              <Typography variant="caption" className="text-yellow-300">
                ID: {errorId.slice(-8)}
              </Typography>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

// Convenience wrapper components
export function CriticalErrorBoundary({
  children,
  ...props
}: Omit<Props, "level">) {
  return (
    <AppErrorBoundary level="critical" {...props}>
      {children}
    </AppErrorBoundary>
  );
}

export function PageErrorBoundary({
  children,
  ...props
}: Omit<Props, "level">) {
  return (
    <AppErrorBoundary level="page" {...props}>
      {children}
    </AppErrorBoundary>
  );
}

export function ComponentErrorBoundary({
  children,
  ...props
}: Omit<Props, "level">) {
  return (
    <AppErrorBoundary level="component" {...props}>
      {children}
    </AppErrorBoundary>
  );
}
