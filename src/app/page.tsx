import { Navigation } from "@/components/sections/Navigation";
import { Hero } from "@/components/sections/Hero";
import { SocialProof } from "@/components/sections/SocialProof";
import { Footer } from "@/components/sections/Footer";
import { ThemeDetector } from "@/components/theme/ThemeDetector";

export default function Home() {
  return (
    <ThemeDetector>
      <Navigation />
      <main className="min-h-screen bg-current text-current">
        <Hero />
        <SocialProof />
      </main>
      <Footer />
    </ThemeDetector>
  );
}
