"use client";

import { useState } from "react";
import { OptimizedImage } from "@/components/ui";
import { useImagePerformanceMonitor } from "@/utils/imagePerformanceMonitor";

const ImageOptimizationExample: React.FC = () => {
  const [showReport, setShowReport] = useState(false);
  const performanceMonitor = useImagePerformanceMonitor();

  const handleShowReport = () => {
    const report = performanceMonitor.getReport();
    console.log("Image Performance Report:", report);
    setShowReport(true);
  };

  return (
    <div className="image-optimization-example">
      <h2>Image Optimization Examples</h2>

      {/* Hero Image Example */}
      <section className="example-section">
        <h3>Hero Image (Critical, Above the Fold)</h3>
        <OptimizedImage
          src="/hero-portrait.jpg"
          alt="Hero portrait"
          width={1200}
          height={800}
          priority={true}
          configName="hero"
          brutalistEffects={true}
          className="hero-example"
        />
      </section>

      {/* Card Images Example */}
      <section className="example-section">
        <h3>Card Images (Lazy Loaded)</h3>
        <div className="card-grid">
          {[
            "/images/testimonials/sarah-johnson.svg",
            "/images/testimonials/david-chen.svg",
          ].map((src, index) => (
            <OptimizedImage
              key={src}
              src={src}
              alt={`Testimonial ${index + 1}`}
              width={400}
              height={400}
              configName="card"
              lazy={true}
              brutalistEffects={true}
              className="card-example"
            />
          ))}
        </div>
      </section>

      {/* Thumbnail Images Example */}
      <section className="example-section">
        <h3>Resource Thumbnails (Lazy Loaded, Small)</h3>
        <div className="thumbnail-grid">
          {[
            "/images/resources/nextjs-guide-preview.jpg",
            "/images/resources/typescript-toolkit-preview.jpg",
            "/images/resources/ui-kit-preview.jpg",
            "/images/resources/templates-preview.jpg",
            "/images/resources/checklist-preview.jpg",
            "/images/resources/whitepaper-preview.jpg",
          ].map((src, index) => (
            <OptimizedImage
              key={src}
              src={src}
              alt={`Resource ${index + 1}`}
              width={200}
              height={150}
              configName="thumbnail"
              lazy={true}
              brutalistEffects={true}
              className="thumbnail-example"
              retryOnError={true}
              maxRetries={2}
            />
          ))}
        </div>
      </section>

      {/* Portrait Example */}
      <section className="example-section">
        <h3>Portrait Image (Responsive)</h3>
        <OptimizedImage
          src="/hero-portrait.svg"
          alt="Professional portrait"
          width={600}
          height={800}
          configName="portrait"
          lazy={true}
          brutalistEffects={true}
          className="portrait-example"
        />
      </section>

      {/* Fill Example */}
      <section className="example-section">
        <h3>Fill Container Image</h3>
        <div className="fill-container">
          <OptimizedImage
            src="/hero-portrait.jpg"
            alt="Fill example"
            fill={true}
            configName="card"
            lazy={true}
            brutalistEffects={true}
            className="fill-example"
          />
        </div>
      </section>

      {/* Error Handling Example */}
      <section className="example-section">
        <h3>Error Handling Example</h3>
        <OptimizedImage
          src="/non-existent-image.jpg"
          alt="This image will fail to load"
          width={400}
          height={300}
          configName="card"
          lazy={true}
          brutalistEffects={true}
          className="error-example"
          retryOnError={true}
          maxRetries={2}
        />
      </section>

      {/* Performance Report */}
      <section className="example-section">
        <h3>Performance Monitoring</h3>
        <button onClick={handleShowReport} className="performance-report-btn">
          Show Performance Report
        </button>

        {showReport && (
          <div className="performance-report">
            <pre>{performanceMonitor.exportMetrics()}</pre>
          </div>
        )}
      </section>

      <style jsx>{`
        .image-optimization-example {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .example-section {
          margin-bottom: 3rem;
          padding: 1.5rem;
          border: 2px solid #333;
          background: #f5f5f5;
        }

        .example-section h3 {
          margin-bottom: 1rem;
          font-family: "JetBrains Mono", monospace;
          font-weight: bold;
        }

        .hero-example {
          width: 100%;
          max-width: 800px;
          height: auto;
        }

        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .card-example {
          width: 100%;
          height: auto;
          border-radius: 8px;
        }

        .thumbnail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
        }

        .thumbnail-example {
          width: 100%;
          height: auto;
          border-radius: 4px;
        }

        .portrait-example {
          max-width: 400px;
          width: 100%;
          height: auto;
        }

        .fill-container {
          position: relative;
          width: 100%;
          height: 300px;
          border: 2px solid #333;
        }

        .fill-example {
          border-radius: 8px;
        }

        .error-example {
          width: 100%;
          max-width: 400px;
          height: auto;
        }

        .performance-report-btn {
          padding: 0.75rem 1.5rem;
          background: #333;
          color: white;
          border: none;
          border-radius: 4px;
          font-family: "JetBrains Mono", monospace;
          cursor: pointer;
          transition: background 0.2s;
        }

        .performance-report-btn:hover {
          background: #555;
        }

        .performance-report {
          margin-top: 1rem;
          padding: 1rem;
          background: #000;
          color: #00ff00;
          font-family: "JetBrains Mono", monospace;
          font-size: 0.75rem;
          border-radius: 4px;
          overflow-x: auto;
          max-height: 400px;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .image-optimization-example {
            padding: 1rem;
          }

          .example-section {
            padding: 1rem;
          }

          .card-grid {
            grid-template-columns: 1fr;
          }

          .thumbnail-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default ImageOptimizationExample;
