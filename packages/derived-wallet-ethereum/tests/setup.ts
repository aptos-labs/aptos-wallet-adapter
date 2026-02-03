/**
 * Vitest setup file for derived-wallet-ethereum tests
 * Configures happy-dom environment and global mocks
 */

// Configure window.location for tests that need it
// happy-dom provides this, but we can override specific values if needed
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
