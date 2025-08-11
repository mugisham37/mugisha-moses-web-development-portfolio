"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

const guarantees = [
  {
    id: "performance",
    title: "PERFORMANCE GUARANTEE",
    description:
      "90+ Lighthouse scores or we optimize until we achieve them. Your site will load in under 2 seconds globally.",
    icon: "⚡",
    details: [
      "90+ Lighthouse Performance Score",
      "Sub-2-second loading times",
      "Core Web Vitals optimization",
      "Mobile performance guarantee",
    ],
    badge: "SPEED DEMON",
  },
  {
    id: "quality",
    title: "QUALITY ASSURANCE",
    description:
      "Bug-free launch guarantee. If we miss a bug, we fix it free for 90 days post-launch.",
    icon: "🛡️",
    details: [
      "Comprehensive testing suite",
      "Cross-browser compatibility",
      "Mobile responsiveness",
      "90-day bug-fix guarantee",
    ],
    badge: "BULLETPROOF",
  },
  {
    id: "timeline",
    title: "DELIVERY PROMISE",
    description:
      "On-time delivery or 10% discount. We respect your deadlines and deliver when promised.",
    icon: "🎯",
    details: [
      "Fixed timeline commitment",
      "Weekly progress updates",
      "Milestone-based delivery",
      "10% discount for delays",
    ],
    badge: "PUNCTUAL",
  },
  {
    id: "satisfaction",
    title: "SATISFACTION GUARANTEE",
    description:
      "Not happy? We'll work until you are, or provide a full refund within 30 days.",
    icon: "💎",
    details: [
      "Unlimited revisions",
      "30-day satisfaction period",
      "Full refund if unsatisfied",
      "No questions asked policy",
    ],
    badge: "RISK-FREE",
  },
  {
    id: "security",
    title: "SECURITY PROMISE",
    description:
      "Enterprise-grade security implementation. OWASP compliance and security audit included.",
    icon: "🔒",
    details: [
      "OWASP security compliance",
      "Penetration testing",
      "Data encryption standards",
      "Security audit report",
    ],
    badge: "FORTRESS",
  },
  {
    id: "support",
    title: "SUPPORT COMMITMENT",
    description:
      "Dedicated support during business hours. Critical issues resolved within 4 hours.",
    icon: "🚀",
    details: [
      "Business hours support",
      "4-hour critical response",
      "Direct developer access",
      "Knowledge base included",
    ],
    badge: "ALWAYS ON",
  },
];

export function ServiceGuarantees() {
  return (
    <div className="space-y-12">
      {/* Introduction */}
      <div className="text-center">
        <Typography
          variant="body"
          className="mx-auto max-w-3xl text-xl text-gray-300"
        >
          We don't just promise excellence—we guarantee it. Our iron-clad
          guarantees ensure you get exactly what you pay for, when you need it.
        </Typography>
      </div>

      {/* Guarantees Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {guarantees.map((guarantee, index) => (
          <motion.div
            key={guarantee.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <GuaranteeCard guarantee={guarantee} />
          </motion.div>
        ))}
      </div>

      {/* Guarantee Promise */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <Card className="bg-brutalist-yellow p-12 text-center text-black">
          <div className="mx-auto max-w-4xl">
            <Typography
              variant="display"
              className="mb-6 text-4xl font-bold md:text-6xl"
            >
              OUR WORD IS
              <br />
              OUR BOND
            </Typography>
            <Typography
              variant="h2"
              className="mb-8 font-mono text-xl md:text-2xl"
            >
              These aren't just marketing promises. They're legally binding
              commitments backed by our reputation and your success.
            </Typography>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                variant="secondary"
                size="lg"
                className="border-black bg-black text-white hover:bg-gray-900"
              >
                VIEW TERMS & CONDITIONS
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="border-black text-black hover:bg-black/10"
              >
                START YOUR PROJECT
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

interface GuaranteeCardProps {
  guarantee: (typeof guarantees)[0];
}

function GuaranteeCard({ guarantee }: GuaranteeCardProps) {
  return (
    <Card className="group hover:border-brutalist-yellow relative flex h-full flex-col p-8 transition-colors">
      {/* Badge */}
      <div className="bg-brutalist-yellow absolute -top-3 -right-3 rotate-3 transform px-3 py-1 font-mono text-xs font-bold tracking-wider text-black uppercase">
        {guarantee.badge}
      </div>

      {/* Icon */}
      <div className="mb-6">
        <div className="bg-brutalist-charcoal-100 group-hover:bg-brutalist-yellow flex h-16 w-16 items-center justify-center border-2 border-white transition-colors group-hover:text-black">
          <span className="text-3xl">{guarantee.icon}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <Typography
          variant="h3"
          className="group-hover:text-brutalist-yellow mb-4 text-xl font-bold transition-colors"
        >
          {guarantee.title}
        </Typography>

        <Typography
          variant="body"
          className="mb-6 leading-relaxed text-gray-300"
        >
          {guarantee.description}
        </Typography>

        {/* Details */}
        <div className="mb-6">
          <Typography
            variant="h4"
            className="text-brutalist-yellow mb-3 text-sm font-bold tracking-wider uppercase"
          >
            What's Included
          </Typography>
          <ul className="space-y-2">
            {guarantee.details.map((detail, index) => (
              <li key={index} className="flex items-start">
                <span className="text-brutalist-yellow mr-2 font-bold">▸</span>
                <Typography variant="caption" className="text-gray-300">
                  {detail}
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action */}
      <div className="mt-auto">
        <Button
          variant="ghost"
          className="group-hover:bg-brutalist-yellow w-full transition-colors group-hover:text-black"
        >
          LEARN MORE
        </Button>
      </div>
    </Card>
  );
}
