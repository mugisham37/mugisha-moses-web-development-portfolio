"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StarRating } from "@/components/testimonials/star-rating";
import { TestimonialVideoPlayer } from "@/components/testimonials/testimonial-video-player";
import type { Testimonial } from "@prisma/client";

interface TestimonialWithAuthor extends Testimonial {
  author?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  } | null;
}

interface TestimonialManagementProps {
  className?: string;
}

type FilterStatus = "all" | "pending" | "approved" | "featured";

export function TestimonialManagement({
  className = "",
}: TestimonialManagementProps) {
  const [testimonials, setTestimonials] = useState<TestimonialWithAuthor[]>([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState<
    TestimonialWithAuthor[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<TestimonialWithAuthor | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const filterTestimonials = useCallback(() => {
    let filtered = testimonials;

    // Apply status filter
    switch (filter) {
      case "pending":
        filtered = testimonials.filter((t) => !t.approved);
        break;
      case "approved":
        filtered = testimonials.filter((t) => t.approved && !t.featured);
        break;
      case "featured":
        filtered = testimonials.filter((t) => t.featured);
        break;
      default:
        filtered = testimonials;
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.company?.toLowerCase().includes(query) ||
          t.content.toLowerCase().includes(query) ||
          t.role.toLowerCase().includes(query)
      );
    }

    setFilteredTestimonials(filtered);
  }, [testimonials, filter, searchQuery]);

  useEffect(() => {
    filterTestimonials();
  }, [filterTestimonials]);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials");
      const data = await response.json();

      if (data.success) {
        setTestimonials(data.data);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTestimonial = async (
    id: string,
    updates: Partial<Testimonial>
  ) => {
    try {
      const response = await fetch("/api/testimonials", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...updates }),
      });

      const data = await response.json();

      if (data.success) {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
        );

        if (selectedTestimonial?.id === id) {
          setSelectedTestimonial((prev) =>
            prev ? { ...prev, ...updates } : null
          );
        }
      }
    } catch (error) {
      console.error("Error updating testimonial:", error);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }

    try {
      const response = await fetch(`/api/testimonials?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        if (selectedTestimonial?.id === id) {
          setSelectedTestimonial(null);
        }
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  };

  const getStatusBadge = (testimonial: TestimonialWithAuthor) => {
    if (testimonial.featured) {
      return (
        <span className="bg-brutalist-yellow px-2 py-1 text-xs font-bold text-black uppercase">
          Featured
        </span>
      );
    }
    if (testimonial.approved) {
      return (
        <span className="bg-green-600 px-2 py-1 text-xs font-bold text-white uppercase">
          Approved
        </span>
      );
    }
    return (
      <span className="bg-orange-600 px-2 py-1 text-xs font-bold text-white uppercase">
        Pending
      </span>
    );
  };

  const filterCounts = {
    all: testimonials.length,
    pending: testimonials.filter((t) => !t.approved).length,
    approved: testimonials.filter((t) => t.approved && !t.featured).length,
    featured: testimonials.filter((t) => t.featured).length,
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <div className="animate-pulse space-y-4">
          <div className="mx-auto h-8 w-1/3 rounded bg-gray-700"></div>
          <div className="mx-auto h-4 w-1/2 rounded bg-gray-700"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h2" className="text-2xl font-bold uppercase">
            Testimonial Management
          </Typography>
          <Typography variant="body" className="text-gray-400">
            Review, approve, and manage client testimonials
          </Typography>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {(["all", "pending", "approved", "featured"] as FilterStatus[]).map(
              (status) => (
                <Button
                  key={status}
                  variant={filter === status ? "accent" : "secondary"}
                  size="sm"
                  onClick={() => setFilter(status)}
                  className="font-mono text-xs uppercase"
                >
                  {status}
                  <span className="ml-2 opacity-75">
                    ({filterCounts[status]})
                  </span>
                </Button>
              )
            )}
          </div>

          <div className="flex gap-4">
            <Input
              placeholder="Search testimonials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
        </div>
      </Card>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Testimonials List */}
        <div className="space-y-4">
          <Typography variant="h3" className="text-lg font-bold uppercase">
            Testimonials ({filteredTestimonials.length})
          </Typography>

          <div className="max-h-[800px] space-y-4 overflow-y-auto">
            {filteredTestimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card
                  className={`cursor-pointer p-4 transition-all duration-200 ${
                    selectedTestimonial?.id === testimonial.id
                      ? "border-brutalist-yellow bg-brutalist-charcoal-100"
                      : "hover:border-gray-600"
                  } `}
                  onClick={() => setSelectedTestimonial(testimonial)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <Typography variant="h4" className="font-bold">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="caption" className="text-gray-400">
                          {testimonial.role}{" "}
                          {testimonial.company && `at ${testimonial.company}`}
                        </Typography>
                      </div>
                      {getStatusBadge(testimonial)}
                    </div>

                    <div className="flex items-center gap-2">
                      <StarRating rating={testimonial.rating} size="sm" />
                      {testimonial.videoUrl && (
                        <span className="rounded bg-purple-600 px-2 py-1 text-xs text-white uppercase">
                          Video
                        </span>
                      )}
                    </div>

                    <Typography
                      variant="body"
                      className="line-clamp-2 text-sm text-gray-300"
                    >
                      {testimonial.content}
                    </Typography>

                    <Typography variant="caption" className="text-gray-500">
                      Submitted{" "}
                      {new Date(testimonial.createdAt).toLocaleDateString()}
                    </Typography>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonial Details */}
        <div className="space-y-4">
          <Typography variant="h3" className="text-lg font-bold uppercase">
            Details
          </Typography>

          {selectedTestimonial ? (
            <TestimonialDetails
              testimonial={selectedTestimonial}
              onUpdate={updateTestimonial}
              onDelete={deleteTestimonial}
            />
          ) : (
            <Card className="p-8 text-center">
              <Typography variant="body" className="text-gray-400">
                Select a testimonial to view details
              </Typography>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

interface TestimonialDetailsProps {
  testimonial: TestimonialWithAuthor;
  onUpdate: (id: string, updates: Partial<Testimonial>) => void;
  onDelete: (id: string) => void;
}

function TestimonialDetails({
  testimonial,
  onUpdate,
  onDelete,
}: TestimonialDetailsProps) {
  return (
    <Card className="space-y-6 p-6">
      {/* Video */}
      {testimonial.videoUrl && (
        <TestimonialVideoPlayer
          videoUrl={testimonial.videoUrl}
          posterUrl={testimonial.avatarUrl}
          clientName={testimonial.name}
        />
      )}

      {/* Content */}
      <div className="space-y-4">
        <div>
          <Typography variant="h4" className="mb-2 font-bold">
            {testimonial.name}
          </Typography>
          <Typography variant="body" className="text-gray-400">
            {testimonial.role}{" "}
            {testimonial.company && `at ${testimonial.company}`}
          </Typography>
        </div>

        <div className="flex items-center gap-2">
          <StarRating rating={testimonial.rating} size="md" />
          <span className="text-gray-400">({testimonial.rating}/5)</span>
        </div>

        <div>
          <Typography variant="h4" className="mb-2 font-bold">
            Content
          </Typography>
          <Typography variant="body" className="leading-relaxed text-gray-300">
            &quot;{testimonial.content}&quot;
          </Typography>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Submitted:</span>
            <br />
            {new Date(testimonial.createdAt).toLocaleDateString()}
          </div>
          <div>
            <span className="text-gray-400">Updated:</span>
            <br />
            {new Date(testimonial.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 border-t border-gray-700 pt-4">
        {!testimonial.approved && (
          <Button
            variant="accent"
            size="sm"
            onClick={() => onUpdate(testimonial.id, { approved: true })}
          >
            Approve
          </Button>
        )}

        {testimonial.approved && !testimonial.featured && (
          <Button
            variant="accent"
            size="sm"
            onClick={() => onUpdate(testimonial.id, { featured: true })}
          >
            Feature
          </Button>
        )}

        {testimonial.featured && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onUpdate(testimonial.id, { featured: false })}
          >
            Unfeature
          </Button>
        )}

        {testimonial.approved && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onUpdate(testimonial.id, { approved: false })}
          >
            Unapprove
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(testimonial.id)}
          className="text-red-400 hover:text-red-300"
        >
          Delete
        </Button>
      </div>
    </Card>
  );
}
