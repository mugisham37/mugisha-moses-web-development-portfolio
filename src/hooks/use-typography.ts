/**
 * Typography Hook
 * Custom hook for typography utilities and font loading
 */

import { useEffect, useState } from "react";
import { fontLoadingUtils, typographyA11y } from "@/lib/typography-utils";

export interface UseTypographyOptions {
  preloadFonts?: boolean;
  checkFontLoad?: boolean;
  applyFontLoadedClass?: boolean;
}

export function useTypography(options: UseTypographyOptions = {}) {
  const {
    preloadFonts = true,
    checkFontLoad = true,
    applyFontLoadedClass = true,
  } = options;

  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [spaceMonoLoaded, setSpaceMonoLoaded] = useState(false);
  const [interLoaded, setInterLoaded] = useState(false);

  useEffect(() => {
    const initializeTypography = async () => {
      // Preload fonts if requested
      if (preloadFonts) {
        fontLoadingUtils.preloadFonts();
      }

      // Check font loading status
      if (checkFontLoad) {
        try {
          const [spaceMono, inter] = await Promise.all([
            fontLoadingUtils.checkFontLoad("Space Mono"),
            fontLoadingUtils.checkFontLoad("Inter"),
          ]);

          setSpaceMonoLoaded(spaceMono);
          setInterLoaded(inter);
          setFontsLoaded(spaceMono && inter);

          // Apply font loaded class
          if (applyFontLoadedClass && spaceMono && inter) {
            await fontLoadingUtils.applyFontLoadedClass();
          }
        } catch (error) {
          console.warn("Font loading check failed:", error);
          // Fallback: assume fonts are loaded after timeout
          setTimeout(() => {
            setFontsLoaded(true);
            setSpaceMonoLoaded(true);
            setInterLoaded(true);
          }, 3000);
        }
      }
    };

    initializeTypography();
  }, [preloadFonts, checkFontLoad, applyFontLoadedClass]);

  // Typography utility functions
  const getOptimalFontSize = (textLength: number) => {
    return typographyA11y.getOptimalFontSize(textLength);
  };

  const getOptimalLineHeight = (fontSize: number) => {
    return typographyA11y.getOptimalLineHeight(fontSize);
  };

  const checkContrast = (foreground: string, background: string) => {
    return typographyA11y.checkContrast(foreground, background);
  };

  return {
    // Font loading status
    fontsLoaded,
    spaceMonoLoaded,
    interLoaded,

    // Utility functions
    getOptimalFontSize,
    getOptimalLineHeight,
    checkContrast,

    // Font loading utilities
    preloadFonts: fontLoadingUtils.preloadFonts,
    checkFontLoad: fontLoadingUtils.checkFontLoad,
    applyFontLoadedClass: fontLoadingUtils.applyFontLoadedClass,
  };
}

/**
 * Hook for responsive typography
 */
export function useResponsiveTypography() {
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize("mobile");
      } else if (width < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    // Initial check
    updateScreenSize();

    // Listen for resize events
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  const getResponsiveVariant = (
    mobileVariant: string,
    tabletVariant: string,
    desktopVariant: string
  ) => {
    switch (screenSize) {
      case "mobile":
        return mobileVariant;
      case "tablet":
        return tabletVariant;
      case "desktop":
      default:
        return desktopVariant;
    }
  };

  return {
    screenSize,
    getResponsiveVariant,
    isMobile: screenSize === "mobile",
    isTablet: screenSize === "tablet",
    isDesktop: screenSize === "desktop",
  };
}

/**
 * Hook for typography animations
 */
export function useTypographyAnimations() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simple visibility check - in production, use Intersection Observer
    setIsVisible(true);
  }, []);

  const typewriterConfig = {
    duration: 50,
    cursor: "|",
    cursorBlink: 500,
  };

  const textRevealConfig = {
    duration: 600,
    delay: 100,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const counterConfig = {
    duration: 2000,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    separator: ",",
  };

  return {
    isVisible,
    typewriterConfig,
    textRevealConfig,
    counterConfig,
  };
}

export default useTypography;
