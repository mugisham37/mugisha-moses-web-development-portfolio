/**
 * Technical Arsenal - Skills Visualization System
 * Implements hexagonal grid, SVG progress rings, technology constellation,
 * certification badges, and skill filtering system
 */

class TechnicalArsenal {
  constructor() {
    this.skillsData = this.getSkillsData();
    this.currentFilter = "all";
    this.constellationNodes = [];
    this.constellationConnections = [];

    this.init();
  }

  init() {
    this.setupFilterSystem();
    this.renderSkillCategories();
    this.setupProficiencyRings();
    this.setupTechnologyConstellation();
    this.setupCertificationBadges();
    this.setupScrollAnimations();

    // Initialize with all skills visible
    this.filterSkills("all");
  }

  getSkillsData() {
    return {
      frontend: {
        title: "Frontend Development",
        icon: "⚛️",
        proficiency: 95,
        yearsExperience: 6,
        projectsUsed: [
          "E-commerce Platform",
          "Portfolio Website",
          "Task Management App",
          "Real-time Chat App",
        ],
        relatedSkills: ["backend", "design"],
        technologies: [
          {
            name: "React",
            experience: "5 years",
            proficiency: 95,
            projectsUsed: [
              "E-commerce Platform",
              "Portfolio Website",
              "Task Management App",
            ],
            relatedTechs: ["TypeScript", "Next.js", "Node.js"],
          },
          {
            name: "TypeScript",
            experience: "4 years",
            proficiency: 90,
            projectsUsed: [
              "E-commerce Platform",
              "Task Management App",
              "Real-time Chat App",
            ],
            relatedTechs: ["React", "Node.js", "GraphQL"],
          },
          {
            name: "Next.js",
            experience: "3 years",
            proficiency: 88,
            projectsUsed: ["Portfolio Website", "E-commerce Platform"],
            relatedTechs: ["React", "TypeScript", "Vercel"],
          },
          {
            name: "Vue.js",
            experience: "3 years",
            proficiency: 82,
            projectsUsed: ["Admin Dashboard", "Content Management System"],
            relatedTechs: ["Nuxt.js", "Vuex", "Vue Router"],
          },
          {
            name: "Tailwind CSS",
            experience: "4 years",
            proficiency: 92,
            projectsUsed: [
              "Portfolio Website",
              "Task Management App",
              "Landing Pages",
            ],
            relatedTechs: ["PostCSS", "Headless UI", "Alpine.js"],
          },
          {
            name: "SASS/SCSS",
            experience: "6 years",
            proficiency: 94,
            projectsUsed: [
              "Legacy Systems",
              "Custom Design Systems",
              "E-commerce Platform",
            ],
            relatedTechs: ["CSS3", "PostCSS", "Webpack"],
          },
        ],
      },
      backend: {
        title: "Backend Systems",
        icon: "🔧",
        proficiency: 90,
        yearsExperience: 5,
        projectsUsed: [
          "E-commerce API",
          "Real-time Chat System",
          "Microservices Architecture",
          "Payment Gateway",
        ],
        relatedSkills: ["frontend", "database", "devops"],
        technologies: [
          {
            name: "Node.js",
            experience: "5 years",
            proficiency: 92,
            projectsUsed: [
              "E-commerce API",
              "Real-time Chat System",
              "Task Management Backend",
            ],
            relatedTechs: ["Express.js", "TypeScript", "MongoDB"],
          },
          {
            name: "Express.js",
            experience: "5 years",
            proficiency: 90,
            projectsUsed: [
              "REST APIs",
              "Authentication Systems",
              "File Upload Services",
            ],
            relatedTechs: ["Node.js", "JWT", "Helmet"],
          },
          {
            name: "GraphQL",
            experience: "3 years",
            proficiency: 85,
            projectsUsed: ["Content Management API", "Social Media Platform"],
            relatedTechs: ["Apollo Server", "TypeScript", "Prisma"],
          },
          {
            name: "REST APIs",
            experience: "6 years",
            proficiency: 94,
            projectsUsed: [
              "E-commerce Platform",
              "Mobile App Backend",
              "Third-party Integrations",
            ],
            relatedTechs: ["OpenAPI", "Swagger", "Postman"],
          },
          {
            name: "Microservices",
            experience: "3 years",
            proficiency: 80,
            projectsUsed: ["Enterprise Platform", "Scalable Architecture"],
            relatedTechs: ["Docker", "Kubernetes", "API Gateway"],
          },
          {
            name: "WebSockets",
            experience: "2 years",
            proficiency: 78,
            projectsUsed: ["Real-time Chat App", "Live Collaboration Tool"],
            relatedTechs: ["Socket.io", "Redis", "Node.js"],
          },
        ],
      },
      database: {
        title: "Database Architecture",
        icon: "🗄️",
        proficiency: 85,
        yearsExperience: 5,
        projectsUsed: [
          "E-commerce Database",
          "Analytics Platform",
          "User Management System",
          "Content Repository",
        ],
        relatedSkills: ["backend", "devops"],
        technologies: [
          {
            name: "PostgreSQL",
            experience: "4 years",
            proficiency: 88,
            projectsUsed: [
              "E-commerce Platform",
              "Analytics Dashboard",
              "User Management",
            ],
            relatedTechs: ["Prisma", "pgAdmin", "PostGIS"],
          },
          {
            name: "MongoDB",
            experience: "4 years",
            proficiency: 85,
            projectsUsed: [
              "Content Management",
              "Real-time Chat",
              "IoT Data Storage",
            ],
            relatedTechs: ["Mongoose", "MongoDB Atlas", "Aggregation Pipeline"],
          },
          {
            name: "Redis",
            experience: "3 years",
            proficiency: 82,
            projectsUsed: [
              "Session Storage",
              "Caching Layer",
              "Real-time Features",
            ],
            relatedTechs: ["Redis Cluster", "Pub/Sub", "Lua Scripts"],
          },
          {
            name: "Prisma",
            experience: "2 years",
            proficiency: 80,
            projectsUsed: [
              "Type-safe APIs",
              "Database Migrations",
              "Schema Management",
            ],
            relatedTechs: ["PostgreSQL", "TypeScript", "GraphQL"],
          },
          {
            name: "MySQL",
            experience: "5 years",
            proficiency: 90,
            projectsUsed: [
              "Legacy Systems",
              "WordPress Sites",
              "Analytics Platform",
            ],
            relatedTechs: ["phpMyAdmin", "MySQL Workbench", "Replication"],
          },
          {
            name: "Elasticsearch",
            experience: "2 years",
            proficiency: 75,
            projectsUsed: ["Search Engine", "Log Analysis", "Data Analytics"],
            relatedTechs: ["Kibana", "Logstash", "Beats"],
          },
        ],
      },
      mobile: {
        title: "Mobile Development",
        icon: "📱",
        proficiency: 80,
        yearsExperience: 4,
        projectsUsed: [
          "Task Management App",
          "E-commerce Mobile",
          "Social Media App",
          "Fitness Tracker",
        ],
        relatedSkills: ["frontend", "backend"],
        technologies: [
          {
            name: "React Native",
            experience: "3 years",
            proficiency: 85,
            projectsUsed: [
              "Task Management App",
              "E-commerce Mobile",
              "Social Media App",
            ],
            relatedTechs: ["Expo", "React Navigation", "Redux"],
          },
          {
            name: "Flutter",
            experience: "2 years",
            proficiency: 78,
            projectsUsed: ["Fitness Tracker", "Weather App"],
            relatedTechs: ["Dart", "Firebase", "Provider"],
          },
          {
            name: "iOS (Swift)",
            experience: "2 years",
            proficiency: 75,
            projectsUsed: ["Native iOS App", "App Store Optimization"],
            relatedTechs: ["Xcode", "Core Data", "UIKit"],
          },
          {
            name: "Android (Kotlin)",
            experience: "2 years",
            proficiency: 75,
            projectsUsed: ["Native Android App", "Google Play Store"],
            relatedTechs: ["Android Studio", "Room", "Jetpack Compose"],
          },
          {
            name: "Expo",
            experience: "3 years",
            proficiency: 88,
            projectsUsed: ["Rapid Prototyping", "Cross-platform Development"],
            relatedTechs: ["React Native", "EAS Build", "Expo Router"],
          },
          {
            name: "PWA",
            experience: "4 years",
            proficiency: 90,
            projectsUsed: ["Offline-first Apps", "Mobile Web Experience"],
            relatedTechs: ["Service Workers", "Web App Manifest", "Workbox"],
          },
        ],
      },
      devops: {
        title: "DevOps & Cloud",
        icon: "🚀",
        proficiency: 88,
        yearsExperience: 4,
        projectsUsed: [
          "Cloud Infrastructure",
          "CI/CD Pipelines",
          "Container Orchestration",
          "Monitoring Systems",
        ],
        relatedSkills: ["backend", "database"],
        technologies: [
          {
            name: "AWS",
            experience: "4 years",
            proficiency: 90,
            projectsUsed: [
              "Scalable Web Apps",
              "Serverless Functions",
              "Data Analytics",
            ],
            relatedTechs: ["EC2", "S3", "Lambda", "RDS"],
          },
          {
            name: "Docker",
            experience: "4 years",
            proficiency: 88,
            projectsUsed: [
              "Containerized Applications",
              "Development Environment",
            ],
            relatedTechs: [
              "Docker Compose",
              "Dockerfile",
              "Multi-stage Builds",
            ],
          },
          {
            name: "Kubernetes",
            experience: "2 years",
            proficiency: 80,
            projectsUsed: [
              "Microservices Orchestration",
              "Auto-scaling Systems",
            ],
            relatedTechs: ["Helm", "kubectl", "Ingress Controllers"],
          },
          {
            name: "GitHub Actions",
            experience: "3 years",
            proficiency: 85,
            projectsUsed: [
              "Automated Testing",
              "Deployment Pipelines",
              "Code Quality Checks",
            ],
            relatedTechs: ["YAML", "Secrets Management", "Matrix Builds"],
          },
          {
            name: "Terraform",
            experience: "2 years",
            proficiency: 78,
            projectsUsed: ["Infrastructure as Code", "Multi-cloud Deployments"],
            relatedTechs: ["HCL", "Terraform Cloud", "State Management"],
          },
          {
            name: "Nginx",
            experience: "4 years",
            proficiency: 85,
            projectsUsed: [
              "Reverse Proxy",
              "Load Balancing",
              "SSL Termination",
            ],
            relatedTechs: ["SSL/TLS", "Rate Limiting", "Caching"],
          },
        ],
      },
      design: {
        title: "UI/UX Design",
        icon: "🎨",
        proficiency: 75,
        yearsExperience: 4,
        projectsUsed: [
          "Design Systems",
          "User Interface Design",
          "Prototyping",
          "User Research",
        ],
        relatedSkills: ["frontend"],
        technologies: [
          {
            name: "Figma",
            experience: "4 years",
            proficiency: 88,
            projectsUsed: [
              "Design Systems",
              "UI Mockups",
              "Collaborative Design",
            ],
            relatedTechs: ["Auto Layout", "Components", "Variants"],
          },
          {
            name: "Adobe XD",
            experience: "3 years",
            proficiency: 80,
            projectsUsed: ["Mobile App Design", "Interactive Prototypes"],
            relatedTechs: ["Creative Cloud", "Plugins", "Voice Prototyping"],
          },
          {
            name: "Sketch",
            experience: "2 years",
            proficiency: 75,
            projectsUsed: ["macOS App Design", "Symbol Libraries"],
            relatedTechs: ["Sketch Cloud", "Plugins", "Symbols"],
          },
          {
            name: "Framer",
            experience: "2 years",
            proficiency: 78,
            projectsUsed: ["Advanced Prototyping", "Micro-interactions"],
            relatedTechs: [
              "Framer Motion",
              "React Components",
              "Smart Components",
            ],
          },
          {
            name: "Principle",
            experience: "1 year",
            proficiency: 70,
            projectsUsed: [
              "Animation Prototypes",
              "Timeline-based Interactions",
            ],
            relatedTechs: ["Timeline", "Drivers", "Artboards"],
          },
          {
            name: "InVision",
            experience: "2 years",
            proficiency: 72,
            projectsUsed: ["Client Presentations", "Design Handoffs"],
            relatedTechs: ["InVision Studio", "Craft", "Design System Manager"],
          },
        ],
      },
    };
  }

