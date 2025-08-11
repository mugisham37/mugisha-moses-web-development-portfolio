"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LinkedInTestimonials } from "@/components/testimonials/linkedin-testimonials";
import {
  isLinkedInConfigured,
  linkedInIntegration,
} from "@/lib/linkedin-integration";

interface LinkedInIntegrationAdminProps {
  className?: string;
}

interface LinkedInSettings {
  clientId: string;
  clientSecret: string;
  accessToken: string;
  profileId: string;
  autoImport: boolean;
  verifyConnections: boolean;
}

export function LinkedInIntegrationAdmin({
  className = "",
}: LinkedInIntegrationAdminProps) {
  const [settings, setSettings] = useState<LinkedInSettings>({
    clientId: "",
    clientSecret: "",
    accessToken: "",
    profileId: "",
    autoImport: false,
    verifyConnections: true,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "unknown" | "connected" | "error"
  >("unknown");
  const [activeTab, setActiveTab] = useState<
    "settings" | "import" | "verification"
  >("settings");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from your settings API
      const isConfigured = isLinkedInConfigured();
      setConnectionStatus(isConfigured ? "connected" : "error");

      // Load settings from environment or database
      setSettings({
        clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || "",
        clientSecret: "", // Never expose client secret in frontend
        accessToken: "", // Never expose access token in frontend
        profileId: "", // Would come from user settings
        autoImport: false,
        verifyConnections: true,
      });
    } catch (error) {
      console.error("Error loading LinkedIn settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // In a real implementation, this would save to your settings API
      const response = await fetch("/api/admin/linkedin-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert("LinkedIn settings saved successfully!");
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving LinkedIn settings:", error);
      alert("Failed to save LinkedIn settings");
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    setTestingConnection(true);
    try {
      // Test LinkedIn API connection
      const recommendations = await linkedInIntegration.getRecommendations(
        settings.profileId
      );
      setConnectionStatus("connected");
      alert(
        `Connection successful! Found ${recommendations.length} recommendations.`
      );
    } catch (error) {
      console.error("LinkedIn connection test failed:", error);
      setConnectionStatus("error");
      alert("LinkedIn connection test failed. Please check your credentials.");
    } finally {
      setTestingConnection(false);
    }
  };

  const handleInputChange = (
    field: keyof LinkedInSettings,
    value: string | boolean
  ) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const getConnectionStatusBadge = () => {
    switch (connectionStatus) {
      case "connected":
        return (
          <span className="bg-green-600 px-3 py-1 text-xs font-bold text-white uppercase">
            Connected
          </span>
        );
      case "error":
        return (
          <span className="bg-red-600 px-3 py-1 text-xs font-bold text-white uppercase">
            Not Connected
          </span>
        );
      default:
        return (
          <span className="bg-gray-600 px-3 py-1 text-xs font-bold text-white uppercase">
            Unknown
          </span>
        );
    }
  };

  if (loading) {
    return (
      <Card className={`p-8 text-center ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="mx-auto h-8 w-1/3 rounded bg-gray-700"></div>
          <div className="mx-auto h-4 w-1/2 rounded bg-gray-700"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h2" className="text-2xl font-bold uppercase">
            LinkedIn Integration
          </Typography>
          <Typography variant="body" className="text-gray-400">
            Manage LinkedIn API integration for testimonial import
          </Typography>
        </div>
        {getConnectionStatusBadge()}
      </div>

      {/* Tab Navigation */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-3">
          {[
            { key: "settings" as const, label: "Settings", icon: "⚙️" },
            { key: "import" as const, label: "Import", icon: "📥" },
            { key: "verification" as const, label: "Verification", icon: "✅" },
          ].map(({ key, label, icon }) => (
            <Button
              key={key}
              variant={activeTab === key ? "accent" : "secondary"}
              size="sm"
              onClick={() => setActiveTab(key)}
              className="font-mono text-xs uppercase"
            >
              <span className="mr-2">{icon}</span>
              {label}
            </Button>
          ))}
        </div>
      </Card>

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <motion.div
          key="settings"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-6">
            <Typography
              variant="h3"
              className="mb-6 text-xl font-bold uppercase"
            >
              LinkedIn API Configuration
            </Typography>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client ID</Label>
                  <Input
                    id="clientId"
                    type="text"
                    value={settings.clientId}
                    onChange={(e) =>
                      handleInputChange("clientId", e.target.value)
                    }
                    placeholder="LinkedIn App Client ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profileId">Profile ID</Label>
                  <Input
                    id="profileId"
                    type="text"
                    value={settings.profileId}
                    onChange={(e) =>
                      handleInputChange("profileId", e.target.value)
                    }
                    placeholder="Your LinkedIn Profile ID"
                  />
                </div>
              </div>

              <div className="space-y-4 rounded border border-gray-700 p-4">
                <Typography variant="h4" className="font-bold">
                  Integration Options
                </Typography>

                <div className="space-y-3">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={settings.autoImport}
                      onChange={(e) =>
                        handleInputChange("autoImport", e.target.checked)
                      }
                      className="accent-brutalist-yellow mt-1 h-4 w-4"
                    />
                    <div>
                      <span className="text-sm font-medium">
                        Auto-import new recommendations
                      </span>
                      <p className="text-xs text-gray-400">
                        Automatically import new LinkedIn recommendations as
                        testimonials
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={settings.verifyConnections}
                      onChange={(e) =>
                        handleInputChange("verifyConnections", e.target.checked)
                      }
                      className="accent-brutalist-yellow mt-1 h-4 w-4"
                    />
                    <div>
                      <span className="text-sm font-medium">
                        Verify client connections
                      </span>
                      <p className="text-xs text-gray-400">
                        Check if testimonial authors are connected on LinkedIn
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="accent"
                  onClick={saveSettings}
                  disabled={saving}
                  className="font-mono uppercase"
                >
                  {saving ? "Saving..." : "Save Settings"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={testConnection}
                  disabled={testingConnection}
                  className="font-mono uppercase"
                >
                  {testingConnection ? "Testing..." : "Test Connection"}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Import Tab */}
      {activeTab === "import" && (
        <motion.div
          key="import"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <LinkedInTestimonials />
        </motion.div>
      )}

      {/* Verification Tab */}
      {activeTab === "verification" && (
        <motion.div
          key="verification"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-6">
            <Typography
              variant="h3"
              className="mb-6 text-xl font-bold uppercase"
            >
              Connection Verification
            </Typography>

            <div className="space-y-6">
              <Typography variant="body" className="text-gray-400">
                Verify LinkedIn connections for existing testimonials to add
                credibility badges.
              </Typography>

              <div className="space-y-4">
                <Button
                  variant="accent"
                  className="font-mono uppercase"
                  onClick={async () => {
                    // In a real implementation, this would verify all testimonials
                    alert(
                      "Connection verification started. This may take a few minutes."
                    );
                  }}
                >
                  Verify All Connections
                </Button>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Card className="p-4 text-center">
                    <Typography
                      variant="h4"
                      className="text-brutalist-yellow mb-2 text-2xl font-bold"
                    >
                      12
                    </Typography>
                    <Typography variant="body" className="text-gray-400">
                      Verified Connections
                    </Typography>
                  </Card>
                  <Card className="p-4 text-center">
                    <Typography
                      variant="h4"
                      className="mb-2 text-2xl font-bold text-orange-400"
                    >
                      3
                    </Typography>
                    <Typography variant="body" className="text-gray-400">
                      Pending Verification
                    </Typography>
                  </Card>
                  <Card className="p-4 text-center">
                    <Typography
                      variant="h4"
                      className="mb-2 text-2xl font-bold text-red-400"
                    >
                      1
                    </Typography>
                    <Typography variant="body" className="text-gray-400">
                      Verification Failed
                    </Typography>
                  </Card>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Setup Instructions */}
      <Card className="bg-brutalist-charcoal-100 p-6">
        <Typography variant="h4" className="mb-4 font-bold">
          LinkedIn App Setup Instructions
        </Typography>
        <div className="space-y-2 text-sm text-gray-300">
          <p>
            1. Create a LinkedIn App at{" "}
            <a
              href="https://developer.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brutalist-yellow hover:underline"
            >
              developer.linkedin.com
            </a>
          </p>
          <p>2. Add your domain to the authorized redirect URLs</p>
          <p>
            3. Request access to the "Sign In with LinkedIn" and "Profile API"
            products
          </p>
          <p>
            4. Copy your Client ID and Client Secret to your environment
            variables
          </p>
          <p>
            5. Set up OAuth flow to get access tokens for recommendation import
          </p>
        </div>
      </Card>
    </div>
  );
}
