import React from 'react';

// Types
interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  href: string;
}

interface TabButtonProps {
  label: string;
  isActive: boolean;
}

interface ProjectCardProps {
  project: Project;
}

// Data
const projects: Project[] = [
  {
    id: 'bookease',
    title: 'BookEase App',
    description: 'Intuitive platform for seamless online book shopping.',
    imageUrl: 'https://framerusercontent.com/images/I3WJm2mv67qLCa3IapaovJh6EmU.webp',
    href: './works/bookease-copy#work-details',
  },
  {
    id: 'produli',
    title: 'Produli',
    description: 'IoT-enabled kitchen chopping board.',
    imageUrl: 'https://framerusercontent.com/images/ORiNmQF0Pu1sP6MUbOKf4J4f2UA.png',
    href: './works/produli#work-details',
  },
  {
    id: 'travelease',
    title: 'TravelEase',
    description: 'A rebranded travel agency site aimed at millennials.',
    imageUrl: 'https://framerusercontent.com/images/5Ut9ib9l2kwjn6ThlsPt54yiA.png',
    href: './works/travelease#work-details',
  },
  {
    id: 'edukids',
    title: 'EduKids',
    description: 'Educational platform offering interactive learning for kids.',
    imageUrl: 'https://framerusercontent.com/images/pybLPiPdzHp1iq9ezjjFGw9IJQ.png',
    href: './works/edukids#work-details',
  },
  {
    id: 'fitbod',
    title: 'FitBod',
    description: 'Web-based fitness tracking and meal planning.',
    imageUrl: 'https://framerusercontent.com/images/wIVnZ13oYsjU5mC3b5BAMDYPBY.png',
    href: './works/fitbod#work-details',
  },
  {
    id: 'photomingle',
    title: 'PhotoMingle',
    description: 'Social media platform focused on photography enthusiasts.',
    imageUrl: 'https://framerusercontent.com/images/dynunyDW5G2prn1TjiYIiuAU.png',
    href: './works/photomingle#work-details',
  },
  {
    id: 'bookease-branding',
    title: 'BookEase Branding',
    description: 'Intuitive platform for seamless online book shopping.',
    imageUrl: 'https://framerusercontent.com/images/Sj0j2YIYMlYSLbL2SDJbiSHsOA.png',
    href: './works/bookease-branding#work-details',
  },
];

// Shared styles
const styles = {
  border: {
    '--border-bottom-width': '1px',
    '--border-color': 'var(--token-b2fd3f17-d233-4f1a-96da-ff9eb89f2185, rgb(239, 239, 242))',
    '--border-left-width': '1px',
    '--border-right-width': '1px',
    '--border-style': 'solid',
    '--border-top-width': '1px',
  } as React.CSSProperties,
  cardBackground: {
    backgroundColor: 'var(--token-d2d4a269-93e6-4d8d-a89e-585bfbef9cfd, rgb(245, 245, 247))',
    borderRadius: '11.5px',
    opacity: '1',
  } as React.CSSProperties,
  menuBackground: {
    backgroundColor: 'var(--token-d2d4a269-93e6-4d8d-a89e-585bfbef9cfd, rgb(245, 245, 245))',
    borderRadius: '11.5px',
    opacity: '1',
  } as React.CSSProperties,
};

