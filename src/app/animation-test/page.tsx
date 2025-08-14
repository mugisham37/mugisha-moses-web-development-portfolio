import { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { AnimationShowcase } from "@/components/animations/animation-showcase";
import {
  ScrollNavigation,
  ScrollProgressWithSections,
} from "@/components/animations/scroll-navigation";

export const metadata: Metadata = {
  title: "Animation Test | Advanced Scroll Effects System",
  description:
    "Comprehensive test page for the advanced animation and scroll effects system",
};

export default function AnimationTestPage() {
  const testSections = [
    { id: "showcase", label: "Showcase", color: "#ffff00" },
    { id: "performance", label: "Performance", color: "#ff6b6b" },
    { id: "accessibility", label: "Accessibility", color: "#4ecdc4" },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <ScrollProgressWithSections
        sections={testSections}
        height={4}
        showSectionMarkers={true}
      />
      <ScrollNavigation
        sections={testSections}
        position="right"
        showLabels={true}
      />

      {/* Main Content */}
      <Section padding="xl" id="showcase">
        <Container>
          <AnimationShowcase />
        </Container>
      </Section>

      {/* Performance Section */}
      <Section padding="xl" background="dark-gradient" id="performance">
        <Container>
          <div className="space-y-8 text-center">
            <h2 className="text-brutalist-yellow font-mono text-4xl font-bold uppercase">
              PERFORMANCE METRICS
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="border-4 border-white bg-black p-8 text-center">
                <div className="text-brutalist-yellow mb-2 font-mono text-3xl font-bold">
                  60 FPS
                </div>
                <div className="text-white">Target Frame Rate</div>
              </div>
              <div className="border-4 border-white bg-black p-8 text-center">
                <div className="text-brutalist-yellow mb-2 font-mono text-3xl font-bold">
                  &lt; 100ms
                </div>
                <div className="text-white">Animation Delay</div>
              </div>
              <div className="border-4 border-white bg-black p-8 text-center">
                <div className="text-brutalist-yellow mb-2 font-mono text-3xl font-bold">
                  AUTO
                </div>
                <div className="text-white">Optimization</div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Accessibility Section */}
      <Section padding="xl" background="textured-light" id="accessibility">
        <Container>
          <div className="space-y-8 text-center">
            <h2 className="font-mono text-4xl font-bold text-black uppercase">
              ACCESSIBILITY FEATURES
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="border-4 border-black bg-white p-8">
                <h3 className="mb-4 font-mono text-2xl font-bold text-black">
                  REDUCED MOTION
                </h3>
                <ul className="space-y-2 text-left text-black">
                  <li>• Respects prefers-reduced-motion</li>
                  <li>• Instant transitions when enabled</li>
                  <li>• Maintains functionality</li>
                  <li>• Automatic detection</li>
                </ul>
              </div>
              <div className="bg-brutalist-yellow border-4 border-black p-8">
                <h3 className="mb-4 font-mono text-2xl font-bold text-black">
                  PERFORMANCE ADAPTATION
                </h3>
                <ul className="space-y-2 text-left text-black">
                  <li>• Device capability detection</li>
                  <li>• Animation complexity scaling</li>
                  <li>• Memory usage optimization</li>
                  <li>• Graceful degradation</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
