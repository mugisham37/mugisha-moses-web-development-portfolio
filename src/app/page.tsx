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
  ScrollProgressIndicator,
} from "@/components/animations/advanced-scroll-effects";
import {
  ScrollReveal,
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
          <StaggeredAnimation className="space-y-12" staggerDelay={0.15}>
            <ViewportAnimation
              variant="fadeInUp"
              delay={0.1}
              easing="brutalist"
            >
              <div className="space-y-4 text-center">
                <ScrollTextReveal
                  text="FEATURED PROJECTS"
                  className="font-mono text-4xl font-bold text-black uppercase md:text-6xl"
                  stagger={0.03}
                  animation="slideUp"
                />
                <ViewportAnimation variant="fadeInUp" delay={0.3}>
                  <Typography
                    variant="body"
                    className="text-brutalist-charcoal-200 mx-auto max-w-2xl"
                  >
                    Explore cutting-edge web applications built with modern
                    technologies and brutalist design principles.
                  </Typography>
                </ViewportAnimation>
              </div>
            </ViewportAnimation>

            <ScrollRevealStagger
              animation="scaleInRotate"
              config={{ stagger: 0.2, delay: 0.2, easing: "backOut" }}
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              <ParallaxElement speed={0.2} direction="vertical">
                <Card
                  variant="default"
                  hover="lift"
                  className="group border-4 border-black bg-white"
                >
                  <CardHeader>
                    <CardTitle className="text-black">
                      E-COMMERCE PLATFORM
                    </CardTitle>
                    <CardDescription className="text-brutalist-charcoal-200">
                      Next.js • TypeScript • Stripe
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Typography
                      variant="body"
                      className="text-brutalist-charcoal-200 mb-4"
                    >
                      Full-stack e-commerce solution with advanced payment
                      processing and inventory management.
                    </Typography>
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="text-brutalist-yellow bg-black px-2 py-1 font-mono text-xs uppercase">
                        React
                      </span>
                      <span className="text-brutalist-yellow bg-black px-2 py-1 font-mono text-xs uppercase">
                        Node.js
                      </span>
                      <span className="text-brutalist-yellow bg-black px-2 py-1 font-mono text-xs uppercase">
                        PostgreSQL
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </ParallaxElement>

              <ParallaxElement speed={0.3} direction="vertical">
                <Card
                  variant="elevated"
                  hover="glow"
                  className="group bg-brutalist-charcoal-100 border-4 border-black"
                >
                  <CardHeader>
                    <CardTitle className="text-brutalist-yellow">
                      REAL-TIME DASHBOARD
                    </CardTitle>
                    <CardDescription className="text-white">
                      React • WebSocket • D3.js
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Typography variant="body" className="mb-4 text-white">
                      Interactive analytics dashboard with real-time data
                      visualization and user management.
                    </Typography>
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="bg-brutalist-yellow px-2 py-1 font-mono text-xs text-black uppercase">
                        React
                      </span>
                      <span className="bg-brutalist-yellow px-2 py-1 font-mono text-xs text-black uppercase">
                        WebSocket
                      </span>
                      <span className="bg-brutalist-yellow px-2 py-1 font-mono text-xs text-black uppercase">
                        D3.js
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </ParallaxElement>

              <ParallaxElement speed={0.25} direction="vertical">
                <Card
                  variant="accent"
                  hover="invert"
                  className="group bg-brutalist-yellow border-4 border-black"
                >
                  <CardHeader>
                    <CardTitle className="text-black">
                      MOBILE-FIRST PWA
                    </CardTitle>
                    <CardDescription className="text-black">
                      PWA • Service Workers • IndexedDB
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Typography variant="body" className="mb-4 text-black">
                      Progressive web application with offline functionality and
                      native-like performance.
                    </Typography>
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="text-brutalist-yellow bg-black px-2 py-1 font-mono text-xs uppercase">
                        PWA
                      </span>
                      <span className="text-brutalist-yellow bg-black px-2 py-1 font-mono text-xs uppercase">
                        Offline
                      </span>
                      <span className="text-brutalist-yellow bg-black px-2 py-1 font-mono text-xs uppercase">
                        Mobile
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </ParallaxElement>
            </ScrollRevealStagger>

            <ViewportAnimation
              variant="scaleInRotate"
              delay={0.4}
              easing="elastic"
            >
              <div className="text-center">
                <Button variant="accent" size="lg" asChild>
                  <SmoothScrollLink href="/projects">
                    VIEW ALL PROJECTS →
                  </SmoothScrollLink>
                </Button>
              </div>
            </ViewportAnimation>
          </StaggeredAnimation>
        </Container>
      </Section>

      {/* Technical Experience Section */}
      <Section
        padding="xl"
        background="dark-gradient"
        id="technical-experience"
      >
        <Container>
          <MultiLayerParallax
            className="space-y-12"
            layers={[
              { speed: 0.3, direction: "up" },
              { speed: 0.5, direction: "down" },
              { speed: 0.2, direction: "up" },
            ]}
          >
            <ViewportAnimation
              variant="brutalistSlam"
              delay={0.1}
              easing="elastic"
            >
              <div className="space-y-4 text-center">
                <ScrollTextReveal
                  text="TECHNICAL ARSENAL"
                  className="text-brutalist-yellow font-mono text-4xl font-bold uppercase md:text-6xl"
                  stagger={0.05}
                  animation="rotateIn"
                />
                <ViewportAnimation variant="fadeInUp" delay={0.5}>
                  <Typography
                    variant="body"
                    className="text-brutalist-off-white-100 mx-auto max-w-2xl"
                  >
                    Raw power. Uncompromising tools. Digital concrete that
                    builds the future.
                  </Typography>
                </ViewportAnimation>
              </div>
            </ViewportAnimation>

            <ScrollRevealStagger
              animation="brutalistPunch"
              config={{ stagger: 0.3, delay: 0.2, easing: "backOut" }}
              className="grid grid-cols-1 gap-0 md:grid-cols-3"
            >
              <div className="group border-4 border-white p-8 transition-all duration-300 hover:bg-white hover:text-black">
                <Typography
                  variant="h3"
                  className="mb-4 text-2xl font-bold uppercase"
                >
                  FRONTEND MASTERY
                </Typography>
                <Typography variant="body" className="mb-6">
                  React, Next.js, TypeScript, Tailwind CSS. Modern frameworks
                  wielded with precision.
                </Typography>
                <div className="bg-brutalist-yellow h-1 w-1/2 transition-all duration-300 group-hover:w-full"></div>
              </div>
              <div className="group border-4 border-white p-8 transition-all duration-300 hover:bg-white hover:text-black">
                <Typography
                  variant="h3"
                  className="mb-4 text-2xl font-bold uppercase"
                >
                  BACKEND POWER
                </Typography>
                <Typography variant="body" className="mb-6">
                  Node.js, Python, PostgreSQL, Redis. Server architecture that
                  scales without compromise.
                </Typography>
                <div className="bg-brutalist-yellow h-1 w-1/2 transition-all duration-300 group-hover:w-full"></div>
              </div>
              <div className="group border-4 border-white p-8 transition-all duration-300 hover:bg-white hover:text-black">
                <Typography
                  variant="h3"
                  className="mb-4 text-2xl font-bold uppercase"
                >
                  DEVOPS EXCELLENCE
                </Typography>
                <Typography variant="body" className="mb-6">
                  Docker, AWS, CI/CD, Monitoring. Infrastructure that never
                  sleeps, never fails.
                </Typography>
                <div className="bg-brutalist-yellow h-1 w-1/2 transition-all duration-300 group-hover:w-full"></div>
              </div>
            </ScrollRevealStagger>
          </MultiLayerParallax>
        </Container>
      </Section>

      {/* Blog Preview Section */}
      <Section padding="xl" background="light-gradient" id="blog-preview">
        <Container>
          <ScrollStagger className="space-y-12" staggerDelay={0.2}>
            <ScrollTriggered animation="slideUp" delay={0.1}>
              <div className="space-y-4 text-center">
                <Typography
                  variant="h2"
                  className="text-4xl font-bold text-black uppercase md:text-6xl"
                >
                  LATEST INSIGHTS
                </Typography>
                <Typography
                  variant="body"
                  className="text-brutalist-charcoal-200 mx-auto max-w-2xl"
                >
                  Deep dives into modern web development, architecture patterns,
                  and industry best practices.
                </Typography>
              </div>
            </ScrollTriggered>

            <ScrollTriggered animation="slideUp" delay={0.2}>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
                      December 2024 • 8 min read
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Typography
                      variant="body"
                      className="text-brutalist-charcoal-200 mb-4"
                    >
                      Exploring advanced patterns for building maintainable
                      React applications that scale with your team and business
                      needs.
                    </Typography>
                    <div className="flex flex-wrap gap-2">
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
                      November 2024 • 12 min read
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Typography variant="body" className="mb-4 text-white">
                      Master advanced TypeScript techniques for building
                      type-safe applications with complex business logic.
                    </Typography>
                    <div className="flex flex-wrap gap-2">
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
                  </CardContent>
                </Card>
              </div>
            </ScrollTriggered>

            <ScrollTriggered animation="slideUp" delay={0.3}>
              <div className="text-center">
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

            <ScrollTriggered animation="slideUp" delay={0.2}>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <Card variant="default" hover="lift" className="text-center">
                  <CardHeader>
                    <div className="mb-4 text-6xl">⚡</div>
                    <CardTitle className="text-brutalist-yellow">
                      WEB DEVELOPMENT
                    </CardTitle>
                    <CardDescription>Full-Stack Solutions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Typography variant="body" className="mb-4">
                      Custom web applications built with modern technologies and
                      scalable architecture.
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-brutalist-yellow font-mono uppercase"
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
                      design, and team scaling.
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-brutalist-yellow font-mono uppercase"
                    >
                      FROM $200/HOUR
                    </Typography>
                  </CardContent>
                </Card>

                <Card variant="accent" hover="invert" className="text-center">
                  <CardHeader>
                    <div className="mb-4 text-6xl text-black">💎</div>
                    <CardTitle className="text-black">
                      PREMIUM SUPPORT
                    </CardTitle>
                    <CardDescription className="text-black">
                      24/7 Maintenance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Typography variant="body" className="mb-4 text-black">
                      Ongoing maintenance, updates, and performance optimization
                      for your applications.
                    </Typography>
                    <Typography
                      variant="caption"
                      className="font-mono text-black uppercase"
                    >
                      FROM $1,500/MONTH
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            </ScrollTriggered>

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
          <ScrollStagger className="space-y-12" staggerDelay={0.2}>
            <ScrollTriggered animation="slideUp" delay={0.1}>
              <div className="space-y-4 text-center">
                <Typography
                  variant="h2"
                  className="text-brutalist-yellow text-4xl font-bold uppercase md:text-6xl"
                >
                  CLIENT VICTORIES
                </Typography>
                <Typography
                  variant="body"
                  className="text-brutalist-off-white-100 mx-auto max-w-2xl"
                >
                  Real results from real clients who achieved extraordinary
                  success with our elite development services.
                </Typography>
              </div>
            </ScrollTriggered>

            <ScrollTriggered animation="slideUp" delay={0.2}>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <Card variant="default" hover="lift" className="group">
                  <CardContent className="p-8">
                    <div className="text-brutalist-yellow mb-4 text-4xl">
                      &ldquo;
                    </div>
                    <Typography variant="body" className="mb-6 text-lg">
                      &ldquo;The team delivered a flawless e-commerce platform
                      that increased our conversion rate by 340%. Their
                      brutalist approach to problem-solving is exactly what we
                      needed.&rdquo;
                    </Typography>
                    <div className="flex items-center space-x-4">
                      <div className="bg-brutalist-yellow flex h-12 w-12 items-center justify-center rounded-full">
                        <span className="text-lg font-bold text-black">S</span>
                      </div>
                      <div>
                        <Typography
                          variant="body"
                          className="text-brutalist-yellow font-bold"
                        >
                          Sarah Chen
                        </Typography>
                        <Typography
                          variant="caption"
                          className="text-brutalist-off-white-100"
                        >
                          CEO, TechStart Inc.
                        </Typography>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="elevated" hover="glow" className="group">
                  <CardContent className="p-8">
                    <div className="text-brutalist-yellow mb-4 text-4xl">
                      &ldquo;
                    </div>
                    <Typography variant="body" className="mb-6 text-lg">
                      &ldquo;Exceptional technical expertise and uncompromising
                      attention to detail. Our dashboard now handles 10x the
                      traffic with zero downtime.&rdquo;
                    </Typography>
                    <div className="flex items-center space-x-4">
                      <div className="bg-brutalist-yellow flex h-12 w-12 items-center justify-center rounded-full">
                        <span className="text-lg font-bold text-black">M</span>
                      </div>
                      <div>
                        <Typography
                          variant="body"
                          className="text-brutalist-yellow font-bold"
                        >
                          Marcus Rodriguez
                        </Typography>
                        <Typography
                          variant="caption"
                          className="text-brutalist-off-white-100"
                        >
                          CTO, DataFlow Systems
                        </Typography>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollTriggered>

            <ScrollTriggered animation="slideUp" delay={0.3}>
              <div className="space-y-6 text-center">
                <div className="flex items-center justify-center space-x-8">
                  <div className="text-center">
                    <Typography
                      variant="h3"
                      className="text-brutalist-yellow text-4xl font-bold"
                    >
                      50+
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-brutalist-off-white-100 uppercase"
                    >
                      Projects Delivered
                    </Typography>
                  </div>
                  <div className="text-center">
                    <Typography
                      variant="h3"
                      className="text-brutalist-yellow text-4xl font-bold"
                    >
                      98%
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-brutalist-off-white-100 uppercase"
                    >
                      Client Satisfaction
                    </Typography>
                  </div>
                  <div className="text-center">
                    <Typography
                      variant="h3"
                      className="text-brutalist-yellow text-4xl font-bold"
                    >
                      24/7
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-brutalist-off-white-100 uppercase"
                    >
                      Support Available
                    </Typography>
                  </div>
                </div>
                <Button variant="secondary" size="lg" asChild>
                  <SmoothScrollLink href="/testimonials">
                    READ ALL TESTIMONIALS →
                  </SmoothScrollLink>
                </Button>
              </div>
            </ScrollTriggered>
          </ScrollStagger>
        </Container>
      </Section>
    </main>
  );
}
