/**
 * Type declarations for optional polyfill packages
 * These packages are loaded dynamically and may not be installed
 */

declare module "intersection-observer" {
  // IntersectionObserver polyfill - no exports needed, it's a global polyfill
}

declare module "@juggle/resize-observer" {
  export class ResizeObserver {
    constructor(callback: ResizeObserverCallback);
    observe(target: Element, options?: ResizeObserverOptions): void;
    unobserve(target: Element): void;
    disconnect(): void;
  }
}

declare module "web-animations-js" {
  // Web Animations API polyfill - no exports needed, it's a global polyfill
}

declare module "css-vars-ponyfill" {
  interface CSSVarsOptions {
    include?: string;
    onlyLegacy?: boolean;
    watch?: boolean;
    variables?: Record<string, string>;
    onlyVars?: boolean;
    preserve?: boolean;
    silent?: boolean;
    updateDOM?: boolean;
    updateURLs?: boolean;
  }

  function cssVars(options?: CSSVarsOptions): void;
  export default cssVars;
}
