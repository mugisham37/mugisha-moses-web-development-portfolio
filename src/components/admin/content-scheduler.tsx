"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Play,
  Edit,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, addDays, startOfWeek, isSameDay, parseISO } from "date-fns";

interface ScheduledContent {
  id: string;
  title: string;
  type: "PROJECT" | "BLOG_POST";
  status: "SCHEDULED" | "PUBLISHED" | "DRAFT";
  scheduledAt: string;
  publishedAt?: string;
  author: {
    name: string;
    email: string;
  };
}

export function ContentScheduler() {
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [filterType, setFilterType] = useState<"all" | "PROJECT" | "BLOG_POST">(
    "all"
  );

  useEffect(() => {
    loadScheduledContent();
  }, []);

  const loadScheduledContent = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/scheduler");
      if (response.ok) {
        const data = await response.json();
        setScheduledContent(data.content);
      }
    } catch (error) {
      console.error("Failed to load scheduled content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishNow = async (contentId: string) => {
    try {
      const response = await fetch(
        `/api/admin/scheduler/${contentId}/publish`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        await loadScheduledContent();
      }
    } catch (error) {
      console.error("Failed to publish content:", error);
    }
  };

  const handleDeleteScheduled = async (contentId: string) => {
    if (!confirm("Are you sure you want to remove this from the schedule?"))
      return;

    try {
      const response = await fetch(`/api/admin/scheduler/${contentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadScheduledContent();
      }
    } catch (error) {
      console.error("Failed to delete scheduled content:", error);
    }
  };

  const getWeekDays = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getContentForDate = (date: Date) => {
    return scheduledContent.filter((content) => {
      const scheduledDate = parseISO(content.scheduledAt);
      return isSameDay(scheduledDate, date);
    });
  };

  const filteredContent = scheduledContent.filter(
    (content) => filterType === "all" || content.type === filterType
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "text-yellow-400";
      case "PUBLISHED":
        return "text-green-400";
      case "DRAFT":
        return "text-gray-400";
      default:
        return "text-white";
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "PROJECT" ? "📁" : "📝";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="font-mono text-white">LOADING SCHEDULED CONTENT...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "calendar" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              CALENDAR
            </Button>
            <Button
              variant={viewMode === "list" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              LIST
            </Button>
          </div>

          <select
            value={filterType}
            onChange={(e) =>
              setFilterType(e.target.value as "all" | "PROJECT" | "BLOG_POST")
            }
            className="border-2 border-white bg-black px-4 py-2 font-mono text-white uppercase"
          >
            <option value="all">ALL TYPES</option>
            <option value="PROJECT">PROJECTS</option>
            <option value="BLOG_POST">BLOG POSTS</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-gray-400">
            {scheduledContent.filter((c) => c.status === "SCHEDULED").length}{" "}
            SCHEDULED
          </span>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            SCHEDULE CONTENT
          </Button>
        </div>
      </div>

      {viewMode === "calendar" ? (
        /* Calendar View */
        <div className="space-y-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between border-2 border-white p-4">
            <Button
              variant="ghost"
              onClick={() => setCurrentDate(addDays(currentDate, -7))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <h2 className="font-mono text-xl font-bold text-white uppercase">
              {format(currentDate, "MMMM yyyy")}
            </h2>

            <Button
              variant="ghost"
              onClick={() => setCurrentDate(addDays(currentDate, 7))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day Headers */}
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
              <div key={day} className="border-2 border-white p-2 text-center">
                <div className="font-mono text-sm font-bold text-white uppercase">
                  {day}
                </div>
              </div>
            ))}

            {/* Calendar Days */}
            {getWeekDays(currentDate).map((date) => {
              const dayContent = getContentForDate(date);
              const isToday = isSameDay(date, new Date());

              return (
                <div
                  key={date.toISOString()}
                  className={`min-h-[120px] border-2 p-2 ${
                    isToday
                      ? "border-yellow-400 bg-yellow-400/10"
                      : "border-white"
                  }`}
                >
                  <div className="mb-2 font-mono text-sm font-bold text-white">
                    {format(date, "d")}
                  </div>

                  <div className="space-y-1">
                    {dayContent.map((content) => (
                      <div
                        key={content.id}
                        className="rounded border border-gray-600 bg-gray-900 p-1"
                      >
                        <div className="flex items-center gap-1">
                          <span className="text-xs">
                            {getTypeIcon(content.type)}
                          </span>
                          <span className="truncate font-mono text-xs text-white">
                            {content.title}
                          </span>
                        </div>
                        <div className="font-mono text-xs text-gray-400">
                          {format(parseISO(content.scheduledAt), "HH:mm")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="border-4 border-white bg-black">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-white">
                  <th className="p-4 text-left font-mono text-sm font-bold text-white uppercase">
                    CONTENT
                  </th>
                  <th className="p-4 text-left font-mono text-sm font-bold text-white uppercase">
                    TYPE
                  </th>
                  <th className="p-4 text-left font-mono text-sm font-bold text-white uppercase">
                    STATUS
                  </th>
                  <th className="p-4 text-left font-mono text-sm font-bold text-white uppercase">
                    SCHEDULED
                  </th>
                  <th className="p-4 text-left font-mono text-sm font-bold text-white uppercase">
                    AUTHOR
                  </th>
                  <th className="p-4 text-left font-mono text-sm font-bold text-white uppercase">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredContent.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center font-mono text-gray-400"
                    >
                      NO SCHEDULED CONTENT FOUND
                    </td>
                  </tr>
                ) : (
                  filteredContent.map((content) => (
                    <tr
                      key={content.id}
                      className="border-b border-gray-800 hover:bg-gray-900"
                    >
                      <td className="p-4">
                        <div>
                          <h3 className="font-mono font-bold text-white">
                            {content.title}
                          </h3>
                          <div className="mt-1 font-mono text-xs text-gray-400">
                            ID: {content.id}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {getTypeIcon(content.type)}
                          </span>
                          <span className="font-mono text-sm text-white uppercase">
                            {content.type.replace("_", " ")}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-mono text-sm font-bold uppercase ${getStatusColor(content.status)}`}
                        >
                          {content.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-mono text-sm text-white">
                            {format(
                              parseISO(content.scheduledAt),
                              "MMM d, yyyy"
                            )}
                          </div>
                          <div className="font-mono text-xs text-gray-400">
                            {format(parseISO(content.scheduledAt), "HH:mm")}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-mono text-sm text-white">
                            {content.author.name}
                          </div>
                          <div className="font-mono text-xs text-gray-400">
                            {content.author.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {content.status === "SCHEDULED" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePublishNow(content.id)}
                              title="Publish Now"
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Edit Schedule"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteScheduled(content.id)}
                            className="text-red-400 hover:text-red-300"
                            title="Remove from Schedule"
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
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="border-2 border-white p-4 text-center">
          <div className="font-mono text-2xl font-bold text-yellow-400">
            {scheduledContent.filter((c) => c.status === "SCHEDULED").length}
          </div>
          <div className="font-mono text-sm text-gray-400 uppercase">
            SCHEDULED
          </div>
        </div>
        <div className="border-2 border-white p-4 text-center">
          <div className="font-mono text-2xl font-bold text-green-400">
            {scheduledContent.filter((c) => c.status === "PUBLISHED").length}
          </div>
          <div className="font-mono text-sm text-gray-400 uppercase">
            PUBLISHED
          </div>
        </div>
        <div className="border-2 border-white p-4 text-center">
          <div className="font-mono text-2xl font-bold text-blue-400">
            {scheduledContent.filter((c) => c.type === "PROJECT").length}
          </div>
          <div className="font-mono text-sm text-gray-400 uppercase">
            PROJECTS
          </div>
        </div>
        <div className="border-2 border-white p-4 text-center">
          <div className="font-mono text-2xl font-bold text-purple-400">
            {scheduledContent.filter((c) => c.type === "BLOG_POST").length}
          </div>
          <div className="font-mono text-sm text-gray-400 uppercase">
            BLOG POSTS
          </div>
        </div>
      </div>
    </div>
  );
}