  getCertificationsData() {
    return [
      {
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        logo: "AWS",
        status: "active",
        date: "2023",
        expiryDate: "2026",
        verificationUrl: "#",
        level: "Professional",
      },
      {
        name: "Google Cloud Professional",
        issuer: "Google Cloud",
        logo: "GCP",
        status: "active",
        date: "2023",
        expiryDate: "2025",
        verificationUrl: "#",
        level: "Professional",
      },
      {
        name: "Certified Kubernetes Administrator",
        issuer: "Cloud Native Computing Foundation",
        logo: "K8s",
        status: "active",
        date: "2022",
        expiryDate: "2025",
        verificationUrl: "#",
        level: "Administrator",
      },
      {
        name: "MongoDB Certified Developer",
        issuer: "MongoDB Inc.",
        logo: "MDB",
        status: "active",
        date: "2022",
        expiryDate: "2024",
        verificationUrl: "#",
        level: "Associate",
      },
      {
        name: "React Developer Certification",
        issuer: "Meta",
        logo: "META",
        status: "active",
        date: "2021",
        expiryDate: "2024",
        verificationUrl: "#",
        level: "Professional",
      },
      {
        name: "Docker Certified Associate",
        issuer: "Docker Inc.",
        logo: "DOCK",
        status: "expired",
        date: "2020",
        expiryDate: "2023",
        verificationUrl: "#",
        level: "Associate",
      },
      {
        name: "Azure Fundamentals",
        issuer: "Microsoft",
        logo: "AZ",
        status: "renewing",
        date: "2023",
        expiryDate: "2024",
        verificationUrl: "#",
        level: "Fundamentals",
      },
    ];
  }

