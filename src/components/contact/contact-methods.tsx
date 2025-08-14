"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { AnimationWrapper } from "@/components/ui/animation";
import { contactMethods } from "@/lib/contact-validation";
import { formatContactMethod } from "@/lib/contact-utils";
import {
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Github,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactMethodsProps {
  className?: string;
  variant?: "default" | "compact" | "horizontal";
}

const iconMap = {
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Github,
};

export function ContactMethods({
  className,
  variant = "default",
}: ContactMethodsProps) {
  const [copiedMethod, setCopiedMethod] = React.useState<string | null>(null);

  const handleCopyToClipboard = async (value: string, type: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedMethod(type);
      setTimeout(() => setCopiedMethod(null), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const handleContactClick = (method: (typeof contactMethods)[0]) => {
    const formattedUrl = formatContactMethod(method.type, method.value) as string;

    if (method.type === "email" || method.type === "phone") {
      window.location.href = formattedUrl;
    } else {
      window.open(formattedUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (variant === "compact") {
    return (
      <AnimationWrapper type="fadeIn" className={className}>
        <div className="flex flex-wrap gap-3">
          {contactMethods.map((method) => {
            const IconComponent = iconMap[method.icon as keyof typeof iconMap];
            const isCopied = copiedMethod === method.type;

            return (
              <div key={method.type} className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleContactClick(method)}
                  className="hover:bg-brutalist-yellow flex items-center gap-2 hover:text-black"
                >
                  <IconComponent size={16} />
                  <span className="hidden sm:inline">{method.label}</span>
                </Button>

                {(method.type === "email" || method.type === "phone") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleCopyToClipboard(method.value, method.type)
                    }
                    className="hover:bg-brutalist-yellow p-1 hover:text-black"
                  >
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </AnimationWrapper>
    );
  }

  if (variant === "horizontal") {
    return (
      <AnimationWrapper type="fadeIn" className={className}>
        <Card variant="default" padding="md">
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {contactMethods.map((method) => {
                const IconComponent =
                  iconMap[method.icon as keyof typeof iconMap];
                const isCopied = copiedMethod === method.type;

                return (
                  <div
                    key={method.type}
                    className={cn(
                      "bg-brutalist-charcoal-100 hover:bg-brutalist-yellow group flex items-center justify-between border-2 border-white p-3 transition-all duration-200 hover:text-black",
                      method.primary && "border-brutalist-yellow"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent size={20} className="flex-shrink-0" />
                      <div>
                        <Typography
                          variant="caption"
                          className="font-bold tracking-wider uppercase"
                        >
                          {method.label}
                        </Typography>
                        <Typography
                          variant="caption"
                          className="text-brutalist-off-white-100 group-hover:text-black"
                        >
                          {method.value}
                        </Typography>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleContactClick(method)}
                        className="p-1 hover:bg-black hover:text-white group-hover:hover:bg-black group-hover:hover:text-white"
                      >
                        <ExternalLink size={14} />
                      </Button>

                      {(method.type === "email" || method.type === "phone") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleCopyToClipboard(method.value, method.type)
                          }
                          className="p-1 hover:bg-black hover:text-white group-hover:hover:bg-black group-hover:hover:text-white"
                        >
                          {isCopied ? <Check size={14} /> : <Copy size={14} />}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </AnimationWrapper>
    );
  }

  // Default variant - vertical cards
  return (
    <AnimationWrapper type="fadeIn" className={className}>
      <div className="space-y-4">
        <Typography variant="h4" className="mb-6">
          MULTIPLE WAYS TO CONNECT
        </Typography>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {contactMethods.map((method, index) => {
            const IconComponent = iconMap[method.icon as keyof typeof iconMap];
            const isCopied = copiedMethod === method.type;

            return (
              <AnimationWrapper
                key={method.type}
                type="slideIn"
                delay={index * 0.1}
              >
                <Card
                  variant={method.primary ? "accent" : "interactive"}
                  padding="md"
                  hover="lift"
                  className="group cursor-pointer"
                  onClick={() => handleContactClick(method)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "border-2 p-2 transition-all duration-200",
                            method.primary
                              ? "text-brutalist-yellow border-black bg-black"
                              : "group-hover:border-brutalist-yellow group-hover:bg-brutalist-yellow border-white bg-transparent text-white group-hover:text-black"
                          )}
                        >
                          <IconComponent size={20} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {method.label}
                          </CardTitle>
                          {method.primary && (
                            <Typography
                              variant="caption"
                              className="text-black/70"
                            >
                              PRIMARY
                            </Typography>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContactClick(method);
                          }}
                          className={cn(
                            "p-2 transition-all duration-200",
                            method.primary
                              ? "hover:text-brutalist-yellow hover:bg-black"
                              : "hover:bg-brutalist-yellow hover:text-black"
                          )}
                        >
                          <ExternalLink size={16} />
                        </Button>

                        {(method.type === "email" ||
                          method.type === "phone") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyToClipboard(method.value, method.type);
                            }}
                            className={cn(
                              "p-2 transition-all duration-200",
                              method.primary
                                ? "hover:text-brutalist-yellow hover:bg-black"
                                : "hover:bg-brutalist-yellow hover:text-black"
                            )}
                          >
                            {isCopied ? (
                              <Check size={16} />
                            ) : (
                              <Copy size={16} />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <Typography
                      variant="body"
                      className={cn(
                        "font-mono break-all",
                        method.primary
                          ? "text-black"
                          : "text-brutalist-off-white-100"
                      )}
                    >
                      {method.value}
                    </Typography>

                    {isCopied && (
                      <Typography
                        variant="caption"
                        className="mt-2 text-green-400"
                      >
                        Copied to clipboard!
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </AnimationWrapper>
            );
          })}
        </div>
      </div>
    </AnimationWrapper>
  );
}
