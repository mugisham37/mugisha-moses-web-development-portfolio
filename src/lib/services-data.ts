// Service data types and utilities
export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  content?: string;
  priceFrom?: number;
  priceTo?: number;
  priceType: "HOURLY" | "PROJECT" | "MONTHLY" | "CUSTOM";
  features: string[];
  highlights: string[];
  processSteps?: ProcessStep[];
  deliveryTime?: string;
  deliverables: string[];
  featured: boolean;
  popular: boolean;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  active: boolean;
  faqs: ServiceFAQ[];
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  deliverables: string[];
  icon?: string;
}

export interface ServiceFAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

// Mock service data - in production this would come from the database
export const servicesData: Service[] = [
  {
    id: "web-development",
    name: "Web Development",
    slug: "web-development",
    description:
      "Custom web applications built with cutting-edge technologies and brutalist precision. From concept to deployment, we create digital experiences that dominate.",
    content: `
# ELITE WEB DEVELOPMENT

Transform your vision into a digital weapon. Our web development service combines modern technologies with brutalist design principles to create applications that don't just work—they dominate.

## WHAT YOU GET

Every web application we build is a testament to technical excellence and design sophistication. We don't just write code; we architect digital experiences that convert visitors into customers and ideas into empires.

## TECHNOLOGIES WE MASTER

- **Frontend**: React, Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Python, PostgreSQL, Redis
- **Cloud**: Vercel, AWS, Docker, Kubernetes
- **Performance**: Edge computing, CDN optimization, Core Web Vitals
    `,
    priceFrom: 500000, // $5,000 in cents
    priceTo: 5000000, // $50,000 in cents
    priceType: "PROJECT",
    features: [
      "Custom React/Next.js applications",
      "Responsive brutalist design system",
      "Performance optimization (90+ Lighthouse scores)",
      "SEO optimization and meta tag management",
      "Database design and API development",
      "Authentication and security implementation",
      "Deployment and hosting setup",
      "3 months of maintenance and support",
    ],
    highlights: [
      "90+ Lighthouse Performance Scores",
      "Sub-2-second loading times globally",
      "Mobile-first responsive design",
      "Enterprise-grade security",
    ],
    processSteps: [
      {
        id: "discovery",
        title: "DISCOVERY & STRATEGY",
        description:
          "Deep dive into your business goals, target audience, and technical requirements. We analyze competitors and define the project scope with military precision.",
        duration: "1-2 weeks",
        deliverables: [
          "Technical requirements document",
          "Project timeline and milestones",
          "Technology stack recommendations",
          "Wireframes and user flow diagrams",
        ],
        icon: "🎯",
      },
      {
        id: "design",
        title: "DESIGN & ARCHITECTURE",
        description:
          "Create brutalist design system and technical architecture. Every pixel and every line of code is planned for maximum impact and performance.",
        duration: "2-3 weeks",
        deliverables: [
          "Brutalist design system",
          "High-fidelity mockups",
          "Database schema design",
          "API architecture documentation",
        ],
        icon: "🏗️",
      },
      {
        id: "development",
        title: "DEVELOPMENT & TESTING",
        description:
          "Build your application with test-driven development and continuous integration. Every feature is battle-tested before deployment.",
        duration: "4-8 weeks",
        deliverables: [
          "Fully functional web application",
          "Comprehensive test suite",
          "Performance optimization",
          "Security audit and fixes",
        ],
        icon: "⚡",
      },
      {
        id: "deployment",
        title: "DEPLOYMENT & LAUNCH",
        description:
          "Deploy to production with zero-downtime strategies and monitoring. Your application goes live with enterprise-grade infrastructure.",
        duration: "1 week",
        deliverables: [
          "Production deployment",
          "Monitoring and analytics setup",
          "Documentation and training",
          "Post-launch support plan",
        ],
        icon: "🚀",
      },
    ],
    deliveryTime: "6-12 weeks",
    deliverables: [
      "Custom web application",
      "Source code and documentation",
      "Deployment and hosting setup",
      "Performance optimization report",
      "3 months of maintenance",
    ],
    featured: true,
    popular: true,
    order: 1,
    metaTitle: "WEB DEVELOPMENT | ELITE DIGITAL SOLUTIONS",
    metaDescription:
      "Custom web applications built with cutting-edge technologies and brutalist precision. Transform your vision into digital dominance.",
    active: true,
    faqs: [
      {
        id: "faq-1",
        question: "What technologies do you use for web development?",
        answer:
          "We specialize in modern technologies including React, Next.js, TypeScript, Node.js, PostgreSQL, and cloud platforms like Vercel and AWS. Our tech stack is chosen for performance, scalability, and maintainability.",
        order: 1,
      },
      {
        id: "faq-2",
        question: "How long does a typical web development project take?",
        answer:
          "Project timelines vary based on complexity, but most custom web applications take 6-12 weeks from start to finish. We provide detailed timelines during the discovery phase.",
        order: 2,
      },
      {
        id: "faq-3",
        question: "Do you provide ongoing maintenance and support?",
        answer:
          "Yes, every project includes 3 months of maintenance and support. We also offer extended maintenance plans for ongoing updates, security patches, and feature enhancements.",
        order: 3,
      },
      {
        id: "faq-4",
        question: "Can you work with existing codebases?",
        answer:
          "Absolutely. We can audit, optimize, and extend existing applications. We also provide code review services and can help migrate legacy applications to modern technologies.",
        order: 4,
      },
    ],
  },
  {
    id: "mobile-app",
    name: "Mobile App Development",
    slug: "mobile-app",
    description:
      "Native and cross-platform mobile applications that deliver exceptional user experiences. Built for performance, designed for conversion.",
    priceFrom: 800000, // $8,000 in cents
    priceTo: 10000000, // $100,000 in cents
    priceType: "PROJECT",
    features: [
      "React Native cross-platform development",
      "Native iOS and Android optimization",
      "Brutalist mobile design system",
      "Offline functionality and data sync",
      "Push notifications and analytics",
      "App store optimization and submission",
      "Performance monitoring and crash reporting",
      "6 months of maintenance and updates",
    ],
    highlights: [
      "Cross-platform compatibility",
      "Native performance optimization",
      "App store approval guarantee",
      "Real-time analytics integration",
    ],
    deliveryTime: "8-16 weeks",
    deliverables: [
      "Cross-platform mobile application",
      "App store submissions (iOS & Android)",
      "Source code and documentation",
      "Analytics and monitoring setup",
      "6 months of maintenance",
    ],
    featured: true,
    popular: false,
    order: 2,
    active: true,
    faqs: [
      {
        id: "mobile-faq-1",
        question: "Do you develop native or cross-platform apps?",
        answer:
          "We specialize in React Native for cross-platform development, which allows us to build high-performance apps for both iOS and Android with a single codebase. For specific performance requirements, we can also develop native apps.",
        order: 1,
      },
      {
        id: "mobile-faq-2",
        question: "Do you handle app store submissions?",
        answer:
          "Yes, we handle the entire app store submission process for both iOS App Store and Google Play Store, including app store optimization, compliance checks, and approval management.",
        order: 2,
      },
    ],
  },
  {
    id: "full-stack",
    name: "Full-Stack Development",
    slug: "full-stack",
    description:
      "Complete end-to-end solutions from database to user interface. Full-stack mastery with brutalist execution.",
    priceFrom: 1000000, // $10,000 in cents
    priceTo: 15000000, // $150,000 in cents
    priceType: "PROJECT",
    features: [
      "Complete frontend and backend development",
      "Database design and optimization",
      "API development and integration",
      "Authentication and authorization systems",
      "Real-time features and WebSocket integration",
      "Third-party service integrations",
      "Scalable cloud architecture",
      "DevOps and deployment automation",
    ],
    highlights: [
      "End-to-end solution delivery",
      "Scalable architecture design",
      "Real-time functionality",
      "Enterprise security standards",
    ],
    deliveryTime: "10-20 weeks",
    deliverables: [
      "Complete full-stack application",
      "Database and API documentation",
      "Deployment and CI/CD setup",
      "Security audit and compliance",
      "6 months of maintenance",
    ],
    featured: true,
    popular: true,
    order: 3,
    active: true,
    faqs: [
      {
        id: "fullstack-faq-1",
        question: "What does full-stack development include?",
        answer:
          "Full-stack development includes everything from database design and API development to frontend user interfaces and deployment infrastructure. We handle the complete technology stack.",
        order: 1,
      },
    ],
  },
  {
    id: "consulting",
    name: "Technical Consulting",
    slug: "consulting",
    description:
      "Strategic technical guidance and architecture reviews. Transform your development process with expert insights.",
    priceFrom: 20000, // $200/hour in cents
    priceTo: 50000, // $500/hour in cents
    priceType: "HOURLY",
    features: [
      "Technical architecture review",
      "Code quality audits",
      "Performance optimization strategies",
      "Technology stack recommendations",
      "Development process improvement",
      "Team training and mentoring",
      "Security assessment and recommendations",
      "Scalability planning and roadmaps",
    ],
    highlights: [
      "Expert technical guidance",
      "Immediate impact on performance",
      "Team skill development",
      "Strategic technology planning",
    ],
    deliveryTime: "1-4 weeks",
    deliverables: [
      "Comprehensive technical audit report",
      "Optimization recommendations",
      "Implementation roadmap",
      "Team training materials",
      "Ongoing support plan",
    ],
    featured: false,
    popular: false,
    order: 4,
    active: true,
    faqs: [
      {
        id: "consulting-faq-1",
        question: "What areas do you provide consulting for?",
        answer:
          "We provide consulting for technical architecture, code quality, performance optimization, security, scalability, and development processes. Our expertise covers modern web technologies and best practices.",
        order: 1,
      },
    ],
  },
  {
    id: "performance",
    name: "Performance Optimization",
    slug: "performance",
    description:
      "Transform slow applications into speed demons. Achieve 90+ Lighthouse scores and sub-2-second loading times.",
    priceFrom: 300000, // $3,000 in cents
    priceTo: 2000000, // $20,000 in cents
    priceType: "PROJECT",
    features: [
      "Core Web Vitals optimization",
      "Bundle size reduction and code splitting",
      "Image optimization and lazy loading",
      "Database query optimization",
      "CDN and caching strategies",
      "Third-party script optimization",
      "Performance monitoring setup",
      "Ongoing performance maintenance",
    ],
    highlights: [
      "90+ Lighthouse Performance Scores",
      "Sub-2-second loading times",
      "Improved conversion rates",
      "Better search engine rankings",
    ],
    deliveryTime: "2-6 weeks",
    deliverables: [
      "Performance audit report",
      "Optimized application code",
      "Performance monitoring setup",
      "Optimization documentation",
      "3 months of performance monitoring",
    ],
    featured: false,
    popular: true,
    order: 5,
    active: true,
    faqs: [
      {
        id: "performance-faq-1",
        question: "How much performance improvement can I expect?",
        answer:
          "Most applications see 40-70% improvement in loading times and achieve 90+ Lighthouse scores. The exact improvement depends on the current state of your application.",
        order: 1,
      },
    ],
  },
  {
    id: "maintenance",
    name: "Maintenance & Support",
    slug: "maintenance",
    description:
      "Keep your applications running at peak performance with ongoing maintenance, updates, and technical support.",
    priceFrom: 200000, // $2,000/month in cents
    priceTo: 1000000, // $10,000/month in cents
    priceType: "MONTHLY",
    features: [
      "Regular security updates and patches",
      "Performance monitoring and optimization",
      "Bug fixes and issue resolution",
      "Feature updates and enhancements",
      "Database maintenance and backups",
      "Server monitoring and maintenance",
      "24/7 technical support",
      "Monthly performance reports",
    ],
    highlights: [
      "24/7 monitoring and support",
      "Proactive issue prevention",
      "Regular security updates",
      "Performance optimization",
    ],
    deliveryTime: "Ongoing",
    deliverables: [
      "Monthly maintenance reports",
      "Security updates and patches",
      "Performance optimization",
      "24/7 technical support",
      "Backup and disaster recovery",
    ],
    featured: false,
    popular: false,
    order: 6,
    active: true,
    faqs: [
      {
        id: "maintenance-faq-1",
        question: "What's included in maintenance and support?",
        answer:
          "Our maintenance service includes security updates, bug fixes, performance monitoring, regular backups, and 24/7 technical support. We also provide monthly reports on your application's health.",
        order: 1,
      },
    ],
  },
];

