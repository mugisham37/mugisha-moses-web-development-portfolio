# AI Builder Prompt: Transform HTML Portfolio to Next.js Dual-Theme Architecture

## MISSION STATEMENT

You are tasked with transforming an existing HTML/CSS/JS brutalist portfolio into a high-performance Next.js 14 application with a sophisticated dual-theme architecture. This project features seamless transitions between **Extreme Brutalist** (raw, aggressive) and **Refined Brutalist** (professional, polished) themes.

## TRANSFORMATION OBJECTIVES

1. **Preserve Design DNA**: Maintain the brutal aesthetic while enhancing with modern React patterns
2. **Implement Dual Themes**: Create intelligent theme switching based on scroll position and section context
3. **Optimize Performance**: Leverage Next.js features for maximum speed and SEO
4. **Enhance Interactivity**: Add sophisticated animations and user interactions
5. **Ensure Scalability**: Build a maintainable, type-safe codebase

## EXECUTIVE SUMMARY

This document provides a comprehensive blueprint for transforming existing HTML portfolio components into a sophisticated Next.js application featuring a dual-theme architecture that seamlessly transitions from **Extreme Brutalist** (navigation/hero) to **Refined Brutalist** (social proof/results) sections.

## Current Design Analysis

### Theme Classification

#### **Extreme Brutalist Theme** (Navigation & Hero)

- **Visual Characteristics:**
  - Harsh geometric borders (8px solid borders)
  - High contrast black/white/yellow color scheme
  - Aggressive animations and glitch effects
  - Terminal-inspired typography (Space Mono, JetBrains Mono)
  - Multiple layered shadows and strikes
  - Raw, unpolished aesthetic with intentional roughness

- **Technical Implementation:**
  - Heavy use of CSS transforms and keyframe animations
  - Multiple pseudo-elements for layered effects
  - Particle systems and dynamic backgrounds
  - Aggressive hover states and interactions

#### **Refined Brutalist Theme** (Social Proof & Results)

- **Visual Characteristics:**
  - Softer geometric elements with rounded corners
  - Gradient backgrounds and subtle color transitions
  - More sophisticated color palette (cyan, purple accents)
  - Cleaner typography hierarchy
  - Professional card-based layouts
  - Maintained brutalist DNA but business-appropriate

- **Technical Implementation:**
  - Smoother animations and transitions
  - Grid-based layouts with better spacing
  - More subtle background effects
  - Professional interaction patterns

## Next.js Architecture Strategy

## DETAILED PROJECT ARCHITECTURE

### 1. Complete Project Structure

