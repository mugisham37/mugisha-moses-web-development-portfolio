"use client";

import { useEffect, createContext, useContext, useState } from "react";
import {
  initializePerformanceMonitoring,
  getPerformanceMonitor,
  bundleAnalysis,
  performanceOptimization,
  type PerformanceMetrics,
  type BundleMetrics,
} from "@/utils/performance-utils";

interface PerformanceContextType {
  metrics: PerformanceMetrics;
  bundles: BundleMetrics[];
  isMonitoring: boolean;
  generateReport: () => string;
  getOptimizationRecommendations: () => string[];
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

interface PerformanceProviderProps {
  children: React.ReactNode;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({
  children,
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [bundles, setBundles] = useState<BundleMetrics[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize performance monitoring
    const monitor = initializePerformanceMonitoring();
    setIsMonitoring(true);

    // Update metrics periodically
    const updateMetrics = () => {
      const currentMonitor = getPerformanceMonitor();
      if (currentMonitor) {
        setMetrics(currentMonitor.getMetrics());
        setBundles(currentMonitor.getBundleMetrics());
      }
    };

    // Update metrics every 5 seconds
    const metricsInterval = setInterval(updateMetrics, 5000);

    // Initial performance optimizations
    performanceOptimization.preloadCriticalResources();
    performanceOptimization.optimizeImages();
    performanceOptimization.preventLayoutShifts();
    performanceOptimization.optimizeAnimations();

    // Cleanup on unmount
    return () => {
      clearInterval(metricsInterval);
      if (monitor) {
        monitor.cleanup();
      }
    };
  }, []);

  const generateReport = (): string => {
    const monitor = getPerformanceMonitor();
    return monitor ? monitor.generateReport() : "{}";
  };

  const getOptimizationRecommendations = (): string[] => {
    return bundleAnalysis.getOptimizationRecommendations();
  };

  const contextValue: PerformanceContextType = {
    metrics,
    bundles,
    isMonitoring,
    generateReport,
    getOptimizationRecommendations,
  };

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
      {/* Performance Debug Panel (development only) */}
      {process.env.NODE_ENV === "development" && <PerformanceDebugPanel />}
    </PerformanceContext.Provider>
  );
};

// Debug panel for development
const PerformanceDebugPanel: React.FC = () => {
  const context = useContext(PerformanceContext);
  const [isOpen, setIsOpen] = useState(false);

  if (!context) return null;

  const { metrics, bundles, getOptimizationRecommendations } = context;

  return (
    <div className="performance-debug-panel">
      <button className="debug-toggle" onClick={() => setIsOpen(!isOpen)}>
        📊 Perf
      </button>

      {isOpen && (
        <div className="debug-content">
          <h3>Performance Metrics</h3>
          <div className="metrics-grid">
            {Object.entries(metrics).map(([key, value]) => (
              <div key={key} className="metric-item">
                <span className="metric-name">{key}:</span>
                <span className="metric-value">
                  {typeof value === "number" ? value.toFixed(2) : value}
                  {key !== "CLS" ? "ms" : ""}
                </span>
              </div>
            ))}
          </div>

          <h3>Bundle Analysis</h3>
          <div className="bundle-list">
            {bundles.map((bundle, index) => (
              <div key={index} className="bundle-item">
                <span className="bundle-name">{bundle.name}</span>
                <span className="bundle-size">
                  {(bundle.size / 1024).toFixed(2)}KB
                </span>
                <span className="bundle-time">
                  {bundle.loadTime.toFixed(2)}ms
                </span>
                {bundle.cached && <span className="cached-indicator">📦</span>}
              </div>
            ))}
          </div>

          <h3>Recommendations</h3>
          <div className="recommendations">
            {getOptimizationRecommendations().map((rec, index) => (
              <div key={index} className="recommendation">
                ⚠️ {rec}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
};

export default PerformanceProvider;
