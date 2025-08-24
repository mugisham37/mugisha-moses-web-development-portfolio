import { Navigation } from "@/components/sections/Navigation";
import { HeroWithEffects, HeroContent } from "@/components/sections/Hero";
import { SocialProof } from "@/components/sections/SocialProof";
import { Results } from "@/components/sections/Results";
import { Footer } from "@/components/sections/Footer";
import { ThemeDetector } from "@/components/theme/ThemeDetector";

export default function Home() {
  return (
    <ThemeDetector>
      <Navigation />
      <main className="min-h-screen bg-current text-current">
        {/* Hero Section with Background Effects System */}
        <HeroWithEffects>
          <HeroContent />
        </HeroWithEffects>

        {/* Social Proof Section - Triggers theme transition to refined brutalist */}
        <SocialProof />

        {/* Results Section - Enhanced visual design with success particles and golden grid */}
        <Results />
      </main>

      {/* Footer Section with Ultimate CTA */}
      <Footer />
    </ThemeDetector>
  );
}
