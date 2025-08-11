import { Suspense } from "react";
import { AdminAnalyticsDashboard } from "@/components/admin/admin-analytics-dashboard";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="border-4 border-white p-6">
        <h1 className="mb-2 font-mono text-4xl font-bold tracking-wider text-white uppercase">
          ANALYTICS DASHBOARD
        </h1>
        <p className="font-mono text-gray-400">
          COMPREHENSIVE PORTFOLIO PERFORMANCE METRICS
        </p>
      </div>

      <Suspense
        fallback={
          <div className="font-mono text-white">LOADING ANALYTICS...</div>
        }
      >
        <AdminAnalyticsDashboard />
      </Suspense>
    </div>
  );
}
