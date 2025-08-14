import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { HeroSection } from "@/components/sections/hero-section";
import { StructuredData } from "@/components/seo/structured-data";
import {
  ScrollTriggered,
  ScrollStagger,
} from "@/components/animations/scroll-triggered";
import {
  ViewportAnimation,
  StaggeredAnimation,
  ParallaxElement,
} from "@/components/animations/advanced-scroll-effects";
import {
  ScrollRevealStagger,
  MultiLayerParallax,
  ScrollTextReveal,
} from "@/components/animations/scroll-reveal-system";
import {
  ScrollNavigation,
  ScrollProgressWithSections,
  FloatingScrollIndicator,
} from "@/components/animations/scroll-navigation";
import { SmoothScrollLink } from "@/components/ui/smooth-scroll-link";
import { TechnicalSkillsVisualization } from "@/components/sections/technical-skills-visualization";
import { TestimonialCarousel } from "@/components/sections/testimonial-carousel";
import { ContactEngagementHub } from "@/components/sections/contact-engagement-hub";
import { ProjectShowcase } from "@/components/sections/project-showcase";

import { SITE_CONFIG } from "@/lib/constants";

export default function Home() {
  const homePageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Home",
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    mainEntity: {
      "@type": "Person",
      name: SITE_CONFIG.author.name,
      jobTitle: "Full-Stack Developer",
      url: SITE_CONFIG.url,
      sameAs: [SITE_CONFIG.author.github, SITE_CONFIG.author.linkedin],
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_CONFIG.url,
        },
      ],
    },
  };

  const navigationSections = [
    { id: "hero", label: "Hero", color: "#ffff00" },
    { id: "projects-preview", label: "Projects", color: "#ff6b6b" },
    { id: "technical-experience", label: "Skills", color: "#4ecdc4" },
    { id: "blog-preview", label: "Blog", color: "#45b7d1" },
    { id: "services-preview", label: "Services", color: "#96ceb4" },
    { id: "testimonials-preview", label: "Testimonials", color: "#feca57" },
    { id: "contact-engagement", label: "Contact", color: "#ff6b6b" },
  ];

  return (
    <main className="min-h-screen" id="main-content">
      <StructuredData data={homePageStructuredData} />

      {/* Advanced Scroll Navigation */}
      <ScrollProgressWithSections
        sections={navigationSections}
        height={4}
        showSectionMarkers={true}
      />
      <ScrollNavigation
        sections={navigationSections}
        position="right"
        showLabels={true}
      />
      <FloatingScrollIndicator />

      {/* Hero Section */}
      <section id="hero">
        <HeroSection />
      </section>

      {/* Projects Preview Section */}
      <Section padding="xl" background="textured-light" id="projects-preview">
        <Container>
          <ProjectShowcase />
        </Container>
      </Section>

      {/* Technical Experience Section */}
      <Section
        padding="xl"
        background="dark-gradient"
        id="technical-experience"
      >
        <Container>
          <TechnicalSkillsVisualization />
        </Container>
      </Section>

      {/* Blog Preview Section */}
      <Section padding="xl" background="light-gradient" id="blog-preview">
        <Container>
          <ScrollStagger className="space-y-12" staggerDelay={0.2}>
            <ScrollTriggered animation="slideUp" delay={0.1}>
              <div className="space-y-4 text-center">
                <ScrollTextReveal
                  text="LATEST INSIGHTS"
                  className="font-mono text-4xl font-bold text-black uppercase md:text-6xl"
                  stagger={0.05}
                  animation="slideUp"
                />
                <Typography
                  variant="body"
                  className="text-brutalist-charcoal-200 mx-auto max-w-2xl"
                >
                  Deep dives into modern web development, architecture patterns,
                  and industry best practices. Raw knowledge that transforms
                  developers.
                </Typography>
              </div>
            </ScrollTriggered>

            <ScrollRevealStagger
              animation="scaleInRotate"
              config={{ stagger: 0.2, delay: 0.2, easing: "backOut" }}
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              <Card
                variant="default"
                hover="lift"
                className="group border-4 border-black bg-white"
              >
                <CardHeader>
                  <CardTitle className="text-black">
                    BUILDING SCALABLE REACT ARCHITECTURES
                  </CardTitle>
                  <CardDescription className="text-brutalist-charcoal-200">
                    December 2024 • 8 min read • 2.5K views
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Typography
                    variant="body"
                    className="text-brutalist-charcoal-200 mb-4"
                  >
                    Exploring advanced patterns for building maintainable React
                    applications that scale with your team and business needs.
                    No fluff, just battle-tested strategies.
                  </Typography>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="text-brutalist-yellow bg-black px-2 py-1 font-mono text-xs uppercase">
                      React
                    </span>
                    <span className="text-brutalist-yellow bg-black px-2 py-1 font-mono text-xs uppercase">
                      Architecture
                    </span>
                    <span className="text-brutalist-yellow bg-black px-2 py-1 font-mono text-xs uppercase">
                      Scalability
                    </span>
                  </div>
                  <div className="text-brutalist-charcoal-200 flex items-center justify-between text-xs">
                    <span>★★★★★ 4.9/5</span>
                    <span>15 min read</span>
                  </div>
                </CardContent>
              </Card>

              <Card
                variant="elevated"
                hover="glow"
                className="group bg-brutalist-charcoal-100 border-4 border-black"
              >
                <CardHeader>
                  <CardTitle className="text-brutalist-yellow">
                    TYPESCRIPT ADVANCED PATTERNS
                  </CardTitle>
                  <CardDescription className="text-white">
                    November 2024 • 12 min read • 3.1K views
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Typography variant="body" className="mb-4 text-white">
                    Master advanced TypeScript techniques for building type-safe
                    applications with complex business logic. Elite-level
                    patterns that separate pros from amateurs.
                  </Typography>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="bg-brutalist-yellow px-2 py-1 font-mono text-xs text-black uppercase">
                      TypeScript
                    </span>
                    <span className="bg-brutalist-yellow px-2 py-1 font-mono text-xs text-black uppercase">
                      Patterns
                    </span>
                    <span className="bg-brutalist-yellow px-2 py-1 font-mono text-xs text-black uppercase">
                      Type Safety
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-white">
                    <span>★★★★★ 4.8/5</span>
                    <span>20 min read</span>
                  </div>
                </CardContent>
              </Card>

              <Card
                variant="accent"
                hover="invert"
                className="group bg-brutalist-yellow border-4 border-black"
              >
                <CardHeader>
                  <CardTitle className="text-black">
                    PERFORMANCE OPTIMIZATION MASTERY
                  </CardTitle>
                  <CardDescription className="text-black">
                    October 2024 • 10 min read • 4.2K views
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Typography variant="body" className="mb-4 text-black">
                    Transform slow applications into speed demons. Achieve 90+
                    Lighthouse scores and sub-2-second loading times with
                    brutalist efficiency.
                  </Typography>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="text-brutalist-yellow bg-black px-2 py-1 font-mono text-xs uppercase">
                      Performance
                    </span>
                    <span className="text-brutalist-yellow bg-black px-2 py-1 font-mono text-xs uppercase">
                      Optimization
                    </span>
                    <span className="text-brutalist-yellow bg-black px-2 py-1 font-mono text-xs uppercase">
                      Core Web Vitals
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-black">
                    <span>★★★★★ 5.0/5</span>
                    <span>18 min read</span>
                  </div>
                </CardContent>
              </Card>
            </ScrollRevealStagger>

            <ScrollTriggered animation="slideUp" delay={0.4}>
              <div className="space-y-6 text-center">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <Typography
                      variant="h3"
                      className="text-2xl font-bold text-black"
                    >
                      50+
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-brutalist-charcoal-200 font-mono text-xs uppercase"
                    >
                      Technical Articles
                    </Typography>
                  </div>
                  <div className="text-center">
                    <Typography
                      variant="h3"
                      className="text-2xl font-bold text-black"
                    >
                      25K+
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-brutalist-charcoal-200 font-mono text-xs uppercase"
                    >
                      Monthly Readers
                    </Typography>
                  </div>
                  <div className="text-center">
                    <Typography
                      variant="h3"
                      className="text-2xl font-bold text-black"
                    >
                      4.9/5
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-brutalist-charcoal-200 font-mono text-xs uppercase"
                    >
                      Average Rating
                    </Typography>
                  </div>
                </div>
                <Button variant="secondary" size="lg" asChild>
                  <SmoothScrollLink href="/blog">
                    READ ALL ARTICLES →
                  </SmoothScrollLink>
                </Button>
              </div>
            </ScrollTriggered>
          </ScrollStagger>
        </Container>
      </Section>

      {/* Services Preview Section */}
      <Section padding="xl" background="accent-gradient" id="services-preview">
        <Container>
          <ScrollStagger className="space-y-12" staggerDelay={0.2}>
            <ScrollTriggered animation="slideUp" delay={0.1}>
              <div className="space-y-4 text-center">
                <Typography
                  variant="h2"
                  className="text-brutalist-yellow text-4xl font-bold uppercase md:text-6xl"
                >
                  ELITE SERVICES
                </Typography>
                <Typography
                  variant="body"
                  className="text-brutalist-off-white-100 mx-auto max-w-2xl"
                >
                  Transform your ideas into digital dominance with brutalist
                  precision and uncompromising quality.
                </Typography>
              </div>
            </ScrollTriggered>

            <ScrollRevealStagger
              animation="brutalistPunch"
              config={{ stagger: 0.2, delay: 0.2, easing: "backOut" }}
              className="grid grid-cols-1 gap-8 md:grid-cols-3"
            >
              <Card variant="default" hover="lift" className="text-center">
                <CardHeader>
                  <div className="mb-4 text-6xl">⚡</div>
                  <div className="mb-2 flex items-center justify-center">
                    <CardTitle className="text-brutalist-yellow">
                      WEB DEVELOPMENT
                    </CardTitle>
                    <span className="ml-2 bg-green-500 px-2 py-1 font-mono text-xs text-white uppercase">
                      POPULAR
                    </span>
                  </div>
                  <CardDescription>Full-Stack Solutions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Typography variant="body" className="mb-4">
                    Custom web applications built with modern technologies and
                    scalable architecture. 90+ Lighthouse scores guaranteed.
                  </Typography>
                  <div className="mb-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>✓ React/Next.js Development</span>
                    </div>
                    <div className="flex justify-between">
                      <span>✓ Performance Optimization</span>
                    </div>
                    <div className="flex justify-between">
                      <span>✓ 3 Months Support</span>
                    </div>
                  </div>
                  <Typography
                    variant="caption"
                    className="text-brutalist-yellow font-mono text-lg font-bold uppercase"
                  >
                    FROM $5,000
                  </Typography>
                </CardContent>
              </Card>

              <Card variant="elevated" hover="glow" className="text-center">
                <CardHeader>
                  <div className="mb-4 text-6xl">🚀</div>
                  <CardTitle className="text-brutalist-yellow">
                    TECHNICAL CONSULTING
                  </CardTitle>
                  <CardDescription>Architecture & Strategy</CardDescription>
                </CardHeader>
                <CardContent>
                  <Typography variant="body" className="mb-4">
                    Expert guidance on technology decisions, architecture
                    design, and team scaling. Immediate impact guaranteed.
                  </Typography>
                  <div className="mb-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>✓ Code Quality Audits</span>
                    </div>
                    <div className="flex justify-between">
                      <span>✓ Performance Reviews</span>
                    </div>
                    <div className="flex justify-between">
                      <span>✓ Team Training</span>
                    </div>
                  </div>
                  <Typography
                    variant="caption"
                    className="text-brutalist-yellow font-mono text-lg font-bold uppercase"
                  >
                    FROM $200/HOUR
                  </Typography>
                </CardContent>
              </Card>

              <Card variant="accent" hover="invert" className="text-center">
                <CardHeader>
                  <div className="mb-4 text-6xl text-black">💎</div>
                  <div className="mb-2 flex items-center justify-center">
                    <CardTitle className="text-black">
                      PREMIUM SUPPORT
                    </CardTitle>
                    <span className="ml-2 bg-red-500 px-2 py-1 font-mono text-xs text-white uppercase">
                      24/7
                    </span>
                  </div>
                  <CardDescription className="text-black">
                    Elite Maintenance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Typography variant="body" className="mb-4 text-black">
                    Ongoing maintenance, updates, and performance optimization
                    for your applications. Never worry about downtime again.
                  </Typography>
                  <div className="mb-4 space-y-2 text-xs text-black">
                    <div className="flex justify-between">
                      <span>✓ 24/7 Monitoring</span>
                    </div>
                    <div className="flex justify-between">
                      <span>✓ Security Updates</span>
                    </div>
                    <div className="flex justify-between">
                      <span>✓ Performance Reports</span>
                    </div>
                  </div>
                  <Typography
                    variant="caption"
                    className="font-mono text-lg font-bold text-black uppercase"
                  >
                    FROM $1,500/MONTH
                  </Typography>
                </CardContent>
              </Card>
            </ScrollRevealStagger>

            <ScrollTriggered animation="slideUp" delay={0.3}>
              <div className="text-center">
                <Button variant="accent" size="lg" asChild>
                  <SmoothScrollLink href="/services">
                    EXPLORE SERVICES →
                  </SmoothScrollLink>
                </Button>
              </div>
            </ScrollTriggered>
          </ScrollStagger>
        </Container>
      </Section>

      {/* Testimonials Preview Section */}
      <Section
        padding="xl"
        background="textured-dark"
        id="testimonials-preview"
      >
        <Container>
          <TestimonialCarousel />
        </Container>
      </Section>

      {/* Contact Engagement Section */}
      <Section padding="xl" background="dark-gradient" id="contact-engagement">
        <Container>
          <ContactEngagementHub />
        </Container>
      </Section>
    </main>
  );
}
