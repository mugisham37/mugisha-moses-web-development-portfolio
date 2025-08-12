import { Octokit } from "@octokit/rest";

// Initialize Octokit client with authentication
export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  userAgent: "brutalist-portfolio/1.0.0",
});

// GitHub API configuration
export const GITHUB_CONFIG = {
  username: process.env.GITHUB_USERNAME || "",
  maxRepositories: 100,
  cacheDuration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  rateLimitBuffer: 100, // Keep 100 requests as buffer
} as const;

// Types for GitHub API responses
export interface GitHubRepositoryData {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  private: boolean;
  fork: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
}

export interface GitHubContributionData {
  date: string;
  contributionCount: number;
  contributionLevel:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE";
}

export interface GitHubActivityData {
  id: string;
  type: string;
  actor: {
    login: string;
    avatar_url: string;
  };
  repo: {
    name: string;
    url: string;
  };
  payload: Record<string, unknown>;
  created_at: string;
}

export interface GitHubLanguageStats {
  [language: string]: number;
}

// Rate limiting utilities
export async function checkRateLimit(): Promise<{
  remaining: number;
  resetTime: Date;
  canMakeRequest: boolean;
}> {
  try {
    const { data } = await octokit.rest.rateLimit.get();
    const remaining = data.rate.remaining;
    const resetTime = new Date(data.rate.reset * 1000);
    const canMakeRequest = remaining > GITHUB_CONFIG.rateLimitBuffer;

    return {
      remaining,
      resetTime,
      canMakeRequest,
    };
  } catch (error) {
    console.error("Error checking GitHub rate limit:", error);
    return {
      remaining: 0,
      resetTime: new Date(),
      canMakeRequest: false,
    };
  }
}

// Error handling utilities
export class GitHubAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public rateLimited?: boolean
  ) {
    super(message);
    this.name = "GitHubAPIError";
  }
}

interface GitHubError {
  status?: number;
  message?: string;
  response?: {
    headers?: {
      "x-ratelimit-remaining"?: string;
      "x-ratelimit-reset"?: string;
    };
  };
}

function isGitHubError(error: unknown): error is GitHubError {
  return typeof error === "object" && error !== null;
}

export function handleGitHubError(error: unknown): GitHubAPIError {
  if (isGitHubError(error)) {
    if (
      error.status === 403 &&
      error.response?.headers?.["x-ratelimit-remaining"] === "0"
    ) {
      const resetTime = new Date(
        parseInt(error.response.headers["x-ratelimit-reset"] || "0") * 1000
      );
      return new GitHubAPIError(
        `GitHub API rate limit exceeded. Resets at ${resetTime.toISOString()}`,
        403,
        true
      );
    }

    if (error.status === 404) {
      return new GitHubAPIError("GitHub resource not found", 404);
    }

    if (error.status === 401) {
      return new GitHubAPIError("GitHub API authentication failed", 401);
    }

    return new GitHubAPIError(
      error.message || "Unknown GitHub API error",
      error.status
    );
  }

  return new GitHubAPIError(
    error instanceof Error ? error.message : "Unknown GitHub API error"
  );
}
