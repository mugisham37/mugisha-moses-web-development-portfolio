"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import {
  getAllServices,
  formatPriceRange,
  type Service,
} from "@/lib/services-data";

export function ServiceGrid() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const servicesData = await getAllServices();
        setServices(servicesData);
      } catch (error) {
        console.error("Failed to load services:", error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse p-8">
            <div className="bg-brutalist-charcoal-100 mb-4 h-6"></div>
            <div className="bg-brutalist-charcoal-100 mb-2 h-4"></div>
            <div className="bg-brutalist-charcoal-100 mb-4 h-4 w-3/4"></div>
            <div className="bg-brutalist-charcoal-100 h-10"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service, index) => (
        <motion.div
          key={service.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ServiceCard service={service} />
        </motion.div>
      ))}
    </div>
  );
}

interface ServiceCardProps {
  service: Service;
}

function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card
      variant="interactive"
      className="group relative flex h-full flex-col p-8"
    >
      {/* Popular Badge */}
      {service.popular && (
        <div className="bg-brutalist-yellow absolute -top-3 -right-3 rotate-3 transform px-4 py-2 font-mono text-xs font-bold tracking-wider text-black uppercase">
          POPULAR
        </div>
      )}

      {/* Featured Badge */}
      {service.featured && (
        <div className="absolute -top-3 -left-3 -rotate-3 transform bg-white px-4 py-2 font-mono text-xs font-bold tracking-wider text-black uppercase">
          FEATURED
        </div>
      )}

      <div className="flex-1">
        <Typography
          variant="h3"
          className="group-hover:text-brutalist-yellow mb-4 text-2xl font-bold transition-colors"
        >
          {service.name.toUpperCase()}
        </Typography>

        <Typography
          variant="body"
          className="mb-6 leading-relaxed text-gray-300"
        >
          {service.description}
        </Typography>

        {/* Key Features */}
        <div className="mb-6">
          <Typography
            variant="h4"
            className="text-brutalist-yellow mb-3 text-sm font-bold tracking-wider uppercase"
          >
            Key Features
          </Typography>
          <ul className="space-y-2">
            {service.highlights.slice(0, 3).map((highlight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-brutalist-yellow mr-2 font-bold">▸</span>
                <Typography variant="caption" className="text-gray-300">
                  {highlight}
                </Typography>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing */}
        <div className="mb-6">
          <Typography
            variant="h3"
            className="text-brutalist-yellow text-xl font-bold"
          >
            {formatPriceRange(
              service.priceFrom,
              service.priceTo,
              service.priceType
            )}
          </Typography>
          {service.deliveryTime && (
            <Typography variant="caption" className="text-gray-400">
              Delivery: {service.deliveryTime}
            </Typography>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Link href={`/services/${service.slug}`} className="block">
          <Button variant="primary" className="w-full">
            LEARN MORE
          </Button>
        </Link>
        <Link href={`/contact?service=${service.slug}`} className="block">
          <Button variant="secondary" className="w-full">
            GET QUOTE
          </Button>
        </Link>
      </div>
    </Card>
  );
}
