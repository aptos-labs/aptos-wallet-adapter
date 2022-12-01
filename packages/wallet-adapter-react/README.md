# Wallet Adapter React Provider

A react provider wrapper for the Aptos Wallet Adapter

Dapps that want to use the adapter should install this package and other supported wallet packages.

#### Supported wallet packages

- Petra
- Martian
- Rise

### Usage

#### Install Dependencies

Install wallet dependencies you want to include in your app. To do that, you can had to each of the wallet in the supported wallets list (each name is linked to the npm package page) above and follow the instructions.

Next, install the `@aptos/wallet-adapter-react`

```
pnpm i @aptos/wallet-adapter-react
```

#### Import dependencies

Import the installed wallets and `AptosWalletAdapterProvider`.
Wrap your app with the Provider, pass it the `plugins (wallets)` you want to have on your app as an array and a `autoConnect` option (set to false by default)

```
import { AptosWallet } from "aptos-wallet";
import { AptosWalletAdapterProvider } from "@aptos/wallet-adapter-react";

const wallets = [new AptosWallet()];

<AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
  <App />
</AptosWalletAdapterProvider>
```

#### Use Wallet

On any page you want to use the wallet props, import `useWallet` from `@aptos/wallet-adapter-react`

```
import { useWallet } from "@aptos/wallet-adapter-react";
```

Then you can use the exported properties

```
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

```
<button onClick={() => connect(wallet.name)} >
  {wallet.name}
</button>
```

##### disconnect()

```
<button onClick={disconnect}>
  Disconnect
</button>
```

##### signAndSubmitTransaction(payload)

```
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

```
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
      setErrorAlertMessage(error);
    }
  };

<button onClick={onSignTransaction}>
  Sign transaction
</button>
```

##### signMessage(payload)

```
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

```
<div>{account?.address}</div>
<div>{account?.publicKey}</div>
```

##### Network

```
<div>{network?.name}</div>
```

##### Wallet

```
<div>{wallet?.name}</div>
<div>{wallet?.icon}</div>
<div>{wallet?.url}</div>
```

##### Wallets

```
{wallets.map((wallet) => (
    <p>{wallet.name}</p>
))}
```
