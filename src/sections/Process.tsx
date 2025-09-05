export default function Process() {
  return (
    <section
      id="process"
      className="bg-black text-white py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-28"
    >
      <div className="max-w-8xl mx-auto">
        {/* Header with blue text */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <p className="text-blue-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6 tracking-wider uppercase">
            [MY PROCESS]
          </p>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal leading-tight sm:leading-snug md:leading-relaxed lg:leading-14">
            Understanding the complexity of modern development challenges,
            I&apos;ve crafted a systematic approach to building robust digital
            solutions that scale. A proven methodology that transforms your
            requirements into clean, efficient code that delivers exceptional
            user experiences and drives business growth.
          </h2>
        </div>

        {/* Process Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mt-8 sm:mt-12 md:mt-16">
          {/* Analyze Card */}
          <div className="bg-zinc-900 p-4 sm:p-5 rounded-lg sm:col-span-2 lg:col-span-1">
            <div className="mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-medium mb-1">Analyze</h3>
              <p className="text-blue-400 text-xs">→ Discovery</p>
            </div>

            <div className="mb-3 sm:mb-4">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-white rounded-full flex items-center justify-center mb-2">
                <div className="w-5 sm:w-7 h-5 sm:h-7 bg-gray-300 rounded-full"></div>
              </div>
            </div>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Deep dive into your business requirements, user needs, and
              technical constraints to architect the optimal solution that
              aligns with your goals and scales with your growth.
            </p>
          </div>

          {/* Architect Card */}
          <div className="bg-zinc-900 p-4 sm:p-5 rounded-lg">
            <div className="mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-medium mb-1">
                Architect
              </h3>
              <p className="text-blue-400 text-xs">→ Design</p>
            </div>

            <div className="mb-3 sm:mb-4">
              <div className="relative w-8 sm:w-10 h-8 sm:h-10 mb-2">
                <div className="w-5 sm:w-7 h-5 sm:h-7 bg-white rounded-sm"></div>
                <div className="absolute top-0.5 sm:top-1 right-0 w-3 sm:w-4 h-0.5 sm:h-1 bg-pink-400 rotate-45 origin-left"></div>
              </div>
            </div>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Design the technical architecture and create detailed blueprints
              that ensure scalability, security, and maintainability while
              delivering optimal performance across all platforms.
            </p>
          </div>

          {/* Execute Card */}
          <div className="bg-zinc-900 p-4 sm:p-5 rounded-lg">
            <div className="mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-medium mb-1">Execute</h3>
              <p className="text-blue-400 text-xs">→ Deliver</p>
            </div>

            <div className="mb-3 sm:mb-4">
              <div className="w-8 sm:w-10 h-8 sm:h-10 mb-2 flex items-center">
                <div className="w-5 sm:w-7 h-3 sm:h-5 bg-white rounded-sm mr-1"></div>
                <div className="w-1.5 sm:w-2 h-2.5 sm:h-4 bg-gray-400 rounded-sm"></div>
              </div>
            </div>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Transform concepts into production-ready applications using modern
              development practices, rigorous testing, and continuous deployment
              to deliver solutions that exceed expectations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
