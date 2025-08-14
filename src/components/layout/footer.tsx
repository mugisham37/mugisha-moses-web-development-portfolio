"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { Container } from "@/components/layout/container";
import { SITE_CONFIG } from "@/lib/constants";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  ExternalLink,
  ArrowUp,
  MapPin,
  Clock,
  Send,
  Check,
  AlertCircle,
} from "lucide-react";

interface SocialLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  hoverColor: string;
  description: string;
}

interface QuickLink {
  label: string;
  href: string;
  description?: string;
}

const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: SITE_CONFIG.author.github,
    icon: Github,
    hoverColor: "hover:text-white",
    description: "View my code and open source contributions",
  },
  {
    label: "LinkedIn",
    href: SITE_CONFIG.author.linkedin,
    icon: Linkedin,
    hoverColor: "hover:text-blue-400",
    description: "Professional networking and career updates",
  },
  {
    label: "Twitter",
    href: "https://twitter.com/username", // Update with actual handle
    icon: Twitter,
    hoverColor: "hover:text-blue-400",
    description: "Tech discussions and industry insights",
  },
  {
    label: "Email",
    href: `mailto:${SITE_CONFIG.author.email}`,
    icon: Mail,
    hoverColor: "hover:text-accent",
    description: "Direct contact for project inquiries",
  },
];

const quickLinks: QuickLink[] = [
  { label: "Home", href: "/", description: "Back to the main page" },
  {
    label: "Projects",
    href: "/projects",
    description: "View my portfolio work",
  },
  { label: "Blog", href: "/blog", description: "Read my latest articles" },
  { label: "Services", href: "/services", description: "Explore what I offer" },
  { label: "Contact", href: "/contact", description: "Get in touch with me" },
];

const legalLinks: QuickLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Sitemap", href: "/sitemap.xml" },
];