```
portfolio-nextjs/
├── src/
│   ├── app/
│   │   ├── globals.css                    # Global styles and CSS variables
│   │   ├── layout.tsx                     # Root layout with theme providers
│   │   ├── page.tsx                       # Main portfolio page
│   │   ├── loading.tsx                    # Loading UI
│   │   ├── not-found.tsx                  # 404 page
│   │   └── metadata.ts                    # SEO metadata configuration
│   ├── components/
│   │   ├── theme/
│   │   │   ├── ThemeProvider.tsx          # Main theme context provider
│   │   │   ├── ThemeTransition.tsx        # Smooth theme transition component
│   │   │   ├── ThemeDetector.tsx          # Scroll-based theme detection
│   │   │   └── BrutalistElements.tsx      # Shared brutalist UI elements
│   │   ├── sections/
│   │   │   ├── Navigation/
│   │   │   │   ├── Navigation.tsx         # Main navigation component
│   │   │   │   ├── Navigation.module.css  # Navigation-specific styles
│   │   │   │   ├── NavigationLogo.tsx     # Logo component
│   │   │   │   ├── NavigationMenu.tsx     # Menu items component
│   │   │   │   ├── NavigationCTA.tsx      # CTA button component
│   │   │   │   └── MobileMenu.tsx         # Mobile navigation
│   │   │   ├── Hero/
│   │   │   │   ├── Hero.tsx               # Hero section container
│   │   │   │   ├── Hero.module.css        # Hero-specific styles
│   │   │   │   ├── HeroContent.tsx        # Text content and CTAs
│   │   │   │   ├── HeroVisual.tsx         # Portrait and visual elements
│   │   │   │   ├── HeroMetrics.tsx        # Impact metrics display
│   │   │   │   ├── HeroEffects.tsx        # Particle systems and animations
│   │   │   │   └── TypewriterText.tsx     # Animated typewriter effect
│   │   │   ├── SocialProof/
│   │   │   │   ├── SocialProof.tsx        # Social proof container
│   │   │   │   ├── SocialProof.module.css # Social proof styles
│   │   │   │   ├── ClientLogos.tsx        # Client logo carousel
│   │   │   │   ├── LinkedInRecommendations.tsx # LinkedIn testimonials
│   │   │   │   ├── CommunityContributions.tsx  # Open source contributions
│   │   │   │   ├── SpeakingEvents.tsx     # Speaking engagements
│   │   │   │   └── IndustryRecognition.tsx # Awards and recognition
│   │   │   ├── Results/
│   │   │   │   ├── Results.tsx            # Results section container
│   │   │   │   ├── Results.module.css     # Results-specific styles
│   │   │   │   ├── MetricsCounter.tsx     # Animated counter component
│   │   │   │   ├── ComparisonShowcase.tsx # Before/after comparisons
│   │   │   │   ├── RevenueDashboard.tsx   # Revenue impact display
│   │   │   │   ├── AchievementTimeline.tsx # Timeline of achievements
│   │   │   │   └── ResultsCTA.tsx         # Results call-to-action
│   │   │   ├── TechCapabilities/
│   │   │   │   ├── TechCapabilities.tsx   # Tech stack showcase
│   │   │   │   ├── TechCapabilities.module.css
│   │   │   │   ├── TechGrid.tsx           # Technology grid
│   │   │   │   ├── SkillMetrics.tsx       # Skill level indicators
│   │   │   │   └── CertificationBadges.tsx # Professional certifications
│   │   │   ├── ProjectShowcase/
│   │   │   │   ├── ProjectShowcase.tsx    # Project portfolio
│   │   │   │   ├── ProjectShowcase.module.css
│   │   │   │   ├── ProjectCard.tsx        # Individual project cards
│   │   │   │   ├── ProjectFilters.tsx     # Technology filters
│   │   │   │   └── ProjectModal.tsx       # Detailed project view
│   │   │   ├── ContactHub/
│   │   │   │   ├── ContactHub.tsx         # Contact section
│   │   │   │   ├── ContactHub.module.css
│   │   │   │   ├── ContactForm.tsx        # Contact form
│   │   │   │   ├── ContactInfo.tsx        # Contact information
│   │   │   │   └── SocialLinks.tsx        # Social media links
│   │   │   └── Footer/
│   │   │       ├── Footer.tsx             # Footer component
│   │   │       ├── Footer.module.css
│   │   │       └── FooterLinks.tsx        # Footer navigation
│   │   ├── ui/
│   │   │   ├── BrutalButton/
│   │   │   │   ├── BrutalButton.tsx       # Themed button component
│   │   │   │   ├── BrutalButton.module.css
│   │   │   │   └── ButtonVariants.tsx     # Button style variants
│   │   │   ├── BrutalCard/
│   │   │   │   ├── BrutalCard.tsx         # Themed card component
│   │   │   │   ├── BrutalCard.module.css
│   │   │   │   └── CardAnimations.tsx     # Card hover effects
│   │   │   ├── AnimatedText/
│   │   │   │   ├── AnimatedText.tsx       # Text animation component
│   │   │   │   ├── AnimatedText.module.css
│   │   │   │   ├── TypewriterEffect.tsx   # Typewriter animation
│   │   │   │   └── GlitchText.tsx         # Glitch text effect
│   │   │   ├── BrutalInput/
│   │   │   │   ├── BrutalInput.tsx        # Themed form inputs
│   │   │   │   └── BrutalInput.module.css
│   │   │   ├── LoadingSpinner/
│   │   │   │   ├── LoadingSpinner.tsx     # Brutalist loading animation
│   │   │   │   └── LoadingSpinner.module.css
│   │   │   └── Modal/
│   │   │       ├── Modal.tsx              # Themed modal component
│   │   │       └── Modal.module.css
│   │   ├── effects/
│   │   │   ├── ParticleSystem.tsx         # Particle background effects
│   │   │   ├── GridBackground.tsx         # Animated grid backgrounds
│   │   │   ├── GlitchEffect.tsx           # Glitch visual effects
│   │   │   ├── ScanLines.tsx              # Terminal scan line effects
│   │   │   ├── NoiseTexture.tsx           # Noise texture overlays
│   │   │   └── CursorTrail.tsx            # Custom cursor effects
│   │   └── layout/
│   │       ├── PageTransition.tsx         # Page transition animations
│   │       ├── ScrollProgress.tsx         # Scroll progress indicator
│   │       └── ViewportDetector.tsx       # Viewport-based animations
│   ├── hooks/
│   │   ├── useTheme.ts                    # Theme context hook
│   │   ├── useThemeTransition.ts          # Theme transition logic
│   │   ├── useScrollProgress.ts           # Scroll position tracking
│   │   ├── useIntersectionObserver.ts     # Element visibility detection
│   │   ├── useAnimatedCounter.ts          # Counter animation hook
│   │   ├── useParallax.ts                 # Parallax scroll effects
│   │   ├── useLocalStorage.ts             # Local storage management
│   │   ├── useMediaQuery.ts               # Responsive breakpoint detection
│   │   ├── useKeyboardShortcuts.ts        # Keyboard navigation
│   │   └── usePerformanceMonitor.ts       # Performance tracking
│   ├── contexts/
│   │   ├── ThemeContext.tsx               # Theme state management
│   │   ├── AnimationContext.tsx           # Animation preferences
│   │   └── PerformanceContext.tsx         # Performance settings
│   ├── styles/
│   │   ├── themes/
│   │   │   ├── extreme-brutalist.css      # Extreme theme styles
│   │   │   ├── refined-brutalist.css      # Refined theme styles
│   │   │   ├── theme-variables.css        # CSS custom properties
│   │   │   └── theme-transitions.css      # Theme transition animations
│   │   ├── animations/
│   │   │   ├── brutalist-keyframes.css    # Brutalist animations
│   │   │   ├── transition-effects.css     # Smooth transitions
│   │   │   ├── hover-effects.css          # Interactive hover states
│   │   │   └── loading-animations.css     # Loading state animations
│   │   ├── components/
│   │   │   ├── navigation.css             # Navigation-specific styles
│   │   │   ├── hero.css                   # Hero section styles
│   │   │   ├── social-proof.css           # Social proof styles
│   │   │   └── results.css                # Results section styles
│   │   └── utilities/
│   │       ├── typography.css             # Typography utilities
│   │       ├── spacing.css                # Spacing utilities
│   │       ├── colors.css                 # Color utilities
│   │       └── responsive.css             # Responsive utilities
│   ├── utils/
│   │   ├── theme-detector.ts              # Theme detection logic
│   │   ├── animation-helpers.ts           # Animation utility functions
│   │   ├── performance-utils.ts           # Performance optimization
│   │   ├── seo-helpers.ts                 # SEO utility functions
│   │   ├── form-validation.ts             # Form validation logic
│   │   ├── image-optimization.ts          # Image handling utilities
│   │   └── analytics.ts                   # Analytics integration
│   ├── types/
│   │   ├── theme.ts                       # Theme type definitions
│   │   ├── components.ts                  # Component prop types
│   │   ├── animations.ts                  # Animation type definitions
│   │   └── api.ts                         # API response types
│   ├── constants/
│   │   ├── themes.ts                      # Theme configuration constants
│   │   ├── animations.ts                  # Animation configuration
│   │   ├── breakpoints.ts                 # Responsive breakpoints
│   │   └── seo.ts                         # SEO constants
│   └── data/
│       ├── portfolio.ts                   # Portfolio content data
│       ├── testimonials.ts                # Testimonial data
│       ├── projects.ts                    # Project data
│       └── skills.ts                      # Skills and technologies
├── public/
│   ├── images/
│   │   ├── hero/                          # Hero section images
│   │   ├── projects/                      # Project screenshots
│   │   ├── testimonials/                  # Testimonial photos
│   │   ├── logos/                         # Client logos
│   │   └── icons/                         # UI icons
│   ├── fonts/                             # Custom fonts
│   ├── favicon.ico                        # Favicon
│   ├── manifest.json                      # PWA manifest
│   └── robots.txt                         # SEO robots file
├── docs/
│   ├── COMPONENT_GUIDE.md                 # Component usage guide
│   ├── THEME_SYSTEM.md                    # Theme system documentation
│   └── DEPLOYMENT.md                      # Deployment instructions
├── .env.local                             # Environment variables
├── .env.example                           # Environment variables template
├── next.config.js                         # Next.js configuration
├── tailwind.config.js                     # Tailwind CSS configuration
├── tsconfig.json                          # TypeScript configuration
├── package.json                           # Dependencies and scripts
└── README.md                              # Project documentation
```

