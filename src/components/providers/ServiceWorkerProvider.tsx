"use client";

import { useEffect, useState } from "react";
import {
  registerServiceWorker,
  showUpdateAvailableNotification,
  type ServiceWorkerConfig,
} from "@/utils/serviceWorker";

interface ServiceWorkerProviderProps {
  children: React.ReactNode;
}

export const ServiceWorkerProvider: React.FC<ServiceWorkerProviderProps> = ({
  children,
}) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const config: ServiceWorkerConfig = {
      onSuccess: (registration) => {
        console.log("[SW] Service worker registered successfully");
        setIsRegistered(true);
      },
      onUpdate: (registration) => {
        console.log("[SW] New content available");
        setUpdateAvailable(true);
        showUpdateAvailableNotification();
      },
      onError: (error) => {
        console.error("[SW] Service worker registration failed:", error);
      },
    };

    registerServiceWorker(config);

    // Listen for service worker messages
    navigator.serviceWorker?.addEventListener("message", (event) => {
      if (event.data && event.data.type === "SW_UPDATE_AVAILABLE") {
        setUpdateAvailable(true);
        showUpdateAvailableNotification();
      }
    });

    // Check for updates periodically
    const checkForUpdates = () => {
      if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "CHECK_FOR_UPDATES",
        });
      }
    };

    // Check for updates every 30 minutes
    const updateInterval = setInterval(checkForUpdates, 30 * 60 * 1000);

    return () => {
      clearInterval(updateInterval);
    };
  }, []);

  return (
    <>
      {children}
      {/* Service Worker Status Indicator (for development) */}
      {process.env.NODE_ENV === "development" && (
        <div className="sw-status-indicator">
          <div
            className={`sw-status ${isRegistered ? "registered" : "pending"}`}
          >
            SW: {isRegistered ? "Active" : "Pending"}
          </div>
          {updateAvailable && (
            <div className="sw-update-indicator">Update Available</div>
          )}
        </div>
      )}
    </>
  );
};

export default ServiceWorkerProvider;
