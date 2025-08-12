"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BlogPost } from "@/lib/types";
import { RichTextEditor } from "./rich-text-editor";
import readingTime from "reading-time";

interface BlogEditorProps {
  post?: BlogPost;
}

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED";
  featured: boolean;
  publishedAt?: string | null;
  readingTime: number;
  categoryIds: string[];
  tagIds: string[];
}

export function BlogEditor({ post }: BlogEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState<BlogFormData>({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    metaTitle: post?.metaTitle || "",
    metaDescription: post?.metaDescription || "",
    ogImage: post?.ogImage || "",
    status: post?.status || "DRAFT",
    featured: post?.featured || false,
    publishedAt: post?.publishedAt
      ? new Date(post.publishedAt).toISOString()
      : null,
    readingTime: post?.readingTime || 0,
    categoryIds: [],
    tagIds: [],
  });

  // Initialize reading time on mount
  useEffect(() => {
    if (formData.content) {
      const stats = readingTime(formData.content);
      setFormData((prev) => ({
        ...prev,
        readingTime: Math.ceil(stats.minutes),
      }));
    }
  }, [formData.content]);

  const handleInputChange = (
    field: keyof BlogFormData,
    value: string | boolean | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-generate slug from title
    if (field === "title" && !post && typeof value === "string") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleReadingTimeChange = (minutes: number) => {
    setFormData((prev) => ({ ...prev, readingTime: Math.ceil(minutes) }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = post ? `/api/admin/blog/${post.id}` : "/api/admin/blog";
      const method = post ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/blog");
      }
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Editor Header */}
      <div className="flex items-center justify-between border-2 border-white p-4">
        <h2 className="font-mono text-xl font-bold text-white uppercase">
          {post ? "EDIT POST" : "NEW POST"}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="mr-2 h-4 w-4" />
            {showPreview ? "EDIT" : "PREVIEW"}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "SAVING..." : "SAVE"}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="border-4 border-white p-6">
            <h3 className="mb-4 font-mono text-xl font-bold text-white uppercase">
              BASIC INFORMATION
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">POST TITLE</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter post title..."
                  className="font-mono"
                />
              </div>
              <div>
                <Label htmlFor="slug">URL SLUG</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  placeholder="post-url-slug"
                  className="font-mono"
                />
              </div>
              <div>
                <Label htmlFor="excerpt">EXCERPT</Label>
                <textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange("excerpt", e.target.value)}
                  placeholder="Brief post excerpt..."
                  rows={3}
                  className="w-full border-2 border-white bg-black p-3 font-mono text-white placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="border-4 border-white p-6">
            <h3 className="mb-4 font-mono text-xl font-bold text-white uppercase">
              POST CONTENT
            </h3>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => handleInputChange("content", content)}
              onReadingTimeChange={handleReadingTimeChange}
              placeholder="Start writing your blog post..."
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-4 border-white p-6">
            <h3 className="mb-4 font-mono text-xl font-bold text-white uppercase">
              PUBLISHING
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">STATUS</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full border-2 border-white bg-black p-3 font-mono text-white"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="SCHEDULED">SCHEDULED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
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
                <Label htmlFor="featured">FEATURED POST</Label>
              </div>
              {formData.status === "SCHEDULED" && (
                <div>
                  <Label htmlFor="publishedAt">PUBLISH DATE</Label>
                  <input
                    type="datetime-local"
                    id="publishedAt"
                    value={
                      formData.publishedAt
                        ? new Date(formData.publishedAt)
                            .toISOString()
                            .slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      handleInputChange("publishedAt", e.target.value)
                    }
                    className="w-full border-2 border-white bg-black p-3 font-mono text-white"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="border-4 border-white p-6">
            <h3 className="mb-4 font-mono text-xl font-bold text-white uppercase">
              SEO & METADATA
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">META TITLE</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle || ""}
                  onChange={(e) =>
                    handleInputChange("metaTitle", e.target.value)
                  }
                  placeholder="SEO title (leave empty to use post title)"
                  className="font-mono"
                />
              </div>
              <div>
                <Label htmlFor="metaDescription">META DESCRIPTION</Label>
                <textarea
                  id="metaDescription"
                  value={formData.metaDescription || ""}
                  onChange={(e) =>
                    handleInputChange("metaDescription", e.target.value)
                  }
                  placeholder="SEO description (leave empty to use excerpt)"
                  rows={3}
                  className="w-full border-2 border-white bg-black p-3 font-mono text-white placeholder-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="ogImage">SOCIAL IMAGE URL</Label>
                <Input
                  id="ogImage"
                  value={formData.ogImage || ""}
                  onChange={(e) => handleInputChange("ogImage", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="font-mono"
                />
              </div>
            </div>
          </div>

          <div className="border-4 border-white p-6">
            <h3 className="mb-4 font-mono text-xl font-bold text-white uppercase">
              CATEGORIES & TAGS
            </h3>
            <div className="space-y-4">
              <div>
                <Label>CATEGORIES</Label>
                <p className="mb-2 font-mono text-xs text-gray-400">
                  Select categories for this post
                </p>
                <div className="space-y-2">
                  {/* This would need to be populated with actual categories */}
                  <p className="font-mono text-sm text-gray-400">
                    Category management will be implemented in the next phase
                  </p>
                </div>
              </div>
              <div>
                <Label>TAGS</Label>
                <p className="mb-2 font-mono text-xs text-gray-400">
                  Add tags separated by commas
                </p>
                <Input
                  placeholder="react, javascript, tutorial"
                  className="font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