## COMPONENT DESIGN STRATEGIES

### 2. Theme-Aware Component Architecture

#### **Strategy 1: Single Components with Theme Adaptation (RECOMMENDED)**

Create components that intelligently adapt to both themes using CSS custom properties and conditional styling:

```typescript
// components/sections/Navigation/Navigation.tsx
interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const { currentTheme, config } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`
        navigation
        navigation--${currentTheme}
        ${isScrolled ? "navigation--scrolled" : ""}
        ${className || ""}
      `}
      style={
        {
          "--nav-bg": config.colors.bg,
          "--nav-text": config.colors.text,
          "--nav-accent": config.colors.accent,
          "--nav-border-width": config.borders.width,
          "--nav-shadow": config.shadows.brutal || config.shadows.subtle,
          "--nav-transition": `${config.animations.duration} ${config.animations.easing}`,
        } as CSSProperties
      }
    >
      <div className="navigation__container">
        <NavigationLogo theme={currentTheme} />
        <NavigationMenu theme={currentTheme} />
        <NavigationCTA theme={currentTheme} />
      </div>
    </nav>
  );
};
```

#### **Strategy 2: Compound Component Pattern**

For complex sections with multiple sub-components:

```typescript
// components/sections/Hero/Hero.tsx
const Hero = {
  Container: ({
    children,
    theme,
  }: {
    children: React.ReactNode;
    theme: ThemeType;
  }) => (
    <section className={`hero hero--${theme}`}>
      <div className="hero__background">
        <ParticleSystem theme={theme} />
        <GridBackground theme={theme} />
      </div>
      {children}
    </section>
  ),

  Content: ({
    children,
    theme,
  }: {
    children: React.ReactNode;
    theme: ThemeType;
  }) => (
    <div className={`hero__content hero__content--${theme}`}>{children}</div>
  ),

  Title: ({
    children,
    theme,
  }: {
    children: React.ReactNode;
    theme: ThemeType;
  }) => <h1 className={`hero__title hero__title--${theme}`}>{children}</h1>,

  Metrics: ({
    metrics,
    theme,
  }: {
    metrics: MetricData[];
    theme: ThemeType;
  }) => (
    <div className={`hero__metrics hero__metrics--${theme}`}>
      {metrics.map((metric, index) => (
        <div key={index} className="hero__metric">
          <span className="hero__metric-number">{metric.value}</span>
          <span className="hero__metric-label">{metric.label}</span>
        </div>
      ))}
    </div>
  ),

  Actions: ({
    children,
    theme,
  }: {
    children: React.ReactNode;
    theme: ThemeType;
  }) => (
    <div className={`hero__actions hero__actions--${theme}`}>{children}</div>
  ),
};

// Usage
const HeroSection = () => {
  const { currentTheme } = useTheme();

  return (
    <Hero.Container theme={currentTheme}>
      <Hero.Content theme={currentTheme}>
        <Hero.Title theme={currentTheme}>FULL-STACK DEVELOPER</Hero.Title>
        <Hero.Metrics metrics={impactMetrics} theme={currentTheme} />
        <Hero.Actions theme={currentTheme}>
          <BrutalButton variant="primary" theme={currentTheme}>
            START PROJECT
          </BrutalButton>
        </Hero.Actions>
      </Hero.Content>
    </Hero.Container>
  );
};
```

