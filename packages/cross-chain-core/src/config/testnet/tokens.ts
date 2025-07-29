import { TokenConfig } from "../types";

export const testnetTokens: Record<string, TokenConfig> = {
  Sepolia: {
    symbol: "USDC",
    icon: "USDC",
    decimals: 6,
    tokenId: {
      chain: "Sepolia",
      address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    },
  },
  Solana: {
    symbol: "USDC",
    tokenId: {
      chain: "Solana",
      address: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
    },
    icon: "USDC",
    decimals: 6,
  },
  Aptos: {
    symbol: "USDC",
    decimals: 6,
    tokenId: {
      chain: "Aptos",
      address:
        "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832",
    },
    icon: "USDC",
  },
  BaseSepolia: {
    symbol: "USDC",
    icon: "USDC",
    decimals: 6,
    tokenId: {
      chain: "BaseSepolia",
      address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    },
  },
  Avalanche: {
    symbol: "USDC",
    icon: "USDC",
    decimals: 6,
    tokenId: {
      chain: "Avalanche",
      address: "0x5425890298aed601595a70AB815c96711a31Bc65",
    },
  },
  ArbitrumSepolia: {
    symbol: "USDC",
    icon: "USDC",
    decimals: 6,
    tokenId: {
      chain: "ArbitrumSepolia",
      address: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
    },
  },
  PolygonSepolia: {
    symbol: "USDC",
    icon: "USDC",
    decimals: 6,
    tokenId: {
      chain: "PolygonSepolia",
      address: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
    },
  },
  // Sui: {
  //   symbol: "USDC",
  //   tokenId: {
  //     chain: "Sui",
  //     address:
  //       "0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC",
  //   },
  //   icon: "USDC",
  //   decimals: 6,
  // },
};
