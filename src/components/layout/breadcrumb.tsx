"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Typography } from "@/components/ui/typography";
import { Container } from "@/components/layout/container";

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

// Helper function to generate breadcrumbs from pathname
function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Add home
  breadcrumbs.push({
    label: "Home",
    href: "/",
  });

  // Add each segment
  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    // Convert segment to readable label
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    breadcrumbs.push({
      label,
      href: currentPath,
      isCurrentPage: isLast,
    });
  });

  return breadcrumbs;
}

export function Breadcrumb({
  items,
  className = "",
  showHome = true,
}: BreadcrumbProps) {
  const pathname = usePathname();

  // Use provided items or generate from pathname
  const breadcrumbItems = items || generateBreadcrumbsFromPath(pathname);

  // Filter out home if showHome is false
  const displayItems = showHome
    ? breadcrumbItems
    : breadcrumbItems.filter((item) => item.href !== "/");

  // Don't show breadcrumbs on home page unless explicitly provided
  if (!items && pathname === "/") {
    return null;
  }

  // Don't show if only one item (home)
  if (displayItems.length <= 1) {
    return null;
  }

  return (
    <nav
      className={`border-b-2 border-white/10 py-4 ${className}`}
      aria-label="Breadcrumb navigation"
    >
      <Container>
        <ol className="flex items-center space-x-2" role="list">
          {displayItems.map((item, index) => (
            <motion.li
              key={item.href}
              className="flex items-center"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Separator */}
              {index > 0 && (
                <span
                  className="mx-3 font-mono text-white/40"
                  aria-hidden="true"
                >
                  /
                </span>
              )}

              {/* Breadcrumb Item */}
              {item.isCurrentPage ? (
                <Typography
                  variant="sm"
                  className="text-accent font-mono tracking-wide uppercase"
                  aria-current="page"
                >
                  {item.label}
                </Typography>
              ) : (
                <Link
                  href={item.href}
                  className="focus:ring-accent rounded-sm text-white/70 transition-colors duration-200 hover:text-white focus:ring-4 focus:outline-none"
                >
                  <Typography
                    variant="sm"
                    className="font-mono tracking-wide uppercase"
                  >
                    {item.label}
                  </Typography>
                </Link>
              )}
            </motion.li>
          ))}
        </ol>
      </Container>
    </nav>
  );
}

// Page Header Component with Breadcrumbs
interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbItems?: BreadcrumbItem[];
  showBreadcrumbs?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  breadcrumbItems,
  showBreadcrumbs = true,
  className = "",
  children,
}: PageHeaderProps) {
  return (
    <div className={`bg-black ${className}`}>
      {/* Breadcrumbs */}
      {showBreadcrumbs && <Breadcrumb items={breadcrumbItems} />}

      {/* Page Header Content */}
      <Container>
        <div className="py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="display"
              weight="bold"
              transform="uppercase"
              className="mb-6 leading-none text-white"
            >
              {title}
            </Typography>

            {description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-3xl"
              >
                <Typography
                  variant="xl"
                  className="leading-relaxed text-white/80"
                >
                  {description}
                </Typography>
              </motion.div>
            )}

            {children && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8"
              >
                {children}
              </motion.div>
            )}
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
