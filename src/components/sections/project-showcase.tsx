"use client";

import React, { useState } from "react";
import { Typography } from "@/components/ui/typography";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ViewportAnimation,
  StaggeredAnimation,
  ParallaxElement,
} from "@/components/animations/advanced-scroll-effects";
import {
  ScrollRevealStagger,
  ScrollTextReveal,
} from "@/components/animations/scroll-reveal-system";

interface ProjectMetric {
  label: string;
  value: string;
  improvement?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: string;
  status: "Live" | "In Development" | "Completed";
  featured: boolean;
  metrics: ProjectMetric[];
  links: {
    live?: string;
    github?: string;
    case_study?: string;
  };
  image: string;
  client: {
    name: string;
    industry: string;
    testimonial?: string;
  };
  challenges: string[];
  solutions: string[];
  results: string[];
}

const projects: Project[] = [
  {
    id: "ecommerce-platform",
    title: "E-COMMERCE PLATFORM",
    description:
      "Full-stack e-commerce solution with advanced payment processing and inventory management.",
    longDescription:
      "A comprehensive e-commerce platform built for TechStart Inc. that revolutionized their online presence. The platform features advanced payment processing, real-time inventory management, and sophisticated analytics that increased conversion rates by 340%.",
    technologies: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Stripe",
      "Redis",
      "Docker",
    ],
    category: "Full-Stack Development",
    status: "Live",
    featured: true,
    metrics: [
      { label: "Conversion Rate", value: "12.4%", improvement: "+340%" },
      { label: "Page Load Speed", value: "1.2s", improvement: "+85%" },
      { label: "Mobile Performance", value: "96/100", improvement: "+92%" },
      { label: "Monthly Revenue", value: "$2.1M", improvement: "+450%" },
    ],
    links: {
      live: "https://techstart-ecommerce.com",
      github: "https://github.com/private/ecommerce-platform",
      case_study: "/case-studies/ecommerce-platform",
    },
    image: "/projects/ecommerce-platform.jpg",
    client: {
      name: "TechStart Inc.",
      industry: "Technology Retail",
      testimonial:
        "The team delivered a flawless e-commerce platform that increased our conversion rate by 340%. Their brutalist approach to problem-solving is exactly what we needed.",
    },
    challenges: [
      "Legacy system migration with zero downtime",
      "Complex inventory management across multiple warehouses",
      "High-traffic handling during flash sales",
      "Multi-currency and international shipping",
    ],
    solutions: [
      "Implemented blue-green deployment strategy",
      "Built distributed inventory system with Redis caching",
      "Optimized database queries and implemented CDN",
      "Integrated with multiple payment gateways and shipping APIs",
    ],
    results: [
      "340% increase in conversion rate",
      "85% improvement in page load speed",
      "Zero downtime during migration",
      "450% increase in monthly revenue",
    ],
  },
  {
    id: "realtime-dashboard",
    title: "REAL-TIME DASHBOARD",
    description:
      "Interactive analytics dashboard with real-time data visualization and user management.",
    longDescription:
      "A sophisticated real-time analytics dashboard for DataFlow Systems that processes millions of data points per second. The system handles 10x the previous traffic with zero downtime and provides actionable insights through advanced visualizations.",
    technologies: [
      "React",
      "WebSocket",
      "D3.js",
      "Node.js",
      "Redis",
      "PostgreSQL",
    ],
    category: "Data Visualization",
    status: "Live",
    featured: true,
    metrics: [
      {
        label: "Traffic Capacity",
        value: "10M req/min",
        improvement: "+1000%",
      },
      { label: "System Uptime", value: "99.99%", improvement: "New" },
      { label: "Response Time", value: "45ms", improvement: "+75%" },
      {
        label: "Data Processing",
        value: "5M points/sec",
        improvement: "+800%",
      },
    ],
    links: {
      live: "https://dataflow-dashboard.com",
      case_study: "/case-studies/realtime-dashboard",
    },
    image: "/projects/realtime-dashboard.jpg",
    client: {
      name: "DataFlow Systems",
      industry: "Data Analytics",
      testimonial:
        "Exceptional technical expertise and uncompromising attention to detail. Our dashboard now handles 10x the traffic with zero downtime.",
    },
    challenges: [
      "Real-time data processing at massive scale",
      "Complex data visualization requirements",
      "High availability and fault tolerance",
      "Multi-tenant architecture with data isolation",
    ],
    solutions: [
      "Implemented event-driven architecture with WebSockets",
      "Built custom D3.js visualization components",
      "Designed redundant systems with automatic failover",
      "Created secure multi-tenant data access layer",
    ],
    results: [
      "1000% increase in traffic handling capacity",
      "99.99% system uptime achieved",
      "75% improvement in response times",
      "Zero data loss incidents",
    ],
  },
  {
    id: "mobile-health-app",
    title: "MOBILE HEALTH APP",
    description:
      "Cross-platform health tracking app with offline sync and AI-powered insights.",
    longDescription:
      "A revolutionary mobile health application for MedTech Innovations that combines real-time health monitoring with AI-powered insights. The app achieved a 4.8/5 App Store rating and has been downloaded over 500K times.",
    technologies: [
      "React Native",
      "Node.js",
      "MongoDB",
      "TensorFlow",
      "AWS",
      "GraphQL",
    ],
    category: "Mobile Development",
    status: "Live",
    featured: true,
    metrics: [
      { label: "App Store Rating", value: "4.8/5", improvement: "New" },
      { label: "User Adoption", value: "500K+", improvement: "+450%" },
      { label: "Daily Active Users", value: "125K", improvement: "+380%" },
      { label: "Health Insights", value: "95% accuracy", improvement: "New" },
    ],
    links: {
      live: "https://apps.apple.com/health-tracker",
      case_study: "/case-studies/mobile-health-app",
    },
    image: "/projects/mobile-health-app.jpg",
    client: {
      name: "MedTech Innovations",
      industry: "Healthcare Technology",
      testimonial:
        "Working with this team was like having a technical co-founder. They didn't just build our MVP—they architected our entire digital future.",
    },
    challenges: [
      "HIPAA compliance and data security",
      "Offline functionality with data synchronization",
      "AI model integration for health insights",
      "Cross-platform native performance",
    ],
    solutions: [
      "Implemented end-to-end encryption and secure data handling",
      "Built robust offline-first architecture with conflict resolution",
      "Integrated TensorFlow Lite for on-device AI processing",
      "Optimized React Native for native-level performance",
    ],
    results: [
      "4.8/5 App Store rating with 10K+ reviews",
      "450% increase in user adoption",
      "95% accuracy in health insights",
      "Zero security incidents",
    ],
  },
];

