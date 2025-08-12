"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPriceRange, type Service } from "@/lib/services-data";

interface ServiceHeroProps {
  service: Service;
}

export function ServiceHero({ service }: ServiceHeroProps) {
  return (
    <Section className="relative overflow-hidden pt-32 pb-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkZGMDAiIGZpbGwtb3BhY2l0eT0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')]"></div>
      </div>

      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              {service.featured && (
                <div className="bg-brutalist-yellow px-4 py-2 font-mono text-xs font-bold tracking-wider text-black uppercase">
                  FEATURED SERVICE
                </div>
              )}
              {service.popular && (
                <div className="bg-white px-4 py-2 font-mono text-xs font-bold tracking-wider text-black uppercase">
                  MOST POPULAR
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <Typography
                variant="display"
                className="mb-4 text-5xl leading-none font-bold tracking-tighter md:text-7xl"
              >
                {service.name.toUpperCase()}
              </Typography>
              <div className="bg-brutalist-yellow h-2 w-24"></div>
            </div>

            {/* Description */}
            <Typography
              variant="h2"
              className="text-xl leading-relaxed text-gray-300 md:text-2xl"
            >
              {service.description}
            </Typography>

            {/* Key Highlights */}
            <div className="space-y-3">
              {service.highlights.slice(0, 4).map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <div className="bg-brutalist-yellow h-2 w-2"></div>
                  <Typography variant="body" className="text-gray-300">
                    {highlight}
                  </Typography>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <Link href={`/contact?service=${service.slug}`}>
                <Button variant="primary" size="lg" className="min-w-[200px]">
                  GET STARTED NOW
                </Button>
              </Link>
              <Link href="/contact?type=consultation">
                <Button variant="secondary" size="lg" className="min-w-[200px]">
                  BOOK CONSULTATION
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Service Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Card className="bg-brutalist-charcoal-100 p-8">
              {/* Pricing */}
              <div className="mb-8">
                <Typography
                  variant="h4"
                  className="text-brutalist-yellow mb-2 text-sm font-bold tracking-wider uppercase"
                >
                  Investment
                </Typography>
                <Typography
                  variant="display"
                  className="mb-2 text-3xl font-bold md:text-4xl"
                >
                  {formatPriceRange(
                    service.priceFrom,
                    service.priceTo,
                    service.priceType
                  )}
                </Typography>
                {service.deliveryTime && (
                  <Typography variant="caption" className="text-gray-400">
                    Typical delivery: {service.deliveryTime}
                  </Typography>
                )}
              </div>

              {/* What's Included */}
              <div className="mb-8">
                <Typography
                  variant="h4"
                  className="text-brutalist-yellow mb-4 text-sm font-bold tracking-wider uppercase"
                >
                  What&apos;s Included
                </Typography>
                <ul className="space-y-3">
                  {service.features.slice(0, 6).map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-brutalist-yellow mt-1 font-bold">
                        ✓
                      </span>
                      <Typography variant="caption" className="text-gray-300">
                        {feature}
                      </Typography>
                    </li>
                  ))}
                  {service.features.length > 6 && (
                    <li className="text-brutalist-yellow font-mono text-sm">
                      + {service.features.length - 6} more features
                    </li>
                  )}
                </ul>
              </div>

              {/* Deliverables */}
              {service.deliverables.length > 0 && (
                <div className="mb-8">
                  <Typography
                    variant="h4"
                    className="text-brutalist-yellow mb-4 text-sm font-bold tracking-wider uppercase"
                  >
                    Deliverables
                  </Typography>
                  <ul className="space-y-2">
                    {service.deliverables
                      .slice(0, 4)
                      .map((deliverable, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-brutalist-yellow mt-1 font-bold">
                            ▸
                          </span>
                          <Typography
                            variant="caption"
                            className="text-gray-300"
                          >
                            {deliverable}
                          </Typography>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Quick Contact */}
              <div className="border-t border-gray-700 pt-6">
                <Typography
                  variant="caption"
                  className="mb-3 block text-gray-400"
                >
                  Questions? Get instant answers:
                </Typography>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/contact"
                    className="text-brutalist-yellow font-mono text-sm transition-colors hover:text-white"
                  >
                    → Send a message
                  </Link>
                  <Link
                    href="/contact?type=consultation"
                    className="text-brutalist-yellow font-mono text-sm transition-colors hover:text-white"
                  >
                    → Book a call
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
