/**
 * Accessibility testing utilities for development and QA
 * Provides automated accessibility auditing and reporting
 */

export interface AccessibilityIssue {
  element: HTMLElement;
  type: "error" | "warning" | "info";
  rule: string;
  message: string;
  impact: "critical" | "serious" | "moderate" | "minor";
  helpUrl?: string;
}

export interface AccessibilityReport {
  issues: AccessibilityIssue[];
  summary: {
    total: number;
    errors: number;
    warnings: number;
    info: number;
  };
  score: number; // 0-100
  timestamp: Date;
}

export class AccessibilityAuditor {
  private static instance: AccessibilityAuditor;
  private issues: AccessibilityIssue[] = [];

  static getInstance(): AccessibilityAuditor {
    if (!AccessibilityAuditor.instance) {
      AccessibilityAuditor.instance = new AccessibilityAuditor();
    }
    return AccessibilityAuditor.instance;
  }

  /**
   * Run comprehensive accessibility audit
   */
  async audit(
    container: HTMLElement = document.body
  ): Promise<AccessibilityReport> {
    this.issues = [];

    // Run all audit checks
    this.auditImages(container);
    this.auditForms(container);
    this.auditButtons(container);
    this.auditLinks(container);
    this.auditHeadings(container);
    this.auditLandmarks(container);
    this.auditColorContrast(container);
    this.auditKeyboardNavigation(container);
    this.auditAriaLabels(container);
    this.auditFocusManagement(container);

    return this.generateReport();
  }

  /**
   * Audit images for accessibility
   */
  private auditImages(container: HTMLElement) {
    const images = container.querySelectorAll("img");

    images.forEach((img) => {
      // Check for alt text
      if (!img.hasAttribute("alt")) {
        this.addIssue({
          element: img,
          type: "error",
          rule: "img-alt",
          message: "Image missing alt attribute",
          impact: "serious",
          helpUrl: "https://dequeuniversity.com/rules/axe/4.4/image-alt",
        });
      }

      // Check for empty alt on decorative images
      const alt = img.getAttribute("alt");
      if (alt === "" && !img.hasAttribute("role")) {
        this.addIssue({
          element: img,
          type: "warning",
          rule: "img-decorative",
          message: "Decorative image should have role='presentation'",
          impact: "minor",
        });
      }

      // Check for meaningful alt text
      if (
        alt &&
        (alt.toLowerCase().includes("image") ||
          alt.toLowerCase().includes("picture"))
      ) {
        this.addIssue({
          element: img,
          type: "warning",
          rule: "img-alt-meaningful",
          message: "Alt text should be more descriptive",
          impact: "moderate",
        });
      }
    });
  }

  /**
   * Audit forms for accessibility
   */
  private auditForms(container: HTMLElement) {
    const inputs = container.querySelectorAll("input, textarea, select");

    inputs.forEach((input) => {
      // Check for labels
      const id = input.getAttribute("id");
      const ariaLabel = input.getAttribute("aria-label");
      const ariaLabelledBy = input.getAttribute("aria-labelledby");

      if (!id && !ariaLabel && !ariaLabelledBy) {
        this.addIssue({
          element: input as HTMLElement,
          type: "error",
          rule: "form-label",
          message: "Form input missing accessible label",
          impact: "critical",
        });
      }

      if (id) {
        const label = container.querySelector(`label[for="${id}"]`);
        if (!label && !ariaLabel && !ariaLabelledBy) {
          this.addIssue({
            element: input as HTMLElement,
            type: "error",
            rule: "form-label-association",
            message: "Form input has ID but no associated label",
            impact: "serious",
          });
        }
      }

      // Check for required field indicators
      if (input.hasAttribute("required")) {
        const label = container.querySelector(`label[for="${id}"]`);
        if (
          label &&
          !label.textContent?.includes("*") &&
          !input.getAttribute("aria-required")
        ) {
          this.addIssue({
            element: input as HTMLElement,
            type: "warning",
            rule: "form-required-indicator",
            message: "Required field should have visual indicator",
            impact: "moderate",
          });
        }
      }
    });
  }

