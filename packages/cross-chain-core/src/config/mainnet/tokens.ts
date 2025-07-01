import { TokenConfig } from "../types";

export const mainnetTokens: Record<string, TokenConfig> = {
  Ethereum: {
    symbol: "USDC",
    tokenId: {
      chain: "Ethereum",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    icon: "USDC",
    decimals: 6,
  },
  Solana: {
    symbol: "USDC",
    tokenId: {
      chain: "Solana",
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
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
        "0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b",
    },
    icon: "USDC",
  },
  Base: {
    symbol: "USDC",
    decimals: 6,
    icon: "USDC",
    tokenId: {
      chain: "Base",
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    },
  },
  Arbitrum: {
    symbol: "USDC",
    decimals: 6,
    icon: "USDC",
    tokenId: {
      chain: "Arbitrum",
      address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    },
  },
  Avalanche: {
    symbol: "USDC",
    decimals: 6,
    icon: "USDC",
    tokenId: {
      chain: "Avalanche",
      address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    },
  },
  Polygon: {
    symbol: "USDC",
    decimals: 6,
    icon: "USDC",
    tokenId: {
      chain: "Polygon",
      address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    },
  },
  // Sui: {
  //   symbol: "USDC",
  //   decimals: 6,
  //   tokenId: {
  //     chain: "Sui",
  //     address:
  //       "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
  //   },
  //   icon: "USDC",
  // },
};
