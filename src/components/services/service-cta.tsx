"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { type Service } from "@/lib/services-data";

interface ServiceCTAProps {
  service?: Service;
}

export function ServiceCTA({ service }: ServiceCTAProps) {
  const isServiceSpecific = !!service;

  return (
    <div className="space-y-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Typography
          variant="display"
          className="mb-6 text-4xl font-bold md:text-6xl"
        >
          {isServiceSpecific ? (
            <>
              READY TO DOMINATE
              <br />
              WITH{" "}
              <span className="text-black">{service.name.toUpperCase()}</span>?
            </>
          ) : (
            <>
              READY TO
              <br />
              <span className="text-black">DOMINATE</span>?
            </>
          )}
        </Typography>

        <Typography
          variant="h2"
          className="mx-auto mb-8 max-w-3xl font-mono text-xl md:text-2xl"
        >
          {isServiceSpecific
            ? `Transform your business with ${service.name.toLowerCase()} that converts visitors into customers and ideas into empires.`
            : "Transform your business with elite development services that convert visitors into customers and ideas into empires."}
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: true }}
        className="flex flex-col justify-center gap-4 sm:flex-row"
      >
        <Link
          href={
            isServiceSpecific ? `/contact?service=${service.slug}` : "/contact"
          }
        >
          <Button
            variant="secondary"
            size="lg"
            className="text-brutalist-yellow min-w-[200px] border-black bg-black hover:bg-gray-900"
          >
            {isServiceSpecific ? "GET STARTED NOW" : "START YOUR PROJECT"}
          </Button>
        </Link>

        <Link href="/contact?type=consultation">
          <Button
            variant="ghost"
            size="lg"
            className="min-w-[200px] border-black text-black hover:bg-black/10"
          >
            BOOK CONSULTATION
          </Button>
        </Link>
      </motion.div>

      {/* Urgency/Scarcity Elements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        viewport={{ once: true }}
        className="space-y-4"
      >
        <div className="flex flex-col items-center justify-center gap-4 text-black sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 animate-pulse rounded-full bg-green-500"></span>
            <Typography variant="caption" className="font-mono font-bold">
              ACCEPTING NEW PROJECTS
            </Typography>
          </div>

          <div className="hidden h-1 w-1 rounded-full bg-black sm:block"></div>

          <div className="flex items-center gap-2">
            <span className="text-red-500">⚡</span>
            <Typography variant="caption" className="font-mono font-bold">
              NEXT AVAILABLE:{" "}
              {new Date(
                Date.now() + 14 * 24 * 60 * 60 * 1000
              ).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </Typography>
          </div>
        </div>

        <Typography
          variant="caption"
          className="mx-auto max-w-2xl text-black/70"
        >
          Limited availability. We only take on projects where we can guarantee
          exceptional results. Book your consultation today to secure your spot
          in our development queue.
        </Typography>
      </motion.div>

      {/* Trust Signals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        viewport={{ once: true }}
        className="border-t-2 border-black pt-8"
      >
        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
          <div>
            <Typography
              variant="h3"
              className="mb-1 text-2xl font-bold text-black"
            >
              98%
            </Typography>
            <Typography variant="caption" className="text-black/70">
              Client Satisfaction
            </Typography>
          </div>

          <div>
            <Typography
              variant="h3"
              className="mb-1 text-2xl font-bold text-black"
            >
              150+
            </Typography>
            <Typography variant="caption" className="text-black/70">
              Projects Delivered
            </Typography>
          </div>

          <div>
            <Typography
              variant="h3"
              className="mb-1 text-2xl font-bold text-black"
            >
              90+
            </Typography>
            <Typography variant="caption" className="text-black/70">
              Lighthouse Scores
            </Typography>
          </div>

          <div>
            <Typography
              variant="h3"
              className="mb-1 text-2xl font-bold text-black"
            >
              0
            </Typography>
            <Typography variant="caption" className="text-black/70">
              Failed Projects
            </Typography>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
