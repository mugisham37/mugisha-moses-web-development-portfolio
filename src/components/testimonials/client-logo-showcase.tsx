"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

interface ClientLogo {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  industry?: string;
  testimonialCount?: number;
}

interface ClientLogoShowcaseProps {
  clients: ClientLogo[];
  title?: string;
  subtitle?: string;
  showIndustry?: boolean;
  showTestimonialCount?: boolean;
  autoScroll?: boolean;
  className?: string;
}

// Mock client data - in production this would come from the database
const defaultClients: ClientLogo[] = [
  {
    id: "1",
    name: "TechFlow Solutions",
    logoUrl: "/clients/techflow.svg",
    websiteUrl: "https://techflow.com",
    industry: "SaaS",
    testimonialCount: 3,
  },
  {
    id: "2",
    name: "StartupForge",
    logoUrl: "/clients/startupforge.svg",
    websiteUrl: "https://startupforge.com",
    industry: "Startup Incubator",
    testimonialCount: 2,
  },
  {
    id: "3",
    name: "MedTech Innovations",
    logoUrl: "/clients/medtech.svg",
    websiteUrl: "https://medtech.com",
    industry: "Healthcare",
    testimonialCount: 4,
  },
  {
    id: "4",
    name: "DataDrive Corp",
    logoUrl: "/clients/datadrive.svg",
    websiteUrl: "https://datadrive.com",
    industry: "Analytics",
    testimonialCount: 1,
  },
  {
    id: "5",
    name: "InnovateLab",
    logoUrl: "/clients/innovatelab.svg",
    websiteUrl: "https://innovatelab.com",
    industry: "R&D",
    testimonialCount: 2,
  },
  {
    id: "6",
    name: "GrowthHack Pro",
    logoUrl: "/clients/growthhack.svg",
    websiteUrl: "https://growthhack.com",
    industry: "Marketing",
    testimonialCount: 3,
  },
];

export function ClientLogoShowcase({
  clients = defaultClients,
  title = "Trusted by Industry Leaders",
  subtitle = "Companies that chose excellence and achieved extraordinary results",
  showIndustry = true,
  showTestimonialCount = true,
  autoScroll = true,
  className = "",
}: ClientLogoShowcaseProps) {
  // Duplicate clients for infinite scroll effect
  const scrollClients = autoScroll ? [...clients, ...clients] : clients;

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="space-y-4 text-center">
        <Typography variant="h2" className="text-3xl font-bold uppercase">
          {title}
        </Typography>
        <Typography variant="body" className="mx-auto max-w-2xl text-gray-400">
          {subtitle}
        </Typography>
      </div>

      {/* Logo Grid */}
      <div className="relative overflow-hidden">
        {autoScroll ? (
          <motion.div
            className="flex gap-8"
            animate={{
              x: [0, -50 * clients.length + "%"],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {scrollClients.map((client, index) => (
              <ClientLogoCard
                key={`${client.id}-${index}`}
                client={client}
                showIndustry={showIndustry}
                showTestimonialCount={showTestimonialCount}
              />
            ))}
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {clients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <ClientLogoCard
                  client={client}
                  showIndustry={showIndustry}
                  showTestimonialCount={showTestimonialCount}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Card className="bg-brutalist-charcoal-100 p-8">
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-4">
            <div>
              <Typography
                variant="display"
                className="text-brutalist-yellow mb-2 text-4xl font-bold"
              >
                {clients.length}+
              </Typography>
              <Typography
                variant="body"
                className="font-mono text-sm text-gray-300 uppercase"
              >
                Happy Clients
              </Typography>
            </div>
            <div>
              <Typography
                variant="display"
                className="text-brutalist-yellow mb-2 text-4xl font-bold"
              >
                {clients.reduce(
                  (sum, client) => sum + (client.testimonialCount || 0),
                  0
                )}
                +
              </Typography>
              <Typography
                variant="body"
                className="font-mono text-sm text-gray-300 uppercase"
              >
                Testimonials
              </Typography>
            </div>
            <div>
              <Typography
                variant="display"
                className="text-brutalist-yellow mb-2 text-4xl font-bold"
              >
                98%
              </Typography>
              <Typography
                variant="body"
                className="font-mono text-sm text-gray-300 uppercase"
              >
                Satisfaction Rate
              </Typography>
            </div>
            <div>
              <Typography
                variant="display"
                className="text-brutalist-yellow mb-2 text-4xl font-bold"
              >
                100%
              </Typography>
              <Typography
                variant="body"
                className="font-mono text-sm text-gray-300 uppercase"
              >
                Project Success
              </Typography>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

interface ClientLogoCardProps {
  client: ClientLogo;
  showIndustry: boolean;
  showTestimonialCount: boolean;
}

function ClientLogoCard({
  client,
  showIndustry,
  showTestimonialCount,
}: ClientLogoCardProps) {
  const CardWrapper = client.websiteUrl ? "a" : "div";
  const cardProps = client.websiteUrl
    ? {
        href: client.websiteUrl,
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex-shrink-0"
    >
      <Card
        className={`group hover:border-brutalist-yellow hover:bg-brutalist-charcoal-100 flex h-32 w-48 flex-col items-center justify-center p-6 transition-all duration-300 ${client.websiteUrl ? "cursor-pointer" : ""} `}
        {...(CardWrapper === "a" ? cardProps : {})}
      >
        {/* Logo Placeholder */}
        <div className="mb-2 flex flex-1 items-center justify-center">
          <div className="group-hover:border-brutalist-yellow flex h-12 w-32 items-center justify-center border-2 border-gray-300 bg-white transition-colors">
            <Typography
              variant="caption"
              className="text-xs font-bold tracking-wider text-black uppercase"
            >
              {client.name}
            </Typography>
          </div>
        </div>

        {/* Client Info */}
        <div className="space-y-1 text-center">
          {showIndustry && client.industry && (
            <Typography
              variant="caption"
              className="text-xs tracking-wider text-gray-400 uppercase"
            >
              {client.industry}
            </Typography>
          )}
          {showTestimonialCount && client.testimonialCount && (
            <Typography
              variant="caption"
              className="text-brutalist-yellow font-mono text-xs"
            >
              {client.testimonialCount} testimonial
              {client.testimonialCount !== 1 ? "s" : ""}
            </Typography>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
