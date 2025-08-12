"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { ProjectWithRelations } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface ProjectManagementInterfaceProps {
  initialProjects?: ProjectWithRelations[];
}

export function ProjectManagementInterface({
  initialProjects = [],
}: ProjectManagementInterfaceProps) {
  const [projects, setProjects] =
    useState<ProjectWithRelations[]>(initialProjects);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects);
      }
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || project.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadProjects();
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "text-gray-400";
      case "ACTIVE":
        return "text-green-400";
      case "FEATURED":
        return "text-yellow-400";
      case "ARCHIVED":
        return "text-red-400";
      default:
        return "text-white";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="SEARCH PROJECTS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 font-mono uppercase"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border-2 border-white bg-black px-4 py-2 font-mono text-white uppercase"
          >
            <option value="all">ALL STATUS</option>
            <option value="draft">DRAFT</option>
            <option value="active">ACTIVE</option>
            <option value="featured">FEATURED</option>
            <option value="archived">ARCHIVED</option>
          </select>
        </div>

        <Link href="/admin/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            NEW PROJECT
          </Button>
        </Link>
      </div>

      {/* Projects Table */}
      <div className="border-4 border-white bg-black">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-white">
                <th className="p-4 text-left font-mono text-sm font-bold text-white uppercase">
                  PROJECT
                </th>
                <th className="p-4 text-left font-mono text-sm font-bold text-white uppercase">
                  STATUS
                </th>
                <th className="p-4 text-left font-mono text-sm font-bold text-white uppercase">
                  VIEWS
                </th>
                <th className="p-4 text-left font-mono text-sm font-bold text-white uppercase">
                  UPDATED
                </th>
                <th className="p-4 text-left font-mono text-sm font-bold text-white uppercase">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center font-mono text-gray-400"
                  >
                    LOADING PROJECTS...
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center font-mono text-gray-400"
                  >
                    NO PROJECTS FOUND
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-gray-800 hover:bg-gray-900"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {project.thumbnail && (
                          <Image
                            src={project.thumbnail}
                            alt={project.title}
                            width={48}
                            height={48}
                            className="h-12 w-12 border-2 border-white object-cover"
                          />
                        )}
                        <div>
                          <h3 className="font-mono font-bold text-white">
                            {project.title}
                          </h3>
                          <p className="font-mono text-sm text-gray-400">
                            {project.description.substring(0, 60)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-mono text-sm font-bold uppercase ${getStatusColor(project.status)}`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-white">
                        {project.viewCount.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm text-gray-400">
                        {formatDistanceToNow(new Date(project.updatedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/projects/${project.slug}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/projects/${project.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
