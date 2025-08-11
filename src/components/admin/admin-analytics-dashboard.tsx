"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  Clock,
  MousePointer,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalyticsData {
  overview: {
    totalViews: number;
    uniqueVisitors: number;
    avgSessionDuration: number;
    bounceRate: number;
    conversionRate: number;
  };
  trends: {
    viewsChange: number;
    visitorsChange: number;
    durationChange: number;
    bounceChange: number;
  };
}

export function AdminAnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getTrendIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-400" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-400" />
    );
  };

  const getTrendColor = (change: number) => {
    return change >= 0 ? "text-green-400" : "text-red-400";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="font-mono text-white">LOADING ANALYTICS DATA...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="font-mono text-gray-400">FAILED TO LOAD ANALYTICS</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between border-2 border-white p-4">
        <h2 className="font-mono text-xl font-bold text-white uppercase">
          PERFORMANCE OVERVIEW
        </h2>
        <div className="flex items-center gap-2">
          {["24h", "7d", "30d", "90d"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="font-mono uppercase"
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="border-4 border-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-2xl font-bold text-white">
                {formatNumber(data.overview.totalViews)}
              </div>
              <div className="font-mono text-sm text-gray-400 uppercase">
                TOTAL VIEWS
              </div>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(data.trends.viewsChange)}
              <span
                className={`font-mono text-sm ${getTrendColor(data.trends.viewsChange)}`}
              >
                {Math.abs(data.trends.viewsChange)}%
              </span>
            </div>
          </div>
          <Eye className="mt-2 h-6 w-6 text-gray-400" />
        </div>

        <div className="border-4 border-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-2xl font-bold text-white">
                {formatNumber(data.overview.uniqueVisitors)}
              </div>
              <div className="font-mono text-sm text-gray-400 uppercase">
                UNIQUE VISITORS
              </div>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(data.trends.visitorsChange)}
              <span
                className={`font-mono text-sm ${getTrendColor(data.trends.visitorsChange)}`}
              >
                {Math.abs(data.trends.visitorsChange)}%
              </span>
            </div>
          </div>
          <Users className="mt-2 h-6 w-6 text-gray-400" />
        </div>

        <div className="border-4 border-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-2xl font-bold text-white">
                {formatDuration(data.overview.avgSessionDuration)}
              </div>
              <div className="font-mono text-sm text-gray-400 uppercase">
                AVG SESSION
              </div>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(data.trends.durationChange)}
              <span
                className={`font-mono text-sm ${getTrendColor(data.trends.durationChange)}`}
              >
                {Math.abs(data.trends.durationChange)}%
              </span>
            </div>
          </div>
          <Clock className="mt-2 h-6 w-6 text-gray-400" />
        </div>

        <div className="border-4 border-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-2xl font-bold text-white">
                {data.overview.bounceRate}%
              </div>
              <div className="font-mono text-sm text-gray-400 uppercase">
                BOUNCE RATE
              </div>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(-data.trends.bounceChange)}
              <span
                className={`font-mono text-sm ${getTrendColor(-data.trends.bounceChange)}`}
              >
                {Math.abs(data.trends.bounceChange)}%
              </span>
            </div>
          </div>
          <Activity className="mt-2 h-6 w-6 text-gray-400" />
        </div>

        <div className="border-4 border-white p-6">
          <div>
            <div className="font-mono text-2xl font-bold text-white">
              {data.overview.conversionRate}%
            </div>
            <div className="font-mono text-sm text-gray-400 uppercase">
              CONVERSION RATE
            </div>
          </div>
          <MousePointer className="mt-2 h-6 w-6 text-gray-400" />
        </div>
      </div>

      {/* Placeholder for additional charts */}
      <div className="border-4 border-white p-6">
        <h3 className="mb-4 font-mono text-xl font-bold text-white uppercase">
          DETAILED ANALYTICS
        </h3>
        <div className="flex items-center justify-center p-12">
          <div className="font-mono text-gray-400">
            ADDITIONAL CHARTS AND METRICS WILL BE DISPLAYED HERE
          </div>
        </div>
      </div>
    </div>
  );
}
