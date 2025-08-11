"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Settings } from "lucide-react";

interface ConsentBannerProps {
  onAcceptAll: () => void;
  onAcceptNecessary: () => void;
  onCustomize: (consent: {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    functional: boolean;
  }) => void;
}

export function ConsentBanner({ onAcceptAll, onAcceptNecessary, onCustomize }: ConsentBannerProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [customConsent, setCustomConsent] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: true,
  });

  const handleCustomSave = () => {
    onCustomize(customConsent);
  };

  if (showDetails) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
        <div className="w-full max-w-2xl border-4 border-white bg-black p-6"></div>      <div className="mb-6 flex items-center justify-between">
            <h2 className="font-mono text-xl font-bold text-white uppercase">
              PRIVACY PREFERENCES
            </h2>
            <button
              onClick={() => setShowDetails(false)}
              className="text-white hover:text-yellow-400"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between border-2 border-gray-600 p-4">
                <div className="flex-1">
                  <h3 className="font-mono font-bold text-white uppercase">
                    NECESSARY COOKIES
                  </h3>
                  <p className="mt-2 font-mono text-sm text-gray-400">
                    Essential for basic website functionality. Cannot be disabled.
                  </p>
                </div>
                <div className="ml-4">
                  <div className="font-mono text-sm text-green-400">ALWAYS ON</div>
                </div>
              </div>

              <div className="flex items-start justify-between border-2 border-gray-600 p-4">
                <div className="flex-1">
                  <h3 className="font-mono font-bold text-white uppercase">
                    ANALYTICS COOKIES
                  </h3>
                  <p className="mt-2 font-mono text-sm text-gray-400">
                    Help us understand how visitors interact with our website.
                  </p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() =>
                      setCustomConsent(prev => ({ ...prev, analytics: !prev.analytics }))
                    }
                    className={`border-2 px-4 py-2 font-mono text-sm uppercase transition-colors ${
                      customConsent.analytics
                        ? "border-yellow-400 bg-yellow-400 text-black"
                        : "border-white text-white hover:bg-white hover:text-black"
                    }`}
                  >
                    {customConsent.analytics ? "ON" : "OFF"}
                  </button>
                </div>
              </div>

              <div className="flex items-start justify-between border-2 border-gray-600 p-4">
                <div className="flex-1">
                  <h3 className="font-mono font-bold text-white uppercase">
                    MARKETING COOKIES
                  </h3>
                  <p className="mt-2 font-mono text-sm text-gray-400">
                    Used to track visitors across websites for marketing purposes.
                  </p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() =>
                      setCustomConsent(prev => ({ ...prev, marketing: !prev.marketing }))
                    }
                    className={`border-2 px-4 py-2 font-mono text-sm uppercase transition-colors ${
                      customConsent.marketing
                        ? "border-yellow-400 bg-yellow-400 text-black"
                        : "border-white text-white hover:bg-white hover:text-black"
                    }`}
                  >
                    {customConsent.marketing ? "ON" : "OFF"}
                  </button>
                </div>
              </div>

              <div className="flex items-start justify-between border-2 border-gray-600 p-4">
                <div className="flex-1">
                  <h3 className="font-mono font-bold text-white uppercase">
                    FUNCTIONAL COOKIES
                  </h3>
                  <p className="mt-2 font-mono text-sm text-gray-400">
                    Enable enhanced functionality and personalization.
                  </p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() =>
                      setCustomConsent(prev => ({ ...prev, functional: !prev.functional }))
                    }
                    className={`border-2 px-4 py-2 font-mono text-sm uppercase transition-colors ${
                      customConsent.functional
                        ? "border-yellow-400 bg-yellow-400 text-black"
                        : "border-white text-white hover:bg-white hover:text-black"
                    }`}
                  >
                    {customConsent.functional ? "ON" : "OFF"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleCustomSave} className="flex-1">
                SAVE PREFERENCES
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowDetails(false)}
                className="flex-1"
              >
                CANCEL
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t-4 border-white bg-black p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <h2 className="mb-2 font-mono text-lg font-bold text-white uppercase">
              PRIVACY NOTICE
            </h2>
            <p className="font-mono text-sm text-gray-400">
              We use cookies and similar technologies to enhance your experience, analyze traffic, 
              and improve our services. Choose your preferences below.
            </p>
          </div>
          
          <div className="flex flex-col gap-2 sm:flex-row lg:ml-6">
            <Button
              onClick={onAcceptAll}
              className="whitespace-nowrap"
            >
              ACCEPT ALL
            </Button>
            <Button
              onClick={onAcceptNecessary}
              variant="ghost"
              className="whitespace-nowrap"
            >
              NECESSARY ONLY
            </Button>
            <Button
              onClick={() => setShowDetails(true)}
              variant="ghost"
              className="whitespace-nowrap"
            >
              <Settings className="mr-2 h-4 w-4" />
              CUSTOMIZE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}