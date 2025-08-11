"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/use-analytics";
import { useABTest } from "./ab-test-provider";
import { ConversionTracker } from "./conversion-tracker";

export function AnalyticsDemo() {
  const [eventCount, setEventCount] = useState(0);
  const { trackEvent, trackConversion } = useAnalytics();
  const { getVariant, trackConversion: trackABConversion } = useABTest();

  // Example A/B test
  const buttonVariant = getVariant("demo_button_test");
  const buttonText = buttonVariant === "variant" ? "CLICK ME NOW!" : "CLICK ME";
  const buttonColor =
    buttonVariant === "variant" ? "bg-red-500" : "bg-yellow-400";

  const handleTrackEvent = () => {
    trackEvent("demo_button_click", {
      count: eventCount + 1,
      variant: buttonVariant,
    });
    setEventCount((prev) => prev + 1);
  };

  const handleTrackConversion = () => {
    trackConversion("demo_conversion", 100, {
      source: "analytics_demo",
      variant: buttonVariant,
    });
    trackABConversion("demo_button_test");
  };

  return (
    <ConversionTracker
      step="analytics_demo_view"
      metadata={{ component: "AnalyticsDemo" }}
    >
      <div className="space-y-6 border-4 border-white p-6">
        <h2 className="font-mono text-xl font-bold text-white uppercase">
          ANALYTICS SYSTEM DEMO
        </h2>

        <div className="space-y-4">
          <div className="border-2 border-gray-600 p-4">
            <h3 className="mb-2 font-mono font-bold text-white">
              EVENT TRACKING
            </h3>
            <p className="mb-4 font-mono text-sm text-gray-400">
              Track custom events with metadata
            </p>
            <Button onClick={handleTrackEvent} className="mr-2">
              TRACK EVENT ({eventCount})
            </Button>
          </div>

          <div className="border-2 border-gray-600 p-4">
            <h3 className="mb-2 font-mono font-bold text-white">
              CONVERSION TRACKING
            </h3>
            <p className="mb-4 font-mono text-sm text-gray-400">
              Track conversions with value attribution
            </p>
            <Button onClick={handleTrackConversion} variant="accent">
              TRACK CONVERSION ($1.00)
            </Button>
          </div>

          <div className="border-2 border-gray-600 p-4">
            <h3 className="mb-2 font-mono font-bold text-white">A/B TESTING</h3>
            <p className="mb-4 font-mono text-sm text-gray-400">
              You are seeing variant:{" "}
              <span className="text-yellow-400">
                {buttonVariant.toUpperCase()}
              </span>
            </p>
            <Button
              onClick={() => {
                handleTrackEvent();
                trackABConversion("demo_button_test");
              }}
              className={`${buttonColor} text-black hover:bg-black hover:text-white`}
            >
              {buttonText}
            </Button>
          </div>

          <div className="border-2 border-gray-600 p-4">
            <h3 className="mb-2 font-mono font-bold text-white">
              PRIVACY COMPLIANCE
            </h3>
            <p className="mb-4 font-mono text-sm text-gray-400">
              Analytics respects user consent preferences
            </p>
            <div className="font-mono text-xs text-gray-500">
              Check the consent banner at the bottom of the page
            </div>
          </div>
        </div>

        <div className="border-t-2 border-gray-600 pt-4">
          <h3 className="mb-2 font-mono font-bold text-white">
            FEATURES IMPLEMENTED
          </h3>
          <ul className="space-y-1 font-mono text-sm text-gray-400">
            <li>✅ Custom event tracking with metadata</li>
            <li>✅ Page view tracking with session management</li>
            <li>✅ Conversion funnel tracking</li>
            <li>✅ Core Web Vitals monitoring</li>
            <li>✅ A/B testing framework</li>
            <li>✅ Privacy-compliant tracking with consent management</li>
            <li>✅ Real-time admin analytics dashboard</li>
            <li>✅ Performance monitoring and optimization</li>
          </ul>
        </div>
      </div>
    </ConversionTracker>
  );
}
