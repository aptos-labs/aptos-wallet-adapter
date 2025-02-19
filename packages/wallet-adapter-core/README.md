# Aptos Wallet Adapter core functionality

The core functionality for the wallet adapter that holds and manages the adapter state, validations and interaction with the current connected wallet.

### Usage

```ts
import { WalletCore } from "@aptos-labs/wallet-adapter-core";

const walletCore = new WalletCore([], dappConfig);

const wallets = walletCore.wallets();
```
