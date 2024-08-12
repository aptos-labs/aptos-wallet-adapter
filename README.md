> **_NOTE:_** Use the Wallet Adapter v2.0.0 and up with the new Aptos TypeScript SDK [@aptos-labs/ts-sdk](https://www.npmjs.com/package/@aptos-labs/ts-sdk)

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

[AIP-62](https://github.com/aptos-foundation/AIPs/blob/main/aips/aip-62.md) standard compatible

- [AptosConnect](https://aptosconnect.app/)
- [Mizu](https://www.mizu.io/)
- [MizuWallet](https://www.npmjs.com/package/@mizuwallet-sdk/aptos-wallet-adapter)
- [Nightly](https://chromewebstore.google.com/detail/nightly/fiikommddbeccaoicoejoniammnalkfa)
- [Petra](https://chromewebstore.google.com/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci?hl=en)
- [Pontem](https://www.npmjs.com/package/@pontem/wallet-adapter-plugin)
- T wallet

Legacy standard compatible

- [BitgetWallet](https://www.npmjs.com/package/@bitget-wallet/aptos-wallet-adapter)
- [Fewcha](https://www.npmjs.com/package/fewcha-plugin-wallet-adapter)
- [Martian](https://www.npmjs.com/package/@martianwallet/aptos-wallet-adapter)
- [MSafe](https://www.npmjs.com/package/@msafe/aptos-wallet-adapter)
- [OKX](https://www.npmjs.com/package/@okwallet/aptos-wallet-adapter)
- [Trust](https://www.npmjs.com/package/@trustwallet/aptos-wallet-adapter)

#### Develop Locally

You would need `pnpm@7.14.2` in order to bootstrap and test a local copy of this repo.

1. Clone the repo with `git clone https://github.com/aptos-labs/aptos-wallet-adapter.git`
2. On the root folder, run `pnpm install` and `pnpm turbo run build`
3. On the root folder, run `pnpm turbo run dev` - that would spin up a local server (`localhost:3000`) with the `nextjs` demoapp

Looking how you can contribute? Take a look at our [contribution guide](./CONTRIBUTING.md)

#### Terms of Use and Privacy Policy

By accessing or using the wallet adapter, you agree to be bound to the Aptos Labs [Terms of Use](https://aptoslabs.com/terms) and [Privacy Policy](https://aptoslabs.com/privacy).
