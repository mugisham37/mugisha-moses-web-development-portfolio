"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Play, Pause, TrendingUp, TrendingDown } from "lucide-react";

interface ABTestExperiment {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  trafficSplit: number;
  targetPages: string[];
  component: string;
  controlVersion: Record<string, unknown>;
  variantVersion: Record<string, unknown>;
  primaryGoal: string;
  successMetric: string;
  controlConversions: number;
  variantConversions: number;
  controlViews: number;
  variantViews: number;
  confidenceLevel: number | null;
  pValue: number | null;
  isSignificant: boolean;
  winner: string | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
}

export function ABTestManagement() {
  const [experiments, setExperiments] = useState<ABTestExperiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadExperiments();
  }, []);

  const loadExperiments = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/ab-tests");
      if (response.ok) {
        const data = await response.json();
        setExperiments(data.experiments);
      }
    } catch (error) {
      console.error("Failed to load A/B tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExperiment = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/ab-tests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        loadExperiments();
      }
    } catch (error) {
      console.error("Failed to toggle experiment:", error);
    }
  };

  const calculateConversionRate = (conversions: number, views: number) => {
    return views > 0 ? ((conversions / views) * 100).toFixed(2) : "0.00";
  };

  const getSignificanceColor = (
    isSignificant: boolean,
    winner: string | null
  ) => {
    if (!isSignificant) return "text-gray-400";
    return winner === "variant" ? "text-green-400" : "text-yellow-400";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="font-mono text-white">LOADING A/B TESTS...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-2 border-white p-4">
        <h2 className="font-mono text-xl font-bold text-white uppercase">
          A/B TEST MANAGEMENT
        </h2>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          CREATE TEST
        </Button>
      </div>

      {/* Experiments List */}
      <div className="space-y-4">
        {experiments.length === 0 ? (
          <div className="border-4 border-white p-12 text-center">
            <div className="font-mono text-gray-400">
              NO A/B TESTS CONFIGURED
            </div>
            <div className="mt-2 font-mono text-sm text-gray-500">
              Create your first experiment to start testing
            </div>
          </div>
        ) : (
          experiments.map((experiment) => {
            const controlRate = parseFloat(
              calculateConversionRate(
                experiment.controlConversions,
                experiment.controlViews
              )
            );
            const variantRate = parseFloat(
              calculateConversionRate(
                experiment.variantConversions,
                experiment.variantViews
              )
            );
            const improvement =
              controlRate > 0
                ? ((variantRate - controlRate) / controlRate) * 100
                : 0;

            return (
              <div key={experiment.id} className="border-4 border-white p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-mono text-lg font-bold text-white uppercase">
                      {experiment.name}
                    </h3>
                    <p className="mt-1 font-mono text-sm text-gray-400">
                      {experiment.description}
                    </p>
                    <div className="mt-2 flex items-center gap-4 font-mono text-xs text-gray-500">
                      <span>GOAL: {experiment.primaryGoal}</span>
                      <span>PAGES: {experiment.targetPages.join(", ")}</span>
                      <span>SPLIT: {experiment.trafficSplit}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`border px-2 py-1 font-mono text-xs ${
                        experiment.isActive
                          ? "border-green-400 text-green-400"
                          : "border-gray-400 text-gray-400"
                      }`}
                    >
                      {experiment.isActive ? "ACTIVE" : "PAUSED"}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        toggleExperiment(experiment.id, experiment.isActive)
                      }
                    >
                      {experiment.isActive ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {/* Control */}
                  <div className="border-2 border-gray-600 p-4">
                    <div className="mb-2 font-mono text-sm text-gray-400 uppercase">
                      CONTROL
                    </div>
                    <div className="font-mono text-lg font-bold text-white">
                      {controlRate}%
                    </div>
                    <div className="font-mono text-xs text-gray-400">
                      {experiment.controlConversions}/{experiment.controlViews}{" "}
                      conversions
                    </div>
                  </div>

                  {/* Variant */}
                  <div className="border-2 border-gray-600 p-4">
                    <div className="mb-2 font-mono text-sm text-gray-400 uppercase">
                      VARIANT
                    </div>
                    <div className="font-mono text-lg font-bold text-white">
                      {variantRate}%
                    </div>
                    <div className="font-mono text-xs text-gray-400">
                      {experiment.variantConversions}/{experiment.variantViews}{" "}
                      conversions
                    </div>
                  </div>

                  {/* Results */}
                  <div className="border-2 border-gray-600 p-4">
                    <div className="mb-2 font-mono text-sm text-gray-400 uppercase">
                      RESULTS
                    </div>
                    <div
                      className={`flex items-center gap-2 font-mono text-lg font-bold ${getSignificanceColor(
                        experiment.isSignificant,
                        experiment.winner
                      )}`}
                    >
                      {improvement > 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {Math.abs(improvement).toFixed(1)}%
                    </div>
                    <div className="font-mono text-xs text-gray-400">
                      {experiment.isSignificant ? (
                        <span className="text-green-400">SIGNIFICANT</span>
                      ) : (
                        <span>Not significant</span>
                      )}
                      {experiment.pValue && (
                        <span> (p={experiment.pValue.toFixed(4)})</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Winner Declaration */}
                {experiment.isSignificant && experiment.winner && (
                  <div
                    className={`mt-4 border-2 p-3 font-mono text-sm ${
                      experiment.winner === "variant"
                        ? "border-green-400 text-green-400"
                        : "border-yellow-400 text-yellow-400"
                    }`}
                  >
                    🏆 {experiment.winner.toUpperCase()} IS THE WINNER with{" "}
                    {experiment.winner === "variant"
                      ? variantRate
                      : controlRate}
                    % conversion rate
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-2xl border-4 border-white bg-black p-6">
            <h3 className="mb-4 font-mono text-xl font-bold text-white uppercase">
              CREATE A/B TEST
            </h3>
            <div className="font-mono text-gray-400">
              A/B test creation form would go here...
            </div>
            <div className="mt-6 flex gap-4">
              <Button onClick={() => setShowCreateForm(false)} variant="ghost">
                CANCEL
              </Button>
              <Button onClick={() => setShowCreateForm(false)}>
                CREATE TEST
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
