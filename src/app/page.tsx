import { Navigation } from "@/components/sections/Navigation";
import { ThemeDetector } from "@/components/theme/ThemeDetector";

export default function Home() {
  return (
    <ThemeDetector>
      <Navigation />
      <main className="min-h-screen bg-current text-current">
        {/* Hero Section - Extreme Brutalist Theme */}
        <section className="min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-6xl font-bold text-current font-primary mb-8">
              BRUTALIST PORTFOLIO
            </h1>
            <p className="text-xl text-current mb-8">
              Next.js 14 project with dual-theme brutalist architecture.
            </p>
            <div className="brutal-border p-6 bg-accent text-current inline-block mb-8">
              <span className="font-code">EXTREME BRUTALIST THEME ACTIVE</span>
            </div>
            <div className="brutal-border p-4 bg-secondary text-current">
              <p className="font-code">
                SCROLL DOWN TO SEE THEME TRANSITION AT 40%
              </p>
            </div>
          </div>
        </section>

        {/* Transition Section */}
        <section className="min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-4 py-8 text-center">
            <h2 className="text-5xl font-bold text-current font-primary mb-8">
              TRANSITION ZONE
            </h2>
            <p className="text-lg text-current mb-8">
              Watch the theme smoothly transition as you scroll through this
              area. The transition happens at 40% scroll progress with 600ms
              duration.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="brutal-border p-6 bg-secondary text-current"
                >
                  <h3 className="text-xl font-bold mb-4">Feature {i}</h3>
                  <p>
                    This card adapts to the current theme automatically with
                    smooth transitions.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Refined Section */}
        <section className="min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-4 py-8 text-center">
            <h2 className="text-5xl font-bold text-current font-primary mb-8">
              REFINED BRUTALIST
            </h2>
            <p className="text-lg text-current mb-8">
              This section uses the refined brutalist theme with softer edges,
              gradients, and professional styling while maintaining the brutal
              aesthetic.
            </p>
            <div className="brutal-border p-8 bg-highlight text-current inline-block mb-8">
              <span className="font-code">PROFESSIONAL & POLISHED</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="brutal-border p-6 bg-success text-current">
                <h3 className="text-xl font-bold mb-4">✓ Smooth Transitions</h3>
                <p>600ms cubic-bezier transitions between themes</p>
              </div>
              <div className="brutal-border p-6 bg-success text-current">
                <h3 className="text-xl font-bold mb-4">
                  ✓ Hysteresis Prevention
                </h3>
                <p>Prevents rapid theme switching with smart logic</p>
              </div>
            </div>
          </div>
        </section>

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