  setupFilterSystem() {
    const filterContainer = document.querySelector(".skill-filter");
    if (!filterContainer) return;

    const categories = ["all", ...Object.keys(this.skillsData)];
    const categoryLabels = {
      all: "All Skills",
      frontend: "Frontend",
      backend: "Backend",
      database: "Database",
      mobile: "Mobile",
      devops: "DevOps",
      design: "Design",
    };

    filterContainer.innerHTML = categories
      .map((category) => {
        const count =
          category === "all"
            ? Object.keys(this.skillsData).length
            : this.skillsData[category].technologies.length;

        return `
                <button class="skill-filter__button ${
                  category === "all" ? "active" : ""
                }" 
                        data-filter="${category}">
                    <span>
                        ${categoryLabels[category]}
                        <span class="skill-filter__counter">(${count})</span>
                    </span>
                </button>
            `;
      })
      .join("");

    // Add event listeners
    filterContainer.addEventListener("click", (e) => {
      const button = e.target.closest(".skill-filter__button");
      if (!button) return;

      const filter = button.dataset.filter;
      this.filterSkills(filter);

      // Update active state
      filterContainer
        .querySelectorAll(".skill-filter__button")
        .forEach((btn) => {
          btn.classList.remove("active");
        });
      button.classList.add("active");
    });
  }

