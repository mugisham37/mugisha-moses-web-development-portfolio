"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BlogPost } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface BlogManagementInterfaceProps {
  initialPosts?: BlogPost[];
}

export function BlogManagementInterface({
  initialPosts = [],
}: BlogManagementInterfaceProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  // Load posts on mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/blog");
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Failed to load blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt &&
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || post.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadPosts();
      }
    } catch (error) {
      console.error("Failed to delete blog post:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "text-gray-400";
      case "PUBLISHED":
        return "text-green-400";
      case "SCHEDULED":
        return "text-yellow-400";
      case "ARCHIVED":
        return "text-red-400";
      default:
        return "text-white";
    }
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="SEARCH BLOG POSTS..."
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
            <option value="published">PUBLISHED</option>
            <option value="scheduled">SCHEDULED</option>
            <option value="archived">ARCHIVED</option>
          </select>
        </div>

        <Link href="/admin/blog/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            NEW POST
          </Button>
        </Link>
      </div>

      {/* Blog Posts Table */}
      <div className="border-4 border-white bg-black">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-white">
                <th className="p-4 text-left font-mono text-sm font-bold text-white uppercase">
                  POST
                </th>
                <th className="p-4 text-left font-mono text-sm font-bold text-white uppercase">
                  STATUS
                </th>
                <th className="p-4 text-left font-mono text-sm font-bold text-white uppercase">
                  VIEWS
                </th>
                <th className="p-4 text-left font-mono text-sm font-bold text-white uppercase">
                  READING TIME
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
                    colSpan={6}
                    className="p-8 text-center font-mono text-gray-400"
                  >
                    LOADING BLOG POSTS...
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center font-mono text-gray-400"
                  >
                    NO BLOG POSTS FOUND
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-gray-800 hover:bg-gray-900"
                  >
                    <td className="p-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-mono font-bold text-white">
                            {post.title}
                          </h3>
                          {post.featured && (
                            <Star className="h-4 w-4 text-yellow-400" />
                          )}
                        </div>
                        {post.excerpt && (
                          <p className="mt-1 font-mono text-sm text-gray-400">
                            {post.excerpt.substring(0, 80)}...
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                          <span>SLUG: {post.slug}</span>
                          {post.publishedAt && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-mono text-sm font-bold uppercase ${getStatusColor(post.status)}`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-white">
                        {post.viewCount.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="font-mono text-sm text-gray-400">
                          {post.readingTime ||
                            calculateReadingTime(post.content)}{" "}
                          MIN
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm text-gray-400">
                        {formatDistanceToNow(new Date(post.updatedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/blog/${post.slug}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/blog/${post.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
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

      {/* Stats Summary */}
      {filteredPosts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="border-2 border-white p-4 text-center">
            <div className="font-mono text-2xl font-bold text-white">
              {posts.filter((p) => p.status === "PUBLISHED").length}
            </div>
            <div className="font-mono text-sm text-gray-400 uppercase">
              PUBLISHED
            </div>
          </div>
          <div className="border-2 border-white p-4 text-center">
            <div className="font-mono text-2xl font-bold text-white">
              {posts.filter((p) => p.status === "DRAFT").length}
            </div>
            <div className="font-mono text-sm text-gray-400 uppercase">
              DRAFTS
            </div>
          </div>
          <div className="border-2 border-white p-4 text-center">
            <div className="font-mono text-2xl font-bold text-white">
              {posts.reduce((sum, p) => sum + p.viewCount, 0).toLocaleString()}
            </div>
            <div className="font-mono text-sm text-gray-400 uppercase">
              TOTAL VIEWS
            </div>
          </div>
          <div className="border-2 border-white p-4 text-center">
            <div className="font-mono text-2xl font-bold text-white">
              {posts.filter((p) => p.featured).length}
            </div>
            <div className="font-mono text-sm text-gray-400 uppercase">
              FEATURED
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
