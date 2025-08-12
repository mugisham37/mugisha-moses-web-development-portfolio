"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { useOnlineStatus } from "@/lib/offline-detection";
import type {
  GitHubRepository,
  ContributionData,
  GitHubUserStats,
} from "@/lib/github-fallbacks";

interface GitHubFallbackProps {
  children: React.ReactNode;
  fallbackData?: unknown;
  errorMessage?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

export function GitHubFallback({
  children,
  fallbackData,
  errorMessage = "GitHub data is temporarily unavailable",
  showRetry = true,
  onRetry,
}: GitHubFallbackProps) {
  const { isOnline } = useOnlineStatus();
  const [showFallback, setShowFallback] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Show fallback if offline or if there's an error message
    setShowFallback(!isOnline || !!errorMessage);
  }, [isOnline, errorMessage]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    if (onRetry) {
      onRetry();
    }
  };

  if (!showFallback) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-4">
      {/* Fallback Notice */}
      <Card className="border-yellow-500 bg-yellow-900/20 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div className="flex-1">
            <Typography variant="h4" className="mb-2 text-yellow-400">
              {!isOnline ? "OFFLINE MODE" : "GITHUB API UNAVAILABLE"}
            </Typography>
            <Typography variant="body" className="mb-3 text-yellow-200">
              {!isOnline
                ? "You're currently offline. Showing cached GitHub data."
                : errorMessage}
            </Typography>

            {showRetry && (
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleRetry}
                  variant="secondary"
                  className="text-xs"
                  disabled={!isOnline}
                >
                  {!isOnline ? "WAITING FOR CONNECTION" : "RETRY"}
                </Button>
                {retryCount > 0 && (
                  <Typography variant="caption" className="text-yellow-300">
                    Retry attempts: {retryCount}
                  </Typography>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Fallback Content */}
      {fallbackData ? (
        <div className="opacity-75">
          <GitHubFallbackContent data={fallbackData} />
        </div>
      ) : (
        <GitHubPlaceholderContent />
      )}
    </div>
  );
}

interface GitHubFallbackContentProps {
  data: {
    repositories?: GitHubRepository[];
    contributions?: ContributionData;
    userStats?: GitHubUserStats;
  };
}

function GitHubFallbackContent({ data }: GitHubFallbackContentProps) {
  if (data.repositories) {
    return <RepositoriesFallback repositories={data.repositories} />;
  }

  if (data.contributions) {
    return <ContributionsFallback contributions={data.contributions} />;
  }

  if (data.userStats) {
    return <UserStatsFallback stats={data.userStats} />;
  }

  return <GitHubPlaceholderContent />;
}

