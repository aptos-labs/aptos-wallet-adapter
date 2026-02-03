# @aptos-labs/wallet-adapter-core

Core functionality for the Aptos Wallet Adapter. This package provides the foundation for wallet management, state handling, and interaction with AIP-62 compatible wallets on the Aptos blockchain.

## Overview

The wallet-adapter-core package handles:

- **Wallet Detection**: Automatically detects AIP-62 standard compatible wallets installed in the browser
- **Connection Management**: Connect, disconnect, and manage wallet sessions
- **Transaction Signing**: Sign messages, transactions, and submit transactions to the network
- **Network Management**: Handle network changes and multi-network support
- **Event System**: Subscribe to wallet, account, and network change events
- **State Management**: Centralized state for connected wallet, account, and network information

## Installation

```bash
npm install @aptos-labs/wallet-adapter-core
# or
pnpm add @aptos-labs/wallet-adapter-core
# or
yarn add @aptos-labs/wallet-adapter-core
```

**Peer Dependencies:**

```bash
npm install @aptos-labs/ts-sdk
```

## Usage

### Basic Setup

```ts
import { WalletCore } from "@aptos-labs/wallet-adapter-core";
import { Network } from "@aptos-labs/ts-sdk";

// Create wallet core instance
const walletCore = new WalletCore(
  [], // Optional: array of wallet names to opt-in (empty = all wallets)
  { network: Network.MAINNET }, // Optional: dapp configuration
  false, // Optional: disable telemetry (default: false)
  ["Petra Web"], // Optional: wallets to hide from display
);

// Get available wallets
const wallets = walletCore.wallets;
const notDetectedWallets = walletCore.notDetectedWallets;
```

### Connecting to a Wallet

```ts
// Connect to a wallet by name
await walletCore.connect("Petra");

// Check connection status
if (walletCore.isConnected()) {
  console.log("Connected account:", walletCore.account);
  console.log("Connected network:", walletCore.network);
}
```

### Signing Messages

```ts
const signedMessage = await walletCore.signMessage({
  message: "Hello, Aptos!",
  nonce: "random-nonce-123",
});

console.log("Signature:", signedMessage.signature);
console.log("Full message:", signedMessage.fullMessage);
```

### Signing and Submitting Transactions

```ts
const result = await walletCore.signAndSubmitTransaction({
  data: {
    function: "0x1::aptos_account::transfer",
    typeArguments: [],
    functionArguments: [recipientAddress, amount],
  },
});

console.log("Transaction hash:", result.hash);
```

### Listening to Events

```ts
// Account change event
walletCore.on("accountChange", (account) => {
  console.log("Account changed:", account);
});

// Network change event
walletCore.on("networkChange", (network) => {
  console.log("Network changed:", network);
});

// Disconnect event
walletCore.on("disconnect", () => {
  console.log("Wallet disconnected");
});
```

### Disconnecting

```ts
await walletCore.disconnect();
```

## API Reference

### WalletCore

The main class that manages wallet state and interactions.

#### Constructor

```ts
new WalletCore(
  optInWallets?: ReadonlyArray<AvailableWallets>,
  dappConfig?: DappConfig,
  disableTelemetry?: boolean,
  hideWallets?: ReadonlyArray<AvailableWallets>
)
```

#### Properties

| Property             | Type                                      | Description                  |
| -------------------- | ----------------------------------------- | ---------------------------- |
| `wallet`             | `AptosWallet \| null`                     | Currently connected wallet   |
| `account`            | `AccountInfo \| null`                     | Currently connected account  |
| `network`            | `NetworkInfo \| null`                     | Currently connected network  |
| `wallets`            | `ReadonlyArray<AptosWallet>`              | List of detected wallets     |
| `hiddenWallets`      | `ReadonlyArray<AdapterWallet>`            | List of hidden wallets       |
| `notDetectedWallets` | `ReadonlyArray<AdapterNotDetectedWallet>` | List of not-detected wallets |

#### Methods

| Method                            | Description                            |
| --------------------------------- | -------------------------------------- |
| `connect(walletName)`             | Connect to a wallet                    |
| `disconnect()`                    | Disconnect from current wallet         |
| `signMessage(input)`              | Sign a message                         |
| `signTransaction(args)`           | Sign a transaction                     |
| `signAndSubmitTransaction(input)` | Sign and submit a transaction          |
| `changeNetwork(network)`          | Request network change                 |
| `signIn(args)`                    | Sign in with SIWA (Sign In With Aptos) |
| `isConnected()`                   | Check if wallet is connected           |

#### Events

| Event           | Payload       | Description                     |
| --------------- | ------------- | ------------------------------- |
| `connect`       | `AccountInfo` | Emitted when wallet connects    |
| `disconnect`    | -             | Emitted when wallet disconnects |
| `accountChange` | `AccountInfo` | Emitted when account changes    |
| `networkChange` | `NetworkInfo` | Emitted when network changes    |

## DappConfig

Configuration options for the wallet adapter:

```ts
interface DappConfig {
  network: Network;
  transactionSubmitter?: TransactionSubmitter;
  aptosApiKeys?: Partial<Record<Network, string>>;
  aptosConnectDappId?: string;
  aptosConnect?: AptosConnectWalletConfig;
  crossChainWallets?: boolean;
}
```

## Related Packages

- [`@aptos-labs/wallet-adapter-react`](../wallet-adapter-react) - React hooks and context provider
- [`@aptos-labs/wallet-adapter-vue`](../wallet-adapter-vue) - Vue composables and plugin
- [`@aptos-labs/ts-sdk`](https://github.com/aptos-labs/aptos-ts-sdk) - Aptos TypeScript SDK

## License

Apache-2.0
