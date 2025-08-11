import { SITE_CONFIG } from "./constants";

/**
 * Generate canonical URL for a given path
 */
export function getCanonicalUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // Remove trailing slash except for root
  const normalizedPath = cleanPath === "" ? "" : cleanPath.replace(/\/$/, "");

  return `${SITE_CONFIG.url}${normalizedPath ? `/${normalizedPath}` : ""}`;
}

/**
 * Generate alternate URLs for different languages (future use)
 */
export function getAlternateUrls(path: string): Record<string, string> {
  const baseUrl = getCanonicalUrl(path);

  return {
    "en-US": baseUrl,
    // Add more languages as needed
    // "es-ES": `${baseUrl}?lang=es`,
    // "fr-FR": `${baseUrl}?lang=fr`,
  };
}

/**
 * Check if a URL should be redirected
 */
export function shouldRedirect(url: string): {
  redirect: boolean;
  destination?: string;
} {
  // Remove trailing slashes except for root
  if (url !== "/" && url.endsWith("/")) {
    return {
      redirect: true,
      destination: url.slice(0, -1),
    };
  }

  // Convert old blog URLs
  if (url.startsWith("/posts/")) {
    return {
      redirect: true,
      destination: url.replace("/posts/", "/blog/"),
    };
  }

  // Convert old project URLs
  if (url.startsWith("/work/")) {
    return {
      redirect: true,
      destination: url.replace("/work/", "/projects/"),
    };
  }

  return { redirect: false };
}

/**
 * Generate breadcrumb data for a given path
 */
export function generateBreadcrumbs(
  path: string
): Array<{ name: string; url: string }> {
  const segments = path.split("/").filter(Boolean);
  const breadcrumbs: Array<{ name: string; url: string }> = [];

  let currentPath = "";

  for (const segment of segments) {
    currentPath += `/${segment}`;

    // Convert segment to readable name
    const name = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    breadcrumbs.push({
      name,
      url: currentPath,
    });
  }

  return breadcrumbs;
}

/**
 * Generate SEO-friendly slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Validate and normalize URL paths
 */
export function normalizePath(path: string): string {
  // Remove query parameters and fragments
  const cleanPath = path.split("?")[0].split("#")[0];

  // Ensure path starts with /
  const normalizedPath = cleanPath.startsWith("/")
    ? cleanPath
    : `/${cleanPath}`;

  // Remove trailing slash except for root
  return normalizedPath === "/" ? "/" : normalizedPath.replace(/\/$/, "");
}
