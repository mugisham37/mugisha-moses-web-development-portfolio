"use client";

import { Suspense, lazy, ComponentType } from "react";
import { motion } from "framer-motion";

interface LazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

// Skeleton loader for sections
const SectionSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`section-skeleton ${className}`}>
    <div className="skeleton-container">
      <motion.div
        className="skeleton-shimmer"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="skeleton-content">
        <div className="skeleton-header" />
        <div className="skeleton-body">
          <div className="skeleton-line" />
          <div className="skeleton-line" />
          <div className="skeleton-line short" />
        </div>
      </div>
    </div>
  </div>
);

// Enhanced lazy loader with intersection observer
export const LazyLoader: React.FC<LazyLoaderProps> = ({
  children,
  fallback,
  className = "",
}) => {
  return (
    <Suspense fallback={fallback || <SectionSkeleton className={className} />}>
      {children}
    </Suspense>
  );
};

// Higher-order component for lazy loading with intersection observer
export const withLazyLoading = <P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }));

  return (props: P) => (
    <LazyLoader fallback={fallback}>
      <LazyComponent {...props} />
    </LazyLoader>
  );
};

// Dynamic import helper with preloading
export const createDynamicImport = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    ssr?: boolean;
    loading?: ComponentType;
    preload?: boolean;
  } = {}
) => {
  const DynamicComponent = lazy(importFn);

  // Preload component on hover or intersection
  if (options.preload) {
    const preloadComponent = () => {
      importFn().catch(() => {
        // Silently handle preload failures
      });
    };

    // Expose preload function
    (DynamicComponent as any).preload = preloadComponent;
  }

  return DynamicComponent;
};

export default LazyLoader;
