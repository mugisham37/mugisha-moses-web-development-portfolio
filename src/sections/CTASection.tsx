export default function CTASection() {
  return (
    <section className="px-4 sm:px-8 md:px-16 lg:px-28 py-12 sm:py-14 md:py-16 lg:py-17 bg-black">
      <div className="max-w-8xl mx-auto">
        <div className="bg-gradient-to-r from-purple-500 to-purple-400 rounded-xl sm:rounded-2xl px-6 sm:px-10 md:px-12 lg:px-14 py-8 sm:py-9 md:py-10 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-white mb-4 sm:mb-5 leading-tight max-w-xs sm:max-w-lg md:max-w-2xl mx-auto">
            Ready to build something amazing? Let&apos;s turn your ideas into
            reality!
          </h2>

          <p className="text-white/90 text-base sm:text-lg mb-6 sm:mb-7 font-light max-w-md sm:max-w-none mx-auto">
            Get in touch and let&apos;s discuss how I can help bring your
            project to life.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-3 justify-center items-stretch sm:items-center">
            <button className="bg-black/80 hover:bg-black text-white px-6 sm:px-7 py-3 rounded-full flex items-center justify-center gap-3 font-medium transition-colors min-h-[48px] sm:min-h-auto">
              <span>Let&apos;s Build Together</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button className="bg-black/80 hover:bg-black text-white px-6 sm:px-7 py-3 rounded-full flex items-center justify-center gap-3 font-medium transition-colors min-h-[48px] sm:min-h-auto">
              <span>View Resume</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
