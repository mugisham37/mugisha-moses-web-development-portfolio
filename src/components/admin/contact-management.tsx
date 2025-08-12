"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimationWrapper } from "@/components/ui/animation";
import {
  Mail,
  Calendar,
  User,
  MessageSquare,
  Filter,
  Search,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  Reply,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  type:
    | "GENERAL"
    | "PROJECT_INQUIRY"
    | "CONSULTATION"
    | "COLLABORATION"
    | "SUPPORT";
  projectType?: string;
  budget?: string;
  timeline?: string;
  status: "NEW" | "IN_PROGRESS" | "RESPONDED" | "CLOSED";
  responded: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ContactManagementProps {
  className?: string;
}

const statusConfig = {
  NEW: {
    label: "New",
    color: "text-brutalist-yellow",
    bg: "bg-brutalist-yellow/20",
    icon: AlertCircle,
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "text-blue-400",
    bg: "bg-blue-400/20",
    icon: Clock,
  },
  RESPONDED: {
    label: "Responded",
    color: "text-green-400",
    bg: "bg-green-400/20",
    icon: CheckCircle,
  },
  CLOSED: {
    label: "Closed",
    color: "text-gray-400",
    bg: "bg-gray-400/20",
    icon: CheckCircle,
  },
};

const typeConfig = {
  GENERAL: { label: "General", color: "text-white", icon: MessageSquare },
  PROJECT_INQUIRY: {
    label: "Project",
    color: "text-brutalist-yellow",
    icon: User,
  },
  CONSULTATION: {
    label: "Consultation",
    color: "text-green-400",
    icon: Calendar,
  },
  COLLABORATION: { label: "Collaboration", color: "text-blue-400", icon: User },
  SUPPORT: { label: "Support", color: "text-red-400", icon: MessageSquare },
};

export function ContactManagement({ className }: ContactManagementProps) {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<
    ContactSubmission[]
  >([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<ContactSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockSubmissions: ContactSubmission[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        subject: "Website Development Project",
        message:
          "I need a new website for my business. Looking for modern design with e-commerce functionality.",
        type: "PROJECT_INQUIRY",
        projectType: "E-commerce Website",
        budget: "15k-30k",
        timeline: "2-3-months",
        status: "NEW",
        responded: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "2",
        name: "Sarah Johnson",
        email: "sarah@company.com",
        subject: "Technical Consultation",
        message:
          "Need advice on migrating our legacy system to modern architecture.",
        type: "CONSULTATION",
        status: "IN_PROGRESS",
        responded: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "3",
        name: "Mike Chen",
        email: "mike@startup.io",
        subject: "General Inquiry",
        message: "Interested in your services. Can we schedule a call?",
        type: "GENERAL",
        status: "RESPONDED",
        responded: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    setTimeout(() => {
      setSubmissions(mockSubmissions);
      setFilteredSubmissions(mockSubmissions);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter submissions
  useEffect(() => {
    let filtered = submissions;

    if (searchTerm) {
      filtered = filtered.filter(
        (submission) =>
          submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          submission.subject
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          submission.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (submission) => submission.status === statusFilter
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(
        (submission) => submission.type === typeFilter
      );
    }

    setFilteredSubmissions(filtered);
  }, [submissions, searchTerm, statusFilter, typeFilter]);

  const handleStatusUpdate = async (
    submissionId: string,
    newStatus: ContactSubmission["status"]
  ) => {
    try {
      // Mock API call - replace with actual implementation
      setSubmissions((prev) =>
        prev.map((submission) =>
          submission.id === submissionId
            ? {
                ...submission,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              }
            : submission
        )
      );

      if (selectedSubmission?.id === submissionId) {
        setSelectedSubmission((prev) =>
          prev
            ? {
                ...prev,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              }
            : null
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = async (submissionId: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) {
      return;
    }

    try {
      // Mock API call - replace with actual implementation
      setSubmissions((prev) =>
        prev.filter((submission) => submission.id !== submissionId)
      );

      if (selectedSubmission?.id === submissionId) {
        setSelectedSubmission(null);
      }
    } catch (error) {
      console.error("Failed to delete submission:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} variant="default" padding="md">
              <div className="bg-brutalist-charcoal-100 h-20"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Typography variant="h2" className="mb-2">
            CONTACT MANAGEMENT
          </Typography>
          <Typography variant="body" className="text-brutalist-off-white-100">
            Manage and respond to contact form submissions
          </Typography>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="bg-brutalist-yellow h-3 w-3 rounded-full"></div>
            <span>
              {submissions.filter((s) => s.status === "NEW").length} New
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-3 w-3 rounded-full bg-blue-400"></div>
            <span>
              {submissions.filter((s) => s.status === "IN_PROGRESS").length} In
              Progress
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card variant="default" padding="md">
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="relative">
              <Search
                className="text-brutalist-off-white-100 absolute top-1/2 left-3 -translate-y-1/2 transform"
                size={16}
              />
              <Input
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-brutalist-charcoal-100 focus:ring-brutalist-yellow focus:border-brutalist-yellow flex h-12 w-full border-4 border-white px-4 py-3 font-mono text-base text-white focus:ring-2 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              {Object.entries(statusConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-brutalist-charcoal-100 focus:ring-brutalist-yellow focus:border-brutalist-yellow flex h-12 w-full border-4 border-white px-4 py-3 font-mono text-base text-white focus:ring-2 focus:outline-none"
            >
              <option value="all">All Types</option>
              {Object.entries(typeConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>

            <Button variant="secondary" className="flex items-center gap-2">
              <Filter size={16} />
              FILTER
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Typography variant="h4">
            SUBMISSIONS ({filteredSubmissions.length})
          </Typography>

          {filteredSubmissions.length === 0 ? (
            <Card variant="default" padding="lg" className="text-center">
              <CardContent>
                <MessageSquare
                  size={48}
                  className="text-brutalist-off-white-100 mx-auto mb-4"
                />
                <Typography variant="h4" className="mb-2">
                  NO SUBMISSIONS FOUND
                </Typography>
                <Typography
                  variant="body"
                  className="text-brutalist-off-white-100"
                >
                  {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                    ? "Try adjusting your filters"
                    : "No contact submissions yet"}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredSubmissions.map((submission, index) => {
                const statusInfo = statusConfig[submission.status];
                const typeInfo = typeConfig[submission.type];
                const StatusIcon = statusInfo.icon;
                const TypeIcon = typeInfo.icon;

                return (
                  <AnimationWrapper
                    key={submission.id}
                    type="slideInLeft"
                    delay={index * 0.05}
                  >
                    <Card
                      variant={
                        selectedSubmission?.id === submission.id
                          ? "accent"
                          : "interactive"
                      }
                      padding="md"
                      hover="lift"
                      className="cursor-pointer"
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <CardContent>
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <TypeIcon size={16} className={typeInfo.color} />
                            <Typography
                              variant="caption"
                              className={typeInfo.color}
                            >
                              {typeInfo.label}
                            </Typography>
                          </div>

                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "flex items-center gap-1 rounded-none px-2 py-1 text-xs",
                                statusInfo.bg
                              )}
                            >
                              <StatusIcon
                                size={12}
                                className={statusInfo.color}
                              />
                              <span className={statusInfo.color}>
                                {statusInfo.label}
                              </span>
                            </div>
                            <Typography
                              variant="caption"
                              className="text-brutalist-off-white-100"
                            >
                              {formatDate(submission.createdAt)}
                            </Typography>
                          </div>
                        </div>

                        <Typography variant="body" className="mb-1 font-bold">
                          {submission.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          className="text-brutalist-off-white-100 mb-2"
                        >
                          {submission.email}
                        </Typography>

                        {submission.subject && (
                          <Typography variant="body" className="mb-2">
                            {submission.subject}
                          </Typography>
                        )}

                        <Typography
                          variant="caption"
                          className="text-brutalist-off-white-100 line-clamp-2"
                        >
                          {submission.message}
                        </Typography>

                        {submission.type === "PROJECT_INQUIRY" && (
                          <div className="mt-2 flex gap-4 text-xs">
                            {submission.budget && (
                              <span className="text-brutalist-yellow">
                                Budget: {submission.budget}
                              </span>
                            )}
                            {submission.timeline && (
                              <span className="text-brutalist-yellow">
                                Timeline: {submission.timeline}
                              </span>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </AnimationWrapper>
                );
              })}
            </div>
          )}
        </div>

        {/* Submission Details */}
        <div className="space-y-4">
          <Typography variant="h4">SUBMISSION DETAILS</Typography>

          {selectedSubmission ? (
            <AnimationWrapper type="fadeIn">
              <Card variant="default" padding="lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="mb-2">
                        {selectedSubmission.name}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Mail size={14} />
                          <span>{selectedSubmission.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>
                            {new Date(
                              selectedSubmission.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          window.open(
                            `mailto:${selectedSubmission.email}`,
                            "_blank"
                          )
                        }
                        className="hover:bg-brutalist-yellow hover:text-black"
                      >
                        <Reply size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(selectedSubmission.id)}
                        className="hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {selectedSubmission.subject && (
                    <div className="mb-4">
                      <Typography
                        variant="caption"
                        className="text-brutalist-yellow mb-1 font-bold tracking-wider uppercase"
                      >
                        Subject
                      </Typography>
                      <Typography variant="body">
                        {selectedSubmission.subject}
                      </Typography>
                    </div>
                  )}

                  <div className="mb-4">
                    <Typography
                      variant="caption"
                      className="text-brutalist-yellow mb-1 font-bold tracking-wider uppercase"
                    >
                      Message
                    </Typography>
                    <div className="bg-brutalist-charcoal-100 border-2 border-white p-4">
                      <Typography
                        variant="body"
                        className="whitespace-pre-wrap"
                      >
                        {selectedSubmission.message}
                      </Typography>
                    </div>
                  </div>

                  {selectedSubmission.type === "PROJECT_INQUIRY" && (
                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                      {selectedSubmission.projectType && (
                        <div>
                          <Typography
                            variant="caption"
                            className="text-brutalist-yellow mb-1 font-bold tracking-wider uppercase"
                          >
                            Project Type
                          </Typography>
                          <Typography variant="body">
                            {selectedSubmission.projectType}
                          </Typography>
                        </div>
                      )}
                      {selectedSubmission.budget && (
                        <div>
                          <Typography
                            variant="caption"
                            className="text-brutalist-yellow mb-1 font-bold tracking-wider uppercase"
                          >
                            Budget
                          </Typography>
                          <Typography variant="body">
                            {selectedSubmission.budget}
                          </Typography>
                        </div>
                      )}
                      {selectedSubmission.timeline && (
                        <div>
                          <Typography
                            variant="caption"
                            className="text-brutalist-yellow mb-1 font-bold tracking-wider uppercase"
                          >
                            Timeline
                          </Typography>
                          <Typography variant="body">
                            {selectedSubmission.timeline}
                          </Typography>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {Object.entries(statusConfig).map(([status, config]) => (
                      <Button
                        key={status}
                        variant={
                          selectedSubmission.status === status
                            ? "accent"
                            : "secondary"
                        }
                        size="sm"
                        onClick={() =>
                          handleStatusUpdate(
                            selectedSubmission.id,
                            status as ContactSubmission["status"]
                          )
                        }
                        className="flex items-center gap-1"
                      >
                        <config.icon size={14} />
                        {config.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimationWrapper>
          ) : (
            <Card variant="default" padding="lg" className="text-center">
              <CardContent>
                <Eye
                  size={48}
                  className="text-brutalist-off-white-100 mx-auto mb-4"
                />
                <Typography variant="h4" className="mb-2">
                  SELECT A SUBMISSION
                </Typography>
                <Typography
                  variant="body"
                  className="text-brutalist-off-white-100"
                >
                  Click on a submission from the list to view details
                </Typography>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