function RepositoriesFallback({ repositories }: { repositories: GitHubRepository[] }) {
  return (
    <div className="space-y-4">
      <Typography variant="h3" className="text-muted-foreground">
        CACHED REPOSITORIES
      </Typography>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {repositories.slice(0, 6).map((repo, index) => (
          <Card key={index} className="bg-muted/50 p-4">
            <Typography variant="h4" className="text-accent mb-2">
              {repo.name}
            </Typography>
            <Typography
              variant="caption"
              className="text-muted-foreground mb-3 line-clamp-2"
            >
              {repo.description || "No description available"}
            </Typography>
            <div className="flex items-center justify-between text-xs">
              <span className="text-yellow-400">
                {repo.language || "Unknown"}
              </span>
              <div className="flex items-center gap-3">
                <span>⭐ {repo.stargazers_count || 0}</span>
                <span>🍴 {repo.forks_count || 0}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ContributionsFallback({ contributions }: { contributions: ContributionData }) {
  return (
    <div className="space-y-4">
      <Typography variant="h3" className="text-muted-foreground">
        CACHED CONTRIBUTIONS
      </Typography>
      <Card className="bg-muted/50 p-6">
        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
          <div>
            <Typography variant="display" className="text-accent text-2xl">
              {contributions.totalContributions || 0}
            </Typography>
            <Typography variant="caption" className="text-muted-foreground">
              Total Contributions
            </Typography>
          </div>
          <div>
            <Typography variant="display" className="text-accent text-2xl">
              {contributions.currentStreak || 0}
            </Typography>
            <Typography variant="caption" className="text-muted-foreground">
              Current Streak
            </Typography>
          </div>
          <div>
            <Typography variant="display" className="text-accent text-2xl">
              {contributions.longestStreak || 0}
            </Typography>
            <Typography variant="caption" className="text-muted-foreground">
              Longest Streak
            </Typography>
          </div>
          <div>
            <Typography variant="display" className="text-accent text-2xl">
              {new Date().getFullYear()}
            </Typography>
            <Typography variant="caption" className="text-muted-foreground">
              Year
            </Typography>
          </div>
        </div>
      </Card>
    </div>
  );
}

function UserStatsFallback({ stats }: { stats: GitHubUserStats }) {
  return (
    <div className="space-y-4">
      <Typography variant="h3" className="text-muted-foreground">
        CACHED USER STATS
      </Typography>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="bg-muted/50 p-4 text-center">
          <Typography variant="display" className="text-accent text-2xl">
            {stats.publicRepos || 0}
          </Typography>
          <Typography variant="caption" className="text-muted-foreground">
            Public Repos
          </Typography>
        </Card>
        <Card className="bg-muted/50 p-4 text-center">
          <Typography variant="display" className="text-accent text-2xl">
            {stats.followers || 0}
          </Typography>
          <Typography variant="caption" className="text-muted-foreground">
            Followers
          </Typography>
        </Card>
        <Card className="bg-muted/50 p-4 text-center">
          <Typography variant="display" className="text-accent text-2xl">
            {stats.totalStars || 0}
          </Typography>
          <Typography variant="caption" className="text-muted-foreground">
            Total Stars
          </Typography>
        </Card>
        <Card className="bg-muted/50 p-4 text-center">
          <Typography variant="display" className="text-accent text-2xl">
            {stats.totalForks || 0}
          </Typography>
          <Typography variant="caption" className="text-muted-foreground">
            Total Forks
          </Typography>
        </Card>
      </div>
    </div>
  );
}

function GitHubPlaceholderContent() {
  return (
    <Card className="bg-muted/50 p-8 text-center">
      <div className="mb-4">
        <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <svg
            className="text-muted-foreground h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        <Typography variant="h3" className="text-muted-foreground mb-2">
          GITHUB DATA UNAVAILABLE
        </Typography>

        <Typography variant="body" className="text-muted-foreground">
          GitHub data is currently unavailable. This could be due to API rate
          limits, network issues, or service maintenance.
        </Typography>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="bg-muted rounded p-4">
          <div className="bg-background mb-2 h-4 animate-pulse rounded"></div>
          <div className="bg-background h-3 animate-pulse rounded"></div>
        </div>
        <div className="bg-muted rounded p-4">
          <div className="bg-background mb-2 h-4 animate-pulse rounded"></div>
          <div className="bg-background h-3 animate-pulse rounded"></div>
        </div>
        <div className="bg-muted rounded p-4">
          <div className="bg-background mb-2 h-4 animate-pulse rounded"></div>
          <div className="bg-background h-3 animate-pulse rounded"></div>
        </div>
      </div>
    </Card>
  );
}

// Hook for GitHub data with fallback
export function useGitHubWithFallback<T>(
  fetchFunction: () => Promise<T>,
  fallbackData: T,
  cacheKey: string
) {
  const [data, setData] = useState<T>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOnline } = useOnlineStatus();

  const fetchData = useCallback(async () => {
    if (!isOnline) {
      // Try to get cached data
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          setData(JSON.parse(cached));
        } catch {
          setData(fallbackData);
        }
      } else {
        setData(fallbackData);
      }
      setError("Offline - using cached data");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);

      // Cache the successful result
      localStorage.setItem(cacheKey, JSON.stringify(result));
    } catch (err) {
      console.error("GitHub fetch error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch GitHub data"
      );

      // Try to use cached data
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          setData(JSON.parse(cached));
        } catch {
          setData(fallbackData);
        }
      } else {
        setData(fallbackData);
      }
    } finally {
      setLoading(false);
    }
  }, [isOnline, cacheKey, fallbackData, fetchFunction]);

  useEffect(() => {
    fetchData();
  }, [isOnline, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
