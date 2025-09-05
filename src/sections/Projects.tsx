import Image from "next/image";

// TypeScript interfaces
interface Technology {
  name: string;
  isHighlighted: boolean;
}

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  technologies: Technology[];
  githubUrl: string;
  liveUrl: string;
}

// Project data array
const projectsData: Project[] = [
  {
    id: 1,
    title: "Full-Stack E-Commerce Platform",
    description:
      "Built a complete e-commerce solution with React and Node.js, featuring real-time inventory management, secure payment processing, and an admin dashboard that increased client sales by 150%.",
    imageUrl:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    imageAlt:
      "E-commerce platform interface showing shopping cart and product listings",
    technologies: [
      { name: "React & TypeScript", isHighlighted: false },
      { name: "Node.js & MongoDB", isHighlighted: false },
    ],
    githubUrl: "https://github.com/username/ecommerce-platform",
    liveUrl: "https://ecommerce-demo.vercel.app",
  },
  {
    id: 2,
    title: "AI-Powered Analytics Dashboard",
    description:
      "Developed a machine learning-powered analytics platform using Python and React, processing 100K+ data points daily to deliver predictive insights that helped clients optimize their operations.",
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    imageAlt: "Analytics dashboard with charts, graphs and data visualizations",
    technologies: [
      { name: "Python & FastAPI", isHighlighted: false },
      { name: "Machine Learning", isHighlighted: false },
      { name: "React & D3.js", isHighlighted: false },
      { name: "AWS Certified", isHighlighted: true },
    ],
    githubUrl: "https://github.com/username/ai-analytics-dashboard",
    liveUrl: "https://analytics-dashboard-ai.netlify.app",
  },
];

// ProjectCard component
const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="flex-1">
      <div className="aspect-[2/1] bg-gray-200 mb-6 sm:mb-8 overflow-hidden rounded-sm">
        <Image
          src={project.imageUrl}
          alt={project.imageAlt}
          width={800}
          height={400}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="text-lg sm:text-xl font-medium text-black mb-3 sm:mb-4 leading-tight">
        {project.title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-6 sm:mb-8 font-light">
        {project.description}
      </p>

      {/* Action buttons */}
      <div className="flex gap-3 mb-6 sm:mb-8">
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-400 text-gray-700 hover:border-gray-600 hover:text-gray-900 transition-colors rounded-sm font-light"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
              clipRule="evenodd"
            />
          </svg>
          GitHub
        </a>
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 text-sm bg-black text-white hover:bg-gray-800 transition-colors rounded-sm font-light"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          Live Demo
        </a>
      </div>

      <div className="flex flex-wrap gap-2">
        {project.technologies.map((tech: Technology, index: number) => (
          <span
            key={index}
            className={`px-3 py-1.5 text-xs border font-light rounded-sm ${
              tech.isHighlighted
                ? "border-blue-400 text-blue-700 bg-blue-50"
                : "border-gray-400 text-gray-700"
            }`}
          >
            {tech.name}
          </span>
        ))}
      </div>
    </div>
  );
};

// Main SelectedWorks component
export default function Projects() {
  return (
    <section
      id="projects"
      className="px-4 sm:px-8 md:px-16 lg:px-28 py-12 sm:py-16 md:py-20 bg-white"
    >
      <div className="max-w-8xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-black mb-8 sm:mb-12 lg:mb-16">
          Selected Projects
        </h2>

        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-12">
          {projectsData.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