const additionalLinks: QuickLink[] = [
  { label: "About", href: "/about", description: "Learn more about me" },
  { label: "Resume", href: "/resume", description: "Download my CV" },
  {
    label: "Testimonials",
    href: "/testimonials",
    description: "Client feedback",
  },
  { label: "FAQ", href: "/faq", description: "Common questions" },
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
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsSubscribing(true);

    try {
      // TODO: Implement newsletter subscription API call
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
      setSubscriptionStatus("success");
      setEmail("");
    } catch {
      setSubscriptionStatus("error");
    } finally {
      setIsSubscribing(false);
    }

    // Reset status after 4 seconds
    setTimeout(() => setSubscriptionStatus("idle"), 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`border-t-4 border-white bg-black ${className}`}
      id="footer"
    >
      <Container>
        {/* Main Footer Content */}
        <div className="py-20">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            {/* Brand Section */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link
                  href="/"
                  className="group focus:ring-accent mb-8 inline-block rounded-sm focus:ring-4 focus:outline-none"
                >
                  <Typography
                    variant="h2"
                    weight="bold"
                    transform="uppercase"
                    className="group-hover:text-accent text-white transition-colors duration-300"
                  >
                    {SITE_CONFIG.author.name}
                  </Typography>
                </Link>

                <Typography
                  variant="body"
                  className="mb-8 max-w-lg text-lg leading-relaxed text-white/80"
                >
                  Elite full-stack developer crafting brutalist digital
                  experiences that convert visitors into clients through
                  technical excellence and unapologetic design. Building the
                  future, one pixel at a time.
                </Typography>

                {/* Contact Info */}
                <div className="mb-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-accent h-5 w-5" />
                    <Typography
                      variant="body"
                      className="font-mono text-white/70"
                    >
                      Available Worldwide
                    </Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="text-accent h-5 w-5" />
                    <Typography
                      variant="body"
                      className="font-mono text-white/70"
                    >
                      UTC+2 • Available for Projects
                    </Typography>
                  </div>
                </div>

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

                  <Typography variant="sm" className="mb-6 text-white/60">
                    Get notified about new projects, blog posts, and exclusive
                    insights into modern web development.
                  </Typography>

                  <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <div className="flex-1">
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError("");
                          }}
                          className={`w-full ${emailError ? "border-red-400" : ""}`}
                          aria-label="Email address for newsletter"
                          disabled={isSubscribing}
                        />
                        {emailError && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 flex items-center gap-2 font-mono text-sm text-red-400"
                          >
                            <AlertCircle className="h-4 w-4" />
                            {emailError}
                          </motion.p>
                        )}
                      </div>
                      <Button
                        type="submit"
                        variant="accent"
                        size="md"
                        disabled={isSubscribing}
                        leftIcon={
                          isSubscribing ? undefined : (
                            <Send className="h-4 w-4" />
                          )
                        }
                        className="font-mono tracking-wide whitespace-nowrap uppercase"
                      >
                        {isSubscribing ? "Subscribing..." : "Subscribe"}
                      </Button>
                    </div>

                    <AnimatePresence mode="wait">
                      {subscriptionStatus === "success" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-accent flex items-center gap-2"
                        >
                          <Check className="h-4 w-4" />
                          <Typography
                            variant="sm"
                            className="font-mono uppercase"
                          >
                            Successfully subscribed! Welcome aboard.
                          </Typography>
                        </motion.div>
                      )}

                      {subscriptionStatus === "error" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2 text-red-400"
                        >
                          <AlertCircle className="h-4 w-4" />
                          <Typography
                            variant="sm"
                            className="font-mono uppercase"
                          >
                            Subscription failed. Please try again.
                          </Typography>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </div>
              </motion.div>
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
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
                  className="space-y-4"
                  role="navigation"
                  aria-label="Footer navigation"
                >
                  {quickLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Link
                        href={link.href}
                        className="group hover:text-accent focus:ring-accent block rounded-sm text-white/70 transition-all duration-300 focus:ring-4 focus:outline-none"
                        title={link.description}
                      >
                        <Typography
                          variant="body"
                          className="font-mono tracking-wide uppercase transition-transform duration-300 group-hover:translate-x-2"
                        >
                          {link.label}
                        </Typography>
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </motion.div>
            </div>

            {/* Additional Links */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="body"
                  weight="bold"
                  transform="uppercase"
                  spacing="wide"
                  className="mb-6 font-mono text-white"
                >
                  Explore
                </Typography>

                <nav className="space-y-4">
                  {additionalLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Link
                        href={link.href}
                        className="group hover:text-accent focus:ring-accent block rounded-sm text-white/70 transition-all duration-300 focus:ring-4 focus:outline-none"
                        title={link.description}
                      >
                        <Typography
                          variant="body"
                          className="font-mono tracking-wide uppercase transition-transform duration-300 group-hover:translate-x-2"
                        >
                          {link.label}
                        </Typography>
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </motion.div>
            </div>

            {/* Connect Section */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="body"
                  weight="bold"
                  transform="uppercase"
                  spacing="wide"
                  className="mb-6 font-mono text-white"
                >
                  Connect
                </Typography>

                <div className="space-y-4">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <motion.div
                        key={social.href}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Link
                          href={social.href}
                          target={
                            social.href.startsWith("http")
                              ? "_blank"
                              : undefined
                          }
                          rel={
                            social.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className={`group ${social.hoverColor} focus:ring-accent flex items-center gap-3 rounded-sm p-2 text-white/70 transition-all duration-300 hover:bg-white/5 focus:ring-4 focus:outline-none`}
                          title={social.description}
                        >
                          <IconComponent className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                          <div>
                            <Typography
                              variant="body"
                              className="font-mono tracking-wide uppercase transition-transform duration-300 group-hover:translate-x-1"
                            >
                              {social.label}
                            </Typography>
                            <Typography
                              variant="caption"
                              className="text-white/50 transition-colors duration-300 group-hover:text-white/70"
                            >
                              {social.description}
                            </Typography>
                          </div>
                          <ExternalLink className="ml-auto h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Direct Contact */}
                <div className="mt-8 border-t-2 border-white/20 pt-6">
                  <Typography
                    variant="caption"
                    transform="uppercase"
                    spacing="wide"
                    className="mb-4 font-mono text-white/60"
                  >
                    Direct Contact
                  </Typography>

                  <Link
                    href={`mailto:${SITE_CONFIG.author.email}`}
                    className="group hover:text-accent focus:ring-accent mb-3 flex items-center gap-3 rounded-sm p-2 text-white/70 transition-all duration-300 hover:bg-white/5 focus:ring-4 focus:outline-none"
                  >
                    <Mail className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    <div>
                      <Typography
                        variant="sm"
                        className="font-mono transition-transform duration-300 group-hover:translate-x-1"
                      >
                        {SITE_CONFIG.author.email}
                      </Typography>
                      <Typography variant="caption" className="text-white/50">
                        Response within 24 hours
                      </Typography>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2 text-white/60">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
                    <Typography variant="sm" className="font-mono">
                      Available for new projects
                    </Typography>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t-2 border-white/20 py-8"
        >
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* Copyright */}
            <Typography
              variant="sm"
              className="text-center font-mono text-white/60 md:text-left"
            >
              © {currentYear} {SITE_CONFIG.author.name}. All rights reserved.
              <br className="md:hidden" />
              <span className="hidden md:inline"> • </span>
              Crafted with brutalist precision.
            </Typography>

            {/* Legal Links */}
            <div className="flex items-center gap-6">
              {legalLinks.map((link, index) => (
                <React.Fragment key={link.href}>
                  <Link
                    href={link.href}
                    className="focus:ring-accent rounded-sm text-white/60 transition-colors duration-300 hover:text-white focus:ring-4 focus:outline-none"
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
            <motion.button
              onClick={scrollToTop}
              className="hover:text-accent focus:ring-accent flex items-center gap-2 rounded-sm p-2 text-white/60 transition-all duration-300 hover:bg-white/5 focus:ring-4 focus:outline-none"
              aria-label="Back to top"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              <Typography variant="sm" className="font-mono uppercase">
                Top
              </Typography>
            </motion.button>
          </div>
        </motion.div>
      </Container>
    </footer>
  );
}
