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

export const AptosMainnetUSDCToken: TokenConfig = {
  symbol: "USDC",
  tokenId: {
    chain: "Aptos",
    address:
      "0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b",
  },
  icon: "USDC",
  decimals: 6,
};
