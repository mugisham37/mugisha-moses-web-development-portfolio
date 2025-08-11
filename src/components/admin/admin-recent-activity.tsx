import { db } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import { Clock, FolderOpen, FileText, User } from "lucide-react";

async function getRecentActivity() {
  const [recentProjects, recentBlogPosts, recentUsers] = await Promise.all([
    db.project.findMany({
      take: 3,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        updatedAt: true,
        status: true,
        author: {
          select: { name: true },
        },
      },
    }),
    db.blogPost.findMany({
      take: 3,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        updatedAt: true,
        status: true,
        author: {
          select: { name: true },
        },
      },
    }),
    db.user.findMany({
      take: 2,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: true,
      },
    }),
  ]);

  return { recentProjects, recentBlogPosts, recentUsers };
}

export async function AdminRecentActivity() {
  const { recentProjects, recentBlogPosts, recentUsers } =
    await getRecentActivity();

  return (
    <div className="border-4 border-white bg-black p-6">
      <div className="mb-6 flex items-center">
        <Clock className="mr-3 h-6 w-6 text-yellow-400" />
        <h2 className="font-mono text-2xl font-bold tracking-wider text-white uppercase">
          RECENT ACTIVITY
        </h2>
      </div>

      <div className="space-y-6">
        {/* Recent Projects */}
        <div>
          <h3 className="mb-3 flex items-center font-mono text-lg font-bold text-yellow-400 uppercase">
            <FolderOpen className="mr-2 h-5 w-5" />
            PROJECTS
          </h3>
          <div className="space-y-2">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between border border-gray-600 p-3"
              >
                <div>
                  <p className="font-mono text-sm font-bold text-white">
                    {project.title}
                  </p>
                  <p className="font-mono text-xs text-gray-400">
                    BY {project.author.name?.toUpperCase() || "UNKNOWN"}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-mono text-xs font-bold uppercase ${
                      project.status === "ACTIVE"
                        ? "text-green-400"
                        : project.status === "DRAFT"
                          ? "text-yellow-400"
                          : project.status === "FEATURED"
                            ? "text-blue-400"
                            : "text-gray-400"
                    }`}
                  >
                    {project.status}
                  </p>
                  <p className="font-mono text-xs text-gray-400">
                    {formatDistanceToNow(project.updatedAt, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div>
          <h3 className="mb-3 flex items-center font-mono text-lg font-bold text-blue-400 uppercase">
            <FileText className="mr-2 h-5 w-5" />
            BLOG POSTS
          </h3>
          <div className="space-y-2">
            {recentBlogPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between border border-gray-600 p-3"
              >
                <div>
                  <p className="font-mono text-sm font-bold text-white">
                    {post.title}
                  </p>
                  <p className="font-mono text-xs text-gray-400">
                    BY {post.author.name?.toUpperCase() || "UNKNOWN"}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-mono text-xs font-bold uppercase ${
                      post.status === "PUBLISHED"
                        ? "text-green-400"
                        : post.status === "DRAFT"
                          ? "text-yellow-400"
                          : post.status === "SCHEDULED"
                            ? "text-blue-400"
                            : "text-gray-400"
                    }`}
                  >
                    {post.status}
                  </p>
                  <p className="font-mono text-xs text-gray-400">
                    {formatDistanceToNow(post.updatedAt, { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div>
          <h3 className="mb-3 flex items-center font-mono text-lg font-bold text-green-400 uppercase">
            <User className="mr-2 h-5 w-5" />
            NEW USERS
          </h3>
          <div className="space-y-2">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between border border-gray-600 p-3"
              >
                <div>
                  <p className="font-mono text-sm font-bold text-white">
                    {user.name?.toUpperCase() || "UNNAMED USER"}
                  </p>
                  <p className="font-mono text-xs text-gray-400">
                    {user.email}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-mono text-xs font-bold uppercase ${
                      user.role === "ADMIN" ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {user.role}
                  </p>
                  <p className="font-mono text-xs text-gray-400">
                    {formatDistanceToNow(user.createdAt, { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
