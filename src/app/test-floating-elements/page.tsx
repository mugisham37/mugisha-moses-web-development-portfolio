"use client";

import React from "react";
import { BrutalButton } from "@/components/ui";
import {
  showSuccessNotification,
  showErrorNotification,
  showWarningNotification,
  showInfoNotification,
  clearAllNotifications,
} from "@/components/layout";

export default function TestFloatingElementsPage() {
  const handleShowSuccess = () => {
    showSuccessNotification(
      "Success!",
      "Your action was completed successfully.",
      {
        label: "View Details",
        onClick: () => console.log("View details clicked"),
      }
    );
  };

  const handleShowError = () => {
    showErrorNotification(
      "Error Occurred",
      "Something went wrong. Please try again.",
      {
        label: "Retry",
        onClick: () => console.log("Retry clicked"),
      }
    );
  };

  const handleShowWarning = () => {
    showWarningNotification(
      "Warning",
      "This action may have unintended consequences.",
      {
        label: "Proceed Anyway",
        onClick: () => console.log("Proceed clicked"),
      }
    );
  };

  const handleShowInfo = () => {
    showInfoNotification(
      "Information",
      "Here's some useful information for you.",
      {
        label: "Learn More",
        onClick: () => console.log("Learn more clicked"),
      }
    );
  };

  const handleClearAll = () => {
    clearAllNotifications();
  };

  return (
    <div className="min-h-screen bg-current text-current p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Floating Elements Test Page
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Notification System</h2>
            <p className="text-muted mb-6">
              Test the notification system with different types of
              notifications. The floating contact will appear as you scroll.
            </p>

            <div className="space-y-3">
              <BrutalButton
                variant="primary"
                size="md"
                onClick={handleShowSuccess}
                className="w-full"
              >
                Show Success Notification
              </BrutalButton>

              <BrutalButton
                variant="secondary"
                size="md"
                onClick={handleShowError}
                className="w-full"
              >
                Show Error Notification
              </BrutalButton>

              <BrutalButton
                variant="ghost"
                size="md"
                onClick={handleShowWarning}
                className="w-full"
              >
                Show Warning Notification
              </BrutalButton>

              <BrutalButton
                variant="primary"
                size="md"
                onClick={handleShowInfo}
                className="w-full"
              >
                Show Info Notification
              </BrutalButton>

              <BrutalButton
                variant="secondary"
                size="md"
                onClick={handleClearAll}
                className="w-full"
              >
                Clear All Notifications
              </BrutalButton>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Cookie Consent</h2>
            <p className="text-muted mb-6">
              The cookie consent banner will appear automatically if no consent
              has been given. Clear your localStorage to see it again.
            </p>

            <BrutalButton
              variant="ghost"
              size="md"
              onClick={() => {
                localStorage.removeItem("cookie-consent");
                localStorage.removeItem("cookie-consent-date");
                window.location.reload();
              }}
              className="w-full"
            >
              Reset Cookie Consent
            </BrutalButton>
          </div>
        </div>

        <div className="mt-12 space-y-8">
          <h2 className="text-2xl font-semibold">Floating Contact Test</h2>
          <p className="text-muted">
            Scroll down to see the floating contact appear. It will show
            periodically based on your scroll position and interaction history.
          </p>

          {/* Add some content to enable scrolling */}
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="p-6 border brutal-border bg-secondary">
              <h3 className="text-xl font-semibold mb-4">Section {i + 1}</h3>
              <p className="text-muted">
                This is some content to enable scrolling. The floating contact
                should appear as you scroll through this content. Lorem ipsum
                dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat.
              </p>
              <p className="text-muted mt-4">
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted">
            End of test content. The floating contact should have appeared by
            now if you scrolled through the content above.
          </p>
        </div>
      </div>
    </div>
  );
}
