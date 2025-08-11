import { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/ui/typography";
import { ServiceGrid } from "@/components/services/service-grid";
import { ServiceComparison } from "@/components/services/service-comparison";
import { ProcessWorkflow } from "@/components/services/process-workflow";
import { ServiceGuarantees } from "@/components/services/service-guarantees";
import { ServiceTestimonials } from "@/components/services/service-testimonials";
import { ServiceCTA } from "@/components/services/service-cta";

export const metadata: Metadata = {
  title: "SERVICES | ELITE DEVELOPMENT SOLUTIONS",
  description:
    "Professional web development, mobile apps, and technical consulting services. Transform your ideas into powerful digital solutions with brutalist precision.",
  openGraph: {
    title: "SERVICES | ELITE DEVELOPMENT SOLUTIONS",
    description:
      "Professional web development, mobile apps, and technical consulting services. Transform your ideas into powerful digital solutions with brutalist precision.",
    type: "website",
  },
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <Section className="pt-32 pb-16">
        <Container>
          <div className="text-center">
            <Typography
              variant="display"
              className="mb-6 text-6xl font-bold tracking-tighter md:text-8xl"
            >
              ELITE
              <br />
              <span className="text-brutalist-yellow">SERVICES</span>
            </Typography>
            <Typography
              variant="h2"
              className="mx-auto mb-8 max-w-4xl font-mono text-xl tracking-wider uppercase md:text-2xl"
            >
              TRANSFORM IDEAS INTO DIGITAL DOMINANCE
              <br />
              WITH BRUTALIST PRECISION
            </Typography>
            <div className="bg-brutalist-yellow mx-auto h-1 w-32"></div>
          </div>
        </Container>
      </Section>

      {/* Services Grid */}
      <Section className="py-16">
        <Container>
          <Typography
            variant="h2"
            className="mb-12 text-center text-4xl font-bold md:text-5xl"
          >
            CHOOSE YOUR
            <span className="text-brutalist-yellow"> WEAPON</span>
          </Typography>
          <ServiceGrid />
        </Container>
      </Section>

      {/* Service Comparison */}
      <Section className="bg-brutalist-charcoal-100 py-16">
        <Container>
          <Typography
            variant="h2"
            className="mb-12 text-center text-4xl font-bold md:text-5xl"
          >
            FEATURE
            <span className="text-brutalist-yellow"> MATRIX</span>
          </Typography>
          <ServiceComparison />
        </Container>
      </Section>

      {/* Process Workflow */}
      <Section className="py-16">
        <Container>
          <Typography
            variant="h2"
            className="mb-12 text-center text-4xl font-bold md:text-5xl"
          >
            BATTLE-TESTED
            <span className="text-brutalist-yellow"> PROCESS</span>
          </Typography>
          <ProcessWorkflow />
        </Container>
      </Section>

      {/* Service Guarantees */}
      <Section className="bg-brutalist-charcoal-100 py-16">
        <Container>
          <Typography
            variant="h2"
            className="mb-12 text-center text-4xl font-bold md:text-5xl"
          >
            IRON-CLAD
            <span className="text-brutalist-yellow"> GUARANTEES</span>
          </Typography>
          <ServiceGuarantees />
        </Container>
      </Section>

      {/* Service Testimonials */}
      <Section className="py-16">
        <Container>
          <Typography
            variant="h2"
            className="mb-12 text-center text-4xl font-bold md:text-5xl"
          >
            CLIENT
            <span className="text-brutalist-yellow"> VICTORIES</span>
          </Typography>
          <ServiceTestimonials />
        </Container>
      </Section>

      {/* Call to Action */}
      <Section className="bg-brutalist-yellow py-16 text-black">
        <Container>
          <ServiceCTA />
        </Container>
      </Section>
    </main>
  );
}
