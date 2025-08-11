"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import {
  getAllServices,
  formatPriceRange,
  type Service,
} from "@/lib/services-data";

// Feature comparison matrix
const comparisonFeatures = [
  {
    category: "DEVELOPMENT",
    features: [
      { name: "Custom Development", key: "custom_dev" },
      { name: "Responsive Design", key: "responsive" },
      { name: "Performance Optimization", key: "performance" },
      { name: "SEO Optimization", key: "seo" },
      { name: "Database Integration", key: "database" },
      { name: "API Development", key: "api" },
    ],
  },
  {
    category: "SUPPORT",
    features: [
      { name: "Initial Support Period", key: "support_period" },
      { name: "Bug Fixes", key: "bug_fixes" },
      { name: "Security Updates", key: "security" },
      { name: "Performance Monitoring", key: "monitoring" },
      { name: "24/7 Support", key: "support_24_7" },
      { name: "Priority Support", key: "priority_support" },
    ],
  },
  {
    category: "DELIVERY",
    features: [
      { name: "Source Code", key: "source_code" },
      { name: "Documentation", key: "documentation" },
      { name: "Deployment Setup", key: "deployment" },
      { name: "Training", key: "training" },
      { name: "Ongoing Maintenance", key: "maintenance" },
      { name: "Feature Updates", key: "updates" },
    ],
  },
];

// Service feature matrix - defines what each service includes
const serviceFeatures: Record<string, Record<string, boolean | string>> = {
  "web-development": {
    custom_dev: true,
    responsive: true,
    performance: true,
    seo: true,
    database: true,
    api: true,
    support_period: "3 months",
    bug_fixes: true,
    security: true,
    monitoring: true,
    support_24_7: false,
    priority_support: false,
    source_code: true,
    documentation: true,
    deployment: true,
    training: true,
    maintenance: "3 months",
    updates: false,
  },
  "mobile-app": {
    custom_dev: true,
    responsive: true,
    performance: true,
    seo: false,
    database: true,
    api: true,
    support_period: "6 months",
    bug_fixes: true,
    security: true,
    monitoring: true,
    support_24_7: false,
    priority_support: true,
    source_code: true,
    documentation: true,
    deployment: true,
    training: true,
    maintenance: "6 months",
    updates: true,
  },
  "full-stack": {
    custom_dev: true,
    responsive: true,
    performance: true,
    seo: true,
    database: true,
    api: true,
    support_period: "6 months",
    bug_fixes: true,
    security: true,
    monitoring: true,
    support_24_7: true,
    priority_support: true,
    source_code: true,
    documentation: true,
    deployment: true,
    training: true,
    maintenance: "6 months",
    updates: true,
  },
  consulting: {
    custom_dev: false,
    responsive: false,
    performance: true,
    seo: false,
    database: false,
    api: false,
    support_period: "1 month",
    bug_fixes: false,
    security: true,
    monitoring: false,
    support_24_7: false,
    priority_support: true,
    source_code: false,
    documentation: true,
    deployment: false,
    training: true,
    maintenance: false,
    updates: false,
  },
  performance: {
    custom_dev: false,
    responsive: true,
    performance: true,
    seo: true,
    database: true,
    api: false,
    support_period: "3 months",
    bug_fixes: true,
    security: false,
    monitoring: true,
    support_24_7: false,
    priority_support: false,
    source_code: false,
    documentation: true,
    deployment: false,
    training: false,
    maintenance: "3 months",
    updates: false,
  },
  maintenance: {
    custom_dev: false,
    responsive: false,
    performance: true,
    seo: false,
    database: true,
    api: false,
    support_period: "Ongoing",
    bug_fixes: true,
    security: true,
    monitoring: true,
    support_24_7: true,
    priority_support: true,
    source_code: false,
    documentation: false,
    deployment: false,
    training: false,
    maintenance: "Ongoing",
    updates: true,
  },
};

