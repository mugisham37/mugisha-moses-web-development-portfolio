"use client";

import { useState } from "react";
import { Mail, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus("success");
        setMessage("Successfully subscribed to newsletter!");
        setEmail("");
      } else {
        const data = await response.json();
        setStatus("error");
        setMessage(data.error || "Failed to subscribe");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 5000);
  };

  return (
    <div className="border-4 border-white p-6">
      <div className="mb-4 flex items-center gap-3">
        <Mail className="h-6 w-6 text-yellow-400" />
        <h3 className="font-mono text-xl font-bold text-white uppercase">
          NEWSLETTER
        </h3>
      </div>

      <p className="mb-4 font-mono text-sm text-gray-400">
        GET NOTIFIED WHEN NEW POSTS ARE PUBLISHED. NO SPAM, UNSUBSCRIBE ANYTIME.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="YOUR EMAIL ADDRESS"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading" || status === "success"}
            className="font-mono uppercase"
          />
        </div>

        <Button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="w-full"
        >
          {status === "loading" ? (
            "SUBSCRIBING..."
          ) : status === "success" ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              SUBSCRIBED!
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              SUBSCRIBE
            </>
          )}
        </Button>

        {message && (
          <div
            className={`flex items-center gap-2 p-3 font-mono text-sm ${
              status === "success"
                ? "border border-green-400 text-green-400"
                : "border border-red-400 text-red-400"
            }`}
          >
            {status === "success" ? (
              <Check className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
