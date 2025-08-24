"use client";

import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface PageTransitionProps {
  children: React.ReactNode;
  sectionId?: string;
  className?: string;
  transitionDelay?: number;
  transitionDuration?: number;
}

interface SectionTransitionProps {
  children: React.ReactNode;
  sectionId: string;
  className?: string;
  transitionType?: "fade" | "slide" | "scale" | "brutal";
  delay?: number;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  sectionId,
  className = "",
  transitionDelay = 0,
  transitionDuration = 600,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { currentTheme } = useTheme();

  const isInView = useIntersectionObserver(ref, {
    threshold: 0.1,
    rootMargin: "-50px 0px",
    triggerOnce: true,
  });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasAnimated(true);
      }, transitionDelay);

      return () => clearTimeout(timer);
    }
  }, [isInView, hasAnimated, transitionDelay]);

  return (
    <div
      ref={ref}
      id={sectionId}
      className={`page-transition page-transition--${currentTheme} ${
        isVisible ? "page-transition--visible" : ""
      } ${className}`}
      style={
        {
          "--transition-duration": `${transitionDuration}ms`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

export const SectionTransition: React.FC<SectionTransitionProps> = ({
  children,
  sectionId,
  className = "",
  transitionType = "brutal",
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<
    "enter" | "visible" | "exit"
  >("enter");
  const ref = useRef<HTMLElement>(null);
  const { currentTheme } = useTheme();

  const isInView = useIntersectionObserver(ref, {
    threshold: 0.2,
    rootMargin: "-100px 0px",
    triggerOnce: false,
  });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setAnimationPhase("visible");
      }, delay);

      return () => clearTimeout(timer);
    } else if (isVisible) {
      setAnimationPhase("exit");
      const timer = setTimeout(() => {
        setIsVisible(false);
        setAnimationPhase("enter");
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isInView, delay, isVisible]);

  return (
    <section
      ref={ref}
      id={sectionId}
      className={`section-transition section-transition--${currentTheme} section-transition--${transitionType} section-transition--${animationPhase} ${
        isVisible ? "section-transition--visible" : ""
      } ${className}`}
      data-section={sectionId}
    >
      <div className="section-transition__content">{children}</div>

      {/* Brutal transition effects */}
      <div className="section-transition__effects">
        <div className="section-transition__border-top"></div>
        <div className="section-transition__border-bottom"></div>
        <div className="section-transition__scan-line"></div>
        <div className="section-transition__glitch-overlay"></div>
      </div>
    </section>
  );
};

// Staggered children animation component
interface StaggeredChildrenProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggeredChildren: React.FC<StaggeredChildrenProps> = ({
  children,
  staggerDelay = 100,
  className = "",
}) => {
  const [visibleChildren, setVisibleChildren] = useState<number[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const { currentTheme } = useTheme();

  const isInView = useIntersectionObserver(ref, {
    threshold: 0.3,
    triggerOnce: true,
  });

  useEffect(() => {
    if (isInView) {
      const childrenArray = React.Children.toArray(children);

      childrenArray.forEach((_, index) => {
        setTimeout(() => {
          setVisibleChildren((prev) => [...prev, index]);
        }, index * staggerDelay);
      });
    }
  }, [isInView, children, staggerDelay]);

  return (
    <div
      ref={ref}
      className={`staggered-children staggered-children--${currentTheme} ${className}`}
    >
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className={`staggered-child ${
            visibleChildren.includes(index) ? "staggered-child--visible" : ""
          }`}
          style={
            {
              "--stagger-delay": `${index * staggerDelay}ms`,
            } as React.CSSProperties
          }
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// Page transition wrapper for entire page
interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  className = "",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { currentTheme } = useTheme();

  useEffect(() => {
    // Trigger page load animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`page-wrapper page-wrapper--${currentTheme} ${
        isLoaded ? "page-wrapper--loaded" : ""
      } ${className}`}
    >
      <div className="page-wrapper__content">{children}</div>

      {/* Page load overlay */}
      <div className="page-wrapper__overlay">
        <div className="page-wrapper__loading">
          <div className="loading-terminal">
            <div className="loading-text">INITIALIZING BRUTALIST SYSTEM...</div>
            <div className="loading-cursor"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