#### **Strategy 3: Theme-Specific Variants with Shared Logic**

For components with drastically different layouts:

```typescript
// components/ui/BrutalButton/BrutalButton.tsx
interface BrutalButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  theme?: ThemeType;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const BrutalButton: React.FC<BrutalButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  theme,
  onClick,
  disabled = false,
  className,
}) => {
  const { currentTheme, config } = useTheme();
  const activeTheme = theme || currentTheme;

  const baseClasses = "brutal-button";
  const themeClasses = `brutal-button--${activeTheme}`;
  const variantClasses = `brutal-button--${variant}`;
  const sizeClasses = `brutal-button--${size}`;
  const stateClasses = disabled ? "brutal-button--disabled" : "";

  const buttonClasses = [
    baseClasses,
    themeClasses,
    variantClasses,
    sizeClasses,
    stateClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      style={
        {
          "--button-bg":
            variant === "primary" ? config.colors.accent : "transparent",
          "--button-text":
            variant === "primary" ? config.colors.bg : config.colors.text,
          "--button-border": `${config.borders.width} ${config.borders.style} ${config.colors.text}`,
          "--button-shadow": config.shadows.brutal || config.shadows.subtle,
          "--button-transition": `${config.animations.duration} ${config.animations.easing}`,
        } as CSSProperties
      }
    >
      <span className="brutal-button__text">{children}</span>
      <div className="brutal-button__effects">
        <div className="brutal-button__shadow"></div>
        <div className="brutal-button__border"></div>
        <div className="brutal-button__shimmer"></div>
      </div>
    </button>
  );
};
```

### 3. Advanced Component Patterns

#### **Higher-Order Component for Theme Injection**

```typescript
// utils/withTheme.tsx
function withTheme<P extends object>(
  Component: React.ComponentType<P & { theme: ThemeType; config: ThemeConfig }>
) {
  return function ThemedComponent(props: P) {
    const { currentTheme, config } = useTheme();

    return <Component {...props} theme={currentTheme} config={config} />;
  };
}

// Usage
const ThemedNavigation = withTheme(Navigation);
```

#### **Render Props Pattern for Theme-Aware Components**

