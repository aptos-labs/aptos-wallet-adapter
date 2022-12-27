const isProd = process.env.NODE_ENV === "production";

module.exports = {
  reactStrictMode: true,
  assetPrefix: isProd ? "/aptos-wallet-adapter" : "",
  basePath: isProd ? "/aptos-wallet-adapter" : "",
  images: { unoptimized: true },
  experimental: {
    transpilePackages: ["wallet-adapter-react", "wallet-adapter-plugin"],
  },
};
