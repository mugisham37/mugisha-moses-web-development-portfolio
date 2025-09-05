"use client";

import { useState } from "react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiMongodb,
  SiSpringboot,
  SiPython,
  SiDjango,
  SiDocker,
  SiKubernetes,
  SiAmazon,
  SiGooglecloud,
  SiPostgresql,
  SiMysql,
  SiRedis,
  SiGraphql,
  SiExpress,
  SiFastapi,
  SiFlask,
  SiNestjs,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
  SiFirebase,
  SiSupabase,
  SiVercel,
  SiGit,
  SiGithub,
  SiJenkins,
  SiGithubactions,
  SiTerraform,
  SiPrometheus,
  SiGrafana,
  SiElasticsearch,
  SiRabbitmq,
  SiApachekafka,
  SiNginx,
  SiLinux,
  SiJavascript,
  SiOpenjdk,
  SiSharp,
  SiGo,
  SiRust,
  SiPhp,
  SiRuby,
  SiRubyonrails,
  SiLaravel,
} from "react-icons/si";

// Define types for LogoLoop props
interface Logo {
  node: React.ReactNode;
  title: string;
  ariaLabel: string;
}

interface LogoLoopProps {
  logos: Logo[];
  speed?: number;
  direction?: "left" | "right";
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  scaleOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  ariaLabel: string;
  className?: string;
}

