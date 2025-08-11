import { Suspense } from "react";
import { AdminDashboardStats } from "@/components/admin/admin-dashboard-stats";
import { AdminRecentActivity } from "@/components/admin/admin-recent-activity";
import { AdminQuickActions } from "@/components/admin/admin-quick-actions";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="border-4 border-white p-6">
        <h1 className="mb-2 font-mono text-4xl font-bold tracking-wider text-white uppercase">
          ADMIN DASHBOARD
        </h1>
        <p className="font-mono text-gray-400">
          CONTENT MANAGEMENT SYSTEM OVERVIEW
        </p>
      </div>

      <Suspense
        fallback={<div className="font-mono text-white">LOADING STATS...</div>}
      >
        <AdminDashboardStats />
      </Suspense>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense
          fallback={
            <div className="font-mono text-white">LOADING ACTIVITY...</div>
          }
        >
          <AdminRecentActivity />
        </Suspense>

        <AdminQuickActions />
      </div>
    </div>
  );
}
