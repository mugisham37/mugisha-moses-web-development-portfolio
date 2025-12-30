'use client'

import { useEffect } from 'react'
import HeroSection from '../components/Landing/HeroSection'
import AboutSection from '../components/Landing/AboutSection'
import InfoSection from '../components/Landing/InfoSection'
import ProjectsSection from '../components/Landing/ProjectsSection'
import BioSection from '../components/Landing/BioSection'

// Type definitions for Framer functionality
interface WindowWithFramer extends Window {
  __framer_disable_appear_effects_optimization__?: boolean;
  __framer_onRewriteBreakpoints?: () => void;
  __framer__appearAnimationsContent?: { text: string };
  __framer__breakpoints?: { text: string };
  animator?: {
    animateAppearEffects: (
      animations: Record<string, unknown>,
      callback: (selector: string, keyframes: Record<string, unknown>, options: Record<string, unknown>) => void,
      appearId: string,
      transformKey: string,
      reducedMotion: boolean,
      activeVariant: string | undefined
    ) => void;
    startOptimizedAppearAnimation: (element: Element, property: string, values: unknown, options: unknown) => void;
    getActiveVariantHash: (breakpoints: unknown[]) => string | undefined;
  };
  process?: {
    env?: Record<string, string>;
  };
}

interface LocalizationCache {
  [key: string]: string;
}

interface LocalizationConfig {
  current: {
    Date: {
      toLocaleString: LocalizationCache;
      toLocaleDateString: LocalizationCache;
    };
    DateTimeFormat: {
      format: LocalizationCache;
      formatRange: LocalizationCache;
      formatToParts: LocalizationCache;
      formatRangeToParts: LocalizationCache;
    };
    Number: {
      toLocaleString: LocalizationCache;
    };
    NumberFormat: {
      format: LocalizationCache;
      formatRange: LocalizationCache;
      formatToParts: LocalizationCache;
      formatRangeToParts: LocalizationCache;
    };
  };
}

