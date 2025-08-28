import { Navigation } from "@/components/sections/Navigation";
import { Footer } from "@/components/sections/Footer";
import { ThemeDetector } from "@/components/theme/ThemeDetector";

export default function ContactPage() {
  return (
    <ThemeDetector>
      <Navigation />
      <main className="min-h-screen bg-current text-current">
        {/* Newsletter Section - Same as in Footer but standalone */}
        <section className="py-20 px-4 border-b-2 border-current">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                STAY CONNECTED
              </h2>
              <p className="text-lg opacity-80 max-w-2xl mx-auto">
                Get exclusive updates, brutal insights, and be the first to know
                about new projects and opportunities.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <form className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="your.email@domain.com"
                    className="w-full p-4 bg-transparent border-2 border-current font-mono text-current placeholder-current placeholder-opacity-60 focus:outline-none focus:border-accent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-current text-secondary border-2 border-current font-bold font-mono hover:bg-transparent hover:text-current transition-colors duration-200"
                >
                  SUBSCRIBE TO UPDATES
                </button>
              </form>

              <p className="text-sm opacity-60 text-center mt-4 font-mono">
                No spam. Unsubscribe anytime. Your email stays private.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                LET&apos;S BUILD TOGETHER
              </h2>
              <p className="text-lg opacity-80 max-w-2xl mx-auto">
                Ready to create something extraordinary? Choose how you&apos;d
                like to connect.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Quick Chat */}
              <div className="p-8 border-2 border-current hover:bg-current hover:text-secondary transition-colors duration-200 group">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-4 font-mono">QUICK CHAT</h3>
                <p className="mb-6 opacity-80 group-hover:opacity-100">
                  15-minute discovery call to discuss your project needs
                </p>
                <button className="w-full py-3 px-6 border-2 border-current font-bold font-mono hover:bg-secondary hover:text-current transition-colors">
                  BOOK CALL
                </button>
              </div>

              {/* Project Brief */}
              <div className="p-8 border-2 border-current hover:bg-current hover:text-secondary transition-colors duration-200 group">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-xl font-bold mb-4 font-mono">
                  PROJECT BRIEF
                </h3>
                <p className="mb-6 opacity-80 group-hover:opacity-100">
                  Send detailed requirements and get a comprehensive proposal
                </p>
                <button className="w-full py-3 px-6 border-2 border-current font-bold font-mono hover:bg-secondary hover:text-current transition-colors">
                  SEND BRIEF
                </button>
              </div>

              {/* Direct Contact */}
              <div className="p-8 border-2 border-current hover:bg-current hover:text-secondary transition-colors duration-200 group md:col-span-2 lg:col-span-1">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-bold mb-4 font-mono">
                  DIRECT LINE
                </h3>
                <p className="mb-6 opacity-80 group-hover:opacity-100">
                  Reach out directly for urgent projects or collaborations
                </p>
                <button className="w-full py-3 px-6 border-2 border-current font-bold font-mono hover:bg-secondary hover:text-current transition-colors">
                  GET IN TOUCH
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Include the original Footer component */}
      <Footer />
    </ThemeDetector>
  );
}