  /**
   * Audit buttons for accessibility
   */
  private auditButtons(container: HTMLElement) {
    const buttons = container.querySelectorAll("button, [role='button']");

    buttons.forEach((button) => {
      // Check for accessible name
      const hasAccessibleName =
        button.textContent?.trim() ||
        button.getAttribute("aria-label") ||
        button.getAttribute("aria-labelledby");

      if (!hasAccessibleName) {
        this.addIssue({
          element: button as HTMLElement,
          type: "error",
          rule: "button-name",
          message: "Button missing accessible name",
          impact: "critical",
        });
      }

      // Check for keyboard accessibility
      if (
        button.getAttribute("role") === "button" &&
        !button.hasAttribute("tabindex")
      ) {
        this.addIssue({
          element: button as HTMLElement,
          type: "error",
          rule: "button-keyboard",
          message: "Custom button not keyboard accessible",
          impact: "serious",
        });
      }
    });
  }

  /**
   * Audit links for accessibility
   */
  private auditLinks(container: HTMLElement) {
    const links = container.querySelectorAll("a");

    links.forEach((link) => {
      // Check for href
      if (!link.hasAttribute("href")) {
        this.addIssue({
          element: link,
          type: "warning",
          rule: "link-href",
          message: "Link missing href attribute",
          impact: "moderate",
        });
      }

      // Check for accessible name
      const hasAccessibleName =
        link.textContent?.trim() ||
        link.getAttribute("aria-label") ||
        link.getAttribute("aria-labelledby");

      if (!hasAccessibleName) {
        this.addIssue({
          element: link,
          type: "error",
          rule: "link-name",
          message: "Link missing accessible name",
          impact: "serious",
        });
      }

      // Check for generic link text
      const linkText = link.textContent?.trim().toLowerCase();
      if (
        linkText &&
        ["click here", "read more", "more", "here"].includes(linkText)
      ) {
        this.addIssue({
          element: link,
          type: "warning",
          rule: "link-text-meaningful",
          message: "Link text should be more descriptive",
          impact: "moderate",
        });
      }
    });
  }

