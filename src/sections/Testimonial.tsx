import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export default function Testimonial() {
  const testimonials = [
    {
      quote:
        "He delivered a complex e-commerce platform that increased our sales by 150%. His attention to detail and ability to solve challenging problems is exceptional.",
      name: "Sarah M.",
      designation: "CEO at TechVenture",
      src: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The AI analytics dashboard he built processes 100K+ data points daily and helped us optimize operations, saving 30% in operational costs.",
      name: "Michael K.",
      designation: "CTO at DataFlow",
      src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "His mobile app solution exceeded expectations. Clean code, great performance, and delivered ahead of schedule. Highly recommend his services.",
      name: "Emma R.",
      designation: "Product Manager at InnovateLab",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "He migrated our entire infrastructure to the cloud seamlessly. Zero downtime, improved performance, and reduced costs by 40%.",
      name: "David L.",
      designation: "Engineering Director at CloudScale",
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "His full-stack expertise and communication skills made our project a success. Professional, efficient, and delivers quality code every time.",
      name: "Lisa P.",
      designation: "Startup Founder at FutureNet",
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <section
      id="testimonials"
      className="bg-black text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Client Testimonials
          </h2>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
            Hear what clients say about working with me and the results
            we&apos;ve achieved together.
          </p>
        </div>

        <div className="rounded-2xl sm:rounded-3xl overflow-hidden">
          <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
        </div>
      </div>
    </section>
  );
}
