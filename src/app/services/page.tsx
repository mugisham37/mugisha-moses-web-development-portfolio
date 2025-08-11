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
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { StructuredData } from "@/components/seo/structured-data";

export const metadata: Metadata = generateSEOMetadata({
  title: "Services",
  description:
    "Professional web development, mobile apps, and technical consulting services. Transform your ideas into powerful digital solutions with brutalist precision.",
  keywords: [
    "services",
    "web development",
    "mobile apps",
    "consulting",
    "full-stack development",
    "react",
    "next.js",
    "typescript",
    "professional development",
  ],
  url: "/services",
  type: "website",
});

export default function ServicesPage() {
  const breadcrumbs = [{ name: "Services", url: "/services", current: true }];

  const servicesStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Professional Development Services",
    description:
      "Professional web development, mobile apps, and technical consulting services",
    url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/services`,
    provider: {
      "@type": "Person",
      name: process.env.NEXT_PUBLIC_AUTHOR_NAME || "Developer",
      url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    },
    serviceType: "Web Development",
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Development Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Web Development",
            description: "Custom web applications using modern technologies",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Full-Stack Development",
            description: "End-to-end application development",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Technical Consulting",
            description:
              "Expert technical guidance and architecture consulting",
          },
        },
      ],
    },
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <StructuredData data={servicesStructuredData} />

      {/* Hero Section */}
      <Section className="pt-32 pb-16">
        <Container>
          <div className="space-y-6">
            <Breadcrumbs items={breadcrumbs} />
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
