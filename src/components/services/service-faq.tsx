"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { type Service } from "@/lib/services-data";

interface ServiceFAQProps {
  service: Service;
}

export function ServiceFAQ({ service }: ServiceFAQProps) {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const toggleFAQ = (faqId: string) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId);
  };

  // Add some general FAQs if service doesn't have many
  const allFAQs = [
    ...service.faqs,
    ...(service.faqs.length < 6
      ? [
          {
            id: "general-timeline",
            question: "What is the typical project timeline?",
            answer: `Most ${service.name.toLowerCase()} projects are completed within ${service.deliveryTime || "4-12 weeks"}, depending on complexity and scope. We provide detailed timelines during the discovery phase and keep you updated throughout the process.`,
            order: 100,
          },
          {
            id: "general-communication",
            question: "How do you handle project communication?",
            answer:
              "We believe in transparent communication. You'll receive weekly progress updates, have direct access to your development team, and can track progress through our project management system. We're available during business hours for any questions.",
            order: 101,
          },
          {
            id: "general-changes",
            question: "Can I make changes during development?",
            answer:
              "Yes, we accommodate reasonable changes during development. Minor adjustments are included, while significant scope changes are handled through our change request process to ensure timeline and budget clarity.",
            order: 102,
          },
          {
            id: "general-ownership",
            question: "Do I own the source code and designs?",
            answer:
              "Absolutely. Upon final payment, you receive full ownership of all source code, designs, and assets created for your project. We also provide comprehensive documentation for future maintenance.",
            order: 103,
          },
        ]
      : []),
  ].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="text-center">
        <Typography
          variant="h2"
          className="mb-6 text-4xl font-bold md:text-5xl"
        >
          FREQUENTLY ASKED
          <span className="text-brutalist-yellow"> QUESTIONS</span>
        </Typography>
        <Typography
          variant="body"
          className="mx-auto max-w-3xl text-xl text-gray-300"
        >
          Get instant answers to common questions about our{" "}
          {service.name.toLowerCase()} service. Don't see your question? Contact
          us directly.
        </Typography>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {allFAQs.map((faq, index) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <FAQItem
              faq={faq}
              isOpen={openFAQ === faq.id}
              onToggle={() => toggleFAQ(faq.id)}
            />
          </motion.div>
        ))}
      </div>

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <Card className="bg-brutalist-yellow p-12 text-center text-black">
          <Typography variant="h3" className="mb-4 text-3xl font-bold">
            STILL HAVE QUESTIONS?
          </Typography>
          <Typography variant="body" className="mb-8 text-xl">
            Get personalized answers from our experts. No sales pressure, just
            honest advice.
          </Typography>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/contact?type=consultation"
              className="text-brutalist-yellow inline-block bg-black px-8 py-4 font-mono font-bold tracking-wider uppercase transition-colors hover:bg-gray-900"
            >
              BOOK FREE CONSULTATION
            </a>
            <a
              href="/contact"
              className="hover:text-brutalist-yellow inline-block border-2 border-black px-8 py-4 font-mono font-bold tracking-wider text-black uppercase transition-colors hover:bg-black"
            >
              SEND MESSAGE
            </a>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

interface FAQItemProps {
  faq: {
    id: string;
    question: string;
    answer: string;
    order: number;
  };
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ faq, isOpen, onToggle }: FAQItemProps) {
  return (
    <Card className="overflow-hidden">
      <button
        onClick={onToggle}
        className="hover:bg-brutalist-charcoal-100/50 flex w-full items-center justify-between p-6 text-left transition-colors"
      >
        <Typography variant="h4" className="pr-4 font-bold">
          {faq.question}
        </Typography>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <div className="bg-brutalist-yellow flex h-8 w-8 items-center justify-center text-xl font-bold text-black">
            +
          </div>
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-700 px-6 pb-6">
              <Typography
                variant="body"
                className="pt-4 leading-relaxed text-gray-300"
              >
                {faq.answer}
              </Typography>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
