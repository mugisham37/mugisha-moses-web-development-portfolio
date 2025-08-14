import { Metadata } from "next";
import { TestimonialQueries } from "@/lib/db-utils";
import { TestimonialGrid } from "@/components/testimonials/testimonial-grid";
import { TestimonialStats } from "@/components/testimonials/testimonial-stats";
import { TestimonialSubmissionForm } from "@/components/testimonials/testimonial-submission-form";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Client Testimonials | Brutalist Developer Portfolio",
  description:
    "Read what our clients say about our elite development services. Real testimonials from successful projects and satisfied customers.",
  openGraph: {
    title: "Client Testimonials | Brutalist Developer Portfolio",
    description:
      "Read what our clients say about our elite development services. Real testimonials from successful projects and satisfied customers.",
    type: "website",
  },
};

export default async function TestimonialsPage() {
  const testimonials = await TestimonialQueries.getAll({ approved: true });

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
              Client Testimonials
            </Typography>
            <Typography variant="h2" className="text-2xl text-gray-400">
              Real feedback from real clients who achieved extraordinary results
            </Typography>
            <div className="bg-brutalist-yellow inline-block px-6 py-3 font-mono text-sm font-bold tracking-wider text-black uppercase">
              {testimonials.length}+ Success Stories
            </div>
          </div>
        </Container>
      </Section>

      {/* Statistics Section */}
      <Section className="bg-brutalist-charcoal-100 py-16">
        <Container>
          <TestimonialStats testimonials={testimonials} />
        </Container>
      </Section>

      {/* Testimonials Grid */}
      <Section className="py-16">
        <Container>
          <div className="space-y-12">
            <div className="space-y-4 text-center">
              <Typography variant="h2" className="text-3xl font-bold uppercase">
                What Our Clients Say
              </Typography>
              <Typography
                variant="body"
                className="mx-auto max-w-2xl text-gray-400"
              >
                Every testimonial represents a successful partnership and
                exceptional results delivered.
              </Typography>
            </div>

            <TestimonialGrid
              testimonials={testimonials}
              showFilters={true}
              itemsPerPage={12}
            />
          </div>
        </Container>
      </Section>

      {/* Submission Form */}
      <Section className="bg-brutalist-charcoal-100 py-16">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 space-y-4 text-center">
              <Typography variant="h2" className="text-3xl font-bold uppercase">
                Share Your Experience
              </Typography>
              <Typography variant="body" className="text-gray-400">
                Worked with us? We&apos;d love to hear about your experience and
                showcase your success story.
              </Typography>
            </div>

            <TestimonialSubmissionForm />
          </div>
        </Container>
      </Section>
    </main>
  );
}