  /**
   * Audit heading structure
   */
  private auditHeadings(container: HTMLElement) {
    const headings = container.querySelectorAll("h1, h2, h3, h4, h5, h6");
    let previousLevel = 0;

    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1));

      // Check for heading hierarchy
      if (level > previousLevel + 1) {
        this.addIssue({
          element: heading as HTMLElement,
          type: "warning",
          rule: "heading-hierarchy",
          message: `Heading level ${level} skips level ${previousLevel + 1}`,
          impact: "moderate",
        });
      }

      // Check for empty headings
      if (!heading.textContent?.trim()) {
        this.addIssue({
          element: heading as HTMLElement,
          type: "error",
          rule: "heading-empty",
          message: "Heading is empty",
          impact: "serious",
        });
      }

      previousLevel = level;
    });

    // Check for missing h1
    const h1 = container.querySelector("h1");
    if (!h1) {
      this.addIssue({
        element: container,
        type: "warning",
        rule: "heading-h1",
        message: "Page missing h1 heading",
        impact: "moderate",
      });
    }
  }

  /**
   * Audit landmark regions
   */
  private auditLandmarks(container: HTMLElement) {
    const landmarks = {
      banner: container.querySelectorAll('[role="banner"], header'),
      navigation: container.querySelectorAll('[role="navigation"], nav'),
      main: container.querySelectorAll('[role="main"], main'),
      contentinfo: container.querySelectorAll('[role="contentinfo"], footer'),
    };

    // Check for main landmark
    if (landmarks.main.length === 0) {
      this.addIssue({
        element: container,
        type: "error",
        rule: "landmark-main",
        message: "Page missing main landmark",
        impact: "serious",
      });
    }

    // Check for multiple main landmarks
    if (landmarks.main.length > 1) {
      landmarks.main.forEach((main, index) => {
        if (index > 0) {
          this.addIssue({
            element: main as HTMLElement,
            type: "error",
            rule: "landmark-main-multiple",
            message: "Multiple main landmarks found",
            impact: "serious",
          });
        }
      });
    }
  }

  /**
   * Audit color contrast (basic check)
   */
  private auditColorContrast(container: HTMLElement) {
    const textElements = container.querySelectorAll(
      "p, span, div, h1, h2, h3, h4, h5, h6, a, button"
    );

    textElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;

      // Basic contrast check (simplified)
      if (color === backgroundColor) {
        this.addIssue({
          element: element as HTMLElement,
          type: "error",
          rule: "color-contrast",
          message: "Text color same as background color",
          impact: "critical",
        });
      }
    });
  }

  /**
   * Audit keyboard navigation
   */
  private auditKeyboardNavigation(container: HTMLElement) {
    const interactiveElements = container.querySelectorAll(
      "a, button, input, select, textarea, [tabindex], [role='button'], [role='link']"
    );

    interactiveElements.forEach((element) => {
      const tabIndex = element.getAttribute("tabindex");

      // Check for positive tabindex
      if (tabIndex && parseInt(tabIndex) > 0) {
        this.addIssue({
          element: element as HTMLElement,
          type: "warning",
          rule: "tabindex-positive",
          message: "Avoid positive tabindex values",
          impact: "moderate",
        });
      }

      // Check for keyboard event handlers
      const hasClick =
        element.hasAttribute("onclick") ||
        (element as HTMLElement).onclick ||
        element.addEventListener;

      if (hasClick && element.tagName !== "BUTTON" && element.tagName !== "A") {
        const hasKeyboardHandler =
          element.hasAttribute("onkeydown") ||
          element.hasAttribute("onkeyup") ||
          element.hasAttribute("onkeypress");

        if (!hasKeyboardHandler) {
          this.addIssue({
            element: element as HTMLElement,
            type: "warning",
            rule: "keyboard-handler",
            message: "Interactive element missing keyboard event handler",
            impact: "moderate",
          });
        }
      }
    });
  }

  /**
   * Audit ARIA labels and attributes
   */
  private auditAriaLabels(container: HTMLElement) {
    const elementsWithAria = container.querySelectorAll(
      "[aria-labelledby], [aria-describedby]"
    );

    elementsWithAria.forEach((element) => {
      const labelledBy = element.getAttribute("aria-labelledby");
      const describedBy = element.getAttribute("aria-describedby");

      // Check if referenced elements exist
      if (labelledBy) {
        const labelElement = container.querySelector(`#${labelledBy}`);
        if (!labelElement) {
          this.addIssue({
            element: element as HTMLElement,
            type: "error",
            rule: "aria-labelledby-reference",
            message: `aria-labelledby references non-existent element: ${labelledBy}`,
            impact: "serious",
          });
        }
      }

      if (describedBy) {
        const descElement = container.querySelector(`#${describedBy}`);
        if (!descElement) {
          this.addIssue({
            element: element as HTMLElement,
            type: "error",
            rule: "aria-describedby-reference",
            message: `aria-describedby references non-existent element: ${describedBy}`,
            impact: "serious",
          });
        }
      }
    });
  }

  /**
   * Audit focus management
   */
  private auditFocusManagement(container: HTMLElement) {
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    // Check for focus indicators
    focusableElements.forEach((element) => {
      const styles = window.getComputedStyle(element, ":focus");
      const outline = styles.outline;
      const boxShadow = styles.boxShadow;

      if (outline === "none" && boxShadow === "none") {
        this.addIssue({
          element: element as HTMLElement,
          type: "warning",
          rule: "focus-indicator",
          message: "Focusable element missing focus indicator",
          impact: "moderate",
        });
      }
    });
  }

  /**
   * Add issue to the list
   */
  private addIssue(issue: AccessibilityIssue) {
    this.issues.push(issue);
  }

  /**
   * Generate accessibility report
   */
  private generateReport(): AccessibilityReport {
    const summary = {
      total: this.issues.length,
      errors: this.issues.filter((issue) => issue.type === "error").length,
      warnings: this.issues.filter((issue) => issue.type === "warning").length,
      info: this.issues.filter((issue) => issue.type === "info").length,
    };

    // Calculate score (simplified)
    const maxScore = 100;
    const errorPenalty = 10;
    const warningPenalty = 5;
    const infoPenalty = 1;

    const penalty =
      summary.errors * errorPenalty +
      summary.warnings * warningPenalty +
      summary.info * infoPenalty;

    const score = Math.max(0, maxScore - penalty);

    return {
      issues: this.issues,
      summary,
      score,
      timestamp: new Date(),
    };
  }

  /**
   * Generate HTML report
   */
  generateHTMLReport(report: AccessibilityReport): string {
    const { issues, summary, score, timestamp } = report;

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Accessibility Report</title>
        <style>
          body { font-family: monospace; margin: 2rem; background: #f5f5f5; }
          .header { background: #000; color: #fff; padding: 1rem; margin-bottom: 2rem; }
          .score { font-size: 2rem; color: ${score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444"}; }
          .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
          .summary-item { background: #fff; padding: 1rem; border: 2px solid #000; text-align: center; }
          .issue { background: #fff; border: 2px solid #000; margin-bottom: 1rem; padding: 1rem; }
          .issue-error { border-color: #ef4444; }
          .issue-warning { border-color: #f59e0b; }
          .issue-info { border-color: #3b82f6; }
          .issue-title { font-weight: bold; margin-bottom: 0.5rem; }
          .issue-message { margin-bottom: 0.5rem; }
          .issue-element { background: #f0f0f0; padding: 0.5rem; font-size: 0.8rem; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Accessibility Report</h1>
          <p>Generated: ${timestamp.toLocaleString()}</p>
          <div class="score">Score: ${score}/100</div>
        </div>
        
        <div class="summary">
          <div class="summary-item">
            <h3>Total Issues</h3>
            <div style="font-size: 2rem;">${summary.total}</div>
          </div>
          <div class="summary-item">
            <h3>Errors</h3>
            <div style="font-size: 2rem; color: #ef4444;">${summary.errors}</div>
          </div>
          <div class="summary-item">
            <h3>Warnings</h3>
            <div style="font-size: 2rem; color: #f59e0b;">${summary.warnings}</div>
          </div>
          <div class="summary-item">
            <h3>Info</h3>
            <div style="font-size: 2rem; color: #3b82f6;">${summary.info}</div>
          </div>
        </div>
        
        <div class="issues">
          ${issues
            .map(
              (issue) => `
            <div class="issue issue-${issue.type}">
              <div class="issue-title">${issue.rule} (${issue.impact})</div>
              <div class="issue-message">${issue.message}</div>
              <div class="issue-element">${issue.element.outerHTML.substring(0, 200)}...</div>
              ${issue.helpUrl ? `<a href="${issue.helpUrl}" target="_blank">Learn more</a>` : ""}
            </div>
          `
            )
            .join("")}
        </div>
      </body>
      </html>
    `;
  }
}

// Development helper functions
export function runAccessibilityAudit(
  container?: HTMLElement
): Promise<AccessibilityReport> {
  const auditor = AccessibilityAuditor.getInstance();
  return auditor.audit(container);
}

export function logAccessibilityReport(report: AccessibilityReport) {
  console.group("🔍 Accessibility Report");
  console.log(`Score: ${report.score}/100`);
  console.log(`Total Issues: ${report.summary.total}`);
  console.log(`Errors: ${report.summary.errors}`);
  console.log(`Warnings: ${report.summary.warnings}`);
  console.log(`Info: ${report.summary.info}`);

  if (report.issues.length > 0) {
    console.group("Issues:");
    report.issues.forEach((issue) => {
      const icon =
        issue.type === "error" ? "❌" : issue.type === "warning" ? "⚠️" : "ℹ️";
      console.log(`${icon} ${issue.rule}: ${issue.message}`, issue.element);
    });
    console.groupEnd();
  }

  console.groupEnd();
}

// Auto-audit in development
if (process.env.NODE_ENV === "development") {
  // Run audit after page load
  window.addEventListener("load", async () => {
    setTimeout(async () => {
      const report = await runAccessibilityAudit();
      logAccessibilityReport(report);
    }, 2000);
  });
}
