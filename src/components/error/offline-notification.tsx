"use client";

import { useOfflineNotification } from "@/lib/offline-detection";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

export function OfflineNotification() {
  const { showNotification, notificationType, hideNotification } =
    useOfflineNotification();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showNotification) {
      setIsVisible(true);
    } else {
      // Delay hiding to allow for exit animation
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        showNotification
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      }`}
    >
      <Card
        className={`max-w-sm p-4 ${
          notificationType === "offline"
            ? "border-red-500 bg-red-900"
            : "border-green-500 bg-green-900"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  notificationType === "offline"
                    ? "animate-pulse bg-red-400"
                    : "bg-green-400"
                }`}
              />
              <Typography variant="h4" className="text-white">
                {notificationType === "offline" ? "OFFLINE" : "BACK ONLINE"}
              </Typography>
            </div>

            <Typography variant="caption" className="text-gray-200">
              {notificationType === "offline"
                ? "You're currently offline. Some features may be limited."
                : "Connection restored. All features are now available."}
            </Typography>

            {notificationType === "offline" && (
              <div className="mt-3 space-y-2">
                <Typography variant="caption" className="block text-gray-300">
                  Available offline:
                </Typography>
                <ul className="space-y-1 text-xs text-gray-300">
                  <li>• Cached project data</li>
                  <li>• Previously loaded content</li>
                  <li>• Basic navigation</li>
                </ul>
              </div>
            )}
          </div>

          <Button
            onClick={hideNotification}
            variant="ghost"
            className="h-auto min-h-0 p-1 text-white hover:bg-white/10"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>

        {notificationType === "offline" && (
          <div className="mt-3 border-t border-gray-600 pt-3">
            <Button
              onClick={() => window.location.reload()}
              variant="secondary"
              className="w-full text-xs"
            >
              TRY RECONNECTING
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

// Connection status indicator for the header
export function ConnectionStatus() {
  const { isOnline } = useOfflineNotification();
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Show status indicator when offline
    setShowStatus(!isOnline);
  }, [isOnline]);

  if (!showStatus) return null;

  return (
    <div className="flex items-center gap-2 rounded border border-red-500 bg-red-900 px-3 py-1">
      <div className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
      <Typography variant="caption" className="text-red-100 uppercase">
        Offline Mode
      </Typography>
    </div>
  );
}

// Network quality indicator
export function NetworkQualityIndicator() {
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // Check if Network Information API is available
    interface ExtendedNavigator extends Navigator {
      connection?: {
        effectiveType: string;
        downlink: number;
        addEventListener: (type: string, listener: () => void) => void;
        removeEventListener: (type: string, listener: () => void) => void;
      };
      mozConnection?: {
        effectiveType: string;
        downlink: number;
        addEventListener: (type: string, listener: () => void) => void;
        removeEventListener: (type: string, listener: () => void) => void;
      };
      webkitConnection?: {
        effectiveType: string;
        downlink: number;
        addEventListener: (type: string, listener: () => void) => void;
        removeEventListener: (type: string, listener: () => void) => void;
      };
    }

    const connection =
      (navigator as ExtendedNavigator).connection ||
      (navigator as ExtendedNavigator).mozConnection ||
      (navigator as ExtendedNavigator).webkitConnection;

    if (connection) {
      const updateConnectionInfo = () => {
        let quality: "fast" | "slow" | "offline" = "fast";

        switch (connection.effectiveType) {
          case "slow-2g":
          case "2g":
            quality = "slow";
            break;
          case "3g":
            quality = connection.downlink > 1.5 ? "fast" : "slow";
            break;
          case "4g":
          default:
            quality = "fast";
            break;
        }

        setShowIndicator(quality === "slow");
      };

      updateConnectionInfo();
      connection.addEventListener("change", updateConnectionInfo);

      return () => {
        connection.removeEventListener("change", updateConnectionInfo);
      };
    }
  }, []);

  if (!showIndicator) return null;

  return (
    <div className="flex items-center gap-2 rounded border border-yellow-500 bg-yellow-900 px-3 py-1">
      <div className="h-2 w-2 rounded-full bg-yellow-400" />
      <Typography variant="caption" className="text-yellow-100 uppercase">
        Slow Connection
      </Typography>
    </div>
  );
}

// Offline fallback content component
interface OfflineFallbackProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showOfflineMessage?: boolean;
}

export function OfflineFallback({
  children,
  fallback,
  showOfflineMessage = true,
}: OfflineFallbackProps) {
  const { isOnline } = useOfflineNotification();

  if (isOnline) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showOfflineMessage) {
    return null;
  }

  return (
    <Card className="p-8 text-center">
      <div className="mb-4">
        <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <svg
            className="text-muted-foreground h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2v6m0 8v6m-6-6h6m8 0h-6"
            />
          </svg>
        </div>

        <Typography variant="h3" className="mb-2">
          OFFLINE MODE
        </Typography>

        <Typography variant="body" className="text-muted-foreground">
          This content requires an internet connection. Please check your
          connection and try again.
        </Typography>
      </div>

      <Button onClick={() => window.location.reload()} variant="primary">
        RETRY CONNECTION
      </Button>
    </Card>
  );
}
