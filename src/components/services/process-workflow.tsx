"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

// Generic process workflow that applies to most services
const processSteps = [
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
    color: "text-brutalist-yellow",
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
    color: "text-white",
  },
  {
    id: "development",
    title: "DEVELOPMENT & TESTING",
    description:
      "Build your application with test-driven development and continuous integration. Every feature is battle-tested before deployment.",
    duration: "4-8 weeks",
    deliverables: [
      "Fully functional application",
      "Comprehensive test suite",
      "Performance optimization",
      "Security audit and fixes",
    ],
    icon: "⚡",
    color: "text-brutalist-yellow",
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
    color: "text-white",
  },
];

export function ProcessWorkflow() {
  return (
    <div className="space-y-12">
      {/* Process Overview */}
      <div className="text-center">
        <Typography
          variant="body"
          className="mx-auto max-w-3xl text-xl text-gray-300"
        >
          Our battle-tested process ensures every project delivers maximum
          impact. From strategic planning to flawless execution, we transform
          ideas into digital weapons.
        </Typography>
      </div>

      {/* Process Steps */}
      <div className="relative">
        {/* Connection Line */}
        <div className="bg-brutalist-yellow absolute top-0 bottom-0 left-1/2 hidden w-1 -translate-x-1/2 transform lg:block"></div>

        <div className="space-y-16">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className={`flex flex-col items-center gap-8 lg:flex-row ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Step Content */}
              <div className="flex-1 lg:max-w-lg">
                <Card className="relative p-8">
                  {/* Step Number */}
                  <div className="bg-brutalist-yellow absolute -top-4 -left-4 flex h-12 w-12 items-center justify-center text-xl font-bold text-black">
                    {index + 1}
                  </div>

                  <div className="mb-6">
                    <div className="mb-4 flex items-center gap-4">
                      <span className="text-4xl">{step.icon}</span>
                      <div>
                        <Typography
                          variant="h3"
                          className={`text-xl font-bold ${step.color}`}
                        >
                          {step.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          className="font-mono text-gray-400"
                        >
                          Duration: {step.duration}
                        </Typography>
                      </div>
                    </div>

                    <Typography
                      variant="body"
                      className="leading-relaxed text-gray-300"
                    >
                      {step.description}
                    </Typography>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <Typography
                      variant="h4"
                      className="text-brutalist-yellow mb-3 text-sm font-bold tracking-wider uppercase"
                    >
                      Key Deliverables
                    </Typography>
                    <ul className="space-y-2">
                      {step.deliverables.map(
                        (deliverable, deliverableIndex) => (
                          <li
                            key={deliverableIndex}
                            className="flex items-start"
                          >
                            <span className="text-brutalist-yellow mr-2 font-bold">
                              ▸
                            </span>
                            <Typography
                              variant="caption"
                              className="text-gray-300"
                            >
                              {deliverable}
                            </Typography>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </Card>
              </div>

              {/* Step Connector (Desktop) */}
              <div className="hidden lg:block">
                <div className="bg-brutalist-yellow relative z-10 flex h-16 w-16 items-center justify-center border-4 border-black">
                  <span className="text-2xl">{step.icon}</span>
                </div>
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden flex-1 lg:block lg:max-w-lg"></div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Process Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <Card className="bg-brutalist-charcoal-100 p-8">
          <Typography
            variant="h3"
            className="mb-6 text-center text-2xl font-bold"
          >
            WHY OUR PROCESS
            <span className="text-brutalist-yellow"> DOMINATES</span>
          </Typography>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-brutalist-yellow mx-auto mb-4 flex h-16 w-16 items-center justify-center text-2xl font-bold text-black">
                ⚡
              </div>
              <Typography variant="h4" className="mb-2 font-bold">
                SPEED & EFFICIENCY
              </Typography>
              <Typography variant="body" className="text-gray-300">
                Streamlined process eliminates waste and delivers results faster
                than traditional agencies.
              </Typography>
            </div>

            <div className="text-center">
              <div className="bg-brutalist-yellow mx-auto mb-4 flex h-16 w-16 items-center justify-center text-2xl font-bold text-black">
                🎯
              </div>
              <Typography variant="h4" className="mb-2 font-bold">
                PRECISION TARGETING
              </Typography>
              <Typography variant="body" className="text-gray-300">
                Every decision is data-driven and aligned with your business
                objectives for maximum ROI.
              </Typography>
            </div>

            <div className="text-center">
              <div className="bg-brutalist-yellow mx-auto mb-4 flex h-16 w-16 items-center justify-center text-2xl font-bold text-black">
                🛡️
              </div>
              <Typography variant="h4" className="mb-2 font-bold">
                BULLETPROOF QUALITY
              </Typography>
              <Typography variant="body" className="text-gray-300">
                Rigorous testing and quality assurance ensure your project
                launches without issues.
              </Typography>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
