/* ==========================================================================
   IMAGE PLACEHOLDERS
   Generate placeholder images for development and testing
   ========================================================================== */

/**
 * Image Placeholder Generator
 * Creates placeholder images for development and testing
 */
class ImagePlaceholderGenerator {
  constructor() {
    this.canvas = null;
    this.ctx = null;
  }

  /**
   * Initialize the generator
   */
  init() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
  }

  /**
   * Generate a placeholder image
   */
  generatePlaceholder(
    width,
    height,
    text,
    backgroundColor = "#333333",
    textColor = "#ffffff"
  ) {
    this.canvas.width = width;
    this.canvas.height = height;

    // Fill background
    this.ctx.fillStyle = backgroundColor;
    this.ctx.fillRect(0, 0, width, height);

    // Add text
    this.ctx.fillStyle = textColor;
    this.ctx.font = `${Math.min(width, height) / 10}px monospace`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(text, width / 2, height / 2);

    return this.canvas.toDataURL("image/jpeg", 0.8);
  }

  /**
   * Generate WebP placeholder (simulated)
   */
  generateWebPPlaceholder(width, height, text) {
    // For development, we'll use the same JPEG format
    // In production, this would generate actual WebP
    return this.generatePlaceholder(width, height, text);
  }

  /**
   * Create placeholder images for the portfolio
   */
  createPortfolioPlaceholders() {
    const placeholders = [
      {
        name: "project-1",
        text: "E-COMMERCE\nPLATFORM",
        width: 400,
        height: 300,
      },
      { name: "project-2", text: "TASK\nMANAGER", width: 400, height: 300 },
      {
        name: "project-3",
        text: "WEATHER\nDASHBOARD",
        width: 400,
        height: 300,
      },
      {
        name: "project-4",
        text: "PORTFOLIO\nWEBSITE",
        width: 400,
        height: 300,
      },
      { name: "project-5", text: "CHAT\nAPPLICATION", width: 400, height: 300 },
      { name: "project-6", text: "BLOG\nCMS", width: 400, height: 300 },
    ];

    placeholders.forEach((config) => {
      const jpegData = this.generatePlaceholder(
        config.width,
        config.height,
        config.text
      );
      const webpData = this.generateWebPPlaceholder(
        config.width,
        config.height,
        config.text
      );

      // In a real implementation, these would be saved as actual files
      console.log(
        `Generated placeholder for ${config.name}: JPEG and WebP versions`
      );
    });
  }

  /**
   * Create testimonial placeholders
   */
  createTestimonialPlaceholders() {
    const clients = [
      { name: "client-1", text: "SC" },
      { name: "client-2", text: "MR" },
      { name: "client-3", text: "EW" },
      { name: "client-4", text: "DK" },
      { name: "client-5", text: "LT" },
    ];

    clients.forEach((config) => {
      const jpegData = this.generatePlaceholder(
        150,
        150,
        config.text,
        "#666666"
      );
      const webpData = this.generateWebPPlaceholder(150, 150, config.text);

      console.log(`Generated testimonial placeholder for ${config.name}`);
    });
  }
}

// Auto-initialize if in development mode
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  document.addEventListener("DOMContentLoaded", () => {
    const generator = new ImagePlaceholderGenerator();
    generator.init();
    generator.createPortfolioPlaceholders();
    generator.createTestimonialPlaceholders();
  });
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = ImagePlaceholderGenerator;
} else {
  window.ImagePlaceholderGenerator = ImagePlaceholderGenerator;
}
