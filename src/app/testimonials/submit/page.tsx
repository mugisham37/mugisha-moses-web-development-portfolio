import { Metadata } from "next";
import { TestimonialSubmissionForm } from "@/components/testimonials/testimonial-submission-form";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Submit Testimonial | Brutalist Developer Portfolio",
  description:
    "Share your experience working with us. Help others discover the quality of our development services.",
  openGraph: {
    title: "Submit Testimonial | Brutalist Developer Portfolio",
    description:
      "Share your experience working with us. Help others discover the quality of our development services.",
    type: "website",
  },
};

export default function SubmitTestimonialPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Section className="py-20">
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Typography
              variant="display"
              className="text-6xl font-bold uppercase"
            >
              Submit Testimonial
            </Typography>
            <Typography variant="h2" className="text-2xl text-gray-400">
              Share your experience and help others discover our exceptional
              services
            </Typography>
          </div>
        </Container>
      </Section>

      {/* Why Testimonials Matter */}
      <Section className="bg-brutalist-charcoal-100 py-16">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <Card className="p-8 text-center">
              <div className="mb-4 text-4xl">🎯</div>
              <Typography
                variant="h3"
                className="mb-4 text-xl font-bold uppercase"
              >
                Help Others Succeed
              </Typography>
              <Typography variant="body" className="text-gray-400">
                Your testimonial helps other businesses make informed decisions
                about their development needs.
              </Typography>
            </Card>

            <Card className="p-8 text-center">
              <div className="mb-4 text-4xl">⭐</div>
              <Typography
                variant="h3"
                className="mb-4 text-xl font-bold uppercase"
              >
                Showcase Success
              </Typography>
              <Typography variant="body" className="text-gray-400">
                Highlight the results you achieved and the value you received
                from our collaboration.
              </Typography>
            </Card>

            <Card className="p-8 text-center">
              <div className="mb-4 text-4xl">🤝</div>
              <Typography
                variant="h3"
                className="mb-4 text-xl font-bold uppercase"
              >
                Build Trust
              </Typography>
              <Typography variant="body" className="text-gray-400">
                Your honest feedback builds trust and credibility in our
                development community.
              </Typography>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Submission Form */}
      <Section className="py-16">
        <Container>
          <div className="mx-auto max-w-4xl">
            <TestimonialSubmissionForm />
          </div>
        </Container>
      </Section>

      {/* Guidelines */}
      <Section className="bg-brutalist-charcoal-100 py-16">
        <Container>
          <div className="mx-auto max-w-4xl">
            <Card className="p-8">
              <Typography
                variant="h2"
                className="mb-6 text-2xl font-bold uppercase"
              >
                Testimonial Guidelines
              </Typography>

              <div className="space-y-6">
                <div>
                  <Typography variant="h4" className="mb-2 font-bold">
                    What makes a great testimonial?
                  </Typography>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Specific results and outcomes you achieved</li>
                    <li>• Details about the challenges we helped solve</li>
                    <li>• Your experience working with our team</li>
                    <li>
                      • Measurable improvements (performance, conversions, etc.)
                    </li>
                    <li>
                      • Honest feedback about the process and communication
                    </li>
                  </ul>
                </div>

                <div>
                  <Typography variant="h4" className="mb-2 font-bold">
                    Privacy and Usage
                  </Typography>
                  <ul className="space-y-2 text-gray-300">
                    <li>• All testimonials are reviewed before publication</li>
                    <li>• You control how your testimonial is used</li>
                    <li>
                      • We respect your privacy and company confidentiality
                    </li>
                    <li>• You can request removal or updates at any time</li>
                  </ul>
                </div>

                <div>
                  <Typography variant="h4" className="mb-2 font-bold">
                    Video Testimonials
                  </Typography>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Upload to YouTube, Vimeo, or similar platform</li>
                    <li>• Share the public URL in the form</li>
                    <li>• Keep videos under 3 minutes for best engagement</li>
                    <li>
                      • Good audio quality is more important than perfect video
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </Section>
    </main>
  );
}
