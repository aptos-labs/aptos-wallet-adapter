# Aptos Wallet Adapter

A monorepo modular wallet adapter developed and maintained by Aptos for wallet and dapp builders that includes:

#### Getting Started

- [Example app](https://github.com/aptos-labs/aptos-wallet-adapter/tree/main/apps/nextjs-example)
- [For Aptos Dapps](https://github.com/aptos-labs/aptos-wallet-adapter/tree/main/packages/wallet-adapter-react)
- [For Aptos Wallets](https://github.com/aptos-labs/wallet-adapter-plugin-template)
- [Core package](https://github.com/aptos-labs/aptos-wallet-adapter/tree/main/packages/wallet-adapter-core)
- [Wallet connect UI package](https://github.com/aptos-labs/aptos-wallet-adapter/tree/main/packages/wallet-adapter-ant-design)

#### Supported wallet packages

Note: These are in alphabetical order, any new wallets must be in alphabetical order

- [Blocto](https://www.npmjs.com/package/@blocto/aptos-wallet-adapter-plugin)
- [FaceWallet](https://www.npmjs.com/package/@haechi-labs/face-aptos-adapter-plugin)
- [Fewcha](https://www.npmjs.com/package/fewcha-plugin-wallet-adapter)
- [Flipper](https://www.npmjs.com/package/@flipperplatform/wallet-adapter-plugin)
- [Martian](https://www.npmjs.com/package/@martianwallet/aptos-wallet-adapter)
- [MSafe](https://www.npmjs.com/package/@msafe/aptos-wallet-adapter) 
- [Nightly](https://www.npmjs.com/package/@nightlylabs/aptos-wallet-adapter-plugin)
- [OpenBlock](https://www.npmjs.com/package/@openblockhq/aptos-wallet-adapter)
- [Petra](https://www.npmjs.com/package/petra-plugin-wallet-adapter)
- [Pontem](https://www.npmjs.com/package/@pontem/wallet-adapter-plugin)
- [Rise](https://www.npmjs.com/package/@rise-wallet/wallet-adapter)
- [TokenPocket](https://www.npmjs.com/package/@tp-lab/aptos-wallet-adapter)
- [Trust](https://www.npmjs.com/package/@trustwallet/aptos-wallet-adapter)
- [WELLDONE](https://www.npmjs.com/package/@welldone-studio/aptos-wallet-adapter)

#### Develop Locally

You would need `pnpm@7.14.2` in order to bootstrap and test a local copy of this repo.

1. Clone the repo with `git clone https://github.com/aptos-labs/aptos-wallet-adapter.git`
2. On the root folder, run `pnpm install` and `pnpm turbo run build`
3. On the root folder, run `pnpm turbo run dev` - that would spin up a local server (`localhost:3000`) with the `nextjs` demoapp

Looking how you can contribute? Take a look at our [contribution guide](./CONTRIBUTING.md)
