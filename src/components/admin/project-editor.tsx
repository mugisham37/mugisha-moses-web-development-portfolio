"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Eye,
  Upload,
  X,
  Plus,
  Link as LinkIcon,
  Calendar,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProjectWithRelations } from "@/lib/types";
import { RichTextEditor } from "./rich-text-editor";
import { MediaUploader } from "./media-uploader";

interface ProjectEditorProps {
  project?: ProjectWithRelations;
}

interface ProjectFormData {
  title: string;
  slug: string;
  description: string;
  content: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED" | "FEATURED";
  featured: boolean;
  thumbnail: string;
  images: string[];
  videoUrl: string;
  publishedAt: string;
  categoryIds: string[];
}

export function ProjectEditor({ project }: ProjectEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState<ProjectFormData>({
    title: project?.title || "",
    slug: project?.slug || "",
    description: project?.description || "",
    content: project?.content || "",
    technologies: project?.technologies || [],
    githubUrl: project?.githubUrl || "",
    liveUrl: project?.liveUrl || "",
    status: project?.status || "DRAFT",
    featured: project?.featured || false,
    thumbnail: project?.thumbnail || "",
    images: project?.images || [],
    videoUrl: project?.videoUrl || "",
    publishedAt: project?.publishedAt
      ? new Date(project.publishedAt).toISOString().slice(0, 16)
      : "",
    categoryIds: project?.categories?.map((c) => c.id) || [],
  });

  const [newTechnology, setNewTechnology] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (!project && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, project]);

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const handleInputChange = (field: keyof ProjectFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTechnology = () => {
    if (
      newTechnology.trim() &&
      !formData.technologies.includes(newTechnology.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()],
      }));
      setNewTechnology("");
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  const handleImageUpload = (urls: string[]) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...urls],
    }));
  };

  const handleRemoveImage = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
    }));
  };

  const handleSave = async (isDraft = false) => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        status: isDraft ? "DRAFT" : formData.status,
        publishedAt: formData.publishedAt
          ? new Date(formData.publishedAt).toISOString()
          : null,
      };

      const url = project
        ? `/api/admin/projects/${project.id}`
        : "/api/admin/projects";

      const method = project ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (!project) {
          router.push(`/admin/projects/${data.project.id}`);
        } else {
          router.push("/admin/projects");
        }
      } else {
        throw new Error("Failed to save project");
      }
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save project. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Editor Header */}
      <div className="flex items-center justify-between border-2 border-white p-4">
        <div className="flex items-center gap-4">
          <h2 className="font-mono text-xl font-bold text-white uppercase">
            {project ? "EDIT PROJECT" : "NEW PROJECT"}
          </h2>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
            className="border-2 border-white bg-black px-3 py-1 font-mono text-white"
          >
            <option value="DRAFT">DRAFT</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="FEATURED">FEATURED</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="mr-2 h-4 w-4" />
            {showPreview ? "EDIT" : "PREVIEW"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            SAVE DRAFT
          </Button>
          <Button onClick={() => handleSave(false)} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "SAVING..." : "SAVE"}
          </Button>
        </div>
      </div>

      {showPreview ? (
        /* Preview Mode */
        <div className="border-4 border-white p-6">
          <div className="space-y-6">
            {formData.thumbnail && (
              <img
                src={formData.thumbnail}
                alt={formData.title}
                className="h-64 w-full border-2 border-white object-cover"
              />
            )}

            <div>
              <h1 className="mb-4 font-mono text-4xl font-bold text-white uppercase">
                {formData.title}
              </h1>
              <p className="mb-6 font-mono text-gray-400">
                {formData.description}
              </p>

              {formData.technologies.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {formData.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="border-2 border-yellow-400 bg-yellow-400/20 px-3 py-1 font-mono text-sm text-yellow-400 uppercase"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: formData.content }} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Information */}
            <div className="border-4 border-white p-6">
              <h3 className="mb-4 font-mono text-xl font-bold text-white uppercase">
                BASIC INFORMATION
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">PROJECT TITLE</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter project title..."
                    className="font-mono"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">URL SLUG</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="project-url-slug"
                    className="font-mono"
                  />
                </div>

                <div>
                  <Label htmlFor="description">DESCRIPTION</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Brief project description..."
                    rows={3}
                    className="w-full border-2 border-white bg-black p-3 font-mono text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div className="border-4 border-white p-6">
              <h3 className="mb-4 font-mono text-xl font-bold text-white uppercase">
                PROJECT CONTENT
              </h3>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => handleInputChange("content", content)}
              />
            </div>

            {/* Media */}
            <div className="border-4 border-white p-6">
              <h3 className="mb-4 font-mono text-xl font-bold text-white uppercase">
                MEDIA
              </h3>

              <div className="space-y-4">
                <div>
                  <Label>THUMBNAIL IMAGE</Label>
                  <MediaUploader
                    onUpload={(urls) => handleInputChange("thumbnail", urls[0])}
                    maxFiles={1}
                    accept="image/*"
                  />
                  {formData.thumbnail && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={formData.thumbnail}
                        alt="Thumbnail"
                        className="h-16 w-16 border-2 border-white object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleInputChange("thumbnail", "")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <Label>PROJECT IMAGES</Label>
                  <MediaUploader
                    onUpload={handleImageUpload}
                    maxFiles={10}
                    accept="image/*"
                  />
                  {formData.images.length > 0 && (
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {formData.images.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Project image ${index + 1}`}
                            className="h-20 w-20 border-2 border-white object-cover"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveImage(url)}
                            className="absolute -top-2 -right-2 h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="videoUrl">VIDEO URL (OPTIONAL)</Label>
                  <Input
                    id="videoUrl"
                    value={formData.videoUrl}
                    onChange={(e) =>
                      handleInputChange("videoUrl", e.target.value)
                    }
                    placeholder="https://youtube.com/watch?v=..."
                    className="font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing */}
            <div className="border-4 border-white p-6">
              <h3 className="mb-4 font-mono text-xl font-bold text-white uppercase">
                PUBLISHING
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) =>
                      handleInputChange("featured", e.target.checked)
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="featured">FEATURED PROJECT</Label>
                </div>

                <div>
                  <Label htmlFor="publishedAt">PUBLISH DATE</Label>
                  <Input
                    id="publishedAt"
                    type="datetime-local"
                    value={formData.publishedAt}
                    onChange={(e) =>
                      handleInputChange("publishedAt", e.target.value)
                    }
                    className="font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="border-4 border-white p-6">
              <h3 className="mb-4 font-mono text-xl font-bold text-white uppercase">
                CATEGORIES
              </h3>

              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={formData.categoryIds.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleInputChange("categoryIds", [
                            ...formData.categoryIds,
                            category.id,
                          ]);
                        } else {
                          handleInputChange(
                            "categoryIds",
                            formData.categoryIds.filter(
                              (id) => id !== category.id
                            )
                          );
                        }
                      }}
                      className="h-4 w-4"
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="font-mono text-sm"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div className="border-4 border-white p-6">
              <h3 className="mb-4 font-mono text-xl font-bold text-white uppercase">
                TECHNOLOGIES
              </h3>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    placeholder="Add technology..."
                    className="font-mono"
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleAddTechnology()
                    }
                  />
                  <Button
                    variant="secondary"
                    onClick={handleAddTechnology}
                    disabled={!newTechnology.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="flex items-center gap-1 border-2 border-yellow-400 bg-yellow-400/20 px-2 py-1 font-mono text-sm text-yellow-400"
                    >
                      {tech}
                      <button
                        onClick={() => handleRemoveTechnology(tech)}
                        className="ml-1 text-yellow-400 hover:text-yellow-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="border-4 border-white p-6">
              <h3 className="mb-4 font-mono text-xl font-bold text-white uppercase">
                PROJECT LINKS
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="githubUrl">GITHUB URL</Label>
                  <Input
                    id="githubUrl"
                    value={formData.githubUrl}
                    onChange={(e) =>
                      handleInputChange("githubUrl", e.target.value)
                    }
                    placeholder="https://github.com/..."
                    className="font-mono"
                  />
                </div>

                <div>
                  <Label htmlFor="liveUrl">LIVE URL</Label>
                  <Input
                    id="liveUrl"
                    value={formData.liveUrl}
                    onChange={(e) =>
                      handleInputChange("liveUrl", e.target.value)
                    }
                    placeholder="https://project-demo.com"
                    className="font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
