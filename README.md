# Aptos Wallet Adapter

A comprehensive monorepo developed and maintained by Aptos for wallet and dapp builders. Includes wallet adapter SDK, cross-chain functionality, and derived wallet support for seamless multi-chain integration.

> **_NOTE:_** Vue and Nuxt integration has been moved to a separate community-maintained repository: [aptos-wallet-adapter-vue](https://github.com/aptos-labs/aptos-wallet-adapter-vue)

## Features

- **Wallet Adapter**: Connect dapps to Aptos wallets with React support
- **Cross-Chain Transfers**: USDC transfers between Aptos and other chains (Solana, Ethereum, Sui, etc.) via Circle's CCTP
- **Derived Wallets**: Create Aptos wallets derived from external chain keys (Ethereum, Solana, Sui)
- **UI Components**: Pre-built wallet selector components for Ant Design and Material-UI
- **Comprehensive Testing**: Full test coverage with Vitest

## Getting Started

- [Wallet Adapter Docs](https://aptos.dev/en/build/sdks/wallet-adapter)
- [For Aptos Dapps](https://github.com/aptos-labs/aptos-wallet-adapter/tree/main/packages/wallet-adapter-react)
- [For Aptos Wallets](https://aptos.dev/en/build/sdks/wallet-adapter/browser-extension-wallets)
- [Cross-Chain Transfers](https://github.com/aptos-labs/aptos-wallet-adapter/tree/main/packages/cross-chain-core)

## Example Applications

- [Next.js Example](https://github.com/aptos-labs/aptos-wallet-adapter/tree/main/apps/nextjs-example) - Basic wallet adapter integration
- [Next.js Cross-Chain Example](https://github.com/aptos-labs/aptos-wallet-adapter/tree/main/apps/nextjs-x-chain) - Cross-chain USDC transfers demo

## Packages

### Core Packages

- **[@aptos-labs/wallet-adapter-core](./packages/wallet-adapter-core)** - Core wallet adapter logic and functionality
- **[@aptos-labs/wallet-adapter-react](./packages/wallet-adapter-react)** - React provider and hooks for wallet integration

### UI Components

- **[@aptos-labs/wallet-adapter-ant-design](./packages/wallet-adapter-ant-design)** - Pre-built wallet selector using Ant Design
- **[@aptos-labs/wallet-adapter-mui-design](./packages/wallet-adapter-mui-design)** - Pre-built wallet selector using Material-UI

### Cross-Chain Packages

- **[@aptos-labs/cross-chain-core](./packages/cross-chain-core)** - SDK for cross-chain USDC transfers via Circle's CCTP
- **[@aptos-labs/derived-wallet-base](./packages/derived-wallet-base)** - Base functionality for derived wallets
- **[@aptos-labs/derived-wallet-ethereum](./packages/derived-wallet-ethereum)** - Ethereum/EVM-based derived wallet
- **[@aptos-labs/derived-wallet-solana](./packages/derived-wallet-solana)** - Solana-based derived wallet
- **[@aptos-labs/derived-wallet-sui](./packages/derived-wallet-sui)** - Sui-based derived wallet

## Supported Wallets

- [AptosConnect](https://aptosconnect.app/)
- [Backpack Wallet](https://backpack.app/)
- [Bitget Wallet](https://web3.bitget.com)
- [Cosmostation Wallet](https://chromewebstore.google.com/detail/cosmostation-wallet/fpkhgmpbidmiogeglndfbkegfdlnajnf)
- [MSafe](https://www.npmjs.com/package/@msafe/aptos-wallet-adapter)
- [Nightly](https://chromewebstore.google.com/detail/nightly/fiikommddbeccaoicoejoniammnalkfa)
- [OKX](https://www.npmjs.com/package/@okwallet/aptos-wallet-adapter)
- [Petra](https://chromewebstore.google.com/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci?hl=en)
- [RimoSafe](https://chromewebstore.google.com/detail/rimo-safe-wallet/kiicddjcakdmobjkcpppkgcjbpakcagp)

## Develop Locally

### Requirements

- Node.js 20.18.0 or higher
- pnpm 9.15.5

### Setup

1. Clone the repo with `git clone https://github.com/aptos-labs/aptos-wallet-adapter.git`
2. On the root folder, run `pnpm install` and `pnpm turbo run build`
3. On the root folder, run `pnpm turbo run dev` - that would spin up a local server (`https://localhost:3000`) with the Next.js demo app

### Testing

Run tests across all packages:
```bash
pnpm test
```

All packages include comprehensive test coverage using Vitest.

## Contributing

Looking how you can contribute? Take a look at our [contribution guide](./CONTRIBUTING.md)

#### Terms of Use and Privacy Policy

By accessing or using the wallet adapter, you agree to be bound to the Aptos Labs [Terms of Use](https://aptoslabs.com/terms) and [Privacy Policy](https://aptoslabs.com/privacy).
