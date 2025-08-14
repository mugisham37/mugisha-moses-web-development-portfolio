import { ASCIIPortrait } from "@/components/animations/ascii-portrait";

export default function ASCIITestPage() {
  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center font-mono text-4xl font-bold text-yellow-400">
          ASCII ART HEADSHOT INTEGRATION TEST
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Default Configuration */}
          <div className="space-y-4">
            <h2 className="font-mono text-2xl font-bold text-white">
              Default Configuration
            </h2>
            <div className="border-4 border-white p-4">
              <ASCIIPortrait
                imageUrl="/images/portrait-placeholder.svg"
                width={40}
                height={30}
                fontSize={10}
                autoStart={true}
                loop={true}
                responsive={true}
                accessibilityLabel="Default ASCII art portrait"
                performanceMode="balanced"
              />
            </div>
          </div>

          {/* High Performance Mode */}
          <div className="space-y-4">
            <h2 className="font-mono text-2xl font-bold text-white">
              High Performance Mode
            </h2>
            <div className="border-4 border-white p-4">
              <ASCIIPortrait
                imageUrl="/images/portrait-placeholder.svg"
                width={35}
                height={25}
                fontSize={8}
                autoStart={true}
                loop={false}
                responsive={true}
                accessibilityLabel="High performance ASCII art portrait"
                performanceMode="high"
              />
            </div>
          </div>

          {/* Large Size */}
          <div className="space-y-4">
            <h2 className="font-mono text-2xl font-bold text-white">
              Large Size
            </h2>
            <div className="border-4 border-white p-4">
              <ASCIIPortrait
                imageUrl="/images/portrait-placeholder.svg"
                width={60}
                height={45}
                fontSize={12}
                autoStart={true}
                loop={true}
                responsive={true}
                accessibilityLabel="Large ASCII art portrait"
                performanceMode="balanced"
              />
            </div>
          </div>

          {/* Low Performance Mode */}
          <div className="space-y-4">
            <h2 className="font-mono text-2xl font-bold text-white">
              Low Performance Mode
            </h2>
            <div className="border-4 border-white p-4">
              <ASCIIPortrait
                imageUrl="/images/portrait-placeholder.svg"
                width={30}
                height={22}
                fontSize={9}
                autoStart={true}
                loop={true}
                responsive={true}
                accessibilityLabel="Low performance ASCII art portrait"
                performanceMode="low"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-4">
          <h2 className="font-mono text-2xl font-bold text-white">
            Features Implemented
          </h2>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div className="border-2 border-yellow-400 p-4">
              <h3 className="mb-2 font-bold text-yellow-400">
                ✅ Core Features
              </h3>
              <ul className="space-y-1">
                <li>• Dynamic ASCII art canvas rendering</li>
                <li>• Fallback placeholder system</li>
                <li>• Responsive sizing across devices</li>
                <li>• Smooth loading animations</li>
                <li>• Performance optimization modes</li>
              </ul>
            </div>
            <div className="border-2 border-yellow-400 p-4">
              <h3 className="mb-2 font-bold text-yellow-400">
                ✅ Accessibility
              </h3>
              <ul className="space-y-1">
                <li>• ARIA labels and descriptions</li>
                <li>• Screen reader compatibility</li>
                <li>• Reduced motion support</li>
                <li>• Semantic HTML structure</li>
                <li>• Keyboard navigation support</li>
              </ul>
            </div>
            <div className="border-2 border-yellow-400 p-4">
              <h3 className="mb-2 font-bold text-yellow-400">✅ Performance</h3>
              <ul className="space-y-1">
                <li>• Intersection Observer optimization</li>
                <li>• Frame rate limiting</li>
                <li>• Responsive ResizeObserver</li>
                <li>• Canvas performance modes</li>
                <li>• Memory efficient rendering</li>
              </ul>
            </div>
            <div className="border-2 border-yellow-400 p-4">
              <h3 className="mb-2 font-bold text-yellow-400">✅ Animation</h3>
              <ul className="space-y-1">
                <li>• 5-phase animation system</li>
                <li>• Random character cycling</li>
                <li>• Gradual formation effect</li>
                <li>• Glitch transition effects</li>
                <li>• Photo reveal animation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
