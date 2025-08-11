"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the critical error
    console.error("Critical application error:", error);

    // Send to error monitoring service
    if (typeof window !== "undefined") {
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
          critical: true,
        }),
      }).catch((fetchError) => {
        console.error("Failed to log critical error:", fetchError);
      });
    }
  }, [error]);

  return (
    <html>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: '"Space Mono", monospace',
          backgroundColor: "#000000",
          color: "#ffffff",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            padding: "2rem",
            textAlign: "center",
            border: "4px solid #ffffff",
            backgroundColor: "#000000",
          }}
        >
          <h1
            style={{
              fontSize: "4rem",
              color: "#ffff00",
              margin: "0 0 1rem 0",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
            }}
          >
            CRITICAL ERROR
          </h1>

          <h2
            style={{
              fontSize: "1.5rem",
              margin: "0 0 1rem 0",
              textTransform: "uppercase",
            }}
          >
            Application Failure
          </h2>

          <p
            style={{
              fontSize: "1rem",
              margin: "0 0 2rem 0",
              color: "#f8f8f8",
              lineHeight: "1.5",
            }}
          >
            A critical error has occurred. The application needs to be
            restarted. Our team has been automatically notified.
          </p>

          {process.env.NODE_ENV === "development" && (
            <div
              style={{
                backgroundColor: "#1a1a1a",
                border: "2px solid #ffffff",
                padding: "1rem",
                marginBottom: "2rem",
                textAlign: "left",
              }}
            >
              <strong style={{ color: "#ffff00" }}>DEBUG:</strong>
              <br />
              <code style={{ fontSize: "0.875rem", wordBreak: "break-all" }}>
                {error.message}
              </code>
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={reset}
              style={{
                backgroundColor: "#000000",
                color: "#ffffff",
                border: "4px solid #ffffff",
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                fontFamily: '"Space Mono", monospace',
                fontWeight: "700",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translate(-2px, -2px)";
                e.currentTarget.style.boxShadow = "4px 4px 0px 0px #ffffff";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translate(0, 0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              RESTART APP
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              style={{
                backgroundColor: "#ffffff",
                color: "#000000",
                border: "4px solid #ffffff",
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                fontFamily: '"Space Mono", monospace',
                fontWeight: "700",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translate(-2px, -2px)";
                e.currentTarget.style.boxShadow = "4px 4px 0px 0px #ffff00";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translate(0, 0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              GO HOME
            </button>
          </div>

          <div
            style={{
              marginTop: "2rem",
              paddingTop: "2rem",
              borderTop: "2px solid #ffffff",
              fontSize: "0.75rem",
              color: "#f8f8f8",
            }}
          >
            Error Code: CRITICAL | Application Failure
            {error.digest && ` | ID: ${error.digest}`}
          </div>
        </div>
      </body>
    </html>
  );
}
