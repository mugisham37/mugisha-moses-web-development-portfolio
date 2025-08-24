"use client";

import React, { useState } from "react";
import {
  ThemeRenderer,
  ConditionalThemeRenderer,
  MultiThemeRenderer,
  withTheme,
  withCurrentTheme,
  withThemeStyles,
  useTheme,
  useThemeVariables,
  useThemeClassName,
  useThemeStyles,
  useThemeCondition,
  useThemeAnimation,
  useThemeTransitionUtils,
  createThemeCSSUtils,
  type WithThemeProps,
  type ThemeType,
} from "./index";

// Example component using ThemeRenderer
const ThemeRendererExample: React.FC = () => (
  <div className="demo-section">
    <h3>ThemeRenderer Example</h3>
    <ThemeRenderer>
      {(theme, config) => (
        <div
          style={{
            padding: "16px",
            backgroundColor: config.colors.bg,
            color: config.colors.text,
            border: `${config.borders.width} ${config.borders.style} ${config.colors.accent}`,
            borderRadius: config.borders.radius || "0px",
          }}
        >
          Current theme: <strong>{theme}</strong>
          <br />
          Primary color: <strong>{config.colors.primary}</strong>
        </div>
      )}
    </ThemeRenderer>
  </div>
);

// Example component using ConditionalThemeRenderer
const ConditionalRendererExample: React.FC = () => (
  <div className="demo-section">
    <h3>ConditionalThemeRenderer Example</h3>
    <ConditionalThemeRenderer theme="extreme-brutalist">
      <div style={{ color: "red", fontWeight: "bold" }}>
        🔥 This only shows in EXTREME BRUTALIST theme!
      </div>
    </ConditionalThemeRenderer>
    <ConditionalThemeRenderer theme="refined-brutalist">
      <div style={{ color: "purple", fontStyle: "italic" }}>
        ✨ This only shows in REFINED BRUTALIST theme!
      </div>
    </ConditionalThemeRenderer>
  </div>
);

