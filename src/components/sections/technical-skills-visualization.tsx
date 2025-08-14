"use client";

import React, { useState, useEffect } from "react";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import {
  ViewportAnimation,
  StaggeredAnimation,
} from "@/components/animations/advanced-scroll-effects";
import { ScrollTextReveal } from "@/components/animations/scroll-reveal-system";

interface SkillCategory {
  id: string;
  title: string;
  description: string;
  skills: Skill[];
  icon: string;
  color: string;
}

interface Skill {
  name: string;
  level: number; // 1-100
  experience: string;
  projects: number;
}

const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    title: "FRONTEND MASTERY",
    description:
      "Modern frameworks wielded with precision and brutalist efficiency.",
    icon: "⚡",
    color: "#ffff00",
    skills: [
      { name: "React", level: 95, experience: "5+ years", projects: 50 },
      { name: "Next.js", level: 92, experience: "4+ years", projects: 35 },
      { name: "TypeScript", level: 90, experience: "4+ years", projects: 45 },
      { name: "Tailwind CSS", level: 88, experience: "3+ years", projects: 40 },
      { name: "Three.js", level: 75, experience: "2+ years", projects: 15 },
    ],
  },
  {
    id: "backend",
    title: "BACKEND POWER",
    description:
      "Server architecture that scales without compromise or failure.",
    icon: "🔥",
    color: "#ff6b6b",
    skills: [
      { name: "Node.js", level: 90, experience: "4+ years", projects: 40 },
      { name: "Python", level: 85, experience: "3+ years", projects: 25 },
      { name: "PostgreSQL", level: 88, experience: "4+ years", projects: 35 },
      { name: "Redis", level: 80, experience: "2+ years", projects: 20 },
      { name: "GraphQL", level: 75, experience: "2+ years", projects: 15 },
    ],
  },
  {
    id: "devops",
    title: "DEVOPS EXCELLENCE",
    description:
      "Infrastructure that never sleeps, never fails, never compromises.",
    icon: "🚀",
    color: "#4ecdc4",
    skills: [
      { name: "Docker", level: 85, experience: "3+ years", projects: 30 },
      { name: "AWS", level: 80, experience: "3+ years", projects: 25 },
      { name: "Vercel", level: 90, experience: "3+ years", projects: 40 },
      { name: "CI/CD", level: 82, experience: "3+ years", projects: 35 },
      { name: "Monitoring", level: 78, experience: "2+ years", projects: 20 },
    ],
  },
];

interface SkillBarProps {
  skill: Skill;
  delay: number;
  color: string;
}

const SkillBar: React.FC<SkillBarProps> = ({ skill, delay, color }) => {
  const [animatedLevel, setAnimatedLevel] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedLevel(skill.level);
    }, delay * 100);

    return () => clearTimeout(timer);
  }, [skill.level, delay]);

  return (
    <ViewportAnimation variant="fadeInUp" delay={delay * 0.1}>
      <div className="group mb-6 last:mb-0">
        <div className="mb-2 flex items-center justify-between">
          <Typography
            variant="body"
            className="font-mono text-sm font-bold uppercase"
          >
            {skill.name}
          </Typography>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-brutalist-charcoal-200">
              {skill.experience}
            </span>
            <span className="text-brutalist-charcoal-200">•</span>
            <span className="text-brutalist-charcoal-200">
              {skill.projects} projects
            </span>
          </div>
        </div>
        <div className="relative h-3 border-2 border-black bg-white">
          <div
            className="h-full transition-all duration-1000 ease-out"
            style={{
              width: `${animatedLevel}%`,
              backgroundColor: color,
              transitionDelay: `${delay * 100}ms`,
            }}
          />
          <div className="absolute top-0 right-2 flex h-full items-center">
            <Typography
              variant="caption"
              className="font-mono text-xs font-bold text-black"
            >
              {skill.level}%
            </Typography>
          </div>
        </div>
      </div>
    </ViewportAnimation>
  );
};

interface SkillCategoryCardProps {
  category: SkillCategory;
  index: number;
}

