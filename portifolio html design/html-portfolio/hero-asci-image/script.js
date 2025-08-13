// ASCII Converter Application
class AsciiConverter {
  constructor() {
    // Fixed settings - matching the original
    this.resolution = 0.13;
    this.inverted = false;
    this.grayscale = false;
    this.charSet = "detailed";

    // State variables
    this.loading = true;
    this.imageLoaded = false;
    this.asciiArt = "";
    this.coloredAsciiArt = [];
    this.error = null;
    this.mousePos = null;

    // Character sets
    this.charSets = {
      standard: " .:-=+*#%@",
      detailed: " .,:;i1tfLCG08@",
      blocks: " ░▒▓█",
      minimal: " .:█",
    };

    // DOM elements
    this.loadingEl = document.getElementById("loading");
    this.errorEl = document.getElementById("error");
    this.outputCanvas = document.getElementById("outputCanvas");
    this.processingCanvas = document.getElementById("processingCanvas");

    // Image reference
    this.imageRef = null;
    this.animationFrameId = null;

    this.init();
  }

  init() {
    // Set document background to black
    document.documentElement.style.backgroundColor = "black";
    document.body.style.backgroundColor = "black";

    // Setup event listeners
    this.setupEventListeners();

    // Load default image
    this.loadDefaultImage();
  }

  setupEventListeners() {
    // Mouse events for hover effect
    this.outputCanvas.addEventListener("mousemove", (e) => {
      const canvas = this.outputCanvas;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      this.mousePos = {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };

      this.scheduleRender();
    });

    this.outputCanvas.addEventListener("mouseleave", () => {
      this.mousePos = null;
      this.scheduleRender();
    });
  }

  loadDefaultImage() {
    this.loading = true;
    this.error = null;
    this.imageLoaded = false;
    this.updateUI();

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      if (img.width === 0 || img.height === 0) {
        this.setError("Invalid image dimensions");
        return;
      }

      this.imageRef = img;
      this.imageLoaded = true;
      this.loading = false;
      this.convertToAscii();
    };

    img.onerror = () => {
      this.setError("Failed to load image");
    };

