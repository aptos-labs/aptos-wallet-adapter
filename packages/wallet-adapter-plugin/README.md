A wallet adapter package for Wallet Builders

Wallet builders would copy the file under `packages/wallet-adapter-plugin/src/index.ts` and implement their own logic (basic functionality is already implemented) and rename the class some variables.

Then they publish their own implementation as a package so later dapps can install it as a dependency.

Everything under `packages/wallet-adapter-plugin/src/wallets` would be deleted once this package is publish (this is just for our testing/debugging use for now).
