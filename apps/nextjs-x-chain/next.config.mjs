/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@aptos-labs/wallet-adapter-react",
    "@aptos-labs/wallet-adapter-core",
    "@aptos-labs/wallet-adapter-mui-design",
    "@aptos-labs/cross-chain-core",
  ],
  webpack: (config, { isServer }) => {
    // Only apply fallback on client-side
    if (!isServer) {
      config.resolve.fallback = { "@solana/web3.js": false };
    }
    return config;
  },
};

export default nextConfig;