```typescript
// components/theme/ThemeRenderer.tsx
interface ThemeRendererProps {
  children: (theme: ThemeType, config: ThemeConfig) => React.ReactNode;
}

const ThemeRenderer: React.FC<ThemeRendererProps> = ({ children }) => {
  const { currentTheme, config } = useTheme();
  return <>{children(currentTheme, config)}</>;
};

// Usage
<ThemeRenderer>
  {(theme, config) => (
    <div
      className={`card card--${theme}`}
      style={{
        "--card-bg": config.colors.bg,
        "--card-border": `${config.borders.width} solid ${config.colors.accent}`,
      }}
    >
      Content
    </div>
  )}
</ThemeRenderer>;
```

### 4. Dual Theme System Implementation

#### Theme Provider Architecture

```typescript
// src/components/theme/ThemeProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ThemeType = "extreme-brutalist" | "refined-brutalist";

interface ThemeContextType {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] =
    useState<ThemeType>("extreme-brutalist");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const setTheme = (theme: ThemeType) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentTheme(theme);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, isTransitioning }}>
      <div
        className={`theme-${currentTheme} ${
          isTransitioning ? "theme-transitioning" : ""
        }`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
```

#### Scroll-Based Theme Transition Hook

```typescript
// src/hooks/useThemeTransition.ts
import { useEffect } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useScrollProgress } from "./useScrollProgress";

export function useThemeTransition() {
  const { setTheme } = useTheme();
  const scrollProgress = useScrollProgress();

  useEffect(() => {
    // Transition from extreme to refined brutalist at 40% scroll
    if (scrollProgress > 0.4) {
      setTheme("refined-brutalist");
    } else {
      setTheme("extreme-brutalist");
    }
  }, [scrollProgress, setTheme]);
}
```

### 3. Component Architecture

#### Navigation Component (Extreme Brutalist)

```typescript
// src/components/sections/Navigation/Navigation.tsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import styles from "./Navigation.module.css";

export function Navigation() {
  const { currentTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`${styles.brutalistNav} ${isScrolled ? styles.scrolled : ""}`}
    >
      <div className={styles.navContainer}>
        <div className={styles.logoSection}>
          <div className={styles.logoBlock}>
            <span className={styles.logoText}>DEV</span>
            <div className={styles.logoBorder}></div>
            <div className={styles.logoGlow}></div>
          </div>
        </div>

        <div className={styles.navMenu}>
          {["HOME", "PROJECTS", "STACK", "GITHUB", "RESULTS"].map((item) => (
            <div key={item} className={styles.navItem}>
              <span className={styles.navText}>{item}</span>
              <div className={styles.navUnderline}></div>
              <div className={styles.navGlitch}></div>
            </div>
          ))}
        </div>

        <button className={styles.brutalButton}>
          <span className={styles.buttonText}>START PROJECT</span>
          <div className={styles.buttonShimmer}></div>
        </button>
      </div>
    </nav>
  );
}
```

#### Social Proof Component (Refined Brutalist)