// Components
const TabButton: React.FC<TabButtonProps> = ({ label, isActive }) => (
  <div className={`framer-${isActive ? 'v7jhl6' : 'c7p8gd'}-container`} style={{ opacity: '1' }}>
    <div className="framer-WazJ0 framer-M4SXU framer-v-lxples" tabIndex={0} style={{ display: 'contents' }}>
      <div
        className="framer-lxples"
        data-framer-name={isActive ? 'Variant 1' : 'Off'}
        data-highlight="true"
        tabIndex={0}
        style={{ width: '100%', borderRadius: '7.5px', opacity: '1' }}
      >
        <div
          className="framer-yo2r9r"
          data-framer-name="Text"
          data-framer-component-type="RichTextContainer"
          style={{
            '--framer-paragraph-spacing': '0px',
            ...(isActive ? {} : { '--extracted-r6o4lv': 'var(--token-7a188dfa-68d3-41d9-8d6c-67b23199941d, rgb(113, 113, 122))' }),
            transform: 'none',
            opacity: '1',
            ...(isActive ? {} : { willChange: 'auto' }),
          } as React.CSSProperties}
        >
          <p
            className="framer-text framer-styles-preset-13sghr"
            data-styles-preset="oFmnpzi_h"
            style={isActive ? {} : ({ '--framer-text-color': 'var(--extracted-r6o4lv)' } as React.CSSProperties)}
          >
            {label}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => (
  <div className="framer-6ck86u-container" style={{ opacity: '1' }}>
    <div
      className="framer-tQZEf framer-3Wby5 framer-M4SXU framer-yo8un4 framer-v-127pux1"
      data-framer-name="Mobile"
      data-highlight="true"
      tabIndex={0}
      style={{ width: '100%', borderRadius: '14px', opacity: '1' }}
    >
      <a
        className="framer-3jgq1s framer-irm3n9"
        data-border="true"
        data-framer-name="Card/Project"
        href={project.href}
        style={{ ...styles.border, ...styles.cardBackground }}
      >
        <div className="framer-q9yaf3" data-framer-name="Container" style={{ opacity: '1' }}>
          <div
            className="framer-xgn92i"
            data-framer-name="Photo"
            style={{
              borderRadius: '8px',
              boxShadow: 'rgba(107, 100, 100, 0.1) 0px 1px 3px 0px',
              opacity: '1',
            }}
          >
            <div
              data-framer-background-image-wrapper="true"
              style={{ position: 'absolute', borderRadius: 'inherit', inset: '0px' }}
            >
              <img
                decoding="auto"
                sizes="64px"
                src={project.imageUrl}
                alt={project.title}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  borderRadius: 'inherit',
                  objectPosition: 'center center',
                  objectFit: 'fill',
                }}
              />
            </div>
          </div>
          <div className="framer-1o6754" data-framer-name="Info project" style={{ opacity: '1' }}>
            <div
              className="framer-p2e3yj"
              data-framer-name="Title"
              data-framer-component-type="RichTextContainer"
              style={{
                '--extracted-1of0zx5': 'var(--token-818a283b-450e-452c-a8af-6b81d42f4181, rgb(0, 0, 0))',
                transform: 'none',
                opacity: '1',
              } as React.CSSProperties}
            >
              <h2
                className="framer-text framer-styles-preset-1y43b4w"
                data-styles-preset="SbUeepJXi"
                style={{
                  '--framer-text-color':
                    'var(--extracted-1of0zx5, var(--token-818a283b-450e-452c-a8af-6b81d42f4181, rgb(0, 0, 0)))',
                } as React.CSSProperties}
              >
                {project.title}
              </h2>
            </div>
            <div
              className="framer-1bu06yy"
              data-framer-name="Description"
              data-framer-component-type="RichTextContainer"
              style={{
                '--extracted-r6o4lv': 'var(--token-7a188dfa-68d3-41d9-8d6c-67b23199941d, rgb(113, 113, 122))',
                transform: 'none',
                opacity: '1',
              } as React.CSSProperties}
            >
              <p
                className="framer-text framer-styles-preset-13sghr"
                data-styles-preset="oFmnpzi_h"
                style={{
                  '--framer-text-color':
                    'var(--extracted-r6o4lv, var(--token-7a188dfa-68d3-41d9-8d6c-67b23199941d, rgb(113, 113, 122)))',
                } as React.CSSProperties}
              >
                {project.description}
              </p>
            </div>
          </div>
        </div>
      </a>
    </div>
  </div>
);

// Main Component
const WorkProduct: React.FC = () => {
  return (
    <div className="framer-ejtc8w-container">
      <div
        className="framer-4k1Zq framer-9gn1mz framer-v-169xjp1"
        data-framer-name="Works Mobile"
        style={{ width: '100%', opacity: '1' }}
      >
        <div className="framer-2cxopf" data-framer-name="Tabs" style={{ opacity: '1' }}>
          <div
            className="framer-pbq50l"
            data-border="true"
            data-framer-name="menubar"
            style={{ ...styles.border, ...styles.menuBackground }}
          >
            <div
              className="framer-12zuu6d"
              data-framer-name="Selector"
              style={{
                backgroundColor: 'var(--token-1fc170f9-f857-4cb9-bd35-3840f169c14f, rgb(255, 255, 255))',
                borderRadius: '7.5px',
                boxShadow: 'rgba(107, 100, 100, 0.1) 0px 1px 3px 0px',
                opacity: '1',
              }}
            />
            <TabButton label="Works" isActive={true} />
            <TabButton label="Products" isActive={false} />
          </div>
        </div>
        <div className="framer-1dm2yy8" data-framer-name="Works" style={{ opacity: '1' }}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkProduct;