interface ProjectCardProps {
  project: Project;
  index: number;
  onSelect: (project: Project) => void;
  isSelected: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  onSelect,
  isSelected,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live":
        return "bg-green-500";
      case "In Development":
        return "bg-yellow-500";
      case "Completed":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getVariant = (index: number) => {
    const variants = ["default", "elevated", "accent"] as const;
    return variants[index % variants.length];
  };

  const getHover = (index: number) => {
    const hovers = ["lift", "glow", "invert"] as const;
    return hovers[index % hovers.length];
  };

  return (
    <ParallaxElement speed={0.2 + index * 0.1} direction="vertical">
      <Card
        variant={getVariant(index)}
        hover={getHover(index)}
        className={`group cursor-pointer border-4 border-black transition-all duration-300 ${
          isSelected ? "ring-brutalist-yellow ring-4" : ""
        }`}
        onClick={() => onSelect(project)}
      >
        <CardHeader>
          <div className="mb-2 flex items-center justify-between">
            <CardTitle
              className={
                getVariant(index) === "accent"
                  ? "text-black"
                  : "text-black group-hover:text-white"
              }
            >
              {project.title}
            </CardTitle>
            <div className="flex items-center space-x-2">
              {project.featured && (
                <span className="bg-brutalist-yellow px-2 py-1 font-mono text-xs text-black uppercase">
                  FEATURED
                </span>
              )}
              <span
                className={`${getStatusColor(project.status)} px-2 py-1 font-mono text-xs text-white uppercase`}
              >
                {project.status}
              </span>
            </div>
          </div>
          <CardDescription
            className={
              getVariant(index) === "accent"
                ? "text-black"
                : "text-brutalist-charcoal-200 group-hover:text-white"
            }
          >
            {project.technologies.join(" • ")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Typography
            variant="body"
            className={`mb-4 ${getVariant(index) === "accent" ? "text-black" : "text-brutalist-charcoal-200 group-hover:text-white"}`}
          >
            {project.description}
          </Typography>

          {/* Key Metrics */}
          <div className="mb-4 grid grid-cols-2 gap-2">
            {project.metrics.slice(0, 2).map((metric, metricIndex) => (
              <div key={metricIndex} className="text-center">
                <Typography
                  variant="h4"
                  className={`text-sm font-bold ${
                    getVariant(index) === "accent"
                      ? "text-black"
                      : "text-brutalist-yellow"
                  }`}
                >
                  {metric.value}
                </Typography>
                <Typography
                  variant="caption"
                  className={`font-mono text-xs uppercase ${
                    getVariant(index) === "accent"
                      ? "text-black opacity-80"
                      : "opacity-80"
                  }`}
                >
                  {metric.label}
                </Typography>
              </div>
            ))}
          </div>

          {/* Technologies */}
          <div className="mb-4 flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech, techIndex) => (
              <span
                key={techIndex}
                className={`px-2 py-1 font-mono text-xs uppercase ${
                  getVariant(index) === "accent"
                    ? "text-brutalist-yellow bg-black"
                    : "text-brutalist-yellow bg-black"
                }`}
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span
                className={`px-2 py-1 font-mono text-xs uppercase ${
                  getVariant(index) === "accent"
                    ? "text-brutalist-yellow bg-black"
                    : "text-brutalist-yellow bg-black"
                }`}
              >
                +{project.technologies.length - 4} MORE
              </span>
            )}
          </div>

