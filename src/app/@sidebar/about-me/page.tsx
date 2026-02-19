import React from 'react'
import Navbar from '../../../components/navbar'

// Types
interface ExperienceItem {
  title: string
  year: string
  points: string[]
}

interface SocialLink {
  label: string
  href: string
}

// Data
const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    title: 'Elev8 Rwanda - Multilingual Enterprise Website',
    year: '2024',
    points: [
      'Architected a full-stack Next.js 14 multilingual web application supporting English, French, and Arabic with dynamic locale routing and RTL support, serving 5,000+ monthly visitors.',
      'Integrated Sanity headless CMS with custom schema design, reducing content update time by 80%.',
      'Built 50+ reusable UI components using Radix UI and Tailwind CSS, achieving 95+ Lighthouse performance scores.',
      'Tools: Next.js, TypeScript, Sanity CMS, Tailwind CSS'
    ]
  },
  {
    title: 'Velocity - Comprehensive Business Management Platform',
    year: '2024',
    points: [
      'Developed a microservices-based business management platform with Next.js 15, NestJS, and React Native serving 10,000+ users.',
      'Implemented GraphQL APIs using Apollo Federation and optimized multi-database architecture across PostgreSQL and Redis.',
      'Configured CI/CD pipelines using Vitest, Docker, and Kubernetes for 75% faster deployments.',
      'Tools: Next.js, NestJS, PostgreSQL, Kubernetes, GraphQL'
    ]
  },
  {
    title: 'Drive Master - Adaptive Learning Platform',
    year: '2023',
    points: [
      'Developed an adaptive learning platform with 11+ microservices built across Go, Node.js, and Python.',
      'Built ML-powered personalization engine with PyTorch achieving 87% accuracy for learner gap detection.',
      'Created offline-first mobile and web apps using Flutter and Next.js with SQLite sync support.',
      'Tools: Go, Python, NestJS, Flutter, Kubernetes, PyTorch'
    ]
  }
]

const SKILLS = {
  left: ['TypeScript', 'React & Next.js', 'Node.js & NestJS', 'PostgreSQL', 'Docker', 'Python'],
  right: ['Kubernetes', 'GraphQL & REST', 'AWS & Azure', 'CI/CD Pipelines', 'Go & Java', 'UI/UX Design']
}

const INTERESTS = {
  left: ['3D Design', 'Cloud Architecture', 'Machine Learning', 'Open Source'],
  right: ['System Design', 'DevOps', 'Photography', 'Tech Innovation']
}

const SOCIAL_LINKS: SocialLink[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mugisha-moses' },
  { label: 'GitHub', href: 'https://github.com/mugisham37' },
  { label: 'Instagram', href: 'https://www.instagram.com/mgshmoses' },
  { label: 'mugisham505@gmail.com', href: 'mailto:mugisham505@gmail.com' }
]

// Reusable Components
const BorderedCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  style?: React.CSSProperties;
  'data-framer-name'?: string;
}> = ({ children, className = '', style, ...props }) => (
  <div
    className={className}
    data-border="true"
    style={{
      '--border-bottom-width': '1px',
      '--border-color': 'var(--token-b2fd3f17-d233-4f1a-96da-ff9eb89f2185, rgb(239, 239, 242))',
      '--border-left-width': '1px',
      '--border-right-width': '1px',
      '--border-style': 'solid',
      '--border-top-width': '1px',
      backgroundColor: 'var(--token-d2d4a269-93e6-4d8d-a89e-585bfbef9cfd, rgb(245, 245, 247))',
      borderRadius: '12px',
      opacity: 1,
      ...style
    } as React.CSSProperties}
    {...props}
  >
    {children}
  </div>
)

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="framer-text framer-styles-preset-13sghr">{children}</p>
)

const BodyText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="framer-text framer-styles-preset-f949vx">{children}</p>
)

const ExperienceEntry: React.FC<{ experience: ExperienceItem }> = ({ experience }) => (
  <>
    <SectionTitle>{experience.title}</SectionTitle>
    <SectionTitle>{experience.year}</SectionTitle>
    <ul className="framer-text framer-styles-preset-f949vx">
      {experience.points.map((point, index) => (
        <li key={index} className="framer-text">{point}</li>
      ))}
    </ul>
    <br />
  </>
)

const SkillColumn: React.FC<{ skills: string[]; className: string }> = ({ skills, className }) => (
  <div className={className}>
    {skills.map((skill, index) => (
      <SectionTitle key={index}>{skill}</SectionTitle>
    ))}
  </div>
)

const SocialLink: React.FC<{ link: SocialLink }> = ({ link }) => (
  <div className="framer-1elf2bt" data-framer-name="Social">
    <div className="framer-1c4kmbx" data-framer-name="Title">
      <SectionTitle>
        <a
          className="framer-text framer-styles-preset-1wicq5s"
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.label}
        </a>
      </SectionTitle>
    </div>
  </div>
)

