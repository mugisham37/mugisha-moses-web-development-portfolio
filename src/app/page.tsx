import Navigation from "@/sections/Navigation";
import Hero from "@/sections/Hero";
import BrandSoul from "@/sections/About";
import Experience from "@/sections/Experience";
import Projects from "@/sections/Projects";
import CTASection from "@/sections/CTASection";
import Process from "@/sections/Process";
import Testimonial from "@/sections/Testimonial";
import Footer from "@/sections/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <Hero />
      <BrandSoul />
      <Experience />
      <Projects />
      <CTASection />
      <Process />
      <Testimonial />
      <Footer />
    </>
  );
}
