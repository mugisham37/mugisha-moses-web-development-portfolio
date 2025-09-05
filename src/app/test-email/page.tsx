"use client";

import { useState } from "react";

export default function TestEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const sendTestEmail = async () => {
    setIsLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult(`✅ Success! Test email sent. ID: ${data.id}`);
      } else {
        setResult(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ Network error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          Email Integration Test
        </h1>

        <div className="space-y-4">
          <p className="text-gray-600 text-center">
            Click the button below to send a test email to mugisham505@gmail.com
          </p>

          <button
            onClick={sendTestEmail}
            disabled={isLoading}
            className="w-full bg-black text-white py-3 px-4 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Sending..." : "Send Test Email"}
          </button>

          {result && (
            <div
              className={`p-4 rounded ${
                result.includes("✅")
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {result}
            </div>
          )}

          <div className="text-sm text-gray-500 space-y-2">
            <p>
              <strong>Setup checklist:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Add your Resend API key to .env.local</li>
              <li>Restart your development server</li>
              <li>Click the test button above</li>
              <li>Check mugisham505@gmail.com for the test email</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
