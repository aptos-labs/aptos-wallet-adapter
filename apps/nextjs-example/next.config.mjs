const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  transpilePackages: [
    "wallet-adapter-react",
    "wallet-adapter-plugin",
    "@aptos-labs/wallet-adapter-ant-design",
  ],
  assetPrefix: isProd ? "/aptos-wallet-adapter" : "",
  basePath: isProd ? "/aptos-wallet-adapter" : "",
  // Turbopack configuration (Next.js 16+)
  turbopack: {
    resolveExtensions: [".css", ".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  webpack: (config) => {
    config.resolve.fallback = { "@solana/web3.js": false };
    return config;
  },
};

export default nextConfig;
