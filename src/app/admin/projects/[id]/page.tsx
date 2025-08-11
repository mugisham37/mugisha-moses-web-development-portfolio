import { notFound } from "next/navigation";
import { ProjectEditor } from "@/components/admin/project-editor";
import { getProjectById } from "@/lib/project-queries";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="border-4 border-white p-6">
        <h1 className="mb-2 font-mono text-4xl font-bold tracking-wider text-white uppercase">
          EDIT PROJECT
        </h1>
        <p className="font-mono text-gray-400">
          MODIFY PROJECT: {project.title.toUpperCase()}
        </p>
      </div>

      <ProjectEditor project={project} />
    </div>
  );
}
