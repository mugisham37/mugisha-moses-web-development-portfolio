import React from 'react'
import Navbar from '../../../components/navbar'

// About Me sidebar - shows scrollable about content
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
              <div className="framer-iebpgd" data-border="true" data-framer-name="Photo"
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
                } as React.CSSProperties}>
                <div data-framer-background-image-wrapper="true"
                  style={{ position: 'relative', borderRadius: 'inherit', width: '100%', height: 'auto' }}>
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
              <div className="framer-1mazigv" data-border="true" data-framer-name="About me + Jobs"
                style={{
                  '--border-bottom-width': '1px',
                  '--border-color': 'var(--token-b2fd3f17-d233-4f1a-96da-ff9eb89f2185, rgb(239, 239, 242))',
                  '--border-left-width': '1px',
                  '--border-right-width': '1px',
                  '--border-style': 'solid',
                  '--border-top-width': '1px',
                  backgroundColor: 'var(--token-d2d4a269-93e6-4d8d-a89e-585bfbef9cfd, rgb(245, 245, 247))',
                  borderRadius: '12px',
                  opacity: 1
                } as React.CSSProperties}>
                <div className="framer-q7hd8n" data-framer-name="About me">
                  <p className="framer-text framer-styles-preset-13sghr">About Me</p>
                  <p className="framer-text framer-styles-preset-f949vx">
                    Hi, I'm Moses Mugisha, a Full-Stack Software Engineer with 3+ years of experience 
                    building scalable, data-driven, and cloud-native web applications using Next.js, 
                    NestJS, and PostgreSQL. I'm skilled in TypeScript, React, Docker, and Kubernetes 
                    with a focus on DevOps automation, CI/CD pipelines, and performance optimization. 
                    I'm passionate about delivering modern, secure, and user-centered solutions that 
                    make a real impact.
                  </p>
                </div>

                {/* Experience Section */}
                <div className="framer-p9xrox" data-framer-name="Experience">
                  <p className="framer-text framer-styles-preset-13sghr">Experience</p>
                  <br />

                  <p className="framer-text framer-styles-preset-13sghr">Elev8 Rwanda - Multilingual Enterprise Website</p>
                  <p className="framer-text framer-styles-preset-13sghr">2024</p>
                  <ul className="framer-text framer-styles-preset-f949vx">
                    <li className="framer-text">Architected a full-stack Next.js 14 multilingual web application supporting English, French, and Arabic with dynamic locale routing and RTL support, serving 5,000+ monthly visitors.</li>
                    <li className="framer-text">Integrated Sanity headless CMS with custom schema design, reducing content update time by 80%.</li>
                    <li className="framer-text">Built 50+ reusable UI components using Radix UI and Tailwind CSS, achieving 95+ Lighthouse performance scores.</li>
                    <li className="framer-text">Tools: Next.js, TypeScript, Sanity CMS, Tailwind CSS</li>
                  </ul>
                  <br />

                  <p className="framer-text framer-styles-preset-13sghr">Velocity - Comprehensive Business Management Platform</p>
                  <p className="framer-text framer-styles-preset-13sghr">2024</p>
                  <ul className="framer-text framer-styles-preset-f949vx">
                    <li className="framer-text">Developed a microservices-based business management platform with Next.js 15, NestJS, and React Native serving 10,000+ users.</li>
                    <li className="framer-text">Implemented GraphQL APIs using Apollo Federation and optimized multi-database architecture across PostgreSQL and Redis.</li>
                    <li className="framer-text">Configured CI/CD pipelines using Vitest, Docker, and Kubernetes for 75% faster deployments.</li>
                    <li className="framer-text">Tools: Next.js, NestJS, PostgreSQL, Kubernetes, GraphQL</li>
                  </ul>
                  <br />

                  <p className="framer-text framer-styles-preset-13sghr">Drive Master - Adaptive Learning Platform</p>
                  <p className="framer-text framer-styles-preset-13sghr">2023</p>
                  <ul className="framer-text framer-styles-preset-f949vx">
                    <li className="framer-text">Developed an adaptive learning platform with 11+ microservices built across Go, Node.js, and Python.</li>
                    <li className="framer-text">Built ML-powered personalization engine with PyTorch achieving 87% accuracy for learner gap detection.</li>
                    <li className="framer-text">Created offline-first mobile and web apps using Flutter and Next.js with SQLite sync support.</li>
                    <li className="framer-text">Tools: Go, Python, NestJS, Flutter, Kubernetes, PyTorch</li>
                  </ul>
                </div>

                {/* Education Section */}
                <div className="framer-i5kgy5" data-framer-name="Education">
                  <p className="framer-text framer-styles-preset-13sghr">Education</p>
                  <br />
                  <p className="framer-text framer-styles-preset-13sghr">African Leadership University (ALU)</p>
                  <p className="framer-text framer-styles-preset-13sghr">Expected Graduation: 2028</p>
                  <p className="framer-text framer-styles-preset-13sghr">Bachelor of Science in Software Engineering</p>
                  <p className="framer-text framer-styles-preset-f949vx">Kigali, Rwanda</p>
                  <br />
                  <p className="framer-text framer-styles-preset-13sghr">Certifications</p>
                  <p className="framer-text framer-styles-preset-f949vx">Harvard CS50: Introduction to Computer Science</p>
                </div>
              </div>

              {/* Skills + Interests Section */}
              <div className="framer-61rpwf" data-border="true" data-framer-name="Skills + Interest"
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
                } as React.CSSProperties}>
                <div className="framer-k32yf2" data-framer-name="Skills">
                  <div className="framer-198shbe" data-framer-name="Text">
                    <p className="framer-text framer-styles-preset-13sghr">Skills</p>
                  </div>
                  <div className="framer-21hv8n" data-framer-name="Text">
                    <div className="framer-ajme51">
                      <p className="framer-text framer-styles-preset-13sghr">TypeScript</p>
                      <p className="framer-text framer-styles-preset-13sghr">React & Next.js</p>
                      <p className="framer-text framer-styles-preset-13sghr">Node.js & NestJS</p>
                      <p className="framer-text framer-styles-preset-13sghr">PostgreSQL</p>
                      <p className="framer-text framer-styles-preset-13sghr">Docker</p>
                      <p className="framer-text framer-styles-preset-13sghr">Python</p>
                    </div>
                    <div className="framer-ziz13t">
                      <p className="framer-text framer-styles-preset-13sghr">Kubernetes</p>
                      <p className="framer-text framer-styles-preset-13sghr">GraphQL & REST</p>
                      <p className="framer-text framer-styles-preset-13sghr">AWS & Azure</p>
                      <p className="framer-text framer-styles-preset-13sghr">CI/CD Pipelines</p>
                      <p className="framer-text framer-styles-preset-13sghr">Go & Java</p>
                      <p className="framer-text framer-styles-preset-13sghr">UI/UX Design</p>
                    </div>
                  </div>
                </div>

                <div className="framer-157mepl" data-framer-name="Interest">
                  <div className="framer-9do8o1" data-framer-name="Text">
                    <p className="framer-text framer-styles-preset-13sghr">Interests</p>
                  </div>
                  <div className="framer-16pdcm0" data-framer-name="Text">
                    <div className="framer-j43na3">
                      <p className="framer-text framer-styles-preset-13sghr">3D Design</p>
                      <p className="framer-text framer-styles-preset-13sghr">Cloud Architecture</p>
                      <p className="framer-text framer-styles-preset-13sghr">Machine Learning</p>
                      <p className="framer-text framer-styles-preset-13sghr">Open Source</p>
                    </div>
                    <div className="framer-su4wtg">
                      <p className="framer-text framer-styles-preset-13sghr">System Design</p>
                      <p className="framer-text framer-styles-preset-13sghr">DevOps</p>
                      <p className="framer-text framer-styles-preset-13sghr">Photography</p>
                      <p className="framer-text framer-styles-preset-13sghr">Tech Innovation</p>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="framer-1bhifnh" data-framer-name="Social media">
                  <div className="framer-1elf2bt" data-framer-name="Social">
                    <div className="framer-1c4kmbx" data-framer-name="Title">
                      <p className="framer-text framer-styles-preset-13sghr">
                        <a className="framer-text framer-styles-preset-1wicq5s"
                          href="https://www.linkedin.com/in/mugisha-moses"
                          target="_blank"
                          rel="noopener noreferrer">
                          LinkedIn
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="framer-sl4dr" data-framer-name="Social">
                    <div className="framer-db3jkp" data-framer-name="Title">
                      <p className="framer-text framer-styles-preset-13sghr">
                        <a className="framer-text framer-styles-preset-1wicq5s"
                          href="https://github.com/mugisham37"
                          target="_blank"
                          rel="noopener noreferrer">
                          GitHub
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="framer-5s1wja" data-framer-name="Social media">
                    <div className="framer-judk7u" data-framer-name="Title">
                      <p className="framer-text framer-styles-preset-13sghr">
                        <a className="framer-text framer-styles-preset-1wicq5s"
                          href="https://www.instagram.com/mgshmoses"
                          target="_blank"
                          rel="noopener noreferrer">
                          Instagram
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="framer-xxdrzh" data-framer-name="Mail">
                    <p className="framer-text framer-styles-preset-13sghr">
                      <a className="framer-text framer-styles-preset-1wicq5s"
                        href="mailto:mugisham505@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer">
                        mugisham505@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AboutMeSidebar