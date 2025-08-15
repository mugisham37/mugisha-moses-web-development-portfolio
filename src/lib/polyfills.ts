/**
 * Polyfills for Cross-Browser Compatibility
 * Provides essential polyfills for older browsers and missing features
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-this-alias */

/**
 * CSS.supports polyfill for older browsers
 */
if (typeof window !== "undefined" && (!window.CSS || !window.CSS.supports)) {
  window.CSS = window.CSS || {};
  window.CSS.supports = function (property: string, value?: string): boolean {
    const element = document.createElement("div");

    if (value) {
      // Test property-value pair
      try {
        const style = element.style as any;
        style[property] = value;
        return style[property] === value;
      } catch {
        return false;
      }
    } else {
      // Test property only
      return property in element.style;
    }
  };
}

/**
 * Object.assign polyfill for IE
 */
if (typeof Object.assign !== "function") {
  Object.assign = function (
    target: Record<string, unknown>,
    ...sources: Record<string, unknown>[]
  ) {
    if (target == null) {
      throw new TypeError("Cannot convert undefined or null to object");
    }

    const to = Object(target);

    for (let index = 0; index < sources.length; index++) {
      const nextSource = sources[index];

      if (nextSource != null) {
        for (const nextKey in nextSource) {
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}

/**
 * Array.from polyfill for IE
 */
if (!Array.from) {
  Array.from = function <T, U = T>(
    arrayLike: ArrayLike<T>,
    mapFn?: (v: T, k: number) => U,
    thisArg?: unknown
  ): U[] {
    const C = this;
    const items = Object(arrayLike);

    if (arrayLike == null) {
      throw new TypeError(
        "Array.from requires an array-like object - not null or undefined"
      );
    }

    const mapFunction = mapFn === undefined ? undefined : mapFn;
    if (
      typeof mapFunction !== "undefined" &&
      typeof mapFunction !== "function"
    ) {
      throw new TypeError(
        "Array.from: when provided, the second argument must be a function"
      );
    }

    const len = parseInt(items.length) || 0;
    const A = typeof C === "function" ? Object(new C(len)) : new Array(len);

    let k = 0;
    let kValue;
    while (k < len) {
      kValue = items[k];
      if (mapFunction) {
        A[k] =
          typeof thisArg === "undefined"
            ? mapFunction(kValue, k)
            : mapFunction.call(thisArg, kValue, k);
      } else {
        A[k] = kValue;
      }
      k += 1;
    }
    A.length = len;
    return A;
  };
}

/**
 * Array.includes polyfill for IE
 */
if (!Array.prototype.includes) {
  Array.prototype.includes = function <T>(
    this: T[],
    searchElement: T,
    fromIndex?: number
  ): boolean {
    const O = Object(this);
    const len = parseInt(String(O.length)) || 0;
    if (len === 0) return false;

    const n = parseInt(String(fromIndex)) || 0;
    let k = n >= 0 ? n : Math.max(len + n, 0);

    function sameValueZero(x: unknown, y: unknown): boolean {
      return (
        x === y ||
        (typeof x === "number" && typeof y === "number" && isNaN(x) && isNaN(y))
      );
    }

    while (k < len) {
      if (sameValueZero(O[k], searchElement)) {
        return true;
      }
      k++;
    }
    return false;
  };
}

/**
 * String.includes polyfill for IE
 */
if (!String.prototype.includes) {
  String.prototype.includes = function (
    search: string,
    start?: number
  ): boolean {
    if (typeof start !== "number") {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

/**
 * String.startsWith polyfill for IE
 */
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (
    searchString: string,
    position?: number
  ): boolean {
    position = position || 0;
    return this.substr(position, searchString.length) === searchString;
  };
}

/**
 * String.endsWith polyfill for IE
 */
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (
    searchString: string,
    length?: number
  ): boolean {
    if (length === undefined || length > this.length) {
      length = this.length;
    }
    return (
      this.substring(length - searchString.length, length) === searchString
    );
  };
}

/**
 * Promise polyfill for IE
 */
if (typeof window !== "undefined" && typeof Promise === "undefined") {
  // Simple Promise polyfill
  (window as any).Promise = class SimplePromise {
    private state: "pending" | "fulfilled" | "rejected" = "pending";
    private value: any;
    private handlers: Array<{
      onFulfilled?: Function;
      onRejected?: Function;
      resolve: Function;
      reject: Function;
    }> = [];

    constructor(executor: (resolve: Function, reject: Function) => void) {
      try {
        executor(this.resolve.bind(this), this.reject.bind(this));
      } catch (error) {
        this.reject(error);
      }
    }

    private resolve(value: any): void {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
        this.handlers.forEach(this.handle.bind(this));
        this.handlers = [];
      }
    }

    private reject(reason: any): void {
      if (this.state === "pending") {
        this.state = "rejected";
        this.value = reason;
        this.handlers.forEach(this.handle.bind(this));
        this.handlers = [];
      }
    }

    private handle(handler: any): void {
      if (this.state === "pending") {
        this.handlers.push(handler);
      } else {
        if (
          this.state === "fulfilled" &&
          typeof handler.onFulfilled === "function"
        ) {
          handler.onFulfilled(this.value);
        }
        if (
          this.state === "rejected" &&
          typeof handler.onRejected === "function"
        ) {
          handler.onRejected(this.value);
        }
      }
    }

    then(onFulfilled?: Function, onRejected?: Function): SimplePromise {
      return new SimplePromise((resolve, reject) => {
        this.handle({
          onFulfilled: (value: any) => {
            if (!onFulfilled) {
              resolve(value);
            } else {
              try {
                resolve(onFulfilled(value));
              } catch (error) {
                reject(error);
              }
            }
          },
          onRejected: (reason: any) => {
            if (!onRejected) {
              reject(reason);
            } else {
              try {
                resolve(onRejected(reason));
              } catch (error) {
                reject(error);
              }
            }
          },
          resolve,
          reject,
        });
      });
    }

    catch(onRejected: Function): SimplePromise {
      return this.then(undefined, onRejected);
    }

    static resolve(value: any): SimplePromise {
      return new SimplePromise((resolve) => resolve(value));
    }

    static reject(reason: any): SimplePromise {
      return new SimplePromise((_, reject) => reject(reason));
    }

    static all(promises: SimplePromise[]): SimplePromise {
      return new SimplePromise((resolve, reject) => {
        if (promises.length === 0) {
          resolve([]);
          return;
        }

        let remaining = promises.length;
        const results: any[] = [];

        promises.forEach((promise, index) => {
          promise.then((value: any) => {
            results[index] = value;
            remaining--;
            if (remaining === 0) {
              resolve(results);
            }
          }, reject);
        });
      });
    }
  };
}

/**
 * fetch polyfill for IE
 */
if (typeof window !== "undefined" && !window.fetch) {
  window.fetch = function (
    input: string | Request | URL,
    init?: RequestInit
  ): Promise<Response> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : (input as Request).url;
      const method = init?.method || "GET";
      const headers = init?.headers || {};
      const body = init?.body;

      xhr.open(method, url);

      // Set headers
      if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value as string);
        });
      }

      xhr.onload = () => {
        const response = {
          ok: xhr.status >= 200 && xhr.status < 300,
          status: xhr.status,
          statusText: xhr.statusText,
          headers: new Map(),
          text: () => Promise.resolve(xhr.responseText),
          json: () => Promise.resolve(JSON.parse(xhr.responseText)),
          blob: () => Promise.resolve(new Blob([xhr.response])),
          arrayBuffer: () => Promise.resolve(xhr.response),
        } as unknown as Response;

        resolve(response);
      };

      xhr.onerror = () => reject(new Error("Network error"));
      xhr.ontimeout = () => reject(new Error("Request timeout"));

      // Send with proper body handling
      if (body && typeof body === "string") {
        xhr.send(body);
      } else if (body instanceof FormData) {
        xhr.send(body);
      } else if (body instanceof URLSearchParams) {
        xhr.send(body.toString());
      } else {
        xhr.send(body as any);
      }
    });
  };
}

