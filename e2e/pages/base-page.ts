import { Page, Locator } from "@playwright/test";
import { TestHelpers } from "../utils/test-helpers";

export abstract class BasePage {
  protected helpers: TestHelpers;

  constructor(protected page: Page) {
    this.helpers = new TestHelpers(page);
  }

  // Common elements across all pages
  get header(): Locator {
    return this.page.locator('header[role="banner"]');
  }

  get footer(): Locator {
    return this.page.locator("footer");
  }

  get mainContent(): Locator {
    return this.page.locator("main");
  }

  get skipNavLink(): Locator {
    return this.page.locator('a[href="#main-content"]');
  }

  // Navigation elements
  get homeLink(): Locator {
    return this.page.locator('nav a[href="/"]');
  }

  get projectsLink(): Locator {
    return this.page.locator('nav a[href="/projects"]');
  }

  get blogLink(): Locator {
    return this.page.locator('nav a[href="/blog"]');
  }

  get servicesLink(): Locator {
    return this.page.locator('nav a[href="/services"]');
  }

  get contactLink(): Locator {
    return this.page.locator('nav a[href="/contact"]');
  }

  get mobileMenuButton(): Locator {
    return this.page.locator('button[aria-label*="menu"]');
  }

  get ctaButton(): Locator {
    return this.page.locator('a:has-text("Get In Touch")');
  }

  // Common actions
  async navigate(url: string) {
    await this.page.goto(url);
    await this.helpers.waitForPageLoad();
  }

  async clickNavigation(
    link: "home" | "projects" | "blog" | "services" | "contact"
  ) {
    const linkMap = {
      home: this.homeLink,
      projects: this.projectsLink,
      blog: this.blogLink,
      services: this.servicesLink,
      contact: this.contactLink,
    };

    await linkMap[link].click();
    await this.helpers.waitForNavigation();
  }

  async openMobileMenu() {
    await this.mobileMenuButton.click();
    await this.page.waitForTimeout(300); // Animation time
  }

  async checkHeaderVisibility() {
    await this.header.waitFor({ state: "visible" });
    return this.header.isVisible();
  }

  async checkFooterVisibility() {
    await this.footer.waitFor({ state: "visible" });
    return this.footer.isVisible();
  }

  async useSkipNavigation() {
    // Focus on skip nav link (usually hidden until focused)
    await this.page.keyboard.press("Tab");
    await this.skipNavLink.click();
  }

  async checkPageTitle(expectedTitle: string) {
    await this.page.waitForFunction(
      (title) => document.title.includes(title),
      expectedTitle
    );
  }

  async checkMetaDescription(expectedDescription: string) {
    const metaDescription = await this.page
      .locator('meta[name="description"]')
      .getAttribute("content");
    return metaDescription?.includes(expectedDescription) || false;
  }

  async checkCanonicalUrl(expectedUrl: string) {
    const canonical = await this.page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    return canonical === expectedUrl;
  }

  async checkOpenGraphTags() {
    const ogTitle = await this.page
      .locator('meta[property="og:title"]')
      .getAttribute("content");
    const ogDescription = await this.page
      .locator('meta[property="og:description"]')
      .getAttribute("content");
    const ogImage = await this.page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    const ogUrl = await this.page
      .locator('meta[property="og:url"]')
      .getAttribute("content");

    return {
      title: ogTitle,
      description: ogDescription,
      image: ogImage,
      url: ogUrl,
    };
  }

  async checkStructuredData() {
    const structuredData = await this.page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    return structuredData
      .map((data) => {
        try {
          return JSON.parse(data);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  }
}
