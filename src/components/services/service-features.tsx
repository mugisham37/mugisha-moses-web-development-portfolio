"use client";

import { motion } from "framer-motion";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { type Service } from "@/lib/services-data";

interface ServiceFeaturesProps {
  service: Service;
}

export function ServiceFeatures({ service }: ServiceFeaturesProps) {
  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="text-center">
        <Typography
          variant="h2"
          className="mb-6 text-4xl font-bold md:text-5xl"
        >
          WHAT YOU GET WITH
          <span className="text-brutalist-yellow">
            {" "}
            {service.name.toUpperCase()}
          </span>
        </Typography>
        <Typography
          variant="body"
          className="mx-auto max-w-3xl text-xl text-gray-300"
        >
          Every feature is designed for maximum impact and built with brutalist
          precision. No fluff, no compromises—just results that dominate.
        </Typography>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {service.features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <FeatureCard feature={feature} index={index} />
          </motion.div>
        ))}
      </div>

      {/* Highlights Section */}
      {service.highlights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="bg-brutalist-yellow p-12 text-black">
            <div className="mb-8 text-center">
              <Typography variant="h3" className="mb-4 text-3xl font-bold">
                KEY PERFORMANCE INDICATORS
              </Typography>
              <Typography variant="body" className="text-xl">
                These aren&apos;t just features—they&apos;re competitive advantages that
                set you apart.
              </Typography>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {service.highlights.map((highlight, index) => (
                <div key={index} className="text-center">
                  <div className="text-brutalist-yellow mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-black text-2xl font-bold">
                    {index + 1}
                  </div>
                  <Typography variant="h4" className="mb-2 font-bold">
                    {highlight}
                  </Typography>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

interface FeatureCardProps {
  feature: string;
  index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  // Extract feature name and description if formatted as "Name: Description"
  const [name, ...descriptionParts] = feature.split(":");
  const description = descriptionParts.join(":").trim();
  const hasDescription = description.length > 0;

  return (
    <Card className="group hover:border-brutalist-yellow flex h-full flex-col p-6 transition-colors">
      {/* Feature Number */}
      <div className="mb-4">
        <div className="bg-brutalist-charcoal-100 group-hover:bg-brutalist-yellow flex h-12 w-12 items-center justify-center border-2 border-white transition-colors group-hover:text-black">
          <span className="text-lg font-bold">
            {(index + 1).toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Feature Content */}
      <div className="flex-1">
        <Typography
          variant="h4"
          className="group-hover:text-brutalist-yellow mb-3 font-bold transition-colors"
        >
          {hasDescription ? name.trim() : feature}
        </Typography>

        {hasDescription && (
          <Typography variant="body" className="leading-relaxed text-gray-300">
            {description}
          </Typography>
        )}
      </div>

      {/* Feature Icon/Indicator */}
      <div className="mt-4 border-t border-gray-700 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-brutalist-yellow font-bold">✓</span>
          <Typography variant="caption" className="font-mono text-gray-400">
            INCLUDED
          </Typography>
        </div>
      </div>
    </Card>
  );
}