/**
 * CustomEvent polyfill for IE
 */
if (typeof window !== "undefined" && typeof window.CustomEvent !== "function") {
  function CustomEvent(event: string, params?: CustomEventInit): CustomEvent {
    params = params || { bubbles: false, cancelable: false, detail: null };
    const evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(
      event,
      params.bubbles || false,
      params.cancelable || false,
      params.detail
    );
    return evt;
  }
  (window as any).CustomEvent = CustomEvent;
}

/**
 * Element.matches polyfill for IE
 */
if (typeof window !== "undefined" && !Element.prototype.matches) {
  Element.prototype.matches =
    (Element.prototype as any).matchesSelector ||
    (Element.prototype as any).mozMatchesSelector ||
    (Element.prototype as any).msMatchesSelector ||
    (Element.prototype as any).oMatchesSelector ||
    (Element.prototype as any).webkitMatchesSelector ||
    function (this: Element, s: string): boolean {
      const element = this as any;
      const matches = (
        element.document || element.ownerDocument
      ).querySelectorAll(s);
      let i = matches.length;
      while (--i >= 0 && matches.item(i) !== this) {}
      return i > -1;
    };
}

/**
 * Element.closest polyfill for IE
 */
if (typeof window !== "undefined" && !Element.prototype.closest) {
  Element.prototype.closest = function (
    this: Element,
    s: string
  ): Element | null {
    let el: Element | null = this;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || (el.parentNode as Element);
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

/**
 * NodeList.forEach polyfill for IE
 */
if (
  typeof window !== "undefined" &&
  window.NodeList &&
  !NodeList.prototype.forEach
) {
  NodeList.prototype.forEach = function <T extends Node>(
    this: NodeList,
    callback: (value: T, key: number, parent: NodeList) => void,
    thisArg?: any
  ): void {
    for (let i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i] as T, i, this);
    }
  };
}