// Service utility functions
export async function getAllServices(): Promise<Service[]> {
  // In production, this would query the database
  return servicesData
    .filter((service) => service.active)
    .sort((a, b) => a.order - b.order);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  // In production, this would query the database
  const service = servicesData.find((s) => s.slug === slug && s.active);
  return service || null;
}

export async function getFeaturedServices(): Promise<Service[]> {
  // In production, this would query the database
  return servicesData
    .filter((service) => service.featured && service.active)
    .sort((a, b) => a.order - b.order);
}

export async function getPopularServices(): Promise<Service[]> {
  // In production, this would query the database
  return servicesData
    .filter((service) => service.popular && service.active)
    .sort((a, b) => a.order - b.order);
}

// Price formatting utilities
export function formatPrice(
  priceInCents: number,
  type: "HOURLY" | "PROJECT" | "MONTHLY" | "CUSTOM"
): string {
  const price = priceInCents / 100;

  switch (type) {
    case "HOURLY":
      return `$${price.toLocaleString()}/hr`;
    case "MONTHLY":
      return `$${price.toLocaleString()}/mo`;
    case "PROJECT":
      return `$${price.toLocaleString()}`;
    case "CUSTOM":
      return "Custom Quote";
    default:
      return `$${price.toLocaleString()}`;
  }
}

export function formatPriceRange(
  priceFrom?: number,
  priceTo?: number,
  type: "HOURLY" | "PROJECT" | "MONTHLY" | "CUSTOM" = "PROJECT"
): string {
  if (!priceFrom && !priceTo) {
    return "Contact for Quote";
  }

  if (priceFrom && priceTo && priceFrom !== priceTo) {
    return `${formatPrice(priceFrom, type)} - ${formatPrice(priceTo, type)}`;
  }

  if (priceFrom) {
    return `From ${formatPrice(priceFrom, type)}`;
  }

  if (priceTo) {
    return `Up to ${formatPrice(priceTo, type)}`;
  }

  return "Contact for Quote";
}
