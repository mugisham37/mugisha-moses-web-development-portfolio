"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/layout/container";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);

    // In production, send to your error monitoring service
    if (process.env.NODE_ENV === "production") {
      fetch("/api/errors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          digest: error.digest,
          timestamp: new Date().toISOString(),
          userAgent: window.navigator.userAgent,
          url: window.location.href,
        }),
      }).catch((fetchError) => {
        console.error("Failed to log error:", fetchError);
      });
    }
  }, [error]);

  return (
    <Container className="flex min-h-screen items-center justify-center py-16">
      <Card className="w-full max-w-2xl p-8 text-center">
        <div className="mb-8">
          <Typography variant="display" className="text-accent mb-4">
            500
          </Typography>
          <Typography variant="h1" className="mb-4">
            SYSTEM ERROR
          </Typography>
          <Typography
            variant="body"
            className="text-muted-foreground mx-auto mb-6 max-w-md"
          >
            Something went wrong on our end. Our development team has been
            notified and is working to fix the issue.
          </Typography>
        </div>

        {process.env.NODE_ENV === "development" && (
          <Card className="bg-muted mb-6 p-4 text-left">
            <Typography variant="h4" className="text-accent mb-2">
              DEBUG INFO
            </Typography>
            <Typography variant="code" className="mb-2 text-sm break-all">
              {error.message}
            </Typography>
            {error.digest && (
              <Typography variant="caption" className="text-muted-foreground">
                Error ID: {error.digest}
              </Typography>
            )}
          </Card>
        )}

        <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Button onClick={reset} variant="primary">
            TRY AGAIN
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="secondary"
          >
            GO HOME
          </Button>
          <Button onClick={() => window.location.reload()} variant="ghost">
            RELOAD PAGE
          </Button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-4">
            <Typography variant="h4" className="text-accent mb-2">
              STATUS
            </Typography>
            <Typography variant="caption">Monitoring systems active</Typography>
          </Card>
          <Card className="p-4">
            <Typography variant="h4" className="text-accent mb-2">
              SUPPORT
            </Typography>
            <Typography variant="caption">Team has been notified</Typography>
          </Card>
          <Card className="p-4">
            <Typography variant="h4" className="text-accent mb-2">
              ETA
            </Typography>
            <Typography variant="caption">Resolution in progress</Typography>
          </Card>
        </div>

        <div className="border-border border-t pt-8">
          <Typography variant="caption" className="text-muted-foreground">
            Error Code: 500 | Internal Server Error
            {error.digest && ` | ID: ${error.digest}`}
          </Typography>
        </div>
      </Card>
    </Container>
  );
}
