"use client";

import { useEffect } from "react";

/**
 * Critical CSS Component
 * Inlines critical CSS for above-the-fold content
 */
export function CriticalCSS() {
  useEffect(() => {
    // Load non-critical CSS asynchronously
    const loadNonCriticalCSS = () => {
      const links = document.querySelectorAll(
        'link[rel="preload"][as="style"]'
      );
      links.forEach((link) => {
        const htmlLink = link as HTMLLinkElement;
        htmlLink.rel = "stylesheet";
      });
    };

    // Load after initial render
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", loadNonCriticalCSS);
    } else {
      loadNonCriticalCSS();
    }

    return () => {
      document.removeEventListener("DOMContentLoaded", loadNonCriticalCSS);
    };
  }, []);

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          /* Critical CSS for above-the-fold content */
          
          /* Reset and base styles */
          *,*::before,*::after{box-sizing:border-box}
          *{margin:0}
          html,body{height:100%}
          body{line-height:1.5;-webkit-font-smoothing:antialiased}
          img,picture,video,canvas,svg{display:block;max-width:100%}
          input,button,textarea,select{font:inherit}
          p,h1,h2,h3,h4,h5,h6{overflow-wrap:break-word}
          
          /* Critical design tokens */
          :root{
            --color-primary-black:#000000;
            --color-primary-white:#ffffff;
            --color-accent-yellow:#ffff00;
            --font-mono:'Space Mono',monospace;
            --font-sans:'Inter',sans-serif;
            --shadow-brutalist:8px 8px 0px rgba(255,255,255,0.1);
            --border-width:4px;
          }
          
          /* Critical layout styles */
          body{
            background:var(--color-primary-black);
            color:var(--color-primary-white);
            font-family:var(--font-sans);
            font-size:16px;
            line-height:1.6;
          }
          
          /* Critical header styles */
          header{
            position:fixed;
            top:0;
            left:0;
            right:0;
            z-index:1000;
            background:rgba(0,0,0,0.9);
            backdrop-filter:blur(10px);
            border-bottom:var(--border-width) solid var(--color-primary-white);
          }
          
          /* Critical hero section styles */
          .hero-section{
            min-height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            position:relative;
            overflow:hidden;
          }
          
          /* Critical typography */
          h1,h2,h3,h4,h5,h6{
            font-family:var(--font-mono);
            font-weight:700;
            text-transform:uppercase;
            letter-spacing:-0.025em;
            line-height:1.05;
          }
          
          h1{
            font-size:clamp(2rem,8vw,4rem);
            margin-bottom:1rem;
          }
          
          /* Critical button styles */
          .btn{
            display:inline-block;
            padding:16px 32px;
            border:var(--border-width) solid var(--color-primary-white);
            background:transparent;
            color:var(--color-primary-white);
            font-family:var(--font-mono);
            font-weight:700;
            text-transform:uppercase;
            text-decoration:none;
            transition:all 0.3s cubic-bezier(0.4,0,0.2,1);
            cursor:pointer;
          }
          
          .btn:hover{
            transform:translateY(-4px);
            box-shadow:var(--shadow-brutalist);
          }
          
          .btn-primary{
            background:var(--color-accent-yellow);
            color:var(--color-primary-black);
            border-color:var(--color-accent-yellow);
          }
          
          /* Critical loading states */
          .fonts-loading{
            visibility:hidden;
          }
          
          .fonts-loaded{
            visibility:visible;
          }
          
          /* Critical responsive styles */
          @media (max-width:768px){
            .hero-section{
              padding:2rem 1rem;
              text-align:center;
            }
            
            h1{
              font-size:clamp(1.5rem,6vw,2.5rem);
            }
            
            .btn{
              padding:14px 24px;
              font-size:14px;
            }
          }
          
          /* Critical animation styles */
          @keyframes fadeIn{
            from{opacity:0;transform:translateY(20px)}
            to{opacity:1;transform:translateY(0)}
          }
          
          .animate-fade-in{
            animation:fadeIn 0.6s ease-out forwards;
          }
          
          /* Critical performance optimizations */
          .hardware-accelerated{
            transform:translateZ(0);
            will-change:transform;
            backface-visibility:hidden;
          }
          
          /* Critical accessibility */
          .sr-only{
            position:absolute;
            width:1px;
            height:1px;
            padding:0;
            margin:-1px;
            overflow:hidden;
            clip:rect(0,0,0,0);
            white-space:nowrap;
            border:0;
          }
          
          /* Critical focus styles */
          *:focus{
            outline:4px solid var(--color-accent-yellow);
            outline-offset:2px;
          }
          
          /* Critical reduced motion */
          @media (prefers-reduced-motion:reduce){
            *,*::before,*::after{
              animation-duration:0.01ms!important;
              animation-iteration-count:1!important;
              transition-duration:0.01ms!important;
              scroll-behavior:auto!important;
            }
          }
        `,
      }}
    />
  );
}

/**
 * Font Preloader Component
 * Optimizes font loading with proper fallbacks
 */
export function FontPreloader() {
  return (
    <>
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
        crossOrigin="anonymous"
      />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
    </>
  );
}

/**
 * Resource Hints Component
 * Provides performance hints to the browser
 */
export function ResourceHints() {
  return (
    <>
      {/* DNS prefetch for external domains */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//vercel.live" />
      <link rel="dns-prefetch" href="//va.vercel-scripts.com" />

      {/* Preload critical resources */}
      <link
        rel="preload"
        href="/images/hero-bg.webp"
        as="image"
        type="image/webp"
      />

      {/* Prefetch likely next pages */}
      <link rel="prefetch" href="/projects" />
      <link rel="prefetch" href="/blog" />
      <link rel="prefetch" href="/contact" />

      {/* Module preload for critical JavaScript */}
      <link rel="modulepreload" href="/_next/static/chunks/webpack.js" />
      <link rel="modulepreload" href="/_next/static/chunks/main.js" />
    </>
  );
}
