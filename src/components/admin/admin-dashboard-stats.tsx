import { db } from "@/lib/db";
import {
  FolderOpen,
  FileText,
  Users,
  MessageSquare,
  Eye,
  TrendingUp,
} from "lucide-react";

async function getStats() {
  const [
    projectCount,
    blogPostCount,
    userCount,
    testimonialCount,
    totalViews,
    recentProjects,
  ] = await Promise.all([
    db.project.count(),
    db.blogPost.count(),
    db.user.count(),
    db.testimonial.count(),
    db.project.aggregate({
      _sum: { viewCount: true },
    }),
    db.project.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    }),
  ]);

  return {
    projects: projectCount,
    blogPosts: blogPostCount,
    users: userCount,
    testimonials: testimonialCount,
    totalViews: totalViews._sum.viewCount || 0,
    recentProjects,
  };
}

export async function AdminDashboardStats() {
  const stats = await getStats();

  const statCards = [
    {
      title: "PROJECTS",
      value: stats.projects,
      icon: FolderOpen,
      color: "yellow-400",
      change: `+${stats.recentProjects} THIS WEEK`,
    },
    {
      title: "BLOG POSTS",
      value: stats.blogPosts,
      icon: FileText,
      color: "blue-400",
      change: "CONTENT LIBRARY",
    },
    {
      title: "USERS",
      value: stats.users,
      icon: Users,
      color: "green-400",
      change: "REGISTERED USERS",
    },
    {
      title: "TESTIMONIALS",
      value: stats.testimonials,
      icon: MessageSquare,
      color: "purple-400",
      change: "CLIENT FEEDBACK",
    },
    {
      title: "TOTAL VIEWS",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: "red-400",
      change: "PROJECT VIEWS",
    },
    {
      title: "GROWTH",
      value: "↗",
      icon: TrendingUp,
      color: "white",
      change: "TRENDING UP",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statCards.map((stat) => (
        <div key={stat.title} className="border-4 border-white bg-black p-6">
          <div className="mb-4 flex items-center justify-between">
            <stat.icon className={`h-8 w-8 text-${stat.color}`} />
            <div className="text-right">
              <p className="font-mono text-3xl font-bold text-white">
                {stat.value}
              </p>
            </div>
          </div>
          <h3
            className={`font-mono text-lg font-bold text-${stat.color} mb-1 tracking-wider uppercase`}
          >
            {stat.title}
          </h3>
          <p className="font-mono text-xs text-gray-400 uppercase">
            {stat.change}
          </p>
        </div>
      ))}
    </div>
  );
}
