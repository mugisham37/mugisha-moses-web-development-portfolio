// Type extensions for framer-motion to handle margin and offset types
declare module "framer-motion" {
  interface InViewOptions {
    margin?: string | number;
  }

  interface UseScrollOptions {
    offset?: [string, string] | string[];
  }
}

export {};