          {/* Client Info */}
          <div className="flex items-center justify-between text-xs">
            <span
              className={
                getVariant(index) === "accent"
                  ? "text-black opacity-80"
                  : "opacity-80"
              }
            >
              {project.client.name}
            </span>
            <span
              className={
                getVariant(index) === "accent"
                  ? "text-black opacity-80"
                  : "opacity-80"
              }
            >
              {project.category}
            </span>
          </div>
        </CardContent>
      </Card>
    </ParallaxElement>
  );
};

interface ProjectDetailsProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  project,
  onClose,
}) => {
  return (
    <ViewportAnimation variant="scaleInRotate" delay={0.2}>
      <Card className="border-brutalist-yellow border-4 bg-black text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-brutalist-yellow text-2xl">
                {project.title}
              </CardTitle>
              <CardDescription className="text-white">
                {project.client.name} • {project.client.industry}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Long Description */}
          <Typography variant="body" className="text-white">
            {project.longDescription}
          </Typography>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {project.metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <Typography
                  variant="h3"
                  className="text-brutalist-yellow text-xl font-bold"
                >
                  {metric.value}
                </Typography>
                <Typography
                  variant="caption"
                  className="font-mono text-xs text-white uppercase opacity-80"
                >
                  {metric.label}
                </Typography>
                {metric.improvement && (
                  <Typography
                    variant="caption"
                    className="font-mono text-xs text-green-400"
                  >
                    {metric.improvement}
                  </Typography>
                )}
              </div>
            ))}
          </div>

          {/* Client Testimonial */}
          {project.client.testimonial && (
            <div className="rounded-none border-2 border-white p-4">
              <Typography variant="body" className="mb-2 text-white italic">
                "{project.client.testimonial}"
              </Typography>
              <Typography
                variant="caption"
                className="text-brutalist-yellow font-mono text-xs uppercase"
              >
                — {project.client.name}
              </Typography>
            </div>
          )}

          {/* Technologies */}
          <div>
            <Typography
              variant="h4"
              className="text-brutalist-yellow mb-2 text-lg font-bold uppercase"
            >
              TECHNOLOGIES USED
            </Typography>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="bg-brutalist-yellow px-2 py-1 font-mono text-xs text-black uppercase"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4">
            {project.links.live && (
              <Button variant="accent" size="sm" asChild>
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  VIEW LIVE →
                </a>
              </Button>
            )}
            {project.links.case_study && (
              <Button variant="secondary" size="sm" asChild>
                <a href={project.links.case_study}>CASE STUDY →</a>
              </Button>
            )}
            {project.links.github && (
              <Button variant="ghost" size="sm" asChild>
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GITHUB →
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </ViewportAnimation>
  );
};

