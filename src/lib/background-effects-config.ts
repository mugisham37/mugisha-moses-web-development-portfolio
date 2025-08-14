/**
 * Background Effects Configuration System
 * Manages adaptive configuration for optimal performance and user preferences
 */

export interface BackgroundEffectsSettings {
  // Performance settings
  particleCount: number;
  geometricShapeCount: number;
  animationIntensity: number;

  // Feature toggles
  enableParticleEffects: boolean;
  enableGeometricShapes: boolean;
  enableGridLines: boolean;
  enableParticleTrails: boolean;

  // Visual settings
  colorScheme: "default" | "monochrome" | "accent-heavy";
  particleSize: "small" | "medium" | "large";
  animationSpeed: "slow" | "normal" | "fast";

  // Accessibility
  respectReducedMotion: boolean;
  highContrast: boolean;
}

export interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasHighDPI: boolean;
  supportsWebGL2: boolean;
  estimatedPerformance: "low" | "medium" | "high";
}

export class BackgroundEffectsConfigManager {
  private static instance: BackgroundEffectsConfigManager;
  private deviceCapabilities: DeviceCapabilities;
  private userPreferences: Partial<BackgroundEffectsSettings> = {};

  private constructor() {
    this.deviceCapabilities = this.detectDeviceCapabilities();
  }

  static getInstance(): BackgroundEffectsConfigManager {
    if (!BackgroundEffectsConfigManager.instance) {
      BackgroundEffectsConfigManager.instance =
        new BackgroundEffectsConfigManager();
    }
    return BackgroundEffectsConfigManager.instance;
  }

  /**
   * Get optimized configuration based on device capabilities and user preferences
   */
  getOptimizedConfig(): BackgroundEffectsSettings {
    const baseConfig = this.getBaseConfigForDevice();
    const userConfig = this.getUserPreferences();
    const motionConfig = this.getMotionPreferences();

    return {
      ...baseConfig,
      ...userConfig,
      ...motionConfig,
    };
  }

  /**
   * Update user preferences
   */
  updateUserPreferences(preferences: Partial<BackgroundEffectsSettings>): void {
    this.userPreferences = { ...this.userPreferences, ...preferences };

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "backgroundEffectsPreferences",
        JSON.stringify(this.userPreferences)
      );
    }
  }

  /**
   * Get device capabilities
   */
  getDeviceCapabilities(): DeviceCapabilities {
    return this.deviceCapabilities;
  }

  /**
   * Get performance-based configuration
   */
  getPerformanceConfig(currentFPS: number): Partial<BackgroundEffectsSettings> {
    if (currentFPS >= 55) {
      return {
        particleCount: 3000,
        geometricShapeCount: 15,
        animationIntensity: 1,
        enableParticleTrails: true,
      };
    } else if (currentFPS >= 45) {
      return {
        particleCount: 2000,
        geometricShapeCount: 10,
        animationIntensity: 0.7,
        enableParticleTrails: true,
      };
    } else if (currentFPS >= 30) {
      return {
        particleCount: 1200,
        geometricShapeCount: 6,
        animationIntensity: 0.5,
        enableParticleTrails: false,
      };
    } else {
      return {
        particleCount: 600,
        geometricShapeCount: 3,
        animationIntensity: 0.3,
        enableParticleTrails: false,
        enableParticleEffects: false,
      };
    }
  }

  private detectDeviceCapabilities(): DeviceCapabilities {
    if (typeof window === "undefined") {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        hasHighDPI: false,
        supportsWebGL2: false,
        estimatedPerformance: "medium",
      };
    }

    const userAgent = navigator.userAgent;
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );
    const isTablet =
      /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)|Android(?=.*\bTablet\b)/i.test(
        userAgent
      );
    const isDesktop = !isMobile && !isTablet;
    const hasHighDPI = window.devicePixelRatio > 1.5;

    // Detect WebGL2 support
    const canvas = document.createElement("canvas");
    const gl2 = canvas.getContext("webgl2");
    const supportsWebGL2 = !!gl2;

    // Estimate performance based on device characteristics
    let estimatedPerformance: "low" | "medium" | "high" = "medium";

    if (isMobile) {
      estimatedPerformance = "low";
    } else if (isDesktop && supportsWebGL2 && hasHighDPI) {
      estimatedPerformance = "high";
    }

    // Additional performance hints from hardware concurrency
    if (navigator.hardwareConcurrency) {
      if (navigator.hardwareConcurrency >= 8) {
        estimatedPerformance = "high";
      } else if (navigator.hardwareConcurrency <= 2) {
        estimatedPerformance = "low";
      }
    }

    return {
      isMobile,
      isTablet,
      isDesktop,
      hasHighDPI,
      supportsWebGL2,
      estimatedPerformance,
    };
  }

  private getBaseConfigForDevice(): BackgroundEffectsSettings {
    const { estimatedPerformance, isMobile } = this.deviceCapabilities;

    const configs = {
      high: {
        particleCount: 3000,
        geometricShapeCount: 15,
        animationIntensity: 1,
        enableParticleEffects: true,
        enableGeometricShapes: true,
        enableGridLines: true,
        enableParticleTrails: true,
        colorScheme: "default" as const,
        particleSize: "medium" as const,
        animationSpeed: "normal" as const,
        respectReducedMotion: false,
        highContrast: false,
      },
      medium: {
        particleCount: 2000,
        geometricShapeCount: 10,
        animationIntensity: 0.8,
        enableParticleEffects: true,
        enableGeometricShapes: true,
        enableGridLines: true,
        enableParticleTrails: true,
        colorScheme: "default" as const,
        particleSize: "medium" as const,
        animationSpeed: "normal" as const,
        respectReducedMotion: false,
        highContrast: false,
      },
      low: {
        particleCount: 1000,
        geometricShapeCount: 6,
        animationIntensity: 0.5,
        enableParticleEffects: true,
        enableGeometricShapes: true,
        enableGridLines: false,
        enableParticleTrails: false,
        colorScheme: "default" as const,
        particleSize: "small" as const,
        animationSpeed: "slow" as const,
        respectReducedMotion: false,
        highContrast: false,
      },
    };

    const baseConfig = configs[estimatedPerformance];

    // Mobile-specific adjustments
    if (isMobile) {
      baseConfig.particleCount = Math.floor(baseConfig.particleCount * 0.6);
      baseConfig.geometricShapeCount = Math.floor(
        baseConfig.geometricShapeCount * 0.7
      );
      baseConfig.enableParticleTrails = false;
    }

    return baseConfig;
  }

  private getUserPreferences(): Partial<BackgroundEffectsSettings> {
    if (typeof window === "undefined") return {};

    try {
      const stored = localStorage.getItem("backgroundEffectsPreferences");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private getMotionPreferences(): Partial<BackgroundEffectsSettings> {
    if (typeof window === "undefined") return {};

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const prefersHighContrast = window.matchMedia(
      "(prefers-contrast: high)"
    ).matches;

    if (prefersReducedMotion) {
      return {
        respectReducedMotion: true,
        animationIntensity: 0.2,
        enableParticleTrails: false,
        animationSpeed: "slow",
      };
    }

    if (prefersHighContrast) {
      return {
        highContrast: true,
        colorScheme: "monochrome",
      };
    }

    return {};
  }
}

/**
 * Singleton instance for global configuration management
 */
export const backgroundEffectsConfig =
  BackgroundEffectsConfigManager.getInstance();

/**
 * Preset configurations for different scenarios
 */
export const BACKGROUND_PRESETS = {
  minimal: {
    particleCount: 500,
    geometricShapeCount: 3,
    animationIntensity: 0.3,
    enableParticleEffects: true,
    enableGeometricShapes: false,
    enableGridLines: false,
    enableParticleTrails: false,
  },
  standard: {
    particleCount: 2000,
    geometricShapeCount: 10,
    animationIntensity: 0.8,
    enableParticleEffects: true,
    enableGeometricShapes: true,
    enableGridLines: true,
    enableParticleTrails: true,
  },
  maximum: {
    particleCount: 4000,
    geometricShapeCount: 20,
    animationIntensity: 1,
    enableParticleEffects: true,
    enableGeometricShapes: true,
    enableGridLines: true,
    enableParticleTrails: true,
  },
} as const;