    // Load the default image
    img.src = "images/original-image.jpg";
  }

  setError(message) {
    this.error = message;
    this.loading = false;
    this.updateUI();
  }

  updateUI() {
    if (this.loading) {
      this.loadingEl.style.display = "block";
      this.errorEl.style.display = "none";
      this.outputCanvas.style.display = "none";
    } else if (this.error) {
      this.loadingEl.style.display = "none";
      this.errorEl.style.display = "block";
      this.errorEl.querySelector(".error-text").textContent = this.error;
      this.outputCanvas.style.display = "none";
    } else {
      this.loadingEl.style.display = "none";
      this.errorEl.style.display = "none";
      this.outputCanvas.style.display = "block";
    }
  }

  // Helper function to adjust color brightness
  adjustColorBrightness(r, g, b, factor) {
    const minBrightness = 40;
    r = Math.max(Math.min(Math.round(r * factor), 255), minBrightness);
    g = Math.max(Math.min(Math.round(g * factor), 255), minBrightness);
    b = Math.max(Math.min(Math.round(b * factor), 255), minBrightness);
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Helper function to invert colors
  invertColor(color) {
    if (color === "white") return "black";
    if (color === "black") return "white";

    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      const r = 255 - parseInt(match[1]);
      const g = 255 - parseInt(match[2]);
      const b = 255 - parseInt(match[3]);
      return `rgb(${r}, ${g}, ${b})`;
    }
    return color;
  }

  renderToCanvas() {
    if (
      !this.outputCanvas ||
      !this.asciiArt ||
      this.coloredAsciiArt.length === 0
    )
      return;

    const canvas = this.outputCanvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const fontSize = 8;
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = "top";

    const lineHeight = fontSize;
    const charWidth = fontSize * 0.6;

    if (this.grayscale) {
      const lines = this.asciiArt.split("\n");
      const maxLineLength = Math.max(...lines.map((line) => line.length));
      canvas.width = maxLineLength * charWidth;
      canvas.height = lines.length * lineHeight;
    } else {
      canvas.width = this.coloredAsciiArt[0].length * charWidth;
      canvas.height = this.coloredAsciiArt.length * lineHeight;
    }

    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = "top";

    // Hover effect radius in pixels (reduced to half size)
    const hoverRadius = 40;
    const hoverRadiusSquared = hoverRadius * hoverRadius;

    if (this.grayscale) {
      ctx.fillStyle = "white";
      this.asciiArt.split("\n").forEach((line, lineIndex) => {
        ctx.fillText(line, 0, lineIndex * lineHeight);
      });
    } else {
      this.coloredAsciiArt.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
          const charX = colIndex * charWidth + charWidth / 2;
          const charY = rowIndex * lineHeight + lineHeight / 2;

          let shouldInvert = false;

          if (this.mousePos) {
            const distanceSquared =
              Math.pow(charX - this.mousePos.x, 2) +
              Math.pow(charY - this.mousePos.y, 2);
            shouldInvert = distanceSquared <= hoverRadiusSquared;
          }

          ctx.fillStyle = shouldInvert
            ? this.invertColor(col.color)
            : col.color;
          ctx.fillText(col.char, colIndex * charWidth, rowIndex * lineHeight);
        });
      });
    }
  }

  scheduleRender() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.animationFrameId = requestAnimationFrame(() => {
      if (this.imageLoaded && !this.loading && !this.error) {
        this.renderToCanvas();
      }
    });
  }

  convertToAscii() {
    try {
      if (!this.processingCanvas || !this.imageRef) {
        throw new Error("Canvas or image not available");
      }

      const img = this.imageRef;

      if (img.width === 0 || img.height === 0) {
        throw new Error("Invalid image dimensions");
      }

      const canvas = this.processingCanvas;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      const width = Math.floor(img.width * this.resolution);
      const height = Math.floor(img.height * this.resolution);

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, img.width, img.height);

      let imageData;
      try {
        imageData = ctx.getImageData(0, 0, img.width, img.height);
      } catch (e) {
        throw new Error(
          "Failed to get image data. This might be a CORS issue."
        );
      }

      const data = imageData.data;
      const chars = this.charSets[this.charSet];
      const fontAspect = 0.5;
      const widthStep = Math.ceil(img.width / width);
      const heightStep = Math.ceil(img.height / height / fontAspect);

      let result = "";
      const coloredResult = [];

      for (let y = 0; y < img.height; y += heightStep) {
        const coloredRow = [];

        for (let x = 0; x < img.width; x += widthStep) {
          const pos = (y * img.width + x) * 4;

          const r = data[pos];
          const g = data[pos + 1];
          const b = data[pos + 2];

          let brightness;
          if (this.grayscale) {
            brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
          } else {
            brightness = Math.sqrt(
              0.299 * (r / 255) * (r / 255) +
                0.587 * (g / 255) * (g / 255) +
                0.114 * (b / 255) * (b / 255)
            );
          }

          if (this.inverted) brightness = 1 - brightness;

          const charIndex = Math.floor(brightness * (chars.length - 1));
          const char = chars[charIndex];

          result += char;

          if (!this.grayscale) {
            const brightnessFactor =
              (charIndex / (chars.length - 1)) * 1.5 + 0.5;
            const color = this.adjustColorBrightness(r, g, b, brightnessFactor);
            coloredRow.push({ char, color });
          } else {
            coloredRow.push({ char, color: "white" });
          }
        }

        result += "\n";
        coloredResult.push(coloredRow);
      }

      this.asciiArt = result;
      this.coloredAsciiArt = coloredResult;
      this.error = null;
      this.updateUI();
      this.scheduleRender();
    } catch (err) {
      console.error("Error converting to ASCII:", err);
      this.setError(
        err instanceof Error ? err.message : "Unknown error occurred"
      );
      this.asciiArt = "";
      this.coloredAsciiArt = [];
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new AsciiConverter();
});
