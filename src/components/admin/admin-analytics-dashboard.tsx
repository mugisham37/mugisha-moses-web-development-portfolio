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
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

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
  topPages: Array<{
    path: string;
    views: number;
    uniqueViews: number;
    avgDuration: number;
  }>;
  topProjects: Array<{
    id: string;
    title: string;
    views: number;
    likes: number;
    conversionRate: number;
  }>;
  deviceStats: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  performanceMetrics: {
    lcp: number;
    fid: number;
    cls: number;
    fcp: number;
    ttfb: number;
  };
  abTestResults: Array<{
    name: string;
    controlViews: number;
    variantViews: number;
    controlConversions: number;
    variantConversions: number;
    isSignificant: boolean;
    winner: string | null;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
  geographicData: Array<{
    country: string;
    visitors: number;
    percentage: number;
  }>;
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

      {/* Top Pages */}
      <div className="border-4 border-white p-6">
        <h3 className="mb-4 font-mono text-xl font-bold text-white uppercase">
          TOP PAGES
        </h3>
        <div className="space-y-4">
          {data.topPages?.slice(0, 5).map((page, index) => (
            <div
              key={page.path}
              className="flex items-center justify-between border-2 border-gray-600 p-4"
            >
              <div className="flex items-center gap-4">
                <div className="font-mono text-lg font-bold text-yellow-400">
                  #{index + 1}
                </div>
                <div>
                  <div className="font-mono text-white">{page.path}</div>
                  <div className="font-mono text-sm text-gray-400">
                    {formatDuration(page.avgDuration)} avg duration
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-lg font-bold text-white">
                  {formatNumber(page.views)}
                </div>
                <div className="font-mono text-sm text-gray-400">views</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Device & Performance Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Device Statistics */}
        <div className="border-4 border-white p-6">
          <h3 className="mb-4 font-mono text-xl font-bold text-white uppercase">
            DEVICE BREAKDOWN
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-gray-400" />
                <span className="font-mono text-white">DESKTOP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 bg-gray-600">
                  <div
                    className="h-full bg-yellow-400"
                    style={{ width: `${data.deviceStats?.desktop || 0}%` }}
                  />
                </div>
                <span className="font-mono text-sm text-white">
                  {data.deviceStats?.desktop || 0}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-gray-400" />
                <span className="font-mono text-white">MOBILE</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 bg-gray-600">
                  <div
                    className="h-full bg-yellow-400"
                    style={{ width: `${data.deviceStats?.mobile || 0}%` }}
                  />
                </div>
                <span className="font-mono text-sm text-white">
                  {data.deviceStats?.mobile || 0}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Tablet className="h-5 w-5 text-gray-400" />
                <span className="font-mono text-white">TABLET</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 bg-gray-600">
                  <div
                    className="h-full bg-yellow-400"
                    style={{ width: `${data.deviceStats?.tablet || 0}%` }}
                  />
                </div>
                <span className="font-mono text-sm text-white">
                  {data.deviceStats?.tablet || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Web Vitals */}
        <div className="border-4 border-white p-6">
          <h3 className="mb-4 font-mono text-xl font-bold text-white uppercase">
            CORE WEB VITALS
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-sm text-gray-400">
                  LCP (Largest Contentful Paint)
                </div>
                <div className="font-mono text-lg font-bold text-white">
                  {(data.performanceMetrics?.lcp || 0).toFixed(0)}ms
                </div>
              </div>
              <div
                className={`font-mono text-sm ${
                  (data.performanceMetrics?.lcp || 0) < 2500
                    ? "text-green-400"
                    : (data.performanceMetrics?.lcp || 0) < 4000
                      ? "text-yellow-400"
                      : "text-red-400"
                }`}
              >
                {(data.performanceMetrics?.lcp || 0) < 2500
                  ? "GOOD"
                  : (data.performanceMetrics?.lcp || 0) < 4000
                    ? "NEEDS IMPROVEMENT"
                    : "POOR"}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-sm text-gray-400">
                  FID (First Input Delay)
                </div>
                <div className="font-mono text-lg font-bold text-white">
                  {(data.performanceMetrics?.fid || 0).toFixed(0)}ms
                </div>
              </div>
              <div
                className={`font-mono text-sm ${
                  (data.performanceMetrics?.fid || 0) < 100
                    ? "text-green-400"
                    : (data.performanceMetrics?.fid || 0) < 300
                      ? "text-yellow-400"
                      : "text-red-400"
                }`}
              >
                {(data.performanceMetrics?.fid || 0) < 100
                  ? "GOOD"
                  : (data.performanceMetrics?.fid || 0) < 300
                    ? "NEEDS IMPROVEMENT"
                    : "POOR"}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-sm text-gray-400">
                  CLS (Cumulative Layout Shift)
                </div>
                <div className="font-mono text-lg font-bold text-white">
                  {(data.performanceMetrics?.cls || 0).toFixed(3)}
                </div>
              </div>
              <div
                className={`font-mono text-sm ${
                  (data.performanceMetrics?.cls || 0) < 0.1
                    ? "text-green-400"
                    : (data.performanceMetrics?.cls || 0) < 0.25
                      ? "text-yellow-400"
                      : "text-red-400"
                }`}
              >
                {(data.performanceMetrics?.cls || 0) < 0.1
                  ? "GOOD"
                  : (data.performanceMetrics?.cls || 0) < 0.25
                    ? "NEEDS IMPROVEMENT"
                    : "POOR"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Sources Chart */}
      <div className="border-4 border-white p-6">
        <h3 className="mb-4 font-mono text-xl font-bold text-white uppercase">
          TRAFFIC SOURCES
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.trafficSources}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="source"
                tick={{ fill: "#fff", fontFamily: "monospace" }}
                axisLine={{ stroke: "#fff" }}
              />
              <YAxis
                tick={{ fill: "#fff", fontFamily: "monospace" }}
                axisLine={{ stroke: "#fff" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#000",
                  border: "2px solid #fff",
                  fontFamily: "monospace",
                  color: "#fff",
                }}
              />
              <Bar dataKey="visitors" fill="#FFFF00" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* A/B Test Results */}
      {data.abTestResults && data.abTestResults.length > 0 && (
        <div className="border-4 border-white p-6">
          <h3 className="mb-4 font-mono text-xl font-bold text-white uppercase">
            A/B TEST RESULTS
          </h3>
          <div className="space-y-4">
            {data.abTestResults.map((test) => {
              const controlRate =
                test.controlViews > 0
                  ? (test.controlConversions / test.controlViews) * 100
                  : 0;
              const variantRate =
                test.variantViews > 0
                  ? (test.variantConversions / test.variantViews) * 100
                  : 0;

              return (
                <div key={test.name} className="border-2 border-gray-600 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-mono font-bold text-white uppercase">
                      {test.name}
                    </h4>
                    {test.isSignificant && (
                      <div
                        className={`border px-2 py-1 font-mono text-sm ${
                          test.winner === "variant"
                            ? "border-green-400 text-green-400"
                            : "border-yellow-400 text-yellow-400"
                        }`}
                      >
                        {test.winner?.toUpperCase()} WINS
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="font-mono text-sm text-gray-400">
                        CONTROL
                      </div>
                      <div className="font-mono text-white">
                        {test.controlConversions}/{test.controlViews} (
                        {controlRate.toFixed(1)}%)
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-sm text-gray-400">
                        VARIANT
                      </div>
                      <div className="font-mono text-white">
                        {test.variantConversions}/{test.variantViews} (
                        {variantRate.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
