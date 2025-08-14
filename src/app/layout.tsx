import type { Metadata, Viewport } from "next";
import { Inter, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Import styles
import "@/styles/globals.css";
import "@/styles/accessibility.css";
import "@/styles/browser-compatibility.css";

// Import browser compatibility initialization
import { BrowserCompatibilityProvider } from "@/components/providers/browser-compatibility-provider";

// Font configurations with optimized loading
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-mono",
  preload: true,
  fallback: [
    "SF Mono",
    "Monaco",
    "Cascadia Code",
    "Roboto Mono",
    "Consolas",
    "Courier New",
    "monospace",
  ],
});

// Enhanced metadata for better SEO and social sharing
export const metadata: Metadata = {
  title: {
    default: "Portfolio | Full-Stack Developer",
    template: "%s | Portfolio",
  },
  description:
    "Full-stack developer specializing in modern web technologies, React, Next.js, and cloud solutions. Building exceptional digital experiences with clean code and innovative design.",
  keywords: [
    "full-stack developer",
    "web developer",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "portfolio",
    "software engineer",
    "frontend",
    "backend",
    "cloud solutions",
  ],
  authors: [{ name: "Portfolio Developer" }],
  creator: "Portfolio Developer",
  publisher: "Portfolio Developer",

  // Open Graph metadata
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    siteName: "Developer Portfolio",
    title: "Portfolio | Full-Stack Developer",
    description:
      "Full-stack developer specializing in modern web technologies and innovative digital solutions.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Developer Portfolio",
      },
    ],
  },

  // Twitter metadata
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Full-Stack Developer",
    description:
      "Full-stack developer specializing in modern web technologies and innovative digital solutions.",
    images: ["/images/twitter-image.jpg"],
    creator: "@yourusername",
  },

  // Additional metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },

  // App-specific metadata
  applicationName: "Developer Portfolio",
  referrer: "origin-when-cross-origin",
  category: "technology",

  // Manifest
  manifest: "/manifest.json",

  // Icons
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#000000" },
    ],
  },

  // Additional meta tags
  other: {
    "msapplication-TileColor": "#000000",
    "theme-color": "#000000",
  },
};

// Enhanced viewport configuration for cross-browser compatibility
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://vercel.live" />
        <link rel="preconnect" href="https://vitals.vercel-insights.com" />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://vercel.live" />

        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/fonts/space-mono-v12-latin-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/space-mono-v12-latin-700.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/inter-v13-latin-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Critical CSS for above-the-fold content */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Critical CSS for immediate rendering */
            html { 
              scroll-behavior: smooth;
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
              text-size-adjust: 100%;
            }
            
            @media (prefers-reduced-motion: reduce) {
              html { scroll-behavior: auto; }
              *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
              }
            }
            
            body {
              margin: 0;
              padding: 0;
              font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              text-rendering: optimizeLegibility;
              background-color: #000000;
              color: #ffffff;
              overflow-x: hidden;
            }
            
            /* Prevent flash of unstyled content */
            .font-loading {
              visibility: hidden;
            }
            
            .fonts-loaded .font-loading {
              visibility: visible;
            }
            
            /* Loading state */
            .loading-placeholder {
              background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
              background-size: 200% 100%;
              animation: loading-shimmer 1.5s infinite;
            }
            
            @keyframes loading-shimmer {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
          `,
          }}
        />

        {/* Browser-specific meta tags */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Portfolio" />
        <meta name="application-name" content="Portfolio" />

        {/* Microsoft specific */}
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Performance hints */}
        <meta httpEquiv="Accept-CH" content="DPR, Viewport-Width, Width" />

        {/* Security headers */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />

        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Portfolio Developer",
              jobTitle: "Full-Stack Developer",
              description:
                "Full-stack developer specializing in modern web technologies and innovative digital solutions.",
              url: "https://your-domain.com",
              sameAs: [
                "https://github.com/yourusername",
                "https://linkedin.com/in/yourusername",
                "https://twitter.com/yourusername",
              ],
              knowsAbout: [
                "JavaScript",
                "TypeScript",
                "React",
                "Next.js",
                "Node.js",
                "Web Development",
                "Full-Stack Development",
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {/* Browser compatibility provider for feature detection and polyfills */}
        <BrowserCompatibilityProvider>
          {/* Skip to main content link for accessibility */}
          <a
            href="#main-content"
            className="bg-accent-yellow sr-only z-50 px-4 py-2 font-mono font-bold tracking-wider text-black uppercase focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
          >
            Skip to main content
          </a>

          {/* Main application content */}
          <div id="main-content" className="min-h-screen">
            {children}
          </div>

          {/* Analytics and performance monitoring */}
          <Analytics />
          <SpeedInsights />

          {/* Service worker registration script */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Register service worker for offline functionality
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js')
                      .then(function(registration) {
                        console.log('SW registered: ', registration);
                      })
                      .catch(function(registrationError) {
                        console.log('SW registration failed: ', registrationError);
                      });
                  });
                }
                
                // Font loading optimization
                if ('fonts' in document) {
                  document.fonts.ready.then(function() {
                    document.documentElement.classList.add('fonts-loaded');
                  });
                } else {
                  // Fallback for browsers without Font Loading API
                  setTimeout(function() {
                    document.documentElement.classList.add('fonts-loaded');
                  }, 3000);
                }
                
                // Performance monitoring
                if ('PerformanceObserver' in window) {
                  const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                      if (entry.entryType === 'largest-contentful-paint') {
                        console.log('LCP:', entry.startTime);
                      }
                      if (entry.entryType === 'first-input') {
                        console.log('FID:', entry.processingStart - entry.startTime);
                      }
                      if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
                        console.log('CLS:', entry.value);
                      }
                    }
                  });
                  
                  observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
                }
                
                // Error tracking
                window.addEventListener('error', function(e) {
                  console.error('Global error:', e.error);
                });
                
                window.addEventListener('unhandledrejection', function(e) {
                  console.error('Unhandled promise rejection:', e.reason);
                });
              `,
            }}
          />
        </BrowserCompatibilityProvider>
      </body>
    </html>
  );
}
