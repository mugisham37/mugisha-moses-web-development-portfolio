"use client";

import React, { ComponentType, forwardRef } from "react";
import { ThemeType, ThemeConfig } from "@/types/theme";
import { useThemeContext } from "@/contexts/ThemeContext";

// Enhanced theme props interface
export interface WithThemeProps {
  theme: ThemeType;
  themeConfig: ThemeConfig;
  isTransitioning: boolean;
  transitionProgress: number;
  setTheme: (theme: ThemeType) => void;
}

// HOC options interface
interface WithThemeOptions {
  forwardRef?: boolean;
  displayName?: string;
  injectThemeProps?: boolean;
}

// Higher-order component for automatic theme injection
export function withTheme<P extends object>(
  Component: ComponentType<P & WithThemeProps>,
  options: WithThemeOptions = {}
) {
  const {
    forwardRef: shouldForwardRef = false,
    displayName,
    injectThemeProps = true,
  } = options;

  if (shouldForwardRef) {
    const ForwardedComponent = forwardRef<any, P>((props, ref) => {
      const themeContext = useThemeContext();

      const enhancedProps = injectThemeProps
        ? {
            ...props,
            theme: themeContext.currentTheme,
            themeConfig: themeContext.config,
            isTransitioning: themeContext.isTransitioning,
            transitionProgress: themeContext.transitionProgress,
            setTheme: themeContext.setTheme,
            ref,
          }
        : { ...props, ref };

      return <Component {...(enhancedProps as P & WithThemeProps)} />;
    });

    ForwardedComponent.displayName =
      displayName || `withTheme(${Component.displayName || Component.name})`;

    return ForwardedComponent;
  } else {
    const WrappedComponent = (props: P) => {
      const themeContext = useThemeContext();

      const enhancedProps = injectThemeProps
        ? {
            ...props,
            theme: themeContext.currentTheme,
            themeConfig: themeContext.config,
            isTransitioning: themeContext.isTransitioning,
            transitionProgress: themeContext.transitionProgress,
            setTheme: themeContext.setTheme,
          }
        : props;

      return <Component {...(enhancedProps as P & WithThemeProps)} />;
    };

    WrappedComponent.displayName =
      displayName || `withTheme(${Component.displayName || Component.name})`;

    return WrappedComponent;
  }
}

// Simplified HOC that only injects current theme
export function withCurrentTheme<P extends object>(
  Component: ComponentType<P & { currentTheme: ThemeType }>
): ComponentType<Omit<P, "currentTheme">> {
  const WrappedComponent = (props: Omit<P, "currentTheme">) => {
    const { currentTheme } = useThemeContext();
    return <Component {...(props as P)} currentTheme={currentTheme} />;
  };

  WrappedComponent.displayName = `withCurrentTheme(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}

// HOC for theme-aware styling
export function withThemeStyles<P extends object>(
  Component: ComponentType<P>,
  getThemeStyles: (theme: ThemeType, config: ThemeConfig) => React.CSSProperties
) {
  const WrappedComponent = (props: P & { style?: React.CSSProperties }) => {
    const { currentTheme, config } = useThemeContext();
    const themeStyles = getThemeStyles(currentTheme, config);

    const combinedStyles = {
      ...themeStyles,
      ...props.style,
    };

    return <Component {...props} style={combinedStyles} />;
  };

  WrappedComponent.displayName = `withThemeStyles(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}

// HOC for theme transition awareness
export function withThemeTransition<P extends object>(
  Component: ComponentType<
    P & { isTransitioning: boolean; transitionProgress: number }
  >
) {
  const WrappedComponent = (props: P) => {
    const { isTransitioning, transitionProgress } = useThemeContext();
    return (
      <Component
        {...props}
        isTransitioning={isTransitioning}
        transitionProgress={transitionProgress}
      />
    );
  };

  WrappedComponent.displayName = `withThemeTransition(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}
