const isProd = process.env.NODE_ENV === "production";

module.exports = {
  reactStrictMode: true,
  assetPrefix: isProd ? "/aptos-wallet-adapter/standard-example" : "",
  basePath: isProd ? "/aptos-wallet-adapter/standard-example" : "",
  images: { unoptimized: true },
  experimental: {
    transpilePackages: ["wallet-adapter-react", "wallet-adapter-plugin"],
  },
};