// Example component using MultiThemeRenderer
const MultiRendererExample: React.FC = () => (
  <div className="demo-section">
    <h3>MultiThemeRenderer Example</h3>
    <MultiThemeRenderer
      extreme={
        <div
          style={{
            backgroundColor: "#ffff00",
            color: "#000",
            padding: "8px",
            border: "4px solid #000",
            fontFamily: "monospace",
            textTransform: "uppercase",
          }}
        >
          EXTREME BRUTALIST CONTENT
        </div>
      }
      refined={
        <div
          style={{
            backgroundColor: "#8b5cf6",
            color: "#fff",
            padding: "16px",
            borderRadius: "8px",
            fontFamily: "sans-serif",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          Refined Brutalist Content
        </div>
      }
    />
  </div>
);

// Example component using hooks
const HooksExample: React.FC = () => {
  const { currentTheme, setTheme, isTransitioning } = useTheme();
  const themeVariables = useThemeVariables();
  const className = useThemeClassName("demo-card", {
    "extreme-brutalist": "demo-card--extreme",
    "refined-brutalist": "demo-card--refined",
  });
  const styles = useThemeStyles(
    { padding: "16px", margin: "8px 0" },
    {
      "extreme-brutalist": {
        backgroundColor: "#ffff00",
        color: "#000",
        border: "4px solid #000",
      },
      "refined-brutalist": {
        backgroundColor: "#f8fafc",
        color: "#1e293b",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      },
    }
  );
  const { isExtreme, isRefined } = useThemeCondition("extreme-brutalist");
  const pulseAnimation = useThemeAnimation("pulse");
  const { toggleTheme, transitionProgress } = useThemeTransitionUtils();

  return (
    <div className="demo-section">
      <h3>Hooks Example</h3>
      <div className={className} style={styles}>
        <p>
          Current theme: <strong>{currentTheme}</strong>
        </p>
        <p>
          Is transitioning: <strong>{isTransitioning ? "Yes" : "No"}</strong>
        </p>
        <p>
          Transition progress:{" "}
          <strong>{Math.round(transitionProgress * 100)}%</strong>
        </p>
        <p>
          Is extreme theme: <strong>{isExtreme ? "Yes" : "No"}</strong>
        </p>
        <p>
          Is refined theme: <strong>{isRefined ? "Yes" : "No"}</strong>
        </p>

        <button
          onClick={toggleTheme}
          style={{
            ...pulseAnimation,
            padding: "8px 16px",
            margin: "8px 0",
            backgroundColor: "var(--theme-accent)",
            color: "var(--theme-bg)",
            border:
              "var(--theme-border-width) var(--theme-border-style) var(--theme-text)",
            borderRadius: "var(--theme-border-radius)",
            cursor: "pointer",
          }}
        >
          Toggle Theme
        </button>
      </div>
    </div>
  );
};

// Example component using withTheme HOC
interface BasicComponentProps {
  title: string;
}

const BasicComponent: React.FC<BasicComponentProps & WithThemeProps> = ({
  title,
  theme,
  themeConfig,
  isTransitioning,
}) => {
  const cssUtils = createThemeCSSUtils(theme, themeConfig);
  const buttonStyles = cssUtils.getBrutalButtonStyles("primary");
  const cardStyles = cssUtils.getBrutalCardStyles();

  return (
    <div style={cardStyles}>
      <h4>{title}</h4>
      <p>Theme: {theme}</p>
      <p>Transitioning: {isTransitioning ? "Yes" : "No"}</p>
      <button style={buttonStyles}>Themed Button</button>
    </div>
  );
};

const EnhancedComponent = withTheme(BasicComponent);

// Example component using withCurrentTheme HOC
interface SimpleComponentProps {
  message: string;
  currentTheme: ThemeType;
}

const SimpleComponent: React.FC<SimpleComponentProps> = ({
  message,
  currentTheme,
}) => (
  <div
    style={{
      padding: "8px",
      backgroundColor:
        currentTheme === "extreme-brutalist" ? "#ffff00" : "#e2e8f0",
      color: currentTheme === "extreme-brutalist" ? "#000" : "#334155",
    }}
  >
    {message} (Theme: {currentTheme})
  </div>
);

const SimpleEnhancedComponent = withCurrentTheme(SimpleComponent);

// Example component using withThemeStyles HOC
const StyledComponent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div>{children}</div>;

const ThemedStyledComponent = withThemeStyles(
  StyledComponent,
  (theme, config) => ({
    padding: "16px",
    backgroundColor: config.colors.bg,
    color: config.colors.text,
    border: `2px solid ${config.colors.accent}`,
    borderRadius: config.borders.radius || "0px",
    fontFamily: config.typography.primary,
  })
);

// Main demo component
export const ThemeUtilsDemo: React.FC = () => {
  const [showDemo, setShowDemo] = useState(false);

  if (!showDemo) {
    return (
      <div style={{ padding: "20px" }}>
        <button
          onClick={() => setShowDemo(true)}
          style={{
            padding: "12px 24px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Show Theme Utils Demo
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Theme Utilities Demo</h2>
      <p>This demo showcases all the theme-aware component utilities.</p>

      <button
        onClick={() => setShowDemo(false)}
        style={{
          padding: "8px 16px",
          backgroundColor: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Hide Demo
      </button>

      <ThemeRendererExample />
      <ConditionalRendererExample />
      <MultiRendererExample />
      <HooksExample />

      <div className="demo-section">
        <h3>withTheme HOC Example</h3>
        <EnhancedComponent title="Enhanced with withTheme" />
      </div>

      <div className="demo-section">
        <h3>withCurrentTheme HOC Example</h3>
        <SimpleEnhancedComponent message="Simple theme-aware component" />
      </div>

      <div className="demo-section">
        <h3>withThemeStyles HOC Example</h3>
        <ThemedStyledComponent>
          This component has automatic theme-aware styling applied via HOC.
        </ThemedStyledComponent>
      </div>

      <style jsx>{`
        .demo-section {
          margin: 20px 0;
          padding: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background-color: #f8fafc;
        }

        .demo-section h3 {
          margin-top: 0;
          color: #1e293b;
        }

        .demo-card {
          transition: all 0.3s ease;
        }

        .demo-card--extreme {
          transform: rotate(-1deg);
        }

        .demo-card--refined {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};
