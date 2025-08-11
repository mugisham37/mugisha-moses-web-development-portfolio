"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to monitoring service
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In a real application, you would send this to your error monitoring service
    // like Sentry, LogRocket, or a custom logging endpoint
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent:
        typeof window !== "undefined" ? window.navigator.userAgent : "unknown",
      url: typeof window !== "undefined" ? window.location.href : "unknown",
    };

    // For now, we'll just log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error logged:", errorData);
    }

    // In production, send to your error monitoring service
    if (process.env.NODE_ENV === "production") {
      // Example: Send to your API endpoint
      fetch("/api/errors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(errorData),
      }).catch((fetchError) => {
        console.error("Failed to log error:", fetchError);
      });
    }
  };

  private resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: FallbackComponent } = this.props;

      if (FallbackComponent && this.state.error) {
        return (
          <FallbackComponent
            error={this.state.error}
            resetError={this.resetError}
            hasError={this.state.hasError}
          />
        );
      }

      return (
        <DefaultErrorFallback
          error={this.state.error!}
          resetError={this.resetError}
          hasError={this.state.hasError}
        />
      );
    }

    return this.props.children;
  }
}

// Default error fallback component with brutalist design
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
}) => {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 text-center">
        <div className="mb-6">
          <Typography variant="h1" className="text-accent mb-4">
            SYSTEM ERROR
          </Typography>
          <Typography variant="h3" className="mb-4">
            Something went wrong
          </Typography>
          <Typography variant="body" className="text-muted-foreground mb-6">
            An unexpected error occurred. Our development team has been
            notified.
          </Typography>
        </div>

        {process.env.NODE_ENV === "development" && (
          <Card className="bg-muted mb-6 p-4 text-left">
            <Typography variant="code" className="text-sm break-all">
              {error.message}
            </Typography>
            {error.stack && (
              <pre className="mt-2 max-h-40 overflow-auto text-xs">
                {error.stack}
              </pre>
            )}
          </Card>
        )}

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button onClick={resetError} variant="primary">
            Try Again
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="secondary"
          >
            Go Home
          </Button>
          <Button onClick={() => window.location.reload()} variant="ghost">
            Reload Page
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ErrorBoundary;
