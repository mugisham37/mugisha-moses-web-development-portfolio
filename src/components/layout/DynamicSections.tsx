"use client";

import dynamic from "next/dynamic";
import { ComponentType } from "react";
import SectionSkeleton from "./SectionSkeleton";

// Dynamic imports for sections below the fold
export const DynamicSocialProof = dynamic(
  () => import("@/components/sections/SocialProof/SocialProof"),
  {
    loading: () => <SectionSkeleton variant="social-proof" />,
    ssr: false, // Client-side only for heavy animations
  }
);

export const DynamicResults = dynamic(
  () =>
    import("@/components/sections/Results/Results").then((mod) => ({
      default: mod.Results,
    })),
  {
    loading: () => <SectionSkeleton variant="results" />,
    ssr: false,
  }
);

export const DynamicFooter = dynamic(
  () =>
    import("@/components/sections/Footer/Footer").then((mod) => ({
      default: mod.Footer,
    })),
  {
    loading: () => <SectionSkeleton variant="footer" />,
    ssr: false,
  }
);

// Dynamic imports for heavy UI components
export const DynamicParticleSystem = dynamic(
  () => import("@/components/effects/ParticleSystem"),
  {
    loading: () => <div className="particle-placeholder" />,
    ssr: false,
  }
);

export const DynamicModal = dynamic(
  () =>
    import("@/components/ui/Modal/Modal").then((mod) => ({
      default: mod.Modal,
    })),
  {
    loading: () => <div className="modal-placeholder" />,
    ssr: false,
  }
);

export const DynamicCursorTrail = dynamic(
  () => import("@/components/effects/CursorTrail"),
  {
    loading: () => null,
    ssr: false,
  }
);

// Form components will be added later
// export const DynamicContactForm = dynamic(
//   () => import("@/components/forms/ContactForm"),
//   {
//     loading: () => <SectionSkeleton variant="form" />,
//     ssr: false,
//   }
// );

// export const DynamicNewsletterForm = dynamic(
//   () => import("@/components/forms/NewsletterForm"),
//   {
//     loading: () => <SectionSkeleton variant="form" />,
//     ssr: false,
//   }
// );

// Dynamic imports for visualization components
export const DynamicRevenueDashboard = dynamic(
  () =>
    import("@/components/sections/Results/RevenueDashboard").then((mod) => ({
      default: mod.RevenueDashboard,
    })),
  {
    loading: () => <SectionSkeleton variant="dashboard" />,
    ssr: false,
  }
);

export const DynamicAchievementTimeline = dynamic(
  () =>
    import("@/components/sections/Results/AchievementTimeline").then((mod) => ({
      default: mod.AchievementTimeline,
    })),
  {
    loading: () => <SectionSkeleton variant="timeline" />,
    ssr: false,
  }
);

// Preload functions for critical path optimization
export const preloadSections = () => {
  // Preload sections that are likely to be viewed
  const preloadPromises = [
    import("@/components/sections/SocialProof/SocialProof"),
    import("@/components/sections/Results/Results"),
  ];

  return Promise.allSettled(preloadPromises);
};

// Intersection observer based preloading
export const usePreloadOnIntersection = (
  ref: React.RefObject<HTMLElement>,
  preloadFn: () => Promise<any>
) => {
  if (typeof window === "undefined") return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          preloadFn();
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "200px", // Preload 200px before element comes into view
    }
  );

  if (ref.current) {
    observer.observe(ref.current);
  }

  return () => observer.disconnect();
};

const DynamicSectionsExports = {
  DynamicSocialProof,
  DynamicResults,
  DynamicFooter,
  DynamicParticleSystem,
  DynamicModal,
  DynamicCursorTrail,
  // DynamicContactForm,
  // DynamicNewsletterForm,
  DynamicRevenueDashboard,
  DynamicAchievementTimeline,
  preloadSections,
  usePreloadOnIntersection,
};

export default DynamicSectionsExports;
