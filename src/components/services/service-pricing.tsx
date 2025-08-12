"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPriceRange, type Service } from "@/lib/services-data";

interface ServicePricingProps {
  service: Service;
}

export function ServicePricing({ service }: ServicePricingProps) {
  // Create pricing tiers based on service type
  const pricingTiers = generatePricingTiers(service);

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="text-center">
        <Typography
          variant="h2"
          className="mb-6 text-4xl font-bold md:text-5xl"
        >
          TRANSPARENT
          <span className="text-brutalist-yellow"> PRICING</span>
        </Typography>
        <Typography
          variant="body"
          className="mx-auto max-w-3xl text-xl text-gray-300"
        >
          No hidden fees, no surprises. Choose the package that fits your needs
          and budget. All prices include our iron-clad guarantees.
        </Typography>
      </div>

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {pricingTiers.map((tier, index) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <PricingTierCard
              tier={tier}
              service={service}
              isPopular={tier.popular}
            />
          </motion.div>
        ))}
      </div>

      {/* Value Proposition */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <Card className="bg-brutalist-yellow p-12 text-black">
          <div className="text-center">
            <Typography variant="h3" className="mb-6 text-3xl font-bold">
              INVESTMENT THAT PAYS FOR ITSELF
            </Typography>
            <Typography
              variant="body"
              className="mx-auto mb-8 max-w-3xl text-xl"
            >
              Our {service.name.toLowerCase()} solutions typically generate 3-5x
              ROI within the first year. This isn&apos;t just development—it&apos;s
              business transformation.
            </Typography>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div>
                <Typography
                  variant="display"
                  className="mb-2 text-4xl font-bold"
                >
                  3-5x
                </Typography>
                <Typography variant="body">Average ROI in Year 1</Typography>
              </div>
              <div>
                <Typography
                  variant="display"
                  className="mb-2 text-4xl font-bold"
                >
                  90+
                </Typography>
                <Typography variant="body">
                  Lighthouse Performance Score
                </Typography>
              </div>
              <div>
                <Typography
                  variant="display"
                  className="mb-2 text-4xl font-bold"
                >
                  98%
                </Typography>
                <Typography variant="body">Client Satisfaction Rate</Typography>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Payment Options */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Card className="bg-brutalist-charcoal-100 p-8">
          <Typography
            variant="h3"
            className="mb-6 text-center text-2xl font-bold"
          >
            FLEXIBLE
            <span className="text-brutalist-yellow"> PAYMENT OPTIONS</span>
          </Typography>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="text-center">
              <div className="bg-brutalist-yellow mx-auto mb-4 flex h-16 w-16 items-center justify-center text-2xl font-bold text-black">
                💳
              </div>
              <Typography variant="h4" className="mb-2 font-bold">
                MILESTONE PAYMENTS
              </Typography>
              <Typography variant="body" className="text-gray-300">
                Pay as we deliver. 50% upfront, 25% at midpoint, 25% on
                completion.
              </Typography>
            </div>

            <div className="text-center">
              <div className="bg-brutalist-yellow mx-auto mb-4 flex h-16 w-16 items-center justify-center text-2xl font-bold text-black">
                📅
              </div>
              <Typography variant="h4" className="mb-2 font-bold">
                EXTENDED TERMS
              </Typography>
              <Typography variant="body" className="text-gray-300">
                Qualified businesses can spread payments over 3-6 months with 0%
                interest.
              </Typography>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

interface PricingTier {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  recommended?: boolean;
}

interface PricingTierCardProps {
  tier: PricingTier;
  service: Service;
  isPopular?: boolean;
}

function PricingTierCard({ tier, service, isPopular }: PricingTierCardProps) {
  return (
    <Card
      className={`relative flex h-full flex-col p-8 ${
        isPopular ? "border-brutalist-yellow bg-brutalist-charcoal-100" : ""
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="bg-brutalist-yellow absolute -top-3 -right-3 rotate-3 transform px-4 py-2 font-mono text-xs font-bold tracking-wider text-black uppercase">
          MOST POPULAR
        </div>
      )}

      {/* Tier Header */}
      <div className="mb-6">
        <Typography variant="h3" className="mb-2 text-2xl font-bold">
          {tier.name}
        </Typography>
        <Typography
          variant="display"
          className="text-brutalist-yellow mb-2 text-3xl font-bold"
        >
          {tier.price}
        </Typography>
        <Typography variant="body" className="text-gray-300">
          {tier.description}
        </Typography>
      </div>

      {/* Features */}
      <div className="mb-8 flex-1">
        <ul className="space-y-3">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="text-brutalist-yellow mr-3 font-bold">✓</span>
              <Typography variant="caption" className="text-gray-300">
                {feature}
              </Typography>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="space-y-3">
        <Link href={`/contact?service=${service.slug}&tier=${tier.id}`}>
          <Button
            variant={isPopular ? "primary" : "secondary"}
            className="w-full"
          >
            GET STARTED
          </Button>
        </Link>
        <Link href="/contact?type=consultation">
          <Button variant="ghost" className="w-full">
            DISCUSS OPTIONS
          </Button>
        </Link>
      </div>
    </Card>
  );
}

function generatePricingTiers(service: Service): PricingTier[] {
  // Generate pricing tiers based on service type
  const basePrice = service.priceFrom || 500000; // Default $5,000
  const maxPrice = service.priceTo || basePrice * 3;

  switch (service.slug) {
    case "web-development":
      return [
        {
          id: "starter",
          name: "STARTER",
          price: formatPriceRange(
            basePrice,
            basePrice * 1.5,
            service.priceType
          ),
          description: "Perfect for small businesses and startups",
          features: [
            "Custom responsive website",
            "Up to 5 pages",
            "Basic SEO optimization",
            "Contact form integration",
            "3 months support",
            "Mobile optimization",
          ],
        },
        {
          id: "professional",
          name: "PROFESSIONAL",
          price: formatPriceRange(
            basePrice * 1.5,
            basePrice * 2.5,
            service.priceType
          ),
          description: "Advanced features for growing businesses",
          features: [
            "Everything in Starter",
            "Up to 15 pages",
            "Advanced SEO & analytics",
            "CMS integration",
            "E-commerce functionality",
            "6 months support",
            "Performance optimization",
          ],
          popular: true,
        },
        {
          id: "enterprise",
          name: "ENTERPRISE",
          price: formatPriceRange(basePrice * 2.5, maxPrice, service.priceType),
          description: "Full-scale solutions for large organizations",
          features: [
            "Everything in Professional",
            "Unlimited pages",
            "Custom integrations",
            "Advanced security",
            "Multi-language support",
            "12 months support",
            "Priority support",
          ],
        },
      ];

    case "mobile-app":
      return [
        {
          id: "mvp",
          name: "MVP",
          price: formatPriceRange(
            basePrice,
            basePrice * 1.5,
            service.priceType
          ),
          description: "Minimum viable product for validation",
          features: [
            "Cross-platform app",
            "Core functionality",
            "Basic UI/UX design",
            "App store submission",
            "3 months support",
          ],
        },
        {
          id: "full-featured",
          name: "FULL-FEATURED",
          price: formatPriceRange(
            basePrice * 1.5,
            basePrice * 2.5,
            service.priceType
          ),
          description: "Complete app with advanced features",
          features: [
            "Everything in MVP",
            "Advanced features",
            "Push notifications",
            "Analytics integration",
            "Backend API",
            "6 months support",
          ],
          popular: true,
        },
        {
          id: "enterprise-app",
          name: "ENTERPRISE",
          price: formatPriceRange(basePrice * 2.5, maxPrice, service.priceType),
          description: "Enterprise-grade mobile solution",
          features: [
            "Everything in Full-Featured",
            "Custom integrations",
            "Advanced security",
            "Offline functionality",
            "Admin dashboard",
            "12 months support",
          ],
        },
      ];

    default:
      return [
        {
          id: "basic",
          name: "BASIC",
          price: formatPriceRange(
            basePrice,
            basePrice * 1.5,
            service.priceType
          ),
          description: "Essential features to get started",
          features: service.features.slice(0, 4),
        },
        {
          id: "standard",
          name: "STANDARD",
          price: formatPriceRange(
            basePrice * 1.5,
            basePrice * 2.5,
            service.priceType
          ),
          description: "Most popular option with advanced features",
          features: service.features.slice(0, 6),
          popular: true,
        },
        {
          id: "premium",
          name: "PREMIUM",
          price: formatPriceRange(basePrice * 2.5, maxPrice, service.priceType),
          description: "Complete solution with all features",
          features: service.features,
        },
      ];
  }
}
