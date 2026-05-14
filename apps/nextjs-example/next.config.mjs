/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@aptos-labs/wallet-adapter-react",
    "@aptos-labs/wallet-adapter-core",
    "@aptos-labs/wallet-adapter-ant-design",
    "@aptos-labs/wallet-adapter-mui-design",
  ],
  webpack: (config) => {
    config.resolve.fallback = { "@solana/web3.js": false };
    return config;
  },
};

export default nextConfig;
