"use client";

import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Typography } from "@/components/ui/typography";
import { ProgressCounter } from "@/components/animations/animated-counter";
import { cn } from "@/lib/utils";

interface Skill {
  name: string;
  level: number;
  icon: string;
  category: string;
  color?: string;
}

const skills: Skill[] = [
  // Frontend
  {
    name: "React",
    level: 95,
    icon: "⚛️",
    category: "Frontend",
    color: "#61DAFB",
  },
  {
    name: "Next.js",
    level: 90,
    icon: "▲",
    category: "Frontend",
    color: "#000000",
  },
  {
    name: "TypeScript",
    level: 88,
    icon: "📘",
    category: "Frontend",
    color: "#3178C6",
  },
  {
    name: "Tailwind CSS",
    level: 92,
    icon: "🎨",
    category: "Frontend",
    color: "#06B6D4",
  },

  // Backend
  {
    name: "Node.js",
    level: 85,
    icon: "🟢",
    category: "Backend",
    color: "#339933",
  },
  {
    name: "PostgreSQL",
    level: 80,
    icon: "🐘",
    category: "Backend",
    color: "#336791",
  },
  {
    name: "Prisma",
    level: 82,
    icon: "🔺",
    category: "Backend",
    color: "#2D3748",
  },
  {
    name: "GraphQL",
    level: 75,
    icon: "🔗",
    category: "Backend",
    color: "#E10098",
  },

  // Tools & Others
  { name: "Git", level: 90, icon: "📝", category: "Tools", color: "#F05032" },
  {
    name: "Docker",
    level: 70,
    icon: "🐳",
    category: "Tools",
    color: "#2496ED",
  },
  { name: "AWS", level: 65, icon: "☁️", category: "Tools", color: "#FF9900" },
  { name: "Figma", level: 78, icon: "🎯", category: "Tools", color: "#F24E1E" },
];

const categories = ["All", "Frontend", "Backend", "Tools"];

interface SkillCardProps {
  skill: Skill;
  index: number;
  isVisible: boolean;
}

function SkillCard({ skill, index, isVisible }: SkillCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={
        isVisible
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 50, scale: 0.8 }
      }
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ scale: 1.05, y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="hover:border-brutalist-yellow hover:shadow-brutalist-yellow-lg h-full border-4 border-white bg-black p-6 transition-all duration-300">
        {/* Icon */}
        <motion.div
          className="mb-4 text-center text-4xl"
          animate={
            isHovered ? { scale: 1.2, rotate: 5 } : { scale: 1, rotate: 0 }
          }
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {skill.icon}
        </motion.div>

        {/* Skill Name */}
        <Typography
          variant="h6"
          className="group-hover:text-brutalist-yellow mb-4 text-center text-white transition-colors duration-300"
        >
          {skill.name}
        </Typography>

        {/* Progress Bar */}
        <div className="space-y-2">
          <ProgressCounter
            end={skill.level}
            duration={2000}
            delay={index * 100}
            height={6}
            barClassName="border-white group-hover:border-brutalist-yellow transition-colors duration-300"
            textClassName="text-white group-hover:text-brutalist-yellow transition-colors duration-300"
          />
        </div>

        {/* Category Badge */}
        <motion.div
          className="bg-brutalist-yellow absolute top-2 right-2 px-2 py-1 font-mono text-xs font-bold tracking-wide text-black uppercase"
          initial={{ opacity: 0, scale: 0 }}
          animate={
            isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
          }
          transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
        >
          {skill.category}
        </motion.div>

        {/* Hover Overlay */}
        <motion.div
          className="bg-brutalist-yellow/10 pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="mb-12 flex flex-wrap justify-center gap-4">
      {categories.map((category) => (
        <motion.button
          key={category}
          className={cn(
            "border-4 px-6 py-3 font-mono font-bold tracking-wide uppercase transition-all duration-300",
            activeCategory === category
              ? "bg-brutalist-yellow border-brutalist-yellow shadow-brutalist-yellow-lg text-black"
              : "hover:shadow-brutalist-lg border-white bg-black text-white hover:bg-white hover:text-black"
          )}
          onClick={() => onCategoryChange(category)}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {category}
        </motion.button>
      ))}
    </div>
  );
}

export function SkillVisualization() {
  const [activeCategory, setActiveCategory] = useState("All");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const filteredSkills = skills.filter(
    (skill) => activeCategory === "All" || skill.category === activeCategory
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <div ref={ref} className="mx-auto w-full max-w-6xl">
      {/* Section Header */}
      <motion.div
        className="mb-12 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Typography variant="h2" className="text-brutalist-yellow mb-4">
          TECHNICAL EXPERTISE
        </Typography>
        <Typography
          variant="large"
          className="text-brutalist-off-white-100 mx-auto max-w-2xl"
        >
          Mastery across the full stack with a focus on modern web technologies
          and performance optimization.
        </Typography>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </motion.div>

      {/* Skills Grid */}
      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {filteredSkills.map((skill, index) => (
          <SkillCard
            key={`${skill.name}-${activeCategory}`}
            skill={skill}
            index={index}
            isVisible={isInView}
          />
        ))}
      </motion.div>

      {/* Overall Stats */}
      <motion.div
        className="mt-16 grid grid-cols-1 gap-8 text-center md:grid-cols-3"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="hover:border-brutalist-yellow border-4 border-white bg-black/50 p-6 backdrop-blur-sm transition-colors duration-300">
          <Typography variant="h3" className="text-brutalist-yellow mb-2">
            {skills.length}+
          </Typography>
          <Typography variant="caption" className="text-white">
            TECHNOLOGIES MASTERED
          </Typography>
        </div>

        <div className="hover:border-brutalist-yellow border-4 border-white bg-black/50 p-6 backdrop-blur-sm transition-colors duration-300">
          <Typography variant="h3" className="text-brutalist-yellow mb-2">
            {Math.round(
              skills.reduce((acc, skill) => acc + skill.level, 0) /
                skills.length
            )}
            %
          </Typography>
          <Typography variant="caption" className="text-white">
            AVERAGE PROFICIENCY
          </Typography>
        </div>

        <div className="hover:border-brutalist-yellow border-4 border-white bg-black/50 p-6 backdrop-blur-sm transition-colors duration-300">
          <Typography variant="h3" className="text-brutalist-yellow mb-2">
            8+
          </Typography>
          <Typography variant="caption" className="text-white">
            YEARS EXPERIENCE
          </Typography>
        </div>
      </motion.div>
    </div>
  );
}