export const ProjectShowcase: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(selectedProject?.id === project.id ? null : project);
  };

  const totalProjects = projects.length * 5; // Simulating more projects
  const totalClients = projects.length;
  const averageRating = 4.9;

  return (
    <div className="space-y-12">
      {/* Header */}
      <StaggeredAnimation className="space-y-6 text-center" staggerDelay={0.15}>
        <ViewportAnimation variant="fadeInUp" delay={0.1} easing="brutalist">
          <ScrollTextReveal
            text="FEATURED PROJECTS"
            className="font-mono text-4xl font-bold text-black uppercase md:text-6xl"
            stagger={0.03}
            animation="slideUp"
          />
        </ViewportAnimation>

        <ViewportAnimation variant="fadeInUp" delay={0.3}>
          <Typography
            variant="body"
            className="text-brutalist-charcoal-200 mx-auto max-w-2xl"
          >
            Explore cutting-edge web applications built with modern technologies
            and brutalist design principles. Each project represents a digital
            transformation that exceeded client expectations.
          </Typography>
        </ViewportAnimation>

        {/* Stats */}
        <ViewportAnimation variant="scaleInRotate" delay={0.5}>
          <div className="flex items-center justify-center space-x-8 md:space-x-16">
            <div className="text-center">
              <Typography
                variant="h2"
                className="text-3xl font-bold text-black md:text-4xl"
              >
                {totalProjects}+
              </Typography>
              <Typography
                variant="caption"
                className="text-brutalist-charcoal-200 font-mono text-xs uppercase"
              >
                Projects Delivered
              </Typography>
            </div>
            <div className="text-center">
              <Typography
                variant="h2"
                className="text-3xl font-bold text-black md:text-4xl"
              >
                {totalClients}+
              </Typography>
              <Typography
                variant="caption"
                className="text-brutalist-charcoal-200 font-mono text-xs uppercase"
              >
                Happy Clients
              </Typography>
            </div>
            <div className="text-center">
              <Typography
                variant="h2"
                className="text-3xl font-bold text-black md:text-4xl"
              >
                {averageRating}
              </Typography>
              <Typography
                variant="caption"
                className="text-brutalist-charcoal-200 font-mono text-xs uppercase"
              >
                Average Rating
              </Typography>
            </div>
          </div>
        </ViewportAnimation>
      </StaggeredAnimation>

      {/* Projects Grid */}
      <ScrollRevealStagger
        animation="scaleInRotate"
        config={{ stagger: 0.2, delay: 0.2, easing: "backOut" }}
        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            onSelect={handleProjectSelect}
            isSelected={selectedProject?.id === project.id}
          />
        ))}
      </ScrollRevealStagger>

      {/* Selected Project Details */}
      {selectedProject && (
        <ProjectDetails
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Call to Action */}
      <ViewportAnimation variant="scaleInRotate" delay={0.4} easing="elastic">
        <div className="text-center">
          <Button variant="accent" size="lg" asChild>
            <a href="/projects">VIEW ALL PROJECTS →</a>
          </Button>
        </div>
      </ViewportAnimation>
    </div>
  );
};