/**
 * requestAnimationFrame polyfill for IE
 */
if (typeof window !== "undefined" && !window.requestAnimationFrame) {
  let lastTime = 0;
  window.requestAnimationFrame = function (
    callback: FrameRequestCallback
  ): number {
    const currTime = new Date().getTime();
    const timeToCall = Math.max(0, 16 - (currTime - lastTime));
    const id = window.setTimeout(() => {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}

if (typeof window !== "undefined" && !window.cancelAnimationFrame) {
  window.cancelAnimationFrame = function (id: number): void {
    clearTimeout(id);
  };
}

/**
 * Safe dynamic import helper
 */
async function safeDynamicImport(moduleName: string): Promise<any> {
  try {
    return await import(/* webpackIgnore: true */ moduleName);
  } catch {
    console.warn(
      `Module ${moduleName} not found. Install it with: npm install ${moduleName}`
    );
    return null;
  }
}

/**
 * IntersectionObserver polyfill loader
 */
export async function loadIntersectionObserverPolyfill(): Promise<void> {
  if (typeof window !== "undefined" && !("IntersectionObserver" in window)) {
    const polyfill = await safeDynamicImport("intersection-observer");
    if (polyfill) {
      console.log("IntersectionObserver polyfill loaded");
    }
  }
}

/**
 * ResizeObserver polyfill loader
 */
export async function loadResizeObserverPolyfill(): Promise<void> {
  if (typeof window !== "undefined" && !("ResizeObserver" in window)) {
    const polyfill = await safeDynamicImport("@juggle/resize-observer");
    if (polyfill?.ResizeObserver) {
      (window as any).ResizeObserver = polyfill.ResizeObserver;
      console.log("ResizeObserver polyfill loaded");
    }
  }
}

/**
 * Web Animations API polyfill loader
 */
export async function loadWebAnimationsPolyfill(): Promise<void> {
  if (
    typeof window !== "undefined" &&
    !("animate" in document.createElement("div"))
  ) {
    const polyfill = await safeDynamicImport("web-animations-js");
    if (polyfill) {
      console.log("Web Animations API polyfill loaded");
    }
  }
}

/**
 * CSS Custom Properties polyfill loader for IE
 */
export async function loadCSSCustomPropertiesPolyfill(): Promise<void> {
  // Check if CSS custom properties are supported
  if (typeof window !== "undefined" && !CSS.supports("--custom", "property")) {
    const polyfill = await safeDynamicImport("css-vars-ponyfill");
    if (polyfill?.default) {
      const cssVars = polyfill.default;
      cssVars({
        include: 'style,link[rel="stylesheet"]',
        onlyLegacy: false,
        watch: true,
        variables: {
          "--color-primary-black": "#000000",
          "--color-primary-white": "#ffffff",
          "--color-accent-yellow": "#ffff00",
          "--spacing-4": "1rem",
          "--spacing-8": "2rem",
          "--spacing-16": "4rem",
          "--font-size-base": "1rem",
          "--font-size-lg": "1.125rem",
          "--font-size-xl": "1.25rem",
          "--shadow-brutalist": "8px 8px 0px rgba(255, 255, 255, 0.1)",
          "--shadow-accent": "8px 8px 0px rgba(255, 255, 0, 0.3)",
        },
      });
      console.log("CSS Custom Properties polyfill loaded");
    }
  }
}

/**
 * Load all necessary polyfills
 */
export async function loadAllPolyfills(): Promise<void> {
  const polyfillPromises = [
    loadIntersectionObserverPolyfill(),
    loadResizeObserverPolyfill(),
    loadWebAnimationsPolyfill(),
    loadCSSCustomPropertiesPolyfill(),
  ];

  try {
    await Promise.all(polyfillPromises);
    console.log("All polyfills loaded successfully");
  } catch (error) {
    console.warn("Some polyfills failed to load:", error);
  }
}

/**
 * Initialize polyfills on page load
 */
export function initializePolyfills(): void {
  // Load polyfills asynchronously to avoid blocking
  loadAllPolyfills().catch((error) => {
    console.warn("Polyfill initialization failed:", error);
  });
}

// Auto-initialize polyfills if this module is imported
if (typeof window !== "undefined") {
  // Run polyfills immediately for critical features
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePolyfills);
  } else {
    initializePolyfills();
  }
}