export function ServiceComparison() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const servicesData = await getAllServices();
        setServices(servicesData);
        // Pre-select featured services for comparison
        const featuredServices = servicesData
          .filter((s) => s.featured)
          .slice(0, 3);
        setSelectedServices(featuredServices.map((s) => s.id));
      } catch (error) {
        console.error("Failed to load services:", error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter((id) => id !== serviceId);
      } else if (prev.length < 4) {
        return [...prev, serviceId];
      }
      return prev;
    });
  };

  const selectedServiceData = services.filter((s) =>
    selectedServices.includes(s.id)
  );

  if (loading) {
    return (
      <Card className="p-8">
        <div className="animate-pulse">
          <div className="bg-brutalist-charcoal-100 mb-6 h-8 w-1/3"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="bg-brutalist-charcoal-100 h-6"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Service Selector */}
      <Card className="p-6">
        <Typography variant="h3" className="mb-4 text-xl font-bold">
          SELECT SERVICES TO COMPARE
          <span className="text-brutalist-yellow"> (MAX 4)</span>
        </Typography>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {services.map((service) => (
            <Button
              key={service.id}
              variant={
                selectedServices.includes(service.id) ? "primary" : "secondary"
              }
              size="sm"
              onClick={() => toggleService(service.id)}
              disabled={
                !selectedServices.includes(service.id) &&
                selectedServices.length >= 4
              }
              className="text-xs"
            >
              {service.name.toUpperCase()}
            </Button>
          ))}
        </div>
      </Card>

      {/* Comparison Table */}
      {selectedServiceData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-white">
                    <th className="bg-brutalist-charcoal-100 p-4 text-left">
                      <Typography
                        variant="h4"
                        className="text-brutalist-yellow font-bold tracking-wider uppercase"
                      >
                        FEATURES
                      </Typography>
                    </th>
                    {selectedServiceData.map((service) => (
                      <th
                        key={service.id}
                        className="bg-brutalist-charcoal-100 min-w-[200px] p-4 text-center"
                      >
                        <div className="space-y-2">
                          <Typography
                            variant="h4"
                            className="font-bold tracking-wider uppercase"
                          >
                            {service.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            className="text-brutalist-yellow font-bold"
                          >
                            {formatPriceRange(
                              service.priceFrom,
                              service.priceTo,
                              service.priceType
                            )}
                          </Typography>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((category) => (
                    <>
                      <tr
                        key={category.category}
                        className="border-b border-gray-700"
                      >
                        <td
                          colSpan={selectedServiceData.length + 1}
                          className="bg-brutalist-charcoal-200 p-4"
                        >
                          <Typography
                            variant="h4"
                            className="text-brutalist-yellow font-bold tracking-wider uppercase"
                          >
                            {category.category}
                          </Typography>
                        </td>
                      </tr>
                      {category.features.map((feature) => (
                        <tr
                          key={feature.key}
                          className="hover:bg-brutalist-charcoal-100/50 border-b border-gray-800"
                        >
                          <td className="p-4">
                            <Typography variant="body" className="font-mono">
                              {feature.name}
                            </Typography>
                          </td>
                          {selectedServiceData.map((service) => (
                            <td key={service.id} className="p-4 text-center">
                              <FeatureCell
                                value={
                                  serviceFeatures[service.id]?.[feature.key]
                                }
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}

      {selectedServiceData.length === 0 && (
        <Card className="p-12 text-center">
          <Typography
            variant="h3"
            className="mb-4 text-2xl font-bold text-gray-400"
          >
            SELECT SERVICES TO COMPARE
          </Typography>
          <Typography variant="body" className="text-gray-500">
            Choose up to 4 services from the options above to see a detailed
            feature comparison.
          </Typography>
        </Card>
      )}
    </div>
  );
}

interface FeatureCellProps {
  value: boolean | string | undefined;
}

function FeatureCell({ value }: FeatureCellProps) {
  if (value === true) {
    return (
      <div className="bg-brutalist-yellow inline-flex h-8 w-8 items-center justify-center rounded-none font-bold text-black">
        ✓
      </div>
    );
  }

  if (value === false || value === undefined) {
    return (
      <div className="inline-flex h-8 w-8 items-center justify-center rounded-none bg-gray-600 font-bold text-gray-400">
        ✗
      </div>
    );
  }

  return (
    <Typography variant="caption" className="text-brutalist-yellow font-bold">
      {value}
    </Typography>
  );
}