```typescript
// src/components/sections/SocialProof/SocialProof.tsx
"use client";

import { useEffect, useRef } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import styles from "./SocialProof.module.css";

interface Recommendation {
  id: string;
  name: string;
  title: string;
  company: string;
  content: string;
  profileImage: string;
  linkedinUrl: string;
}

export function SocialProof() {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.3 });

  const recommendations: Recommendation[] = [
    {
      id: "1",
      name: "Sarah Chen",
      title: "CTO",
      company: "TechFlow Solutions",
      content:
        "Exceptional developer who delivered our complex e-commerce platform 2 weeks ahead of schedule...",
      profileImage: "/images/testimonials/sarah-chen.jpg",
      linkedinUrl: "#",
    },
    // ... more recommendations
  ];

  return (
    <section
      ref={sectionRef}
      className={`${styles.socialProofSection} ${
        isVisible ? styles.visible : ""
      }`}
    >
      <div className={styles.socialProofBackground}>
        <div className={styles.networkParticles}></div>
        <div className={styles.trustGrid}></div>
      </div>

      <div className={styles.socialProofContainer}>
        <div className={styles.socialProofHeader}>
          <h2 className={styles.socialProofTitle}>
            INDUSTRY RECOGNITION & SOCIAL PROOF
          </h2>
          <div className={styles.socialProofSubtitle}>
            Validated by industry leaders, trusted by global brands
          </div>
        </div>

        <div className={styles.recommendationsGrid}>
          {recommendations.map((rec) => (
            <div key={rec.id} className={styles.recommendationCard}>
              <div className={styles.cardHeader}>
                <img src={rec.profileImage} alt={rec.name} />
                <div className={styles.profileInfo}>
                  <div className={styles.profileName}>{rec.name}</div>
                  <div className={styles.profileTitle}>
                    {rec.title} at {rec.company}
                  </div>
                </div>
              </div>
              <p className={styles.recommendationText}>{rec.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 4. CSS Architecture & Theme Variables

#### Theme Variables System

```css
/* src/styles/themes/theme-variables.css */
:root {
  /* Extreme Brutalist Theme */
  --extreme-primary-black: #000000;
  --extreme-primary-white: #ffffff;
  --extreme-accent-yellow: #ffff00;
  --extreme-accent-cyan: #00ffff;
  --extreme-brutal-shadow: 8px 8px 0;
  --extreme-brutal-border: 6px solid;
  --extreme-font-mono: "Space Mono", monospace;
  --extreme-font-code: "JetBrains Mono", monospace;

  /* Refined Brutalist Theme */
  --refined-primary-dark: #1a1a1a;
  --refined-primary-light: #f5f5f5;
  --refined-accent-purple: #8b5cf6;
  --refined-accent-cyan: #06b6d4;
  --refined-subtle-shadow: 4px 4px 12px rgba(0, 0, 0, 0.3);
  --refined-soft-border: 2px solid;
  --refined-border-radius: 8px;

  /* Transition Properties */
  --theme-transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Theme Classes */
.theme-extreme-brutalist {
  --current-bg: var(--extreme-primary-black);
  --current-text: var(--extreme-primary-white);
  --current-accent: var(--extreme-accent-yellow);
  --current-shadow: var(--extreme-brutal-shadow);
  --current-border: var(--extreme-brutal-border);
  --current-font: var(--extreme-font-mono);
}

.theme-refined-brutalist {
  --current-bg: var(--refined-primary-dark);
  --current-text: var(--refined-primary-light);
  --current-accent: var(--refined-accent-purple);
  --current-shadow: var(--refined-subtle-shadow);
  --current-border: var(--refined-soft-border);
  --current-font: var(--refined-font-sans);
}
```

#### Component-Specific Styling

```css
/* src/components/sections/Navigation/Navigation.module.css */
.brutalistNav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: var(--current-bg);
  border-bottom: var(--current-border) var(--current-text);
  z-index: 1000;
  transition: var(--theme-transition);
  box-shadow:
    0 8px 0 var(--current-accent),
    0 16px 0 var(--current-text);
}

.theme-extreme-brutalist .brutalistNav {
  box-shadow:
    0 8px 0 var(--extreme-accent-yellow),
    0 16px 0 var(--extreme-primary-white);
}

.theme-refined-brutalist .brutalistNav {
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.3),
    0 1px 0 var(--refined-accent-purple);
  border-radius: 0 0 var(--refined-border-radius) var(--refined-border-radius);
}

.logoBlock {
  position: relative;
  cursor: pointer;
  border: var(--current-border) var(--current-text);
  padding: 0.75rem 1.5rem;
  background: var(--current-bg);
  transition: var(--theme-transition);
}

.theme-extreme-brutalist .logoBlock:hover {
  transform: translate(-4px, -4px);
  box-shadow: 4px 4px 0 var(--extreme-accent-yellow);
}

