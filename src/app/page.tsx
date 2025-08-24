import { Navigation } from "@/components/sections/Navigation";
import { HeroWithEffects, HeroContent } from "@/components/sections/Hero";
import {
  DynamicSocialProof,
  DynamicResults,
  DynamicFooter,
  preloadSections,
} from "@/components/layout/DynamicSections";
import { ThemeDetector } from "@/components/theme/ThemeDetector";
import {
  PageWrapper,
  SectionTransition,
  StaggeredChildren,
} from "@/components/layout/PageTransition";
import {
  ScrollProgress,
  SmoothScroll,
} from "@/components/layout/ScrollProgress";
import { KeyboardNavigation } from "@/components/layout/KeyboardNavigation";
import { useEffect } from "react";

export default function Home() {
  // Preload sections for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      preloadSections();
    }, 2000); // Preload after 2 seconds

    return () => clearTimeout(timer);
  }, []);
  return (
    <ThemeDetector>
      <PageWrapper>
        <SmoothScroll>
          {/* Scroll Progress Indicator */}
          <ScrollProgress
            showSectionNavigation={true}
            sections={[
              { id: "hero", label: "HOME", icon: "⚡" },
              { id: "social-proof", label: "PROOF", icon: "🏆" },
              { id: "results", label: "RESULTS", icon: "📊" },
              { id: "footer", label: "CONTACT", icon: "🚀" },
            ]}
          />

          {/* Keyboard Navigation */}
          <KeyboardNavigation
            enableShortcuts={true}
            sections={[
              { id: "hero", label: "Home" },
              { id: "social-proof", label: "Social Proof" },
              { id: "results", label: "Results" },
              { id: "footer", label: "Contact" },
            ]}
          />

          <Navigation />

          <main
            id="main-content"
            className="min-h-screen bg-current text-current"
          >
            {/* Hero Section with Background Effects System */}
            <SectionTransition
              sectionId="hero"
              transitionType="brutal"
              className="hero-section"
            >
              <HeroWithEffects>
                <StaggeredChildren staggerDelay={150}>
                  <HeroContent />
                </StaggeredChildren>
              </HeroWithEffects>
            </SectionTransition>

            {/* Social Proof Section - Triggers theme transition to refined brutalist */}
            <SectionTransition
              sectionId="social-proof"
              transitionType="brutal"
              delay={200}
              className="social-proof-section"
            >
              <StaggeredChildren staggerDelay={100}>
                <DynamicSocialProof />
              </StaggeredChildren>
            </SectionTransition>

            {/* Results Section - Enhanced visual design with success particles and golden grid */}
            <SectionTransition
              sectionId="results"
              transitionType="brutal"
              delay={300}
              className="results-section"
            >
              <StaggeredChildren staggerDelay={120}>
                <DynamicResults />
              </StaggeredChildren>
            </SectionTransition>
          </main>

          {/* Footer Section with Ultimate CTA */}
          <SectionTransition
            sectionId="footer"
            transitionType="brutal"
            delay={400}
            className="footer-section"
          >
            <StaggeredChildren staggerDelay={80}>
              <DynamicFooter />
            </StaggeredChildren>
          </SectionTransition>
        </SmoothScroll>
      </PageWrapper>
    </ThemeDetector>
  );
}
