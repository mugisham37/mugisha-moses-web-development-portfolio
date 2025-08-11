import { Suspense } from "react";
import { ContentScheduler } from "@/components/admin/content-scheduler";

export default function AdminSchedulerPage() {
  return (
    <div className="space-y-6">
      <div className="border-4 border-white p-6">
        <h1 className="mb-2 font-mono text-4xl font-bold tracking-wider text-white uppercase">
          CONTENT SCHEDULER
        </h1>
        <p className="font-mono text-gray-400">
          MANAGE SCHEDULED POSTS AND CONTENT PUBLISHING
        </p>
      </div>

      <Suspense
        fallback={
          <div className="font-mono text-white">LOADING SCHEDULER...</div>
        }
      >
        <ContentScheduler />
      </Suspense>
    </div>
  );
}
