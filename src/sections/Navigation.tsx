"use client";

import { useState, useEffect } from "react";
import OnboardingModal from "../components/OnboardingModal";

// Smooth scroll utility
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      // Add background blur when scrolled
      setIsScrolled(currentScrollY > 20);

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed nav */}
      <div className="h-16"></div>

      <nav
        className={`
        fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
        ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm"
            : "bg-white border-b border-gray-100"
        }
      `}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-12 lg:px-28">
          <div
            className={`
          flex items-center justify-between transition-all duration-300
          ${isScrolled ? "h-14" : "h-16"}
        `}
          >
            {/* Logo and Navigation Links */}
            <div className="flex items-center">
              {/* Logo */}
              <div className="flex-shrink-0">
                <span
                  className={`
                text-black font-bold transition-all duration-300
                ${isScrolled ? "text-lg" : "text-xl"}
              `}
                >
                  MM
                </span>
              </div>

              {/* Desktop Navigation Links */}
              <div className="hidden md:block ml-12">
                <div className="flex items-baseline space-x-2">
                  <button
                    onClick={() => scrollToSection("hero")}
                    className="text-black hover:text-gray-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-50 rounded-lg relative group"
                  >
                    Home
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-4 transform -translate-x-1/2"></span>
                  </button>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="text-black hover:text-gray-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-50 rounded-lg relative group"
                  >
                    About
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-4 transform -translate-x-1/2"></span>
                  </button>
                  <button
                    onClick={() => scrollToSection("experience")}
                    className="text-black hover:text-gray-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-50 rounded-lg relative group"
                  >
                    Experience
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-4 transform -translate-x-1/2"></span>
                  </button>
                  <button
                    onClick={() => scrollToSection("projects")}
                    className="text-black hover:text-gray-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-50 rounded-lg relative group"
                  >
                    Projects
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-4 transform -translate-x-1/2"></span>
                  </button>
                  <button
                    onClick={() => scrollToSection("process")}
                    className="text-black hover:text-gray-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-50 rounded-lg relative group"
                  >
                    Process
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-4 transform -translate-x-1/2"></span>
                  </button>
                  <button
                    onClick={() => scrollToSection("testimonials")}
                    className="text-black hover:text-gray-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-50 rounded-lg relative group"
                  >
                    Testimonials
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-4 transform -translate-x-1/2"></span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right side - CTA Button and Mobile Menu */}
            <div className="flex items-center space-x-3">
              {/* CTA Button - Responsive text and sizing */}
              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="bg-black text-white px-3 sm:px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2 md:gap-3 hover:bg-gray-800 hover:scale-105 transition-all duration-200 min-h-[40px] touch-manipulation shadow-sm hover:shadow-md"
              >
                <span className="hidden sm:inline">
                  Let&apos;s Build Together
                </span>
                <span className="sm:hidden">Let&apos;s Build</span>
                <svg
                  width="14"
                  height="14"
                  className="md:w-4 md:h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
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

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-black hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 transition-colors min-h-[40px] min-w-[40px] touch-manipulation"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {/* Hamburger Icon */}
                <svg
                  className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                {/* Close Icon */}
                <svg
                  className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <div
            className={`
          md:hidden transition-all duration-300 ease-in-out overflow-hidden
          ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-sm border-t border-gray-200/50">
              <button
                onClick={() => {
                  scrollToSection("hero");
                  setIsMenuOpen(false);
                }}
                className="text-black hover:text-gray-600 hover:bg-gray-50 block px-3 py-3 text-base font-medium transition-colors rounded-md touch-manipulation w-full text-left"
              >
                Home
              </button>
              <button
                onClick={() => {
                  scrollToSection("about");
                  setIsMenuOpen(false);
                }}
                className="text-black hover:text-gray-600 hover:bg-gray-50 block px-3 py-3 text-base font-medium transition-colors rounded-md touch-manipulation w-full text-left"
              >
                About
              </button>
              <button
                onClick={() => {
                  scrollToSection("experience");
                  setIsMenuOpen(false);
                }}
                className="text-black hover:text-gray-600 hover:bg-gray-50 block px-3 py-3 text-base font-medium transition-colors rounded-md touch-manipulation w-full text-left"
              >
                Experience
              </button>
              <button
                onClick={() => {
                  scrollToSection("projects");
                  setIsMenuOpen(false);
                }}
                className="text-black hover:text-gray-600 hover:bg-gray-50 block px-3 py-3 text-base font-medium transition-colors rounded-md touch-manipulation w-full text-left"
              >
                Projects
              </button>
              <button
                onClick={() => {
                  scrollToSection("process");
                  setIsMenuOpen(false);
                }}
                className="text-black hover:text-gray-600 hover:bg-gray-50 block px-3 py-3 text-base font-medium transition-colors rounded-md touch-manipulation w-full text-left"
              >
                Process
              </button>
              <button
                onClick={() => {
                  scrollToSection("testimonials");
                  setIsMenuOpen(false);
                }}
                className="text-black hover:text-gray-600 hover:bg-gray-50 block px-3 py-3 text-base font-medium transition-colors rounded-md touch-manipulation w-full text-left"
              >
                Testimonials
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </>
  );
}
