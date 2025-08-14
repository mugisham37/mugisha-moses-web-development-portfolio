/**
 * Background Effects Performance Monitor
 * Monitors and optimizes Three.js background performance for 60fps
 */

import React from "react";

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  drawCalls: number;
  triangles: number;
}

export interface PerformanceThresholds {
  minFPS: number;
  maxFrameTime: number;
  maxMemoryUsage: number;
}

export class BackgroundPerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private frameTime = 16.67;
  private callbacks: Array<(metrics: PerformanceMetrics) => void> = [];
  private isMonitoring = false;
  private animationFrameId?: number;

  private readonly thresholds: PerformanceThresholds = {
    minFPS: 45, // Minimum acceptable FPS
    maxFrameTime: 22, // Maximum acceptable frame time (ms)
    maxMemoryUsage: 100, // Maximum memory usage (MB)
  };

  constructor() {
    this.startMonitoring();
  }

  /**
   * Start performance monitoring
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitorLoop();
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  /**
   * Add performance callback
   */
  onPerformanceUpdate(callback: (metrics: PerformanceMetrics) => void): void {
    this.callbacks.push(callback);
  }

  /**
   * Remove performance callback
   */
  removePerformanceCallback(
    callback: (metrics: PerformanceMetrics) => void
  ): void {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }

  /**
   * Get current performance metrics
   */
  getCurrentMetrics(): PerformanceMetrics {
    return {
      fps: this.fps,
      frameTime: this.frameTime,
      memoryUsage: this.getMemoryUsage(),
      drawCalls: 0, // Will be updated by Three.js renderer
      triangles: 0, // Will be updated by Three.js renderer
    };
  }

  /**
   * Check if performance is acceptable
   */
  isPerformanceAcceptable(): boolean {
    const metrics = this.getCurrentMetrics();
    return (
      metrics.fps >= this.thresholds.minFPS &&
      metrics.frameTime <= this.thresholds.maxFrameTime &&
      metrics.memoryUsage <= this.thresholds.maxMemoryUsage
    );
  }

  /**
   * Get performance optimization suggestions
   */
  getOptimizationSuggestions(): string[] {
    const metrics = this.getCurrentMetrics();
    const suggestions: string[] = [];

    if (metrics.fps < this.thresholds.minFPS) {
      suggestions.push("Reduce particle count");
      suggestions.push("Disable complex animations");
      suggestions.push("Lower geometry detail");
    }

    if (metrics.frameTime > this.thresholds.maxFrameTime) {
      suggestions.push("Optimize shader complexity");
      suggestions.push("Reduce draw calls");
      suggestions.push("Use instanced rendering");
    }

    if (metrics.memoryUsage > this.thresholds.maxMemoryUsage) {
      suggestions.push("Reduce texture sizes");
      suggestions.push("Dispose unused geometries");
      suggestions.push("Implement object pooling");
    }

    return suggestions;
  }

  /**
   * Get adaptive configuration based on performance
   */
  getAdaptiveConfig(): {
    particleCount: number;
    geometricShapeCount: number;
    animationIntensity: number;
    enableComplexEffects: boolean;
  } {
    const metrics = this.getCurrentMetrics();

    if (metrics.fps >= 55) {
      // High performance - full effects
      return {
        particleCount: 3000,
        geometricShapeCount: 15,
        animationIntensity: 1,
        enableComplexEffects: true,
      };
    } else if (metrics.fps >= 45) {
      // Medium performance - reduced effects
      return {
        particleCount: 2000,
        geometricShapeCount: 10,
        animationIntensity: 0.7,
        enableComplexEffects: true,
      };
    } else {
      // Low performance - minimal effects
      return {
        particleCount: 1000,
        geometricShapeCount: 6,
        animationIntensity: 0.4,
        enableComplexEffects: false,
      };
    }
  }

  private monitorLoop(): void {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    this.frameCount++;
    this.frameTime = deltaTime;

    // Calculate FPS every 60 frames
    if (this.frameCount % 60 === 0) {
      this.fps = Math.round(1000 / (deltaTime / 60));

      // Notify callbacks
      const metrics = this.getCurrentMetrics();
      this.callbacks.forEach((callback) => callback(metrics));
    }

    this.lastTime = currentTime;
    this.animationFrameId = requestAnimationFrame(() => this.monitorLoop());
  }

  private getMemoryUsage(): number {
    // Use Performance API if available
    if ("memory" in performance) {
      const memory = (performance as any).memory;
      return Math.round(memory.usedJSHeapSize / 1024 / 1024); // Convert to MB
    }
    return 0;
  }
}

/**
 * Singleton instance for global performance monitoring
 */
export const backgroundPerformanceMonitor = new BackgroundPerformanceMonitor();

/**
 * React hook for background performance monitoring
 */
export function useBackgroundPerformance() {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    drawCalls: 0,
    triangles: 0,
  });

  const [isAcceptable, setIsAcceptable] = React.useState(true);

  React.useEffect(() => {
    const handlePerformanceUpdate = (newMetrics: PerformanceMetrics) => {
      setMetrics(newMetrics);
      setIsAcceptable(backgroundPerformanceMonitor.isPerformanceAcceptable());
    };

    backgroundPerformanceMonitor.onPerformanceUpdate(handlePerformanceUpdate);

    return () => {
      backgroundPerformanceMonitor.removePerformanceCallback(
        handlePerformanceUpdate
      );
    };
  }, []);

  return {
    metrics,
    isAcceptable,
    suggestions: backgroundPerformanceMonitor.getOptimizationSuggestions(),
    adaptiveConfig: backgroundPerformanceMonitor.getAdaptiveConfig(),
  };
}
