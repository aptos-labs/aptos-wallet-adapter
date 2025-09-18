> **_NOTE:_** This README is for Wallet Adapter `v3` and up. For Wallet Adapter `v2` refer to [this guide](./READMEV2.md)

# Aptos Wallet Adapter

A monorepo modular wallet adapter developed and maintained by Aptos for wallet and dapp builders.

#### Getting Started

- [Wallet Adapter Docs](https://aptos.dev/en/build/sdks/wallet-adapter)
- [Example app](https://github.com/aptos-labs/aptos-wallet-adapter/tree/main/apps/nextjs-example)
- [For Aptos Dapps](https://github.com/aptos-labs/aptos-wallet-adapter/tree/main/packages/wallet-adapter-react)
- [For Aptos Wallets](https://aptos.dev/en/build/sdks/wallet-adapter/browser-extension-wallets)
- [Core package](https://github.com/aptos-labs/aptos-wallet-adapter/tree/main/packages/wallet-adapter-core)
- [Wallet connect UI package](./packages/wallet-adapter-react/READMEV2.md#use-a-ui-package-recommended)

#### [AIP-62](https://github.com/aptos-foundation/AIPs/blob/main/aips/aip-62.md) Supported wallet

- [OKX](https://www.npmjs.com/package/@okwallet/aptos-wallet-adapter)
- [AptosConnect](https://aptosconnect.app/)
- [Petra](https://chromewebstore.google.com/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci?hl=en)
- [Nightly](https://chromewebstore.google.com/detail/nightly/fiikommddbeccaoicoejoniammnalkfa)
- [Pontem](https://www.npmjs.com/package/@pontem/wallet-adapter-plugin)
- [RimoSafe](https://chromewebstore.google.com/detail/rimo-safe-wallet/kiicddjcakdmobjkcpppkgcjbpakcagp)
- [MSafe](https://www.npmjs.com/package/@msafe/aptos-wallet-adapter)
- [Bitget Wallet](https://web3.bitget.com)

#### Develop Locally

You would need `pnpm@9.15.5` in order to bootstrap and test a local copy of this repo.

1. Clone the repo with `git clone https://github.com/aptos-labs/aptos-wallet-adapter.git`
2. On the root folder, run `pnpm install` and `pnpm turbo run build`
3. On the root folder, run `pnpm turbo run dev` - that would spin up a local server (`https://localhost:3000`) with the `nextjs` demoapp

Looking how you can contribute? Take a look at our [contribution guide](./CONTRIBUTING.md)

#### Terms of Use and Privacy Policy

By accessing or using the wallet adapter, you agree to be bound to the Aptos Labs [Terms of Use](https://aptoslabs.com/terms) and [Privacy Policy](https://aptoslabs.com/privacy).
