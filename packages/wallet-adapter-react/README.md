> **_NOTE:_** This documentation is for Wallet Adapter React `v4.0.0` and up that is fully compatible with the Aptos TypeScript SDK V2. For Wallet Adapter React `v^3.*.*` refer to [this guide](./READMEV2.md)

# Wallet Adapter React Provider

A react provider wrapper for the Aptos Wallet Adapter

Dapps that want to use the adapter should install this package and other supported wallet packages.

### Support

The React provider follows the [wallet standard](https://github.com/aptos-labs/wallet-standard/tree/main) and supports the following required functions

##### [Standard required functions](https://github.com/aptos-labs/wallet-standard/blob/main/src/detect.ts#L16)

```
account
connect
disconnect
network
onAccountChange
onNetworkChange
signMessage
signTransaction
```

##### Additional functions

```
signAndSubmitTransaction
signMessageAndVerify
submitTransaction
```

### Usage

#### Install Dependencies

Install wallet dependencies you want to include in your app.
To do that, you can look at our [supported wallets list](https://github.com/aptos-labs/aptos-wallet-adapter#supported-wallet-packages). Each wallet is a link to npm package where you can install it from.

Next, install the `@aptos-labs/wallet-adapter-react`

```cli
pnpm i @aptos-labs/wallet-adapter-react
```

using npm

```cli
npm i @aptos-labs/wallet-adapter-react
```

#### Import dependencies

Import the `AptosWalletAdapterProvider`.

```tsx
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
```

Wrap your app with the Provider, pass it the relevant props.

```tsx
import { Network } from "@aptos-labs/ts-sdk";

<AptosWalletAdapterProvider
  autoConnect={true}
  dappConfig={{ network: Network.MAINNET, aptosApiKey: "my-generated-api-key" }}
  onError={(error) => {
    console.log("error", error);
  }}
>
  <App />
</AptosWalletAdapterProvider>;
```

#### Available Provider Props

- `autoConnect` - a prop indicates whether the dapp should auto connect with a previous connected wallet.
- `dappConfig` - Config used to initialize the dapp with.
  - `network` - the network the dapp works with
  - `aptosApiKey` - an api key generated from https://developers.aptoslabs.com/docs/api-access
- `onError` - a callback function to fire when the adapter throws an error
- `optInWallets` - the adapter detects and adds AIP-62 standard wallets by default, sometimes you might want to opt-in with specific wallets. This props lets you define the AIP-62 standard wallets you want to support in your dapp.

```tsx
<AptosWalletAdapterProvider
  ...
  optInWallets={["Petra"]}
  ...
>
  <App />
</AptosWalletAdapterProvider>
```

- `disableTelemetry` - A boolean flag to disable the adapter telemetry tool, false by default

```tsx
<AptosWalletAdapterProvider
  ...
  disableTelemetry={true}
  ...
>
  <App />
</AptosWalletAdapterProvider>
```

#### Use Wallet

On any page you want to use the wallet props, import `useWallet` from `@aptos-labs/wallet-adapter-react`

```tsx
import { useWallet } from "@aptos-labs/wallet-adapter-react";
```

Then you can use the exported properties

```tsx
const {
  account,
  changeNetwork,
  connect,
  connected,
  disconnect,
  network,
  signAndSubmitTransaction,
  signMessage,
  signMessageAndVerify,
  signTransaction,
  submitTransaction,
  wallet,
  wallets,
} = useWallet();
```

#### Examples

##### Account

```tsx
// The account address as a typed AccountAddress
<div>{account?.address.toString()}</div>
// The account public key as a typed PublicKey
<div>{account?.publicKey.toString()}</div>
```

##### Network

```tsx
<div>{network?.name}</div>
```

##### Wallet

```tsx
<div>{wallet?.name}</div>
<div>{wallet?.icon}</div>
<div>{wallet?.url}</div>
```

##### Wallets

```tsx
{
  wallets.map((wallet) => <p>{wallet.name}</p>);
}
```

##### connect(walletName)

```tsx
const onConnect = async (walletName) => {
  await connect(walletName);
};

<button onClick={() => onConnect(wallet.name)}>{wallet.name}</button>;
```

##### disconnect()

```tsx
<button onClick={disconnect}>Disconnect</button>
```

##### signAndSubmitTransaction(payload)

```tsx
const onSignAndSubmitTransaction = async () => {
  const response = await signAndSubmitTransaction({
    data: {
      function: "0x1::coin::transfer",
      typeArguments: [APTOS_COIN],
      functionArguments: [account.address, 1], // 1 is in Octas
    },
  });
  // if you want to wait for transaction
  try {
    await aptos.waitForTransaction({ transactionHash: response.hash });
  } catch (error) {
    console.error(error);
  }
};

<button onClick={onSignAndSubmitTransaction}>
  Sign and submit transaction
</button>;
```

##### signAndSubmitBCSTransaction(payload)

```tsx
const onSignAndSubmitBCSTransaction = async () => {
  const response = await signAndSubmitTransaction({
    data: {
      function: "0x1::coin::transfer",
      typeArguments: [parseTypeTag(APTOS_COIN)],
      functionArguments: [AccountAddress.from(account.address), new U64(1)],
    },
  });
  // if you want to wait for transaction
  try {
    await aptos.waitForTransaction({ transactionHash: response.hash });
  } catch (error) {
    console.error(error);
  }
};

<button onClick={onSignAndSubmitTransaction}>
  Sign and submit BCS transaction
</button>;
```

##### signMessage(payload)

```tsx
const onSignMessage = async () => {
  const payload = {
    message: "Hello from Aptos Wallet Adapter",
    nonce: "random_string",
  };
  const response = await signMessage(payload);
};

<button onClick={onSignMessage}>Sign message</button>;
```

##### signTransaction(payload | transaction)

```tsx
const onSignTransaction = async () => {
  const payload: InputTransactionData = {
    data: {
      function: "0x1::coin::transfer",
      typeArguments: [APTOS_COIN],
      functionArguments: [account?.address.toString(), 1],
    },
  };
  const response = await signTransaction({
    transactionOrPayload: payload,
  });
};

const onSignRawTransaction = async () => {
  const aptosConfig = new AptosConfig({ network: Network.MAINNET });
  const aptos = new Aptos(aptosConfig);
  const transactionToSign = await aptos.transaction.build.simple({
    sender: account.address,
    data: {
      function: "0x1::coin::transfer",
      typeArguments: [APTOS_COIN],
      functionArguments: [account.address.toString(), 1],
    },
  });
  const response = await signTransaction({
    transactionOrPayload: transactionToSign,
  });
};

<button onClick={onSignTransaction}>Sign transaction</button>;
<button onClick={onSignRawTransaction}>Sign raw transaction</button>;
```

##### signMessageAndVerify(payload)

```tsx
const onSignMessageAndVerify = async () => {
  const payload = {
    message: "Hello from Aptos Wallet Adapter",
    nonce: "random_string",
  };
  const response = await signMessageAndVerify(payload);
};

<button onClick={onSignMessageAndVerify}>Sign message and verify</button>;
```

### Use a UI package (recommended)

As part of the wallet adapter repo we provide a wallet connect UI package that provides a wallet connect button and a wallet select modal.

The available UI Packages are

- [shadcn/ui](../../apps/nextjs-example/README.md#use-shadcnui-wallet-selector-for-your-own-app)
- [MUI](../wallet-adapter-mui-design/)

If you want to create your own wallet selector UI from existing components and styles in your app, `@aptos-labs/wallet-adapter-react` provides a series of headless components and utilities to simplify this process so that you can focus on writing CSS instead of implementing business logic. For more information, check out the [Building Your Own Wallet Selector](./docs/BYO-wallet-selector.md) document.
