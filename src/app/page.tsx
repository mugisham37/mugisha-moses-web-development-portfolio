import { Navigation } from "@/components/sections/Navigation";
import { HeroWithEffects, HeroContent } from "@/components/sections/Hero";
import { SocialProof } from "@/components/sections/SocialProof";
import { Results } from "@/components/sections/Results";
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

        {/* Final Section */}
        <section className="min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-4 py-8 text-center">
            <h2 className="text-4xl font-bold text-current font-primary mb-8">
              SCROLL-BASED THEME DETECTION
            </h2>
            <p className="text-lg text-current mb-8">
              The scroll-based theme detection system is now fully implemented!
            </p>
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="brutal-border p-4 bg-success text-current">
                ✓ useScrollProgress hook with performance optimization
              </div>
              <div className="brutal-border p-4 bg-success text-current">
                ✓ useThemeTransition hook with hysteresis logic
              </div>
              <div className="brutal-border p-4 bg-success text-current">
                ✓ ThemeDetector component with intersection observer
              </div>
              <div className="brutal-border p-4 bg-success text-current">
                ✓ Smooth 600ms transitions between theme states
              </div>
            </div>
          </div>
        </section>
      </main>
    </ThemeDetector>
  );
}