// Simple LogoLoop component for demo
const LogoLoop = ({
  logos,
  speed = 80,
  direction = "left",
  logoHeight = 40,
  gap = 40,
  pauseOnHover = true,
  scaleOnHover = true,
  fadeOut = true,
  fadeOutColor = "#000000",
  ariaLabel,
  className = "",
}: LogoLoopProps) => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      className={`overflow-hidden relative ${className}`}
      aria-label={ariaLabel}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div
        className={`flex animate-scroll ${isPaused ? "paused" : ""}`}
        style={{
          animationDuration: `${speed}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
          gap: `${gap}px`,
        }}
      >
        {[...logos, ...logos].map((logo, index) => (
          <div
            key={index}
            className={`flex-shrink-0 flex items-center justify-center transition-transform duration-200 ${
              scaleOnHover ? "hover:scale-110" : ""
            }`}
            style={{ height: `${logoHeight}px`, minWidth: `${logoHeight}px` }}
            title={logo.title}
            aria-label={logo.ariaLabel}
          >
            <div style={{ fontSize: `${logoHeight * 0.8}px` }}>{logo.node}</div>
          </div>
        ))}
      </div>

      {fadeOut && (
        <>
          <div
            className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none"
            style={{
              background: `linear-gradient(to right, ${fadeOutColor}, transparent)`,
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none"
            style={{
              background: `linear-gradient(to left, ${fadeOutColor}, transparent)`,
            }}
          />
        </>
      )}

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll linear infinite;
        }
        .paused {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

const techLogos = [
  {
    node: <SiReact className="text-[#61DAFB]" />,
    title: "React",
    ariaLabel: "React technology logo",
  },
  {
    node: <SiNextdotjs className="text-white" />,
    title: "Next.js",
    ariaLabel: "Next.js technology logo",
  },
  {
    node: <SiTypescript className="text-[#3178C6]" />,
    title: "TypeScript",
    ariaLabel: "TypeScript technology logo",
  },
  {
    node: <SiTailwindcss className="text-[#06B6D4]" />,
    title: "Tailwind CSS",
    ariaLabel: "Tailwind CSS technology logo",
  },
  {
    node: <SiNodedotjs className="text-[#339933]" />,
    title: "Node.js",
    ariaLabel: "Node.js technology logo",
  },
  {
    node: <SiMongodb className="text-[#47A248]" />,
    title: "MongoDB",
    ariaLabel: "MongoDB technology logo",
  },
  {
    node: <SiSpringboot className="text-[#6DB33F]" />,
    title: "Spring Boot",
    ariaLabel: "Spring Boot technology logo",
  },
  {
    node: <SiPython className="text-[#3776AB]" />,
    title: "Python",
    ariaLabel: "Python technology logo",
  },
  {
    node: <SiDjango className="text-[#092E20]" />,
    title: "Django",
    ariaLabel: "Django technology logo",
  },
  {
    node: <SiDocker className="text-[#2496ED]" />,
    title: "Docker",
    ariaLabel: "Docker technology logo",
  },
  {
    node: <SiKubernetes className="text-[#326CE5]" />,
    title: "Kubernetes",
    ariaLabel: "Kubernetes technology logo",
  },
  {
    node: <SiAmazon className="text-[#FF9900]" />,
    title: "AWS",
    ariaLabel: "Amazon Web Services technology logo",
  },
  {
    node: <SiGooglecloud className="text-[#4285F4]" />,
    title: "Google Cloud",
    ariaLabel: "Google Cloud technology logo",
  },
  {
    node: <SiPostgresql className="text-[#4169E1]" />,
    title: "PostgreSQL",
    ariaLabel: "PostgreSQL technology logo",
  },
  {
    node: <SiMysql className="text-[#4479A1]" />,
    title: "MySQL",
    ariaLabel: "MySQL technology logo",
  },
  {
    node: <SiRedis className="text-[#DC382D]" />,
    title: "Redis",
    ariaLabel: "Redis technology logo",
  },
  {
    node: <SiGraphql className="text-[#E10098]" />,
    title: "GraphQL",
    ariaLabel: "GraphQL technology logo",
  },
  {
    node: <SiExpress className="text-white" />,
    title: "Express.js",
    ariaLabel: "Express.js technology logo",
  },
  {
    node: <SiFastapi className="text-[#009688]" />,
    title: "FastAPI",
    ariaLabel: "FastAPI technology logo",
  },
  {
    node: <SiFlask className="text-white" />,
    title: "Flask",
    ariaLabel: "Flask technology logo",
  },
  {
    node: <SiNestjs className="text-[#E0234E]" />,
    title: "NestJS",
    ariaLabel: "NestJS technology logo",
  },
  {
    node: <SiVuedotjs className="text-[#4FC08D]" />,
    title: "Vue.js",
    ariaLabel: "Vue.js technology logo",
  },
  {
    node: <SiAngular className="text-[#DD0031]" />,
    title: "Angular",
    ariaLabel: "Angular technology logo",
  },
  {
    node: <SiSvelte className="text-[#FF3E00]" />,
    title: "Svelte",
    ariaLabel: "Svelte technology logo",
  },
  {
    node: <SiFirebase className="text-[#FFCA28]" />,
    title: "Firebase",
    ariaLabel: "Firebase technology logo",
  },
  {
    node: <SiSupabase className="text-[#3ECF8E]" />,
    title: "Supabase",
    ariaLabel: "Supabase technology logo",
  },
  {
    node: <SiVercel className="text-white" />,
    title: "Vercel",
    ariaLabel: "Vercel technology logo",
  },
  {
    node: <SiGit className="text-[#F05032]" />,
    title: "Git",
    ariaLabel: "Git technology logo",
  },
  {
    node: <SiGithub className="text-white" />,
    title: "GitHub",
    ariaLabel: "GitHub technology logo",
  },
  {
    node: <SiJenkins className="text-[#D24939]" />,
    title: "Jenkins",
    ariaLabel: "Jenkins technology logo",
  },
  {
    node: <SiGithubactions className="text-[#2088FF]" />,
    title: "GitHub Actions",
    ariaLabel: "GitHub Actions technology logo",
  },
  {
    node: <SiTerraform className="text-[#7B42BC]" />,
    title: "Terraform",
    ariaLabel: "Terraform technology logo",
  },
  {
    node: <SiPrometheus className="text-[#E6522C]" />,
    title: "Prometheus",
    ariaLabel: "Prometheus technology logo",
  },
  {
    node: <SiGrafana className="text-[#F46800]" />,
    title: "Grafana",
    ariaLabel: "Grafana technology logo",
  },
  {
    node: <SiElasticsearch className="text-[#005571]" />,
    title: "Elasticsearch",
    ariaLabel: "Elasticsearch technology logo",
  },
  {
    node: <SiRabbitmq className="text-[#FF6600]" />,
    title: "RabbitMQ",
    ariaLabel: "RabbitMQ technology logo",
  },
  {
    node: <SiApachekafka className="text-white" />,
    title: "Apache Kafka",
    ariaLabel: "Apache Kafka technology logo",
  },
  {
    node: <SiNginx className="text-[#009639]" />,
    title: "Nginx",
    ariaLabel: "Nginx technology logo",
  },
  {
    node: <SiLinux className="text-[#FCC624]" />,
    title: "Linux",
    ariaLabel: "Linux technology logo",
  },
  {
    node: <SiJavascript className="text-[#F7DF1E]" />,
    title: "JavaScript",
    ariaLabel: "JavaScript technology logo",
  },
  {
    node: <SiOpenjdk className="text-[#ED8B00]" />,
    title: "Java",
    ariaLabel: "Java technology logo",
  },
  {
    node: <SiSharp className="text-[#239120]" />,
    title: "C#",
    ariaLabel: "C# technology logo",
  },
  {
    node: <SiGo className="text-[#00ADD8]" />,
    title: "Go",
    ariaLabel: "Go technology logo",
  },
  {
    node: <SiRust className="text-white" />,
    title: "Rust",
    ariaLabel: "Rust technology logo",
  },
  {
    node: <SiPhp className="text-[#777BB4]" />,
    title: "PHP",
    ariaLabel: "PHP technology logo",
  },
  {
    node: <SiRuby className="text-[#CC342D]" />,
    title: "Ruby",
    ariaLabel: "Ruby technology logo",
  },
  {
    node: <SiRubyonrails className="text-[#CC0000]" />,
    title: "Ruby on Rails",
    ariaLabel: "Ruby on Rails technology logo",
  },
  {
    node: <SiLaravel className="text-[#FF2D20]" />,
    title: "Laravel",
    ariaLabel: "Laravel technology logo",
  },
];

export default function BrandSoul() {
  return (
    <section
      id="about"
      className="min-h-screen lg:h-screen bg-black px-4 sm:px-6 md:px-28 flex items-center py-8 sm:py-12 lg:py-0"
    >
      {/* Main content container */}
      <div className="max-w-8xl mx-auto w-full flex flex-col justify-center min-h-0">
        {/* Main text content */}
        <div className="flex-shrink-0 mb-6 sm:mb-8 lg:mb-12">
          <p className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-[48px] leading-snug sm:leading-tight lg:leading-[65px] font-normal">
            Your platform should have a soul, like a high-performance soul, as
            the basis for interaction. It&apos;s just a matter of how your
            requirements can resonate and deliver seamlessly, worth crafting. I,{" "}
            <span className="text-blue-400">[Technical Lead]</span>, help to
            amplify your project&apos;s exceptional execution.
          </p>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-white/20 flex-shrink-0 mb-6 sm:mb-8 lg:mb-12"></div>

        {/* Tech Stack section */}
        <div className="flex-shrink-0">
          <p className="text-blue-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6 lg:mb-8 tracking-wider">
            [ USED TECH STACK]
          </p>

          {/* Animated logo loop */}
          <div className="opacity-60">
            <LogoLoop
              logos={techLogos}
              speed={60}
              direction="left"
              logoHeight={40}
              gap={40}
              pauseOnHover={true}
              scaleOnHover={true}
              fadeOut
              fadeOutColor="#000000"
              ariaLabel="Technology stack"
              className="py-1 sm:py-2"
            />
          </div>
        </div>

        {/* Mobile-specific bottom padding for better spacing */}
        <div className="h-4 sm:h-0 flex-shrink-0"></div>
      </div>
    </section>
  );
}
