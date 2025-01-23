export const mainnetChains = {
  Ethereum: {
    key: "Ethereum",
    id: 2,
    context: "Ethereum",
    finalityThreshold: 64,
    displayName: "Ethereum",
    explorerUrl: "https://etherscan.io/",
    explorerName: "Etherscan",
    gasToken: "ETH",
    chainId: 1,
    icon: "Ethereum",
    maxBlockSearch: 2000,
    symbol: "ETH",
  },
  Solana: {
    key: "Solana",
    id: 1,
    context: "Solana",
    finalityThreshold: 32,
    displayName: "Solana",
    explorerUrl: "https://explorer.solana.com/",
    explorerName: "Solana Explorer",
    gasToken: "SOL",
    chainId: 0,
    icon: "Solana",
    maxBlockSearch: 2000,
    symbol: "SOL",
  },
};

export const testnetChains = {
  // Ethereum: {
  //   key: "Ethereum",
  //   id: 2,
  //   context: "Ethereum",
  //   finalityThreshold: 64,
  //   displayName: "Ethereum",
  //   explorerUrl: "https://etherscan.io/",
  //   explorerName: "Etherscan",
  //   gasToken: "ETH",
  //   chainId: 1,
  //   icon: "Ethereum",
  //   maxBlockSearch: 2000,
  //   symbol: "ETH",
  // },
  Ethereum: {
    key: "BaseSepolia",
    id: 10004,
    context: "Ethereum",
    finalityThreshold: 0,
    displayName: "Ethereum",
    explorerUrl: "https://etherscan.io/",
    explorerName: "Etherscan",
    gasToken: "ETH",
    chainId: 1,
    icon: "Ethereum",
    maxBlockSearch: 2000,
    symbol: "ETH",
  },
  Solana: {
    key: "Solana",
    id: 1,
    context: "Solana",
    finalityThreshold: 32,
    displayName: "Solana",
    explorerUrl: "https://explorer.solana.com/",
    explorerName: "Solana Explorer",
    gasToken: "SOL",
    chainId: 0,
    icon: "Solana",
    maxBlockSearch: 2000,
    symbol: "SOL",
    sdkName: "Solana",
    wrappedGasToken: "So11111111111111111111111111111111111111112",
  },
};

export const mainnetChainTokens: Record<string, any> = {
  Ethereum: {
    key: "USDCeth",
    symbol: "USDC",
    nativeChain: "Ethereum",
    tokenId: {
      chain: "Ethereum",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    icon: "USDC",
    coinGeckoId: "usd-coin",
    color: "#ffffff",
    decimals: 6,
  },
  Solana: {
    key: "USDCsol",
    symbol: "USDC",
    nativeChain: "Solana",
    tokenId: {
      chain: "Solana",
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    },
    icon: "USDC",
    coinGeckoId: "usd-coin",
    color: "#2774CA",
    decimals: 6,
  },
};

export const testnetChainTokens: Record<string, any> = {
  Ethereum: {
    symbol: "USDC",
    decimals: 6,
    tokenId: {
      chain: "Sepolia",
      address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    },
    icon: "USDC",
  },
  // Ethereum: {
  //   symbol: "USDC",
  //   icon: "USDC",
  //   decimals: 6,
  //   tokenId: {
  //     chain: "Avalanche",
  //     address: "0x5425890298aed601595a70AB815c96711a31Bc65",
  //   },
  // },
  Solana: {
    symbol: "USDC",
    tokenId: {
      chain: "Solana",
      address: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
    },
    icon: "USDC",
    decimals: 6,
  },
};

export const AptosMainnetUSDCToken = {
  USDCapt: {
    key: "USDCapt",
    symbol: "USDC",
    nativeChain: "Aptos",
    tokenId: {
      chain: "Aptos",
      address:
        "0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b",
    },
    icon: "USDC",
    coinGeckoId: "usd-coin",
    color: "#2774CA",
    decimals: 6,
  },
};

export const AptosTestnetUSDCToken = {
  USDCapt: {
    symbol: "USDC",
    decimals: 6,
    tokenId: {
      chain: "Aptos",
      address:
        "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832",
    },
    icon: "USDC",
  },
};

export const AptosMainnetChain = {
  Aptos: {
    key: "Aptos",
    id: 22,
    context: "Aptos",
    finalityThreshold: 0,
    displayName: "Aptos",
    explorerUrl: "https://explorer.aptoslabs.com/",
    explorerName: "Aptos Explorer",
    gasToken: "APT",
    chainId: 0,
    icon: "Aptos",
    maxBlockSearch: 0,
    symbol: "APT",
  },
};

export const AptosTestnetChain = {
  Aptos: {
    key: "Aptos",
    id: 22,
    context: "Aptos",
    finalityThreshold: 0,
    displayName: "Aptos",
    explorerUrl: "https://explorer.aptoslabs.com/",
    explorerName: "Aptos Explorer",
    gasToken: "APT",
    chainId: 0,
    icon: "Aptos",
    maxBlockSearch: 0,
    symbol: "APT",
    sdkName: "Aptos",
  },
};
