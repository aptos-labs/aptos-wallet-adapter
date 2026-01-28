/**
 * Vitest setup file for wallet-adapter-core tests
 * Configures happy-dom environment and global mocks
 */

import { vi, beforeEach } from "vitest";

// Configure window.location for tests
if (typeof window !== "undefined") {
  Object.defineProperty(window, "location", {
    value: {
      host: "test.example.com",
      origin: "https://test.example.com",
      protocol: "https:",
      href: "https://test.example.com",
      hostname: "test.example.com",
      port: "",
      pathname: "/",
      search: "",
      hash: "",
    },
    writable: true,
    configurable: true,
  });
}

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Mock document.getElementsByTagName for GA4 script injection
if (typeof document !== "undefined") {
  const originalGetElementsByTagName = document.getElementsByTagName.bind(document);
  document.getElementsByTagName = vi.fn((tagName: string) => {
    if (tagName === "head") {
      return [
        {
          insertBefore: vi.fn(),
          children: [],
        },
      ] as any;
    }
    return originalGetElementsByTagName(tagName);
  });
}

// Reset mocks between tests
beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

