"use client";

import { useState, useEffect } from "react";
import {
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  Rss,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogPost } from "@/lib/types";
import { useAnalytics } from "@/hooks/use-analytics";

interface BlogPostSidebarProps {
  post: BlogPost & {
    author: { name: string | null };
    categories: Array<{ name: string; slug: string; color: string }>;
    tags: Array<{ name: string; slug: string }>;
  };
}

export function BlogPostSidebar({ post }: BlogPostSidebarProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const { trackBlogShare } = useAnalytics();

  useEffect(() => {
    const updateReadingProgress = () => {
      const article = document.querySelector(".blog-content");
      if (!article) return;

      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      const progress = Math.min(
        Math.max(
          (scrollTop - articleTop + windowHeight / 2) / articleHeight,
          0
        ),
        1
      );

      setReadingProgress(progress * 100);
    };

    window.addEventListener("scroll", updateReadingProgress);
    updateReadingProgress();

    return () => window.removeEventListener("scroll", updateReadingProgress);
  }, []);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = post.title;
  const shareText = post.excerpt || post.title;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackBlogShare(post.id, "copy_link");
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  const handleSocialShare = (platform: string) => {
    trackBlogShare(post.id, platform);
  };

  return (
    <div className="space-y-8">
      {/* Reading Progress */}
      <div className="border-4 border-white p-4">
        <h3 className="mb-4 font-mono font-bold text-white uppercase">
          READING PROGRESS
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between font-mono text-sm text-gray-400">
            <span>PROGRESS</span>
            <span>{Math.round(readingProgress)}%</span>
          </div>
          <div className="h-2 border border-white bg-gray-800">
            <div
              className="h-full bg-yellow-400 transition-all duration-300"
              style={{ width: `${readingProgress}%` }}
            />
          </div>
          <div className="font-mono text-xs text-gray-400">
            {post.readingTime} MIN READ
          </div>
        </div>
      </div>

      {/* Share */}
      <div className="border-4 border-white p-4">
        <h3 className="mb-4 font-mono font-bold text-white uppercase">
          SHARE POST
        </h3>
        <div className="space-y-3">
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleSocialShare("twitter")}
            className="flex items-center gap-3 p-2 font-mono text-white transition-colors hover:bg-white hover:text-black"
          >
            <Twitter className="h-4 w-4" />
            <span>TWITTER</span>
          </a>
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleSocialShare("facebook")}
            className="flex items-center gap-3 p-2 font-mono text-white transition-colors hover:bg-white hover:text-black"
          >
            <Facebook className="h-4 w-4" />
            <span>FACEBOOK</span>
          </a>
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleSocialShare("linkedin")}
            className="flex items-center gap-3 p-2 font-mono text-white transition-colors hover:bg-white hover:text-black"
          >
            <Linkedin className="h-4 w-4" />
            <span>LINKEDIN</span>
          </a>
          <button
            onClick={copyToClipboard}
            className="flex w-full items-center gap-3 p-2 text-left font-mono text-white transition-colors hover:bg-white hover:text-black"
          >
            <LinkIcon className="h-4 w-4" />
            <span>{copied ? "COPIED!" : "COPY LINK"}</span>
          </button>
        </div>
      </div>

      {/* Post Info */}
      <div className="border-4 border-white p-4">
        <h3 className="mb-4 font-mono font-bold text-white uppercase">
          POST INFO
        </h3>
        <div className="space-y-3 font-mono text-sm">
          <div>
            <span className="text-gray-400">PUBLISHED:</span>
            <br />
            <span className="text-white">
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Draft"}
            </span>
          </div>
          <div>
            <span className="text-gray-400">AUTHOR:</span>
            <br />
            <span className="text-white">
              {post.author.name?.toUpperCase() || "ANONYMOUS"}
            </span>
          </div>
          <div>
            <span className="text-gray-400">VIEWS:</span>
            <br />
            <span className="text-white">
              {post.viewCount.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-gray-400">READING TIME:</span>
            <br />
            <span className="text-white">{post.readingTime} MINUTES</span>
          </div>
        </div>
      </div>

      {/* RSS Feed */}
      <div className="border-4 border-white p-4">
        <h3 className="mb-4 font-mono font-bold text-white uppercase">
          SUBSCRIBE
        </h3>
        <div className="space-y-3">
          <a
            href="/api/blog/rss"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 font-mono text-white transition-colors hover:bg-white hover:text-black"
          >
            <Rss className="h-4 w-4" />
            <span>RSS FEED</span>
          </a>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="border-4 border-white p-4">
        <h3 className="mb-4 font-mono font-bold text-white uppercase">
          JUMP TO SECTION
        </h3>
        <div className="space-y-2 text-sm">
          <p className="font-mono text-gray-400">
            Use the table of contents above the article to navigate to specific
            sections.
          </p>
        </div>
      </div>
    </div>
  );
}
