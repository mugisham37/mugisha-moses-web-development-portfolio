"use client";

import { useState, useEffect } from "react";
import { OptimizedImage } from "@/components/ui";
import { useImageOptimization } from "@/hooks/useImageOptimization";
import { useImagePerformanceMonitor } from "@/utils/imagePerformanceMonitor";
import { imagePreloader } from "@/utils/imagePreloader";

const ImageOptimizationTest: React.FC = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const performanceMonitor = useImagePerformanceMonitor();

  // Test hook usage
  const heroImageOptimization = useImageOptimization({
    src: "/hero-portrait.jpg",
    width: 1200,
    height: 800,
    preset: "hero",
    isAboveTheFold: true,
    enablePerformanceMonitoring: true,
    enablePreloading: true,
    enableLazyLoading: false,
  });

  const cardImageOptimization = useImageOptimization({
    src: "/images/testimonials/sarah-johnson.svg",
    width: 400,
    height: 400,
    preset: "card",
    isAboveTheFold: false,
    enablePerformanceMonitoring: true,
    enablePreloading: false,
    enableLazyLoading: true,
  });

  const runTests = async () => {
    setIsRunningTests(true);
    const results: any[] = [];

    try {
      // Test 1: Image Preloader
      console.log("Running Test 1: Image Preloader");
      const preloadStart = performance.now();
      await imagePreloader.preloadImage("/hero-portrait.jpg", {
        priority: true,
      });
      const preloadTime = performance.now() - preloadStart;

      results.push({
        test: "Image Preloader",
        status: "PASS",
        time: `${preloadTime.toFixed(2)}ms`,
        details: "Successfully preloaded hero image",
      });

      // Test 2: Multiple Image Preloading
      console.log("Running Test 2: Multiple Image Preloading");
      const multiPreloadStart = performance.now();
      await imagePreloader.preloadImages([
        { src: "/images/testimonials/sarah-johnson.svg" },
        { src: "/images/testimonials/david-chen.svg" },
      ]);
      const multiPreloadTime = performance.now() - multiPreloadStart;

      results.push({
        test: "Multiple Image Preloading",
        status: "PASS",
        time: `${multiPreloadTime.toFixed(2)}ms`,
        details: "Successfully preloaded multiple images",
      });

      // Test 3: Cache Statistics
      console.log("Running Test 3: Cache Statistics");
      const cacheStats = imagePreloader.getCacheStats();

      results.push({
        test: "Cache Statistics",
        status: "PASS",
        time: "N/A",
        details: `Total: ${cacheStats.totalImages}, Loaded: ${cacheStats.loadedImages}, Errors: ${cacheStats.errorImages}`,
      });

      // Test 4: Performance Monitoring
      console.log("Running Test 4: Performance Monitoring");
      const performanceReport = performanceMonitor.getReport();

      results.push({
        test: "Performance Monitoring",
        status: "PASS",
        time: `Avg: ${performanceReport.averageLoadTime.toFixed(2)}ms`,
        details: `Monitored ${performanceReport.totalImages} images, ${(performanceReport.cacheHitRate * 100).toFixed(1)}% cache hit rate`,
      });

      // Test 5: Hook Integration
      console.log("Running Test 5: Hook Integration");
      const hookStatus = heroImageOptimization.isLoaded ? "LOADED" : "LOADING";

      results.push({
        test: "Hook Integration",
        status: "PASS",
        time: `${heroImageOptimization.loadTime.toFixed(2)}ms`,
        details: `Hero image ${hookStatus}, Performance budget: ${heroImageOptimization.performanceReport.meetsPerformanceBudget ? "MET" : "EXCEEDED"}`,
      });

      // Test 6: Error Handling
      console.log("Running Test 6: Error Handling");
      try {
        await imagePreloader.preloadImage("/non-existent-image.jpg");
        results.push({
          test: "Error Handling",
          status: "FAIL",
          time: "N/A",
          details: "Should have thrown an error for non-existent image",
        });
      } catch (error) {
        results.push({
          test: "Error Handling",
          status: "PASS",
          time: "N/A",
          details: "Correctly handled non-existent image error",
        });
      }

      // Test 7: Responsive Image Generation
      console.log("Running Test 7: Responsive Image Generation");
      const responsiveProps = cardImageOptimization.imageProps;
      const hasResponsiveSizes =
        responsiveProps.sizes && responsiveProps.sizes.length > 0;

      results.push({
        test: "Responsive Image Generation",
        status: hasResponsiveSizes ? "PASS" : "FAIL",
        time: "N/A",
        details: hasResponsiveSizes
          ? `Generated sizes: ${responsiveProps.sizes}`
          : "No responsive sizes generated",
      });

      // Test 8: Lazy Loading
      console.log("Running Test 8: Lazy Loading");
      const lazyLoadStatus = cardImageOptimization.shouldLoad
        ? "SHOULD_LOAD"
        : "WAITING";

      results.push({
        test: "Lazy Loading",
        status: "PASS",
        time: "N/A",
        details: `Card image lazy loading status: ${lazyLoadStatus}`,
      });
    } catch (error) {
      results.push({
        test: "Test Suite",
        status: "ERROR",
        time: "N/A",
        details: `Test suite error: ${error}`,
      });
    }

    setTestResults(results);
    setIsRunningTests(false);
  };

  const clearCache = () => {
    imagePreloader.clearCache();
    performanceMonitor.clearMetrics();
    setTestResults([]);
  };

  const exportMetrics = () => {
    const metrics = performanceMonitor.exportMetrics();
    const blob = new Blob([metrics], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "image-performance-metrics.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="image-optimization-test">
      <div className="test-header">
        <h2>Image Optimization Test Suite</h2>
        <div className="test-controls">
          <button
            onClick={runTests}
            disabled={isRunningTests}
            className="test-btn test-btn--primary"
          >
            {isRunningTests ? "Running Tests..." : "Run Tests"}
          </button>
          <button onClick={clearCache} className="test-btn test-btn--secondary">
            Clear Cache
          </button>
          <button
            onClick={exportMetrics}
            className="test-btn test-btn--secondary"
          >
            Export Metrics
          </button>
        </div>
      </div>

      {/* Test Images */}
      <div className="test-images">
        <div className="test-image-section">
          <h3>Hero Image (Critical)</h3>
          <OptimizedImage
            src="/hero-portrait.jpg"
            alt="Hero test image"
            width={600}
            height={400}
            priority={true}
            configName="hero"
            brutalistEffects={true}
            className="test-image"
          />
          <div className="image-stats">
            <p>Load Time: {heroImageOptimization.loadTime.toFixed(2)}ms</p>
            <p>Cache Hit: {heroImageOptimization.cacheHit ? "Yes" : "No"}</p>
            <p>
              Performance Budget:{" "}
              {heroImageOptimization.performanceReport.meetsPerformanceBudget
                ? "Met"
                : "Exceeded"}
            </p>
          </div>
        </div>

        <div className="test-image-section">
          <h3>Card Image (Lazy)</h3>
          <OptimizedImage
            src="/images/testimonials/sarah-johnson.svg"
            alt="Card test image"
            width={300}
            height={300}
            configName="card"
            lazy={true}
            brutalistEffects={true}
            className="test-image"
          />
          <div className="image-stats">
            <p>
              Should Load: {cardImageOptimization.shouldLoad ? "Yes" : "No"}
            </p>
            <p>Is Loaded: {cardImageOptimization.isLoaded ? "Yes" : "No"}</p>
            <p>Load Time: {cardImageOptimization.loadTime.toFixed(2)}ms</p>
          </div>
        </div>

        <div className="test-image-section">
          <h3>Error Test Image</h3>
          <OptimizedImage
            src="/non-existent-image.jpg"
            alt="Error test image"
            width={300}
            height={200}
            configName="card"
            lazy={true}
            brutalistEffects={true}
            className="test-image"
            retryOnError={true}
            maxRetries={2}
          />
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="test-results">
          <h3>Test Results</h3>
          <div className="results-table">
            <div className="results-header">
              <div>Test</div>
              <div>Status</div>
              <div>Time</div>
              <div>Details</div>
            </div>
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`results-row results-row--${result.status.toLowerCase()}`}
              >
                <div>{result.test}</div>
                <div className="status">{result.status}</div>
                <div>{result.time}</div>
                <div>{result.details}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .image-optimization-test {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          font-family: "JetBrains Mono", monospace;
        }

        .test-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #333;
        }

        .test-header h2 {
          margin: 0;
          font-size: 1.5rem;
        }

        .test-controls {
          display: flex;
          gap: 1rem;
        }

        .test-btn {
          padding: 0.5rem 1rem;
          border: 2px solid #333;
          background: white;
          font-family: "JetBrains Mono", monospace;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }

        .test-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .test-btn--primary {
          background: #333;
          color: white;
        }

        .test-btn--primary:hover:not(:disabled) {
          background: #555;
        }

        .test-btn--secondary:hover:not(:disabled) {
          background: #f0f0f0;
        }

        .test-images {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .test-image-section {
          border: 2px solid #333;
          padding: 1rem;
          background: #f9f9f9;
        }

        .test-image-section h3 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
        }

        .test-image {
          width: 100%;
          height: auto;
          margin-bottom: 1rem;
        }

        .image-stats {
          font-size: 0.75rem;
          line-height: 1.4;
        }

        .image-stats p {
          margin: 0.25rem 0;
        }

        .test-results {
          border: 2px solid #333;
          padding: 1rem;
          background: #f9f9f9;
        }

        .test-results h3 {
          margin: 0 0 1rem 0;
        }

        .results-table {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 3fr;
          gap: 0.5rem;
          font-size: 0.75rem;
        }

        .results-header {
          display: contents;
          font-weight: bold;
        }

        .results-header > div {
          padding: 0.5rem;
          background: #333;
          color: white;
        }

        .results-row {
          display: contents;
        }

        .results-row > div {
          padding: 0.5rem;
          border: 1px solid #ddd;
          background: white;
        }

        .results-row--pass .status {
          background: #4ade80;
          color: white;
          font-weight: bold;
        }

        .results-row--fail .status {
          background: #f87171;
          color: white;
          font-weight: bold;
        }

        .results-row--error .status {
          background: #fbbf24;
          color: white;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .image-optimization-test {
            padding: 1rem;
          }

          .test-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .test-controls {
            justify-content: center;
          }

          .test-images {
            grid-template-columns: 1fr;
          }

          .results-table {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .results-header,
          .results-row {
            display: block;
          }

          .results-header > div,
          .results-row > div {
            display: block;
            margin-bottom: 0.25rem;
          }

          .results-header > div:first-child,
          .results-row > div:first-child {
            font-weight: bold;
          }
        }
      `}</style>
    </div>
  );
};

export default ImageOptimizationTest;
