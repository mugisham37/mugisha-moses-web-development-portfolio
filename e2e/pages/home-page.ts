import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base-page";

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Hero section elements
  get heroSection(): Locator {
    return this.page.locator('[data-testid="hero-section"]');
  }

  get heroTitle(): Locator {
    return this.heroSection.locator("h1");
  }

  get heroSubtitle(): Locator {
    return this.heroSection.locator('[data-testid="hero-subtitle"]');
  }

  get typewriterText(): Locator {
    return this.page.locator('[data-testid="typewriter-text"]');
  }

  get heroCtaButtons(): Locator {
    return this.heroSection.locator('a[href*="contact"], a[href*="projects"]');
  }

  // Metrics section
  get metricsSection(): Locator {
    return this.page.locator('[data-testid="metrics-section"]');
  }

  get experienceCounter(): Locator {
    return this.page.locator('[data-testid="experience-counter"]');
  }

  get projectsCounter(): Locator {
    return this.page.locator('[data-testid="projects-counter"]');
  }

  get technologiesCounter(): Locator {
    return this.page.locator('[data-testid="technologies-counter"]');
  }

  // Skills section
  get skillsSection(): Locator {
    return this.page.locator('[data-testid="skills-section"]');
  }

  get skillBars(): Locator {
    return this.skillsSection.locator('[data-testid="skill-bar"]');
  }

  get skillIcons(): Locator {
    return this.skillsSection.locator('[data-testid="skill-icon"]');
  }

  // GitHub section
  get githubSection(): Locator {
    return this.page.locator('[data-testid="github-section"]');
  }

  get contributionGraph(): Locator {
    return this.page.locator('[data-testid="contribution-graph"]');
  }

  get repositoryCards(): Locator {
    return this.page.locator('[data-testid="repository-card"]');
  }

  // Featured projects section
  get featuredProjectsSection(): Locator {
    return this.page.locator('[data-testid="featured-projects"]');
  }

  get projectCards(): Locator {
    return this.page.locator('[data-testid="project-card"]');
  }

  // Testimonials section
  get testimonialsSection(): Locator {
    return this.page.locator('[data-testid="testimonials-section"]');
  }

  get testimonialCards(): Locator {
    return this.page.locator('[data-testid="testimonial-card"]');
  }

  get testimonialCarousel(): Locator {
    return this.page.locator('[data-testid="testimonial-carousel"]');
  }

  // Three.js background
  get threeBackground(): Locator {
    return this.page.locator("canvas");
  }

  // Actions
  async visitHomePage() {
    await this.navigate("/");
  }

  async waitForHeroAnimation() {
    await this.heroSection.waitFor({ state: "visible" });
    await this.page.waitForTimeout(2000); // Wait for typewriter animation
  }

  async scrollToSection(
    section: "metrics" | "skills" | "github" | "projects" | "testimonials"
  ) {
    const sectionMap = {
      metrics: this.metricsSection,
      skills: this.skillsSection,
      github: this.githubSection,
      projects: this.featuredProjectsSection,
      testimonials: this.testimonialsSection,
    };

    await this.helpers.scrollToElement(sectionMap[section].locator("").first());
  }

  async checkCounterAnimations() {
    await this.scrollToSection("metrics");

    // Wait for counters to animate
    await this.page.waitForTimeout(1000);

    const experienceText = await this.experienceCounter.textContent();
    const projectsText = await this.projectsCounter.textContent();
    const technologiesText = await this.technologiesCounter.textContent();

    return {
      experience: experienceText,
      projects: projectsText,
      technologies: technologiesText,
    };
  }

  async checkSkillAnimations() {
    await this.scrollToSection("skills");

    // Wait for skill bars to animate
    await this.page.waitForTimeout(1500);

    const skillBars = await this.skillBars.all();
    const animatedBars = [];

    for (const bar of skillBars) {
      const width = await bar.evaluate((el) => {
        const progressBar = el.querySelector('[data-testid="progress-bar"]');
        return progressBar ? getComputedStyle(progressBar).width : "0px";
      });
      animatedBars.push(width);
    }

    return animatedBars;
  }

  async checkGitHubIntegration() {
    await this.scrollToSection("github");

    // Check if contribution graph is loaded
    const contributionCells = await this.contributionGraph
      .locator('[data-testid="contribution-cell"]')
      .count();

    // Check if repositories are loaded
    const repositoryCount = await this.repositoryCards.count();

    return {
      contributionCells,
      repositoryCount,
    };
  }

  async interactWithProjectCard(index = 0) {
    await this.scrollToSection("projects");

    const projectCard = this.projectCards.nth(index);
    await projectCard.hover();

    // Wait for hover animations
    await this.page.waitForTimeout(300);

    // Check if overlay appears
    const overlay = projectCard.locator('[data-testid="project-overlay"]');
    const isOverlayVisible = await overlay.isVisible();

    return { isOverlayVisible };
  }

  async navigateToProjectDetails(index = 0) {
    await this.scrollToSection("projects");

    const projectCard = this.projectCards.nth(index);
    const projectLink = projectCard.locator("a").first();

    await projectLink.click();
    await this.helpers.waitForNavigation();
  }

  async checkTestimonialCarousel() {
    await this.scrollToSection("testimonials");

    const testimonialCount = await this.testimonialCards.count();

    // Check if carousel navigation exists
    const prevButton = this.testimonialsSection.locator(
      '[data-testid="carousel-prev"]'
    );
    const nextButton = this.testimonialsSection.locator(
      '[data-testid="carousel-next"]'
    );

    const hasPrevButton = await prevButton.isVisible();
    const hasNextButton = await nextButton.isVisible();

    // Test carousel navigation if buttons exist
    if (hasNextButton) {
      await nextButton.click();
      await this.page.waitForTimeout(500); // Animation time
    }

    return {
      testimonialCount,
      hasPrevButton,
      hasNextButton,
    };
  }

  async checkThreeJsBackground() {
    const canvas = this.threeBackground;
    await canvas.waitFor({ state: "visible" });

    // Check if canvas is rendering (has non-zero dimensions)
    const canvasSize = await canvas.boundingBox();

    return {
      isVisible: await canvas.isVisible(),
      width: canvasSize?.width || 0,
      height: canvasSize?.height || 0,
    };
  }

  async checkAllAnimations() {
    const results = {
      hero: false,
      counters: false,
      skills: false,
      threeJs: false,
    };

    try {
      // Check hero animations
      await this.waitForHeroAnimation();
      results.hero = true;

      // Check counter animations
      const counters = await this.checkCounterAnimations();
      results.counters = Object.values(counters).every(
        (val) => val && val !== "0"
      );

      // Check skill animations
      const skillBars = await this.checkSkillAnimations();
      results.skills = skillBars.some((width) => width !== "0px");

      // Check Three.js background
      const threeJs = await this.checkThreeJsBackground();
      results.threeJs = threeJs.isVisible && threeJs.width > 0;
    } catch (error) {
      console.error("Animation check failed:", error);
    }

    return results;
  }
}
