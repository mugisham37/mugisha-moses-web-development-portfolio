import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  // Ensure proper build optimization
  eslint: {
    // Don't fail builds on ESLint errors in production
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Don't fail builds on TypeScript errors in production (only for deployment safety)
    ignoreBuildErrors: false,
  },
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  // Handle static optimization
  experimental: {
    optimizePackageImports: ["@tabler/icons-react", "lucide-react"],
  },
};

export default nextConfig;
