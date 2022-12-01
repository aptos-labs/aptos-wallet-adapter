# A wallet adapter package for Wallet Builders

This package provides wallet builders a pre-made class with all required wallet functionality following the [wallet standard](https://aptos.dev/guides/wallet-standard) for easy and fast development.

### Usage

```
git clone @aptos/wallet-adapter
```

- Open `packages/wallet-adapter-plugin/src/index.ts`
- Change all `ApotsWallet` appereances to `<Your-Wallet-Name>`
- Change all AptosWindow appereances to `<Your-Wallet-Name>Window`
- Change `WalletName` to be `<Your-Wallet-Name>`
- Change `url` to match your website url
- Change `icon` to your wallet icon (pay attention to the required format)

- Change `window.aptos` to be `window.<your-wallet-name>`
  - Make sure the `Window Interface` has `<your-wallet-name>` as a key (instead of `aptos`)
- Open `__tests/index.test.tsx` and change `AptosWallet` to `<Your-Wallet-Name>Wallet`
- Run tests with `pnpm test` - all tests should pass

At this point, you have a ready wallet class with all required props and functions to integrate with the Aptos Wallet Adapter.

### Publish as a Package

Next step is to publish your wallet as a npm package so dapps can install it as a dependency.

Creating and publishing scoped public packages
https://docs.npmjs.com/creating-and-publishing-scoped-public-packages

Creating and publishing unscoped public packages
https://docs.npmjs.com/creating-and-publishing-unscoped-public-packages

> **_Note:_** if your wallet provides function that is not included, you should open a PR against [aptos-wallet-adapter](https://github.com/aptos-labs/aptos-wallet-adapter) in the [core package](https://github.com/aptos-labs/aptos-wallet-adapter/blob/main/packages/wallet-adapter-core/src/WalletCore.ts) so it would support this functionality.
> You can take a look at the `signTransaction` on the wallet [core package](https://github.com/aptos-labs/aptos-wallet-adapter/blob/main/packages/wallet-adapter-core/src/WalletCore.ts)