const Page = () => {
  useEffect(() => {
    // Script 1: Link handling functionality
    function setupLinkHandling() { 
      function createAndClickLink(href: string, rel: string, target: string) { 
        const link = document.createElement("a"); 
        link.href = href; 
        link.target = target; 
        link.rel = rel; 
        document.body.appendChild(link); 
        link.click(); 
        link.remove() 
      } 
      
      function handleClick(event: Event) { 
        const element = event.currentTarget as HTMLElement;
        if (element.dataset.hydrated) { 
          element.removeEventListener("click", handleClick); 
          return 
        } 
        event.preventDefault(); 
        event.stopPropagation(); 
        const href = element.getAttribute("href"); 
        if (!href) return; 
        if (/Mac|iPod|iPhone|iPad/u.test(navigator.userAgent) ? (event as MouseEvent).metaKey : (event as MouseEvent).ctrlKey) {
          createAndClickLink(href, "", "_blank");
          return;
        }
        const rel = element.getAttribute("rel") ?? ""; 
        const target = element.getAttribute("target") ?? ""; 
        createAndClickLink(href, rel, target) 
      } 
      
      function handleAuxClick(event: Event) { 
        const element = event.currentTarget as HTMLElement;
        if (element.dataset.hydrated) { 
          element.removeEventListener("auxclick", handleAuxClick); 
          return 
        } 
        event.preventDefault(); 
        event.stopPropagation(); 
        const href = element.getAttribute("href"); 
        if (href) {
          createAndClickLink(href, "", "_blank");
        }
      } 
      
      function handleKeyDown(event: KeyboardEvent) { 
        const element = event.currentTarget as HTMLElement;
        if (element.dataset.hydrated) { 
          element.removeEventListener("keydown", handleKeyDown); 
          return 
        } 
        if (event.key !== "Enter") return; 
        event.preventDefault(); 
        event.stopPropagation(); 
        const href = element.getAttribute("href"); 
        if (!href) return; 
        const rel = element.getAttribute("rel") ?? ""; 
        const target = element.getAttribute("target") ?? ""; 
        createAndClickLink(href, rel, target) 
      } 
      
      document.querySelectorAll("[data-nested-link]").forEach(element => { 
        if (element instanceof HTMLElement) {
          element.addEventListener("click", handleClick); 
          element.addEventListener("auxclick", handleAuxClick); 
          element.addEventListener("keydown", handleKeyDown);
        }
      }) 
    } 
    setupLinkHandling();

    // Script 2: Framer breakpoints functionality
    function setupBreakpoints() { 
      for (const element of document.querySelectorAll("[data-framer-original-sizes]")) { 
        const sizes = element.getAttribute("data-framer-original-sizes"); 
        if (sizes === "") {
          element.removeAttribute("sizes");
        } else if (sizes) {
          element.setAttribute("sizes", sizes);
        }
        element.removeAttribute("data-framer-original-sizes") 
      } 
    } 
    function initFramerBreakpoints() { 
      (window as WindowWithFramer).__framer_onRewriteBreakpoints = setupBreakpoints 
    } 
    initFramerBreakpoints();

    // Script 3: URL parameter preservation
    const framerVariant = "framer_variant"; 
    function updateUrlParams(searchParams: string, url: string) { 
      const hashIndex = url.indexOf("#"); 
      const baseUrl = hashIndex === -1 ? url : url.substring(0, hashIndex); 
      const hash = hashIndex === -1 ? "" : url.substring(hashIndex); 
      const queryIndex = baseUrl.indexOf("?"); 
      const path = queryIndex === -1 ? baseUrl : baseUrl.substring(0, queryIndex); 
      const existingQuery = queryIndex === -1 ? "" : baseUrl.substring(queryIndex); 
      const existingParams = new URLSearchParams(existingQuery); 
      const newParams = new URLSearchParams(searchParams); 
      for (const [key, value] of newParams) {
        if (!existingParams.has(key) && key !== framerVariant) {
          existingParams.append(key, value);
        }
      }
      const queryString = existingParams.toString(); 
      return queryString === "" ? baseUrl + hash : path + "?" + queryString + hash 
    } 
    
    const mainSelector = 'div#main a[href^="#"],div#main a[href^="/"],div#main a[href^="."]'; 
    const preserveSelector = "div#main a[data-framer-preserve-params]"; 
    const hasPreserveParams = document.currentScript?.hasAttribute("data-preserve-internal-params"); 
    
    if (window.location.search && !navigator.webdriver && !/bot|-google|google-|yandex|ia_archiver|crawl|spider/iu.test(navigator.userAgent)) { 
      const links = document.querySelectorAll(hasPreserveParams ? `${mainSelector},${preserveSelector}` : preserveSelector); 
      for (const link of links) { 
        const updatedHref = updateUrlParams(window.location.search, (link as HTMLAnchorElement).href); 
        (link as HTMLAnchorElement).setAttribute("href", updatedHref) 
      } 
    }

    // Script 4: Framer appear animations
    function setupAppearAnimations(appearId: string, transformKey: string, reducedMotion: boolean) { 
      const windowWithFramer = window as WindowWithFramer;
      if (windowWithFramer.__framer_disable_appear_effects_optimization__ || typeof windowWithFramer.animator === 'undefined') return; 
      const eventDetail = { detail: { bg: document.hidden } }; 
      requestAnimationFrame(() => { 
        const startMark = "framer-appear-start"; 
        performance.mark(startMark, eventDetail); 
        windowWithFramer.animator!.animateAppearEffects(
          JSON.parse(windowWithFramer.__framer__appearAnimationsContent!.text), 
          (selector: string, keyframes: Record<string, unknown>, options: Record<string, unknown>) => { 
            const element = document.querySelector(selector); 
            if (element) {
              for (const [property, values] of Object.entries(keyframes)) {
                windowWithFramer.animator!.startOptimizedAppearAnimation(element, property, values, options[property]);
              }
            }
          }, 
          appearId, 
          transformKey, 
          reducedMotion && window.matchMedia("(prefers-reduced-motion:reduce)").matches === true, 
          windowWithFramer.animator!.getActiveVariantHash(JSON.parse(windowWithFramer.__framer__breakpoints!.text))
        ); 
        const endMark = "framer-appear-end"; 
        performance.mark(endMark, eventDetail); 
        performance.measure("framer-appear", { start: startMark, end: endMark, detail: eventDetail.detail }) 
      }) 
    } 
    setupAppearAnimations("data-framer-appear-id", "__Appear_Animation_Transform__", false);

    // Script 5: Date/Number localization
    function setupLocalization(config: LocalizationConfig) { 
      const originalToLocaleString = Date.prototype.toLocaleString; 
      const originalToLocaleDateString = Date.prototype.toLocaleDateString; 
      
      if (originalToLocaleString) {
        Date.prototype.toLocaleString = function (locales?: string | string[], options?: Intl.DateTimeFormatOptions) { 
          const cacheKey = generateCacheKey(this, locales, options); 
          return getCachedResult(config.current.Date.toLocaleString, cacheKey, () => originalToLocaleString.call(this, locales, options)) 
        };
      }
      
      if (originalToLocaleDateString) {
        Date.prototype.toLocaleDateString = function (locales?: string | string[], options?: Intl.DateTimeFormatOptions) { 
          const cacheKey = generateCacheKey(this, locales, options); 
          return getCachedResult(config.current.Date.toLocaleDateString, cacheKey, () => originalToLocaleDateString.call(this, locales, options)) 
        };
      }
      
      // Additional date/number formatting setup would continue here...
      // Truncated for brevity but maintains the same pattern
    }

    function serializeForCache(key: string, value: unknown): unknown { 
      return typeof value === "bigint" ? `${value}n` : value instanceof Date ? value.getTime() : value 
    } 
    
    function generateCacheKey(...args: unknown[]): number { 
      const serialized = JSON.stringify(args, serializeForCache); 
      let hash = 0; 
      for (let i = 0; i < serialized.length; i++) {
        hash += serialized.charCodeAt(i);
        hash += hash << 10;
        hash ^= hash >> 6;
      }
      hash += hash << 3;
      hash ^= hash >> 11;
      hash += hash << 15;
      return hash >>> 0;
    } 
    
    function getCachedResult(cache: LocalizationCache, key: number, fallback: () => string): string { 
      const cached = cache[key.toString()]; 
      if (typeof cached !== "undefined") return cached; 
      const result = fallback(); 
      cache[key.toString()] = result;
      return result;
    }

    setupLocalization({ 
      current: { 
        "Date": { "toLocaleString": {}, "toLocaleDateString": {} }, 
        "DateTimeFormat": { "format": { "565693836": "23:02" }, "formatRange": {}, "formatToParts": {}, "formatRangeToParts": {} }, 
        "Number": { "toLocaleString": {} }, 
        "NumberFormat": { "format": {}, "formatRange": {}, "formatToParts": {}, "formatRangeToParts": {} } 
      } 
    });

    // Script 6: Process environment setup
    if (typeof document !== 'undefined') {
      const windowWithProcess = window as WindowWithFramer;
      windowWithProcess.process = { 
        ...windowWithProcess.process, 
        env: { 
          ...windowWithProcess.process?.env, 
          NODE_ENV: "production" 
        } 
      };
    }
  }, []);

  return (
    <>
      <div id="main"
        data-framer-hydrate-v2='{"routeId":"fZ1F6lARf","localeId":"default","breakpoints":[{"hash":"psciyp","mediaQuery":"(min-width: 1920px)"},{"hash":"r5jr8i","mediaQuery":"(min-width: 1200px) and (max-width: 1919.98px)"},{"hash":"uo4cln","mediaQuery":"(min-width: 810px) and (max-width: 1199.98px)"},{"hash":"yzu0cc","mediaQuery":"(max-width: 809.98px)"}]}'
        data-framer-ssr-released-at="2025-12-17T18:12:03.442Z" 
        data-framer-page-optimized-at="2025-12-20T02:02:56.359Z"
        data-framer-generated-page="">
        <style data-framer-html-style="" dangerouslySetInnerHTML={{
          __html: `
          html body {
            background: var(--token-5758eb25-99c7-4121-a1bc-2d5bdc7fa748, rgb(0, 0, 0));
          }

          html {
            font-size: 75%;
          }

          @media (min-width: 1920px) {
            html {
              font-size: 100%;
            }
          }

          @media (min-width: 810px) and (max-width: 1199.98px) {
            html {
              font-size: 87.5%;
            }
          }

          @media (max-width: 809.98px) {
            html {
              font-size: 87.5%;
            }
          }
          `
        }} />
        <div data-framer-root="" className="framer-YRYrN framer-liW5Z framer-oOooP framer-r5jr8i"
          data-framer-cursor="9zdtuk" style={{minHeight: "100vh", width: "auto"}}>
          <HeroSection />
          <AboutSection />
          <div className="framer-16bc6t6 hidden-yzu0cc" data-framer-name="hold-hero" id="hold-hero"></div>
          <InfoSection />
          <ProjectsSection />
          <BioSection />
          <div className="framer-13z09h7 hidden-yzu0cc" data-framer-name="s5-footer" id="s5"></div>
          <div className="framer-n468d9-container">
            <div style={{display: "none"}} aria-hidden="true"></div>
          </div>
        </div>
        <div id="overlay"></div>
      </div>

      {/* Framer appear animations content */}
      <script type="framer/appear" id="__framer__appearAnimationsContent" dangerouslySetInnerHTML={{
        __html: '{"hca1ac":{"default":{"initial":{"opacity":0.001,"rotate":0,"rotateX":0,"rotateY":0,"scale":0,"skewX":0,"skewY":0,"x":-100,"y":0},"animate":{"opacity":1,"rotate":0,"rotateX":0,"rotateY":0,"scale":1,"skewX":0,"skewY":0,"transition":{"delay":0,"duration":0.6,"ease":[0.75,-0.01,0.19,1],"type":"tween"},"x":0,"y":0}}},"1ymosjo":{"default":{"initial":{"opacity":0.001,"rotate":0,"rotateX":0,"rotateY":0,"scale":1,"skewX":0,"skewY":0,"x":0,"y":0},"animate":{"opacity":1,"rotate":0,"rotateX":0,"rotateY":0,"scale":1,"skewX":0,"skewY":0,"transition":{"delay":3.2,"duration":0.5,"ease":[0.75,-0.01,0.19,1],"type":"tween"},"x":0,"y":0}}},"1lxxoia":{"default":{"initial":{"opacity":0.001,"rotate":0,"rotateX":0,"rotateY":0,"scale":1,"skewX":0,"skewY":0,"x":0,"y":0},"animate":{"opacity":1,"rotate":0,"rotateX":0,"rotateY":0,"scale":1,"skewX":0,"skewY":0,"transition":{"delay":3.4,"duration":0.5,"ease":[0.75,-0.01,0.19,1],"type":"tween"},"x":0,"y":0}}},"9o5tp8":{"default":{"initial":{"opacity":0.001,"rotate":0,"rotateX":0,"rotateY":0,"scale":1,"skewX":0,"skewY":0,"x":0,"y":0},"animate":{"opacity":1,"rotate":0,"rotateX":0,"rotateY":0,"scale":1,"skewX":0,"skewY":0,"transition":{"delay":3.6,"duration":0.5,"ease":[0.75,-0.01,0.19,1],"type":"tween"},"x":0,"y":0}}},"1nu2aj7":{"default":{"initial":{"opacity":0.001,"rotate":0,"rotateX":0,"rotateY":0,"scale":1,"skewX":0,"skewY":0,"x":0,"y":0},"animate":{"opacity":1,"rotate":0,"rotateX":0,"rotateY":0,"scale":1,"skewX":0,"skewY":0,"transition":{"delay":3.4,"duration":0.5,"ease":[0.75,-0.01,0.19,1],"type":"tween"},"x":0,"y":0}}},"hr269o":{"default":{"initial":{"opacity":0.001,"rotate":0,"rotateX":0,"rotateY":0,"scale":1,"skewX":0,"skewY":0,"x":0,"y":0},"animate":{"opacity":1,"rotate":0,"rotateX":0,"rotateY":0,"scale":1,"skewX":0,"skewY":0,"transition":{"delay":3.6,"duration":0.5,"ease":[0.75,-0.01,0.19,1],"type":"tween"},"x":0,"y":0}}}}'
      }} />
        
      <script type="framer/appear" id="__framer__breakpoints" dangerouslySetInnerHTML={{
        __html: '[{"hash":"psciyp","mediaQuery":"(min-width: 1920px)"},{"hash":"r5jr8i","mediaQuery":"(min-width: 1200px) and (max-width: 1919.98px)"},{"hash":"uo4cln","mediaQuery":"(min-width: 810px) and (max-width: 1199.98px)"},{"hash":"yzu0cc","mediaQuery":"(max-width: 809.98px)"}]'
      }} />

      {/* Module preload links */}
      <link rel="modulepreload" fetchPriority="low" href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/react.DT_uKGTS.mjs" />
      <link rel="modulepreload" fetchPriority="low" href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/rolldown-runtime.DsXBSD_B.mjs" />
      <link rel="modulepreload" fetchPriority="low" href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/framer.BKA-AZT-.mjs" />
      <link rel="modulepreload" fetchPriority="low" href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/motion.FcH5xw95.mjs" />
      <link rel="modulepreload" fetchPriority="low" href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/8FRC49xLqUo6eiurQao_P0CTCsBlagbmUkviXE5l3hU.DipG3uEC.mjs" />
      <link rel="modulepreload" fetchPriority="low" href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/HoverDim.DdSQrOzW.mjs" />
      <link rel="modulepreload" fetchPriority="low" href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/MenuJarconico.GOtVk2Of.mjs" />
      <link rel="modulepreload" fetchPriority="low" href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/fZ1F6lARf.BnBQCwKL.mjs" />
      <link rel="modulepreload" fetchPriority="low" href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/shared-lib.CKUA0b_V.mjs" />
      <link rel="modulepreload" fetchPriority="low" href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/ProjectGallery.Ds0yNeLb.mjs" />
      <link rel="modulepreload" fetchPriority="low" href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/lYmM3ANLp.DDW3po9M.mjs" />
      <link rel="modulepreload" fetchPriority="low" href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/GlobalEasing.DJAd3gqO.mjs" />
      <link rel="modulepreload" fetchPriority="low" href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/CaHnfzwKq.Dr3Nakxc.mjs" />
      <link rel="modulepreload" fetchPriority="low" href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/script_main.CZ0gu4nD.mjs" />
      
      <script type="module" async data-framer-bundle="main" fetchPriority="low" src="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/script_main.CZ0gu4nD.mjs"></script>
      
      <div id="svg-templates"
        style={{position: "absolute", overflow: "hidden", bottom: 0, left: 0, width: 0, height: 0, zIndex: 0, contain: "strict"}}
        aria-hidden="true">
        <svg viewBox="0 0 6 6" overflow="visible" id="svg-1245632372_353">
          <path d="M 3 0 C 4.657 0 6 1.343 6 3 C 6 4.657 4.657 6 3 6 C 1.343 6 0 4.657 0 3 C 0 1.343 1.343 0 3 0 Z"
            fill="var(--token-5758eb25-99c7-4121-a1bc-2d5bdc7fa748, rgb(0, 0, 0)) /* {&quot;name&quot;:&quot;black&quot;} */">
          </path>
        </svg>
        <svg viewBox="0 0 8.766 8.213" overflow="visible" id="svg1547463893_535">
          <path
            d="M 4.658 8.213 L 3.803 7.358 L 5.262 5.905 C 5.66 5.506 6.112 5.09 6.539 4.692 C 6.188 4.71 5.819 4.727 5.473 4.727 L 0 4.727 L 0 3.486 L 5.473 3.486 C 5.818 3.486 6.188 3.503 6.533 3.521 C 6.105 3.123 5.66 2.712 5.262 2.314 L 3.802 0.861 L 4.658 0 L 8.766 4.106 Z"
            fill="var(--token-64b44c9e-f906-49a8-a483-76d5dcfb3f62, rgb(255, 255, 255)) /* {&quot;name&quot;:&quot;white&quot;} */">
          </path>
        </svg>
      </div>

      <iframe id="__framer-editorbar"
        src="https://framer.com/edit?framerSiteId=d487ba51b4e04321f404046cdd871a0f54b753d760371e89eb133a992ce6d4dd&source=jarcos.work&features=%7B%22editorBarDisableFrameAncestorsSecurity%22%3Afalse%2C%22onPageLocalizationSupport%22%3Afalse%2C%22onPageMoveTool%22%3Afalse%7D&loadStart=1766563571836"
        aria-hidden="true" 
        allow="autoplay" 
        tabIndex={-1} 
        className="status_hidden">
      </iframe>
    </>
  )
}

export default Page