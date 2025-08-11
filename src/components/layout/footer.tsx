"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { Container } from "@/components/layout/container";
import { SITE_CONFIG } from "@/lib/constants";

interface SocialLink {
  label: string;
  href: string;
  icon?: string;
}

interface QuickLink {
  label: string;
  href: string;
}

interface ContactInfo {
  email: string;
  location?: string;
  availability?: string;
}

const socialLinks: SocialLink[] = [
  { label: "GitHub", href: SITE_CONFIG.author.github },
  { label: "LinkedIn", href: SITE_CONFIG.author.linkedin },
  { label: "Twitter", href: "https://twitter.com/username" }, // Update with actual handle
  { label: "Email", href: `mailto:${SITE_CONFIG.author.email}` },
];

const quickLinks: QuickLink[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

const legalLinks: QuickLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Sitemap", href: "/sitemap.xml" },
];

interface MainFooterProps {
  className?: string;
}

export function MainFooter({ className = "" }: MainFooterProps) {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);

    try {
      // TODO: Implement newsletter subscription API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setSubscriptionStatus("success");
      setEmail("");
    } catch (error) {
      setSubscriptionStatus("error");
    } finally {
      setIsSubscribing(false);
    }

    // Reset status after 3 seconds
    setTimeout(() => setSubscriptionStatus("idle"), 3000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className={`border-t-4 border-white bg-black ${className}`}>
      <Container>
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link
                href="/"
                className="group focus:ring-accent mb-6 inline-block rounded-sm focus:ring-4 focus:outline-none"
              >
                <Typography
                  variant="h2"
                  weight="bold"
                  transform="uppercase"
                  className="group-hover:text-accent text-white transition-colors duration-200"
                >
                  {SITE_CONFIG.author.name}
                </Typography>
              </Link>

              <Typography
                variant="lg"
                className="mb-8 max-w-md leading-relaxed text-white/80"
              >
                Elite full-stack developer crafting brutalist digital
                experiences that convert visitors into clients through technical
                excellence and unapologetic design.
              </Typography>

              {/* Newsletter Signup */}
              <div className="max-w-md">
                <Typography
                  variant="body"
                  weight="bold"
                  transform="uppercase"
                  spacing="wide"
                  className="mb-4 font-mono text-white"
                >
                  Stay Updated
                </Typography>

                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1"
                      required
                      aria-label="Email address for newsletter"
                    />
                    <Button
                      type="submit"
                      variant="accent"
                      size="md"
                      disabled={isSubscribing}
                      className="font-mono tracking-wide whitespace-nowrap uppercase"
                    >
                      {isSubscribing ? "Subscribing..." : "Subscribe"}
                    </Button>
                  </div>

                  {subscriptionStatus === "success" && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-accent font-mono text-sm uppercase"
                    >
                      Successfully subscribed!
                    </motion.p>
                  )}

                  {subscriptionStatus === "error" && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-mono text-sm text-red-400 uppercase"
                    >
                      Subscription failed. Try again.
                    </motion.p>
                  )}
                </form>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <Typography
                variant="body"
                weight="bold"
                transform="uppercase"
                spacing="wide"
                className="mb-6 font-mono text-white"
              >
                Navigation
              </Typography>

              <nav
                className="space-y-3"
                role="navigation"
                aria-label="Footer navigation"
              >
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="hover:text-accent focus:ring-accent block rounded-sm text-white/70 transition-colors duration-200 focus:ring-4 focus:outline-none"
                  >
                    <Typography
                      variant="body"
                      className="font-mono tracking-wide uppercase"
                    >
                      {link.label}
                    </Typography>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Connect Section */}
            <div>
              <Typography
                variant="body"
                weight="bold"
                transform="uppercase"
                spacing="wide"
                className="mb-6 font-mono text-white"
              >
                Connect
              </Typography>

              <div className="space-y-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.href}
                    href={social.href}
                    target={
                      social.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      social.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="hover:text-accent focus:ring-accent block rounded-sm text-white/70 transition-colors duration-200 focus:ring-4 focus:outline-none"
                  >
                    <Typography
                      variant="body"
                      className="font-mono tracking-wide uppercase"
                    >
                      {social.label}
                    </Typography>
                  </Link>
                ))}
              </div>

              {/* Contact Info */}
              <div className="mt-8 border-t-2 border-white/20 pt-6">
                <Typography
                  variant="caption"
                  transform="uppercase"
                  spacing="wide"
                  className="mb-3 font-mono text-white/60"
                >
                  Get In Touch
                </Typography>

                <Link
                  href={`mailto:${SITE_CONFIG.author.email}`}
                  className="hover:text-accent focus:ring-accent mb-2 block rounded-sm text-white/70 transition-colors duration-200 focus:ring-4 focus:outline-none"
                >
                  <Typography variant="sm" className="font-mono">
                    {SITE_CONFIG.author.email}
                  </Typography>
                </Link>

                <Typography variant="sm" className="font-mono text-white/60">
                  Available for projects
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-white/20 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Copyright */}
            <Typography
              variant="sm"
              className="text-center font-mono text-white/60 md:text-left"
            >
              © {currentYear} {SITE_CONFIG.author.name}. All rights reserved.
            </Typography>

            {/* Legal Links */}
            <div className="flex items-center gap-6">
              {legalLinks.map((link, index) => (
                <React.Fragment key={link.href}>
                  <Link
                    href={link.href}
                    className="focus:ring-accent rounded-sm text-white/60 transition-colors duration-200 hover:text-white focus:ring-4 focus:outline-none"
                  >
                    <Typography variant="sm" className="font-mono uppercase">
                      {link.label}
                    </Typography>
                  </Link>
                  {index < legalLinks.length - 1 && (
                    <span className="text-white/40">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Back to Top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="hover:text-accent focus:ring-accent rounded-sm text-white/60 transition-colors duration-200 focus:ring-4 focus:outline-none"
              aria-label="Back to top"
            >
              <Typography variant="sm" className="font-mono uppercase">
                ↑ Top
              </Typography>
            </button>
          </div>
        </div>
      </Container>
    </footer>
  );
}
