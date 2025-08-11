import { Suspense } from "react";
import { ProjectManagementInterface } from "@/components/admin/project-management-interface";

export default function AdminProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="border-4 border-white p-6">
        <h1 className="mb-2 font-mono text-4xl font-bold tracking-wider text-white uppercase">
          PROJECT MANAGEMENT
        </h1>
        <p className="font-mono text-gray-400">
          CREATE, EDIT, AND MANAGE PORTFOLIO PROJECTS
        </p>
      </div>

      <Suspense
        fallback={
          <div className="font-mono text-white">LOADING PROJECTS...</div>
        }
      >
        <ProjectManagementInterface />
      </Suspense>
    </div>
  );
}
