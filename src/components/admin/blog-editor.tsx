"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BlogPost } from "@/lib/types";
import { RichTextEditor } from "./rich-text-editor";

interface BlogEditorProps {
  post?: BlogPost;
}

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED";
  featured: boolean;
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
    status: post?.status || "DRAFT",
    featured: post?.featured || false,
  });

  const handleInputChange = (field: keyof BlogFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