.theme-refined-brutalist .logoBlock:hover {
  transform: translateY(-2px);
  box-shadow: var(--refined-subtle-shadow);
}
```

### 5. Next.js Optimization Features

#### SEO Optimization

```typescript
// src/app/layout.tsx
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Full-Stack Developer | React & Node.js Expert",
  description:
    "Experienced full-stack developer specializing in React, Node.js, and cloud architecture. Delivering scalable solutions that drive business results.",
  keywords: [
    "full-stack developer",
    "react developer",
    "node.js",
    "typescript",
    "aws",
  ],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Full-Stack Developer Portfolio",
    description:
      "Building digital experiences that drive million-dollar results",
    images: ["/images/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Full-Stack Developer Portfolio",
    description:
      "Building digital experiences that drive million-dollar results",
    images: ["/images/twitter-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

#### Performance Optimization

```typescript
// src/app/page.tsx
import dynamic from "next/dynamic";
import { Navigation } from "@/components/sections/Navigation/Navigation";
import { Hero } from "@/components/sections/Hero/Hero";

// Lazy load components below the fold
const SocialProof = dynamic(
  () => import("@/components/sections/SocialProof/SocialProof"),
  {
    loading: () => <div className="loading-skeleton">Loading...</div>,
  }
);

const Results = dynamic(() => import("@/components/sections/Results/Results"), {
  loading: () => <div className="loading-skeleton">Loading...</div>,
});

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <SocialProof />
      <Results />
    </main>
  );
}
```

### 6. Animation & Interaction System

#### Scroll-Triggered Animations

```typescript
// src/hooks/useScrollProgress.ts
import { useState, useEffect } from "react";

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / totalHeight;
      setScrollProgress(Math.min(progress, 1));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollProgress;
}
```

#### Theme Transition Component

```typescript
// src/components/theme/ThemeTransition.tsx
"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";
import { useScrollProgress } from "@/hooks/useScrollProgress";

export function ThemeTransition() {
  const { setTheme } = useTheme();
  const scrollProgress = useScrollProgress();
  const transitionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Smooth theme transition based on scroll position
    const thresholds = [
      { progress: 0, theme: "extreme-brutalist" },
      { progress: 0.4, theme: "refined-brutalist" },
    ];

    const currentThreshold = thresholds
      .reverse()
      .find((t) => scrollProgress >= t.progress);

    if (currentThreshold) {
      setTheme(currentThreshold.theme as any);
    }
  }, [scrollProgress, setTheme]);

  return (
    <div
      ref={transitionRef}
      className="theme-transition-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 9999,
        background: `linear-gradient(
          180deg,
          rgba(0, 0, 0, ${Math.max(0, 0.3 - scrollProgress)}) 0%,
          transparent 50%,
          rgba(26, 26, 26, ${Math.max(0, scrollProgress - 0.3)}) 100%
        )`,
      }}
    />
  );
}
```

### 7. Development Workflow

#### Package.json Configuration

```json
{
  "name": "brutalist-portfolio-nextjs",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "framer-motion": "^10.0.0",
    "intersection-observer": "^0.12.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

## Implementation Roadmap

### Phase 1: Foundation (Week 1)

1. Set up Next.js project structure
2. Implement theme provider system
3. Create base component architecture
4. Set up CSS modules and theme variables

### Phase 2: Core Components (Week 2)

1. Build Navigation component with extreme brutalist theme
2. Implement Hero section with animations
3. Create theme transition system
4. Add scroll-based interactions

### Phase 3: Content Sections (Week 3)

1. Build SocialProof component with refined brutalist theme
2. Implement Results section with metrics
3. Add remaining portfolio sections
4. Integrate all components

### Phase 4: Optimization (Week 4)

1. Implement SEO optimizations
2. Add performance monitoring
3. Optimize animations and interactions
4. Final testing and deployment

## Key Benefits of This Architecture

1. **Seamless Theme Transitions**: Smooth visual evolution from extreme to refined brutalism
2. **Performance Optimized**: Lazy loading, code splitting, and optimized animations
3. **SEO Excellence**: Server-side rendering, meta tags, and structured data
4. **Maintainable Code**: Modular components, TypeScript, and clear separation of concerns
5. **Scalable Design System**: Reusable components and consistent theming
6. **Modern Development**: Latest Next.js features, hooks, and best practices

## ADVANCED IMPLEMENTATION TECHNIQUES

### 10. Performance Optimization Strategies

#### **Code Splitting and Lazy Loading**

```typescript
// Lazy load theme-specific components
const ExtremeHero = lazy(
  () => import("./components/sections/Hero/ExtremeHero")
);
const RefinedHero = lazy(
  () => import("./components/sections/Hero/RefinedHero")
);

// Conditional loading based on theme
const HeroSection = () => {
  const { currentTheme } = useTheme();

  return (
    <Suspense fallback={<HeroSkeleton />}>
      {currentTheme === "extreme" ? <ExtremeHero /> : <RefinedHero />}
    </Suspense>
  );
};
```

#### **Image Optimization with Next.js**

```typescript
// components/ui/OptimizedImage.tsx
import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  theme?: ThemeType;
  priority?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  theme,
  priority = false,
}) => {
  const { currentTheme } = useTheme();
  const activeTheme = theme || currentTheme;

  return (
    <div className={`image-container image-container--${activeTheme}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`image image--${activeTheme}`}
      />
    </div>
  );
};
```

### 11. Animation System Architecture

#### **Framer Motion Integration**

```typescript
// components/animations/ThemeTransition.tsx
import { motion, AnimatePresence } from "framer-motion";

const ThemeTransition: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentTheme, isTransitioning } = useTheme();

  const variants = {
    extreme: {
      background: "#000000",
      scale: 1,
      rotate: 0,
      transition: { duration: 0.6, ease: [0.68, -0.55, 0.265, 1.55] },
    },
    refined: {
      background: "#1a1a1a",
      scale: 1.01,
      rotate: 0.5,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <motion.div
      animate={currentTheme}
      variants={variants}
      className="theme-transition-container"
    >
      <AnimatePresence mode="wait">
        {!isTransitioning && (
          <motion.div
            key={currentTheme}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
```

#### **Custom Animation Hooks**

```typescript
// hooks/useAnimatedCounter.ts
export const useAnimatedCounter = (
  end: number,
  duration: number = 2000,
  start: number = 0
) => {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);

  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const startValue = start;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (end - startValue) * easeOutCubic;

      setCount(Math.floor(current));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration, start]);

  return { count, ref };
};
```

### 12. SEO and Metadata Optimization

#### **Dynamic Metadata Generation**

```typescript
// app/metadata.ts
import type { Metadata } from "next";

export const generateMetadata = (theme: ThemeType): Metadata => {
  const baseMetadata = {
    title: "Full-Stack Developer | React & Node.js Expert",
    description:
      "Experienced full-stack developer specializing in React, Node.js, and cloud architecture.",
    keywords: [
      "full-stack developer",
      "react",
      "nodejs",
      "typescript",
      "brutalist design",
    ],
    authors: [{ name: "Your Name" }],
    creator: "Your Name",
    publisher: "Your Name",
    robots: "index, follow",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://yourportfolio.com",
      siteName: "Portfolio",
      images: [
        {
          url: `/images/og-${theme}.jpg`,
          width: 1200,
          height: 630,
          alt: "Portfolio Preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@yourusername",
      images: [`/images/twitter-${theme}.jpg`],
    },
  };

  if (theme === "extreme") {
    return {
      ...baseMetadata,
      title: "Brutal Code Architecture | Full-Stack Developer",
      description:
        "Raw, uncompromising full-stack development. Building digital experiences that break conventions.",
      openGraph: {
        ...baseMetadata.openGraph,
        title: "Brutal Code Architecture",
        description: "Raw, uncompromising full-stack development",
      },
    };
  }

  return {
    ...baseMetadata,
    title: "Professional Development Solutions | Full-Stack Expert",
    description:
      "Enterprise-grade full-stack solutions. Delivering scalable applications that drive business results.",
    openGraph: {
      ...baseMetadata.openGraph,
      title: "Professional Development Solutions",
      description: "Enterprise-grade full-stack solutions",
    },
  };
};
```

### 13. Testing Strategy

#### **Component Testing with Theme Context**

```typescript
// __tests__/components/Navigation.test.tsx
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navigation from "@/components/sections/Navigation/Navigation";

const renderWithTheme = (theme: ThemeType = "extreme") => {
  return render(
    <ThemeProvider initialTheme={theme}>
      <Navigation />
    </ThemeProvider>
  );
};

describe("Navigation Component", () => {
  it("renders with extreme theme styles", () => {
    renderWithTheme("extreme");
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("navigation--extreme");
  });

  it("renders with refined theme styles", () => {
    renderWithTheme("refined");
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("navigation--refined");
  });

  it("transitions between themes smoothly", async () => {
    const { rerender } = renderWithTheme("extreme");

    rerender(
      <ThemeProvider initialTheme="refined">
        <Navigation />
      </ThemeProvider>
    );

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("navigation--refined");
  });
});
```

### 14. Deployment and CI/CD

#### **Next.js Configuration**

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["your-image-domain.com"],
    formats: ["image/webp", "image/avif"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = "all";
    }
    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

## IMPLEMENTATION CHECKLIST

### Phase 1: Foundation Setup ✅

- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Set up project structure according to architecture
- [ ] Install and configure dependencies
- [ ] Create theme system foundation
- [ ] Implement basic routing structure

### Phase 2: Core Components ✅

- [ ] Build theme provider and context
- [ ] Create navigation component with dual themes
- [ ] Implement hero section with animations
- [ ] Add scroll-based theme detection
- [ ] Build reusable UI components (buttons, cards, inputs)

### Phase 3: Content Sections ✅

- [ ] Transform social proof section
- [ ] Build results showcase with metrics
- [ ] Add tech capabilities section
- [ ] Implement project showcase
- [ ] Create contact hub

### Phase 4: Advanced Features ✅

- [ ] Add performance optimizations
- [ ] Implement SEO enhancements
- [ ] Add animation system
- [ ] Create responsive design
- [ ] Add accessibility features

### Phase 5: Testing & Deployment ✅

- [ ] Write component tests
- [ ] Add E2E tests
- [ ] Set up CI/CD pipeline
- [ ] Configure deployment
- [ ] Performance auditing

## SUCCESS METRICS

### Performance Targets

- **Lighthouse Score**: 95+ across all categories
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

### User Experience Goals

- **Theme Transition**: Smooth 600ms transitions
- **Mobile Performance**: 90+ mobile Lighthouse score
- **Accessibility**: WCAG 2.1 AA compliance
- **Cross-browser**: Support for last 2 versions of major browsers

This architecture ensures your portfolio maintains its unique dual-theme brutalist identity while leveraging Next.js's full potential for performance, SEO, and developer experience. The modular approach allows for easy maintenance and future enhancements while preserving the raw aesthetic that makes your portfolio stand out.