// Main Component
const AboutMeSidebar = () => {
  return (
    <main className="framer-966u9a sidebar-container" data-framer-name="Left section" data-hide-scrollbars="true">
      <div className="framer-agc1gp sidebar-content" data-framer-name="Container">
        <Navbar />
        <div className="about-me-wrapper">
          <div className="framer-11xim48-container">
            <div className="framer-siQt0 framer-M4SXU framer-LHxgI framer-E4PKR framer-6styqx framer-v-6styqx"
              data-framer-name="Variant 1">
              
              {/* Photo Section */}
              <div
                className="framer-iebpgd"
                data-border="true"
                data-framer-name="Photo"
                style={{
                  '--border-bottom-width': '1px',
                  '--border-color': 'var(--token-b2fd3f17-d233-4f1a-96da-ff9eb89f2185, rgb(239, 239, 242))',
                  '--border-left-width': '1px',
                  '--border-right-width': '1px',
                  '--border-style': 'solid',
                  '--border-top-width': '1px',
                  borderRadius: '12px',
                  opacity: 1,
                  overflow: 'hidden'
                } as React.CSSProperties}
              >
                <div
                  data-framer-background-image-wrapper="true"
                  style={{ position: 'relative', borderRadius: 'inherit', width: '100%', height: 'auto' }}
                >
                  <img
                    decoding="async"
                    loading="lazy"
                    width={1276}
                    height={1173}
                    src="/Moses.png"
                    alt="Moses Mugisha Profile"
                    style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 'inherit' }}
                  />
                </div>
              </div>

              {/* About Me + Experience Section */}
              <BorderedCard className="framer-1mazigv" data-framer-name="About me + Jobs">
                <div className="framer-q7hd8n" data-framer-name="About me">
                  <SectionTitle>About Me</SectionTitle>
                  <BodyText>
                    Hi, I'm Moses Mugisha, a Full-Stack Software Engineer with 3+ years of experience 
                    building scalable, data-driven, and cloud-native web applications using Next.js, 
                    NestJS, and PostgreSQL. I'm skilled in TypeScript, React, Docker, and Kubernetes 
                    with a focus on DevOps automation, CI/CD pipelines, and performance optimization. 
                    I'm passionate about delivering modern, secure, and user-centered solutions that 
                    make a real impact.
                  </BodyText>
                </div>

                {/* Experience Section */}
                <div className="framer-p9xrox" data-framer-name="Experience">
                  <SectionTitle>Experience</SectionTitle>
                  <br />
                  {EXPERIENCE_DATA.map((exp, index) => (
                    <ExperienceEntry key={index} experience={exp} />
                  ))}
                </div>

                {/* Education Section */}
                <div className="framer-i5kgy5" data-framer-name="Education">
                  <SectionTitle>Education</SectionTitle>
                  <br />
                  <SectionTitle>African Leadership University (ALU)</SectionTitle>
                  <SectionTitle>Expected Graduation: 2028</SectionTitle>
                  <SectionTitle>Bachelor of Science in Software Engineering</SectionTitle>
                  <BodyText>Kigali, Rwanda</BodyText>
                  <br />
                  <SectionTitle>Certifications</SectionTitle>
                  <BodyText>Harvard CS50: Introduction to Computer Science</BodyText>
                </div>
              </BorderedCard>

              {/* Skills + Interests Section */}
              <BorderedCard
                className="framer-61rpwf"
                data-framer-name="Skills + Interest"
                style={{
                  '--border-bottom-width': '1px',
                  '--border-color': 'var(--token-b2fd3f17-d233-4f1a-96da-ff9eb89f2185, rgb(239, 239, 242))',
                  '--border-left-width': '1px',
                  '--border-right-width': '1px',
                  '--border-style': 'solid',
                  '--border-top-width': '1px',
                  backgroundColor: 'var(--token-d2d4a269-93e6-4d8d-a89e-585bfbef9cfd, rgb(245, 245, 247))',
                  borderRadius: '12px',
                  boxShadow: 'rgba(107, 100, 100, 0.1) 0px 1px 3px 0px',
                  opacity: 1
                } as React.CSSProperties}
              >
                {/* Skills */}
                <div className="framer-k32yf2" data-framer-name="Skills">
                  <div className="framer-198shbe" data-framer-name="Text">
                    <SectionTitle>Skills</SectionTitle>
                  </div>
                  <div className="framer-21hv8n" data-framer-name="Text">
                    <SkillColumn skills={SKILLS.left} className="framer-ajme51" />
                    <SkillColumn skills={SKILLS.right} className="framer-ziz13t" />
                  </div>
                </div>

                {/* Interests */}
                <div className="framer-157mepl" data-framer-name="Interest">
                  <div className="framer-9do8o1" data-framer-name="Text">
                    <SectionTitle>Interests</SectionTitle>
                  </div>
                  <div className="framer-16pdcm0" data-framer-name="Text">
                    <SkillColumn skills={INTERESTS.left} className="framer-j43na3" />
                    <SkillColumn skills={INTERESTS.right} className="framer-su4wtg" />
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="framer-1bhifnh" data-framer-name="Social media">
                  {SOCIAL_LINKS.map((link, index) => (
                    <SocialLink key={index} link={link} />
                  ))}
                </div>
              </BorderedCard>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AboutMeSidebar
