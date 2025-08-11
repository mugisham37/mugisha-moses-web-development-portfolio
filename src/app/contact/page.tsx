import React from "react";
import { Metadata } from "next";
import { Typography } from "@/components/ui/typography";
import { AnimationWrapper } from "@/components/ui/animation";
import { ContactFormSelector } from "@/components/contact/contact-form-selector";
import { ContactMethods } from "@/components/contact/contact-methods";

export const metadata: Metadata = {
  title: "Contact | Brutalist Developer Portfolio",
  description:
    "Get in touch for project inquiries, consultations, or general questions. Fast response guaranteed.",
  openGraph: {
    title: "Contact | Brutalist Developer Portfolio",
    description:
      "Get in touch for project inquiries, consultations, or general questions. Fast response guaranteed.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Brutalist Developer Portfolio",
    description:
      "Get in touch for project inquiries, consultations, or general questions. Fast response guaranteed.",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <AnimationWrapper type="fadeIn">
            <div className="mb-16 text-center">
              <Typography variant="display" className="mb-6">
                LET'S BUILD SOMETHING
                <br />
                <span className="text-brutalist-yellow">EXTRAORDINARY</span>
              </Typography>
              <Typography
                variant="h4"
                className="text-brutalist-off-white-100 mx-auto max-w-3xl"
              >
                Ready to transform your ideas into reality? Choose how you'd
                like to connect and let's start the conversation.
              </Typography>
            </div>
          </AnimationWrapper>

          {/* Contact Form Selector */}
          <ContactFormSelector className="mb-20" />

          {/* Contact Methods */}
          <AnimationWrapper type="fadeIn" delay={0.3}>
            <div className="border-t-4 border-white pt-16">
              <ContactMethods variant="default" />
            </div>
          </AnimationWrapper>

          {/* Additional Information */}
          <AnimationWrapper type="fadeIn" delay={0.4}>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <Typography variant="h3" className="text-brutalist-yellow">
                  WHAT TO EXPECT
                </Typography>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-brutalist-yellow flex h-8 w-8 items-center justify-center border-2 border-white font-mono text-sm font-bold text-black">
                      1
                    </div>
                    <div>
                      <Typography variant="body" className="mb-1 font-bold">
                        QUICK RESPONSE
                      </Typography>
                      <Typography
                        variant="caption"
                        className="text-brutalist-off-white-100"
                      >
                        I respond to all inquiries within 24 hours, usually much
                        faster.
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-brutalist-yellow flex h-8 w-8 items-center justify-center border-2 border-white font-mono text-sm font-bold text-black">
                      2
                    </div>
                    <div>
                      <Typography variant="body" className="mb-1 font-bold">
                        DETAILED DISCUSSION
                      </Typography>
                      <Typography
                        variant="caption"
                        className="text-brutalist-off-white-100"
                      >
                        We'll dive deep into your project requirements and
                        goals.
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-brutalist-yellow flex h-8 w-8 items-center justify-center border-2 border-white font-mono text-sm font-bold text-black">
                      3
                    </div>
                    <div>
                      <Typography variant="body" className="mb-1 font-bold">
                        CUSTOM PROPOSAL
                      </Typography>
                      <Typography
                        variant="caption"
                        className="text-brutalist-off-white-100"
                      >
                        You'll receive a detailed proposal tailored to your
                        specific needs.
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <Typography variant="h3" className="text-brutalist-yellow">
                  FREQUENTLY ASKED
                </Typography>
                <div className="space-y-4">
                  <div>
                    <Typography variant="body" className="mb-2 font-bold">
                      How quickly can you start a project?
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-brutalist-off-white-100"
                    >
                      Depending on my current workload, I can typically start
                      new projects within 1-2 weeks of agreement.
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="body" className="mb-2 font-bold">
                      Do you work with international clients?
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-brutalist-off-white-100"
                    >
                      Absolutely! I work with clients worldwide and am
                      comfortable with different time zones.
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="body" className="mb-2 font-bold">
                      What's included in a consultation?
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-brutalist-off-white-100"
                    >
                      Free 30-minute consultation to discuss your project,
                      provide initial recommendations, and answer questions.
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </AnimationWrapper>
        </div>
      </section>
    </div>
  );
}
