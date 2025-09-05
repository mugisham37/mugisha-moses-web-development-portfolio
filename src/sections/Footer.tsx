export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white relative overflow-hidden min-h-screen lg:min-h-screen md:min-h-[80vh] sm:min-h-[90vh]">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 lg:gap-16 mb-12 sm:mb-16 md:mb-24 lg:mb-32">
          {/* Logo/Icon - First on mobile, spans full width on small screens */}
          <div className="flex justify-center lg:justify-start md:col-span-2 lg:col-span-1 order-1 lg:order-1">
            <div className="relative">
              {/* Main Icon - Responsive sizing */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 relative">
                <svg
                  viewBox="0 0 160 160"
                  className="w-full h-full text-cyan-300 stroke-current fill-none stroke-2"
                >
                  {/* Code brackets */}
                  <path
                    d="M30 40 L20 50 L20 110 L30 120"
                    strokeLinecap="round"
                  />
                  <path
                    d="M130 40 L140 50 L140 110 L130 120"
                    strokeLinecap="round"
                  />
                  {/* Terminal/screen outline */}
                  <rect x="40" y="35" width="80" height="90" rx="8" />
                  {/* Face elements */}
                  <circle cx="65" cy="70" r="4" className="fill-current" />
                  <circle cx="95" cy="70" r="4" className="fill-current" />
                  <path d="M65 90 Q80 100 95 90" strokeLinecap="round" />
                  {/* Code lines */}
                  <line x1="50" y1="50" x2="70" y2="50" strokeLinecap="round" />
                  <line
                    x1="50"
                    y1="105"
                    x2="90"
                    y2="105"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Decorative stars - Scaled down on mobile */}
              <div className="absolute -top-3 sm:-top-4 lg:-top-6 -left-3 sm:-left-4 lg:-left-6 text-cyan-300">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 20 20"
                  className="fill-current sm:w-4 sm:h-4 lg:w-5 lg:h-5"
                >
                  <path d="M10 0l3 7h7l-6 4 3 7-7-5-7 5 3-7-6-4h7z" />
                </svg>
              </div>
              <div className="absolute -bottom-2 sm:-bottom-3 lg:-bottom-4 -right-2 sm:-right-3 lg:-right-4 text-cyan-300">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 20 20"
                  className="fill-current sm:w-3 sm:h-3 lg:w-4 lg:h-4"
                >
                  <path d="M10 0l3 7h7l-6 4 3 7-7-5-7 5 3-7-6-4h7z" />
                </svg>
              </div>
              <div className="absolute top-4 sm:top-6 lg:top-8 -right-4 sm:-right-6 lg:-right-8 text-cyan-300">
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 20 20"
                  className="fill-current sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3"
                >
                  <path d="M10 0l3 7h7l-6 4 3 7-7-5-7 5 3-7-6-4h7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Contact Info - Second on mobile */}
          <div className="text-center md:text-left lg:text-center space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 order-2 lg:order-2">
            <div>
              <h3 className="text-cyan-300 text-xs sm:text-sm font-medium mb-3 sm:mb-4 uppercase tracking-wide">
                Let&apos;s Connect
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-white/90">
                Ready to build something amazing together? Whether you&apos;re a
                <span className="hidden sm:inline"><br /></span>
                <span className="sm:hidden"> </span>
                startup or enterprise, let&apos;s turn your ideas into reality.
              </p>
            </div>

            <div>
              <h3 className="text-cyan-300 text-xs sm:text-sm font-medium mb-3 sm:mb-4 uppercase tracking-wide">
                Get In Touch
              </h3>
              <p className="text-xs sm:text-sm text-white/90">
                moses.mugisha@dev.com
                <br />
                +250 788 123 456
              </p>
            </div>
          </div>

          {/* Social & Address - Third on mobile, stacked layout */}
          <div className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 order-3 lg:order-3">
            <div>
              <h3 className="text-cyan-300 text-xs sm:text-sm font-medium mb-4 sm:mb-6 uppercase tracking-wide text-center md:text-left">
                Find Me Online
              </h3>
              <div className="grid grid-cols-2 gap-y-2 sm:gap-y-3 gap-x-3 sm:gap-x-4 text-xs sm:text-sm">
                <a
                  href="#"
                  className="flex items-center justify-between hover:text-cyan-300 transition-colors text-white/90"
                >
                  GitHub <span className="text-cyan-300">↗</span>
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between hover:text-cyan-300 transition-colors text-white/90"
                >
                  LinkedIn <span className="text-cyan-300">↗</span>
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between hover:text-cyan-300 transition-colors text-white/90"
                >
                  Portfolio <span className="text-cyan-300">↗</span>
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between hover:text-cyan-300 transition-colors text-white/90"
                >
                  Dev.to <span className="text-cyan-300">↗</span>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-cyan-300 text-xs sm:text-sm font-medium mb-3 sm:mb-4 uppercase tracking-wide text-center md:text-left">
                Location (CAT)
              </h3>
              <p className="text-xs sm:text-sm text-white/90 text-center md:text-left">
                Kigali Innovation City | KG 9 Ave
                <br />
                Kigali - Rwanda
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Large Text - Responsive typography */}
        <div className="relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 sm:gap-0">
            {/* Name text - Responsive sizing and layout */}
            <div className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-9xl font-light text-cyan-300 tracking-wider leading-none text-center sm:text-left">
              <span className="block sm:inline">Moses</span>
              <span className="hidden sm:inline"> &mdash; </span>
              <span className="block sm:inline">Mugisha</span>
            </div>
            
            {/* Monogram - Responsive sizing */}
            <div className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-9xl font-bold leading-none bg-cyan-300 text-purple-600 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-md sm:rounded-lg">
              MM
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}