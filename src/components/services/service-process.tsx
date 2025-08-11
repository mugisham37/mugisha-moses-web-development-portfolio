"use client";

import { motion } from "framer-motion";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { type Service } from "@/lib/services-data";

interface ServiceProcessProps {
  service: Service;
}

export function ServiceProcess({ service }: ServiceProcessProps) {
  // Use service-specific process steps if available, otherwise use default
  const processSteps = service.processSteps || [
    {
      id: "discovery",
      title: "DISCOVERY & PLANNING",
      description:
        "We analyze your requirements, define project scope, and create a detailed roadmap for success.",
      duration: "1-2 weeks",
      deliverables: [
        "Project requirements document",
        "Technical specifications",
        "Timeline and milestones",
        "Resource allocation plan",
      ],
      icon: "🎯",
    },
    {
      id: "design",
      title: "DESIGN & ARCHITECTURE",
      description:
        "Create the technical architecture and design system that will power your solution.",
      duration: "1-3 weeks",
      deliverables: [
        "System architecture design",
        "Database schema",
        "API specifications",
        "UI/UX mockups",
      ],
      icon: "🏗️",
    },
    {
      id: "development",
      title: "DEVELOPMENT & TESTING",
      description:
        "Build your solution with test-driven development and continuous quality assurance.",
      duration: "4-12 weeks",
      deliverables: [
        "Fully functional solution",
        "Comprehensive test suite",
        "Performance optimization",
        "Security implementation",
      ],
      icon: "⚡",
    },
    {
      id: "deployment",
      title: "DEPLOYMENT & LAUNCH",
      description:
        "Deploy to production with monitoring, documentation, and ongoing support setup.",
      duration: "1-2 weeks",
      deliverables: [
        "Production deployment",
        "Monitoring setup",
        "Documentation package",
        "Support and maintenance plan",
      ],
      icon: "🚀",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="text-center">
        <Typography
          variant="h2"
          className="mb-6 text-4xl font-bold md:text-5xl"
        >
          OUR BATTLE-TESTED
          <span className="text-brutalist-yellow"> PROCESS</span>
        </Typography>
        <Typography
          variant="body"
          className="mx-auto max-w-3xl text-xl text-gray-300"
        >
          Every {service.name.toLowerCase()} project follows our proven
          methodology. Systematic, efficient, and designed for maximum impact.
        </Typography>
      </div>

      {/* Process Timeline */}
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
                          className="text-brutalist-yellow text-xl font-bold"
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
            <span className="text-brutalist-yellow"> WORKS</span>
          </Typography>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-brutalist-yellow mx-auto mb-4 flex h-16 w-16 items-center justify-center text-2xl font-bold text-black">
                📊
              </div>
              <Typography variant="h4" className="mb-2 font-bold">
                DATA-DRIVEN DECISIONS
              </Typography>
              <Typography variant="body" className="text-gray-300">
                Every step is backed by analytics and user research, ensuring
                optimal outcomes.
              </Typography>
            </div>

            <div className="text-center">
              <div className="bg-brutalist-yellow mx-auto mb-4 flex h-16 w-16 items-center justify-center text-2xl font-bold text-black">
                🔄
              </div>
              <Typography variant="h4" className="mb-2 font-bold">
                ITERATIVE IMPROVEMENT
              </Typography>
              <Typography variant="body" className="text-gray-300">
                Continuous feedback loops and testing ensure we deliver exactly
                what you need.
              </Typography>
            </div>

            <div className="text-center">
              <div className="bg-brutalist-yellow mx-auto mb-4 flex h-16 w-16 items-center justify-center text-2xl font-bold text-black">
                🎯
              </div>
              <Typography variant="h4" className="mb-2 font-bold">
                RESULTS-FOCUSED
              </Typography>
              <Typography variant="body" className="text-gray-300">
                Every deliverable is designed to drive measurable business
                outcomes.
              </Typography>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