  renderSkillCategories() {
    const skillsGrid = document.querySelector(".skills-grid");
    if (!skillsGrid) return;

    skillsGrid.innerHTML = Object.entries(this.skillsData)
      .map(
        ([key, skill]) => `
            <div class="skill-category" data-category="${key}">
                <div class="skill-category__header">
                    <span class="skill-category__icon">${skill.icon}</span>
                    <h3 class="skill-category__title">${skill.title}</h3>
                    <div class="skill-category__experience">
                        <span class="experience-years">${
                          skill.yearsExperience
                        } Years Experience</span>
                        <span class="projects-count">${
                          skill.projectsUsed.length
                        } Projects</span>
                    </div>
                </div>
                
                <div class="proficiency-ring" data-proficiency="${
                  skill.proficiency
                }">
                    <svg viewBox="0 0 100 100">
                        <circle class="proficiency-ring__background" 
                                cx="50" cy="50" r="45"></circle>
                        <circle class="proficiency-ring__progress" 
                                cx="50" cy="50" r="45"
                                data-category="${key}"></circle>
                    </svg>
                    <div class="proficiency-ring__text">${
                      skill.proficiency
                    }%</div>
                </div>
                
                <div class="skill-category__projects">
                    <h4 class="projects-title">Recent Projects:</h4>
                    <ul class="projects-list">
                        ${skill.projectsUsed
                          .slice(0, 3)
                          .map(
                            (project) => `
                            <li class="project-item">${project}</li>
                        `
                          )
                          .join("")}
                    </ul>
                </div>
                
                <ul class="technology-list">
                    ${skill.technologies
                      .map(
                        (tech) => `
                        <li class="technology-item" data-tech="${tech.name
                          .toLowerCase()
                          .replace(/[^a-z0-9]/g, "-")}">
                            <div class="technology-main">
                                <span class="technology-name">${
                                  tech.name
                                }</span>
                                <span class="technology-experience">${
                                  tech.experience
                                }</span>
                            </div>
                            <div class="technology-proficiency">
                                <div class="proficiency-bar">
                                    <div class="proficiency-fill" style="width: ${
                                      tech.proficiency
                                    }%"></div>
                                </div>
                                <span class="proficiency-percentage">${
                                  tech.proficiency
                                }%</span>
                            </div>
                            <div class="technology-details">
                                <div class="technology-projects">
                                    <strong>Used in:</strong> ${tech.projectsUsed
                                      .slice(0, 2)
                                      .join(", ")}
                                    ${
                                      tech.projectsUsed.length > 2
                                        ? ` +${
                                            tech.projectsUsed.length - 2
                                          } more`
                                        : ""
                                    }
                                </div>
                                <div class="technology-related">
                                    <strong>Related:</strong> ${tech.relatedTechs
                                      .slice(0, 3)
                                      .join(", ")}
                                </div>
                            </div>
                        </li>
                    `
                      )
                      .join("")}
                </ul>
                
                <div class="skill-category__relationships">
                    <span class="relationships-label">Related Skills:</span>
                    ${skill.relatedSkills
                      .map(
                        (relatedSkill) => `
                        <button class="relationship-tag" data-filter="${relatedSkill}">
                            ${
                              this.skillsData[relatedSkill]?.title ||
                              relatedSkill
                            }
                        </button>
                    `
                      )
                      .join("")}
                </div>
            </div>
        `
      )
      .join("");

    // Add click handlers for relationship tags
    this.setupRelationshipTags();

    // Setup technology proficiency bar animations
    this.setupTechnologyProficiencyAnimations();
  }

  setupTechnologyProficiencyAnimations() {
    const technologyItems = document.querySelectorAll(".technology-item");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const proficiencyFill =
              entry.target.querySelector(".proficiency-fill");
            if (
              proficiencyFill &&
              !proficiencyFill.classList.contains("animated")
            ) {
              proficiencyFill.classList.add("animated");

              // Reset and animate
              const targetWidth = proficiencyFill.style.width;
              proficiencyFill.style.width = "0%";

              setTimeout(() => {
                proficiencyFill.style.width = targetWidth;
              }, 100);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    technologyItems.forEach((item) => observer.observe(item));
  }

  setupProficiencyRings() {
    const rings = document.querySelectorAll(".proficiency-ring");

    // Setup intersection observer for animation trigger
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateProficiencyRing(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    rings.forEach((ring) => observer.observe(ring));
  }

  animateProficiencyRing(ringElement) {
    const proficiency = parseInt(ringElement.dataset.proficiency);
    const progressCircle = ringElement.querySelector(
      ".proficiency-ring__progress"
    );
    const textElement = ringElement.querySelector(".proficiency-ring__text");
    const circumference = 2 * Math.PI * 45; // radius = 45

    // Set initial state
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = circumference;

    // Animate the ring and counter simultaneously
    setTimeout(() => {
      const offset = circumference - (proficiency / 100) * circumference;
      progressCircle.style.strokeDashoffset = offset;

      // Animate the percentage counter
      this.animateCounter(textElement, 0, proficiency, 2000, "%");
    }, 100);

    // Also animate individual technology proficiency bars in this category
    const techBars = ringElement
      .closest(".skill-category")
      .querySelectorAll(".proficiency-fill");
    techBars.forEach((bar, index) => {
      setTimeout(() => {
        const targetWidth = bar.style.width;
        bar.style.width = "0%";
        setTimeout(() => {
          bar.style.width = targetWidth;
        }, 100);
      }, 200 + index * 100);
    });
  }

  animateCounter(element, start, end, duration, suffix = "") {
    const startTime = performance.now();
    const range = end - start;

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Use easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + range * easeOutCubic);

      element.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }

  setupTechnologyConstellation() {
    const constellation = document.querySelector(".constellation-container");
    if (!constellation) return;

    // Define constellation nodes with positions
    const nodes = [
      {
        name: "React",
        x: 20,
        y: 30,
        connections: ["TypeScript", "Next.js", "Node.js"],
      },
      {
        name: "TypeScript",
        x: 60,
        y: 20,
        connections: ["React", "Node.js", "GraphQL"],
      },
      { name: "Next.js", x: 80, y: 50, connections: ["React", "Node.js"] },
      {
        name: "Node.js",
        x: 40,
        y: 60,
        connections: ["React", "TypeScript", "PostgreSQL"],
      },
      { name: "GraphQL", x: 70, y: 80, connections: ["TypeScript", "Node.js"] },
      { name: "PostgreSQL", x: 15, y: 70, connections: ["Node.js"] },
      { name: "AWS", x: 85, y: 25, connections: ["Docker"] },
      { name: "Docker", x: 90, y: 70, connections: ["AWS", "Kubernetes"] },
      { name: "Kubernetes", x: 50, y: 85, connections: ["Docker"] },
    ];

    // Create nodes
    nodes.forEach((node) => {
      const nodeElement = document.createElement("div");
      nodeElement.className = "constellation-node";
      nodeElement.textContent = node.name;
      nodeElement.style.left = `${node.x}%`;
      nodeElement.style.top = `${node.y}%`;
      nodeElement.dataset.connections = JSON.stringify(node.connections);

      constellation.appendChild(nodeElement);
      this.constellationNodes.push({ element: nodeElement, data: node });
    });

    // Create connections
    this.createConstellationConnections();

    // Add hover effects
    this.setupConstellationInteractions();
  }

  createConstellationConnections() {
    const constellation = document.querySelector(".constellation-container");

    this.constellationNodes.forEach(
      ({ element: nodeElement, data: nodeData }) => {
        const nodeRect = nodeElement.getBoundingClientRect();
        const constellationRect = constellation.getBoundingClientRect();

        nodeData.connections.forEach((connectionName) => {
          const targetNode = this.constellationNodes.find(
            (n) => n.data.name === connectionName
          );
          if (!targetNode) return;

          const targetRect = targetNode.element.getBoundingClientRect();

          // Calculate connection line
          const x1 =
            nodeRect.left - constellationRect.left + nodeRect.width / 2;
          const y1 = nodeRect.top - constellationRect.top + nodeRect.height / 2;
          const x2 =
            targetRect.left - constellationRect.left + targetRect.width / 2;
          const y2 =
            targetRect.top - constellationRect.top + targetRect.height / 2;

          const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
          const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

          const connection = document.createElement("div");
          connection.className = "constellation-connection";
          connection.style.width = `${length}px`;
          connection.style.left = `${x1}px`;
          connection.style.top = `${y1}px`;
          connection.style.transform = `rotate(${angle}deg)`;
          connection.style.transformOrigin = "0 50%";
          connection.dataset.from = nodeData.name;
          connection.dataset.to = connectionName;

          constellation.appendChild(connection);
          this.constellationConnections.push(connection);
        });
      }
    );
  }

  setupConstellationInteractions() {
    this.constellationNodes.forEach(({ element }) => {
      element.addEventListener("mouseenter", () => {
        this.highlightConstellationNode(element);
      });

      element.addEventListener("mouseleave", () => {
        this.clearConstellationHighlights();
      });
    });
  }

  highlightConstellationNode(nodeElement) {
    const nodeName = nodeElement.textContent;
    const connections = JSON.parse(nodeElement.dataset.connections);

    // Highlight the hovered node
    nodeElement.classList.add("highlighted");

    // Highlight connected nodes
    this.constellationNodes.forEach(({ element }) => {
      if (connections.includes(element.textContent)) {
        element.classList.add("highlighted");
      }
    });

    // Highlight connections
    this.constellationConnections.forEach((connection) => {
      if (
        connection.dataset.from === nodeName ||
        connection.dataset.to === nodeName
      ) {
        connection.classList.add("highlighted");
      }
    });
  }

  clearConstellationHighlights() {
    this.constellationNodes.forEach(({ element }) => {
      element.classList.remove("highlighted");
    });

    this.constellationConnections.forEach((connection) => {
      connection.classList.remove("highlighted");
    });
  }

  setupCertificationBadges() {
    const badgesContainer = document.querySelector(".certification-badges");
    if (!badgesContainer) return;

    const certifications = this.getCertificationsData();

    badgesContainer.innerHTML = certifications
      .map(
        (cert) => `
            <div class="certification-badge certification-badge--${
              cert.status
            }">
                <div class="certification-badge__inner">
                    <div class="certification-badge__front">
                        <div class="certification-badge__status-indicator certification-badge__status-indicator--${
                          cert.status
                        }">
                            ${this.getStatusIcon(cert.status)}
                        </div>
                        <div class="certification-badge__logo">${
                          cert.logo
                        }</div>
                        <div class="certification-badge__name">${
                          cert.name
                        }</div>
                        <div class="certification-badge__level">${
                          cert.level
                        }</div>
                    </div>
                    <div class="certification-badge__back">
                        <div class="certification-badge__details">
                            <strong>${cert.issuer}</strong><br>
                            <span class="cert-dates">
                                Issued: ${cert.date}<br>
                                ${
                                  cert.status === "expired"
                                    ? "Expired"
                                    : "Expires"
                                }: ${cert.expiryDate}
                            </span>
                        </div>
                        <div class="certification-badge__status certification-badge__status--${
                          cert.status
                        }">
                            ${cert.status.toUpperCase()}
                        </div>
                        <a href="${
                          cert.verificationUrl
                        }" class="certification-badge__verify" 
                           target="_blank" rel="noopener noreferrer">
                            VERIFY
                        </a>
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  }

  getStatusIcon(status) {
    const icons = {
      active: "✓",
      expired: "✗",
      renewing: "⟳",
    };
    return icons[status] || "?";
  }

  filterSkills(category) {
    this.currentFilter = category;
    const skillCategories = document.querySelectorAll(".skill-category");

    skillCategories.forEach((categoryElement) => {
      const categoryKey = categoryElement.dataset.category;

      if (category === "all" || categoryKey === category) {
        categoryElement.classList.remove("filtered-out");
      } else {
        categoryElement.classList.add("filtered-out");
      }
    });

    // Update counter in filter buttons
    this.updateFilterCounters();
  }

  updateFilterCounters() {
    const filterButtons = document.querySelectorAll(".skill-filter__button");

    filterButtons.forEach((button) => {
      const filter = button.dataset.filter;
      const counter = button.querySelector(".skill-filter__counter");

      if (filter === "all") {
        counter.textContent = `(${Object.keys(this.skillsData).length})`;
      } else if (this.skillsData[filter]) {
        counter.textContent = `(${this.skillsData[filter].technologies.length})`;
      }
    });
  }

  setupRelationshipTags() {
    const relationshipTags = document.querySelectorAll(".relationship-tag");

    relationshipTags.forEach((tag) => {
      tag.addEventListener("click", (e) => {
        e.preventDefault();
        const filter = tag.dataset.filter;
        this.filterSkills(filter);

        // Update active filter button
        const filterButtons = document.querySelectorAll(
          ".skill-filter__button"
        );
        filterButtons.forEach((btn) => btn.classList.remove("active"));

        const targetButton = document.querySelector(
          `[data-filter="${filter}"]`
        );
        if (targetButton) {
          targetButton.classList.add("active");
        }
      });
    });
  }

  setupScrollAnimations() {
    const animatedElements = document.querySelectorAll(
      ".technical-arsenal .fade-in-scroll"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    animatedElements.forEach((element) => observer.observe(element));
  }
}

// Initialize Technical Arsenal when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Check if we're on a page with the technical arsenal section
  if (document.querySelector(".technical-arsenal")) {
    new TechnicalArsenal();
  }
});

// Handle reduced motion preference
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  // Disable complex animations for users who prefer reduced motion
  document.documentElement.style.setProperty("--animation-duration", "0.01s");
}
