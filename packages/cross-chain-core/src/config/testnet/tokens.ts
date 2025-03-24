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

export const AptosTestnetUSDCToken: TokenConfig = {
  symbol: "USDC",
  decimals: 6,
  tokenId: {
    chain: "Aptos",
    address:
      "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832",
  },
  icon: "USDC",
};