const SkillCategoryCard: React.FC<SkillCategoryCardProps> = ({
  category,
  index,
}) => {
  return (
    <ViewportAnimation
      variant="brutalistSlam"
      delay={index * 0.2}
      easing="elastic"
    >
      <Card className="group h-full border-4 border-black bg-white transition-all duration-300 hover:bg-black hover:text-white">
        <CardContent className="p-8">
          <div className="mb-6 flex items-center space-x-4">
            <div className="text-4xl">{category.icon}</div>
            <div>
              <Typography
                variant="h3"
                className="mb-2 text-xl font-bold uppercase"
              >
                {category.title}
              </Typography>
              <Typography
                variant="body"
                className="text-brutalist-charcoal-200 text-sm group-hover:text-white"
              >
                {category.description}
              </Typography>
            </div>
          </div>

          <div className="space-y-4">
            {category.skills.map((skill, skillIndex) => (
              <SkillBar
                key={skill.name}
                skill={skill}
                delay={index * 2 + skillIndex}
                color={category.color}
              />
            ))}
          </div>

          <div className="border-brutalist-charcoal-200 mt-6 border-t-2 pt-6 group-hover:border-white">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono uppercase">Total Projects</span>
              <span className="font-mono font-bold">
                {category.skills.reduce(
                  (sum, skill) => sum + skill.projects,
                  0
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </ViewportAnimation>
  );
};

export const TechnicalSkillsVisualization: React.FC = () => {
  const totalProjects = skillCategories.reduce(
    (sum, category) =>
      sum +
      category.skills.reduce((catSum, skill) => catSum + skill.projects, 0),
    0
  );

  const totalExperience = "5+";
  const totalTechnologies = skillCategories.reduce(
    (sum, category) => sum + category.skills.length,
    0
  );

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <StaggeredAnimation className="space-y-6 text-center" staggerDelay={0.15}>
        <ViewportAnimation variant="brutalistSlam" delay={0.1} easing="elastic">
          <ScrollTextReveal
            text="TECHNICAL ARSENAL"
            className="font-mono text-4xl font-bold text-black uppercase md:text-6xl"
            stagger={0.05}
            animation="rotateIn"
          />
        </ViewportAnimation>

        <ViewportAnimation variant="fadeInUp" delay={0.3}>
          <Typography
            variant="body"
            className="text-brutalist-charcoal-200 mx-auto max-w-2xl"
          >
            Raw power. Uncompromising tools. Digital concrete that builds the
            future. Every skill honed through real-world battles, every
            technology mastered through relentless practice.
          </Typography>
        </ViewportAnimation>

        {/* Stats Overview */}
        <ViewportAnimation variant="scaleInRotate" delay={0.5}>
          <div className="flex items-center justify-center space-x-8 md:space-x-16">
            <div className="text-center">
              <Typography
                variant="h2"
                className="text-brutalist-yellow text-3xl font-bold md:text-4xl"
              >
                {totalProjects}+
              </Typography>
              <Typography
                variant="caption"
                className="text-brutalist-charcoal-200 font-mono text-xs uppercase"
              >
                Projects Built
              </Typography>
            </div>
            <div className="text-center">
              <Typography
                variant="h2"
                className="text-brutalist-yellow text-3xl font-bold md:text-4xl"
              >
                {totalExperience}
              </Typography>
              <Typography
                variant="caption"
                className="text-brutalist-charcoal-200 font-mono text-xs uppercase"
              >
                Years Experience
              </Typography>
            </div>
            <div className="text-center">
              <Typography
                variant="h2"
                className="text-brutalist-yellow text-3xl font-bold md:text-4xl"
              >
                {totalTechnologies}
              </Typography>
              <Typography
                variant="caption"
                className="text-brutalist-charcoal-200 font-mono text-xs uppercase"
              >
                Technologies
              </Typography>
            </div>
          </div>
        </ViewportAnimation>
      </StaggeredAnimation>

      {/* Skills Grid */}
      <StaggeredAnimation
        className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        staggerDelay={0.2}
      >
        {skillCategories.map((category, index) => (
          <SkillCategoryCard
            key={category.id}
            category={category}
            index={index}
          />
        ))}
      </StaggeredAnimation>

      {/* Interactive Elements */}
      <ViewportAnimation variant="fadeInUp" delay={0.8}>
        <div className="bg-brutalist-yellow rounded-none border-4 border-black p-8 text-center">
          <Typography
            variant="h3"
            className="mb-4 text-2xl font-bold text-black uppercase"
          >
            READY TO BUILD SOMETHING EXTRAORDINARY?
          </Typography>
          <Typography variant="body" className="mb-6 text-black">
            These skills aren't just numbers on a screen. They're battle-tested
            tools ready to transform your vision into digital dominance.
          </Typography>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="text-center">
              <Typography
                variant="caption"
                className="font-mono text-xs text-black uppercase"
              >
                Average Project Success Rate
              </Typography>
              <Typography
                variant="h3"
                className="text-2xl font-bold text-black"
              >
                98%
              </Typography>
            </div>
            <div className="hidden h-8 w-px bg-black sm:block" />
            <div className="text-center">
              <Typography
                variant="caption"
                className="font-mono text-xs text-black uppercase"
              >
                Client Satisfaction Score
              </Typography>
              <Typography
                variant="h3"
                className="text-2xl font-bold text-black"
              >
                4.9/5
              </Typography>
            </div>
          </div>
        </div>
      </ViewportAnimation>
    </div>
  );
};
