"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;
      const { error } = this.state;

      if (Fallback && error) {
        return <Fallback error={error} retry={this.retry} />;
      }

      return (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border-4 border-red-500 bg-red-50 p-8 text-center">
          <div className="mb-4">
            <h2 className="mb-2 font-mono text-xl font-bold text-red-800">
              Something went wrong
            </h2>
            <p className="text-sm text-red-600">
              {process.env.NODE_ENV === "development" && error
                ? error.message
                : "An unexpected error occurred"}
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={this.retry}
            className="font-mono"
          >
            TRY AGAIN
          </Button>
          {process.env.NODE_ENV === "development" && (
            <details className="mt-4 max-w-full overflow-auto">
              <summary className="cursor-pointer font-mono text-xs text-red-700">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-left text-xs whitespace-pre-wrap text-red-800">
                {error?.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Hook for error handling in functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    setError(error);
    console.error("Error caught by useErrorHandler:", error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { handleError, resetError };
}

export default ErrorBoundary;
