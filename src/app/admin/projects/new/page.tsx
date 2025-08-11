import { ProjectEditor } from "@/components/admin/project-editor";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div className="border-4 border-white p-6">
        <h1 className="mb-2 font-mono text-4xl font-bold tracking-wider text-white uppercase">
          CREATE PROJECT
        </h1>
        <p className="font-mono text-gray-400">ADD NEW PROJECT TO PORTFOLIO</p>
      </div>

      <ProjectEditor />
    </div>
  );
}
