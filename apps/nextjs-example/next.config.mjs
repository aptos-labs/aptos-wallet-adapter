const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  assetPrefix: isProd ? "/aptos-wallet-adapter" : "",
  basePath: isProd ? "/aptos-wallet-adapter" : "",
  images: { unoptimized: true },
  transpilePackages: ["wallet-adapter-react", "wallet-adapter-plugin"],
  webpack: (config) => {
    config.resolve.fallback = { "@solana/web3.js": false };
    return config;
  },
};

export default nextConfig;
