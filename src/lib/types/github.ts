// GitHub API type definitions

export interface GitHubError {
  status?: number;
  message?: string;
  response?: {
    headers?: {
      "x-ratelimit-remaining"?: string;
      "x-ratelimit-reset"?: string;
    };
  };
}

export interface NetworkInformation extends EventTarget {
  effectiveType?: string;
  downlink?: number;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
}

export interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

export interface CacheItem<T = unknown> {
  data: T;
  timestamp: number;
  expires: number;
}

export interface StorageItem {
  data: unknown;
  timestamp: number;
  size: number;
}
