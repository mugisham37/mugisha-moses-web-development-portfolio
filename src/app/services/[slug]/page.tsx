import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ServiceHero } from "@/components/services/service-hero";
import { ServiceFeatures } from "@/components/services/service-features";
import { ServiceProcess } from "@/components/services/service-process";
import { ServicePricing } from "@/components/services/service-pricing";
import { ServiceFAQ } from "@/components/services/service-faq";
import { ServiceTestimonials } from "@/components/services/service-testimonials";
import { ServiceCTA } from "@/components/services/service-cta";
import { getServiceBySlug, getAllServices } from "@/lib/services-data";

interface ServicePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const services = await getAllServices();
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: `${service.name.toUpperCase()} | ELITE SERVICES`,
    description: service.description,
    openGraph: {
      title: `${service.name.toUpperCase()} | ELITE SERVICES`,
      description: service.description,
      type: "website",
      images: service.ogImage ? [{ url: service.ogImage }] : [],
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Service Hero */}
      <ServiceHero service={service} />

      {/* Service Features */}
      <Section className="py-16">
        <Container>
          <ServiceFeatures service={service} />
        </Container>
      </Section>

      {/* Service Process */}
      <Section className="bg-brutalist-charcoal-100 py-16">
        <Container>
          <ServiceProcess service={service} />
        </Container>
      </Section>

      {/* Service Pricing */}
      <Section className="py-16">
        <Container>
          <ServicePricing service={service} />
        </Container>
      </Section>

      {/* Service FAQ */}
      <Section className="bg-brutalist-charcoal-100 py-16">
        <Container>
          <ServiceFAQ service={service} />
        </Container>
      </Section>

      {/* Service Testimonials */}
      <Section className="py-16">
        <Container>
          <ServiceTestimonials serviceId={service.id} />
        </Container>
      </Section>

      {/* Call to Action */}
      <Section className="bg-brutalist-yellow py-16 text-black">
        <Container>
          <ServiceCTA service={service} />
        </Container>
      </Section>
    </main>
  );
}
