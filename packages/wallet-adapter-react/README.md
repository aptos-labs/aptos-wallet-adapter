# Wallet Adapter React Provider

A react provider wrapper for the Aptos Wallet Adapter

Dapps that want to use the adapter should install this package and other supported wallet packages.

### Usage

#### Install Dependencies

Install wallet dependencies you want to include in your app.
To do that, you can look at our [supported wallets list](). Each wallet is a link to their npm package where you can install it from.

Next, install the `@aptos-labs/wallet-adapter-react`

```
pnpm i @aptos-labs/wallet-adapter-react
```

using npm

```
npm i @aptos-labs/wallet-adapter-react
```

#### Import dependencies

On the `App.jsx` file,

Import the installed wallets.

```js
import { SomeAptosWallet } from "some-aptos-wallet-package";
```

Import the `AptosWalletAdapterProvider`.

```js
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
```

Wrap your app with the Provider, pass it the `plugins (wallets)` you want to have on your app as an array and a `autoConnect` option (set to false by default)

```js
const wallets = [new AptosWallet()];

<AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
  <App />
</AptosWalletAdapterProvider>;
```

#### Use Wallet

On any page you want to use the wallet props, import `useWallet` from `@aptos-labs/wallet-adapter-react`

```js
import { useWallet } from "@aptos-labs/wallet-adapter-react";
```

Then you can use the exported properties

```js
const {
  connect,
  account,
  network,
  connected,
  disconnect,
  wallet,
  wallets,
  signAndSubmitTransaction,
  signTransaction,
  signMessage,
} = useWallet();
```

#### Examples

##### connect(walletName)

```js
<button onClick={() => connect(wallet.name)}>{wallet.name}</button>
```

##### disconnect()

```js
<button onClick={disconnect}>Disconnect</button>
```

##### signAndSubmitTransaction(payload)

```js
  const onSignAndSubmitTransaction = async () => {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: "0x1::coin::transfer",
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
      arguments: [account?.address, 1], // 1 is in Octas
    };
    try {
      const response = await signAndSubmitTransaction(payload);
      // if you want to wait for transaction
      await aptosClient.waitForTransaction(response?.hash || "");
      console.log(response?.hash)
    } catch (error: any) {
      console.log("error", error);
    }
  };

<button onClick={onSignAndSubmitTransaction}>
  Sign and submit transaction
</button>
```

##### signTransaction(payload)

```js
  const onSignTransaction = async () => {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: "0x1::coin::transfer",
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
      arguments: [account?.address, 1], // 1 is in Octas
    };
    try {
      const response = await signTransaction(payload);
      console.log("response", response);
    } catch (error: any) {
      console.log("error", error);
    }
  };

<button onClick={onSignTransaction}>
  Sign transaction
</button>
```

##### signMessage(payload)

```js
  const onSignMessage = async () => {
    const payload = {
      message: "Hello from Aptos Wallet Adapter",
      nonce: "random_string",
    };
    try {
      const response = await signMessage(payload);
      console.log("response", response);
    } catch (error: any) {
      console.log("error", error);
    }
  };

<button onClick={onSignMessage}>
  Sign message
</button>
```

##### Account

```js
<div>{account?.address}</div>
<div>{account?.publicKey}</div>
```

##### Network

```js
<div>{network?.name}</div>
```

##### Wallet

```js
<div>{wallet?.name}</div>
<div>{wallet?.icon}</div>
<div>{wallet?.url}</div>
```

##### Wallets

```js
{
  wallets.map((wallet) => <p>{wallet.name}</p>);
}
```
