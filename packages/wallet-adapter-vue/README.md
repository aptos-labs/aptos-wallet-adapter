> **_NOTE:_** This documentation is for Wallet Adapter `v^1.*.*`

# Wallet Adapter Vue

A vue provider wrapper for the Aptos Wallet Adapter

Dapps that want to use the adapter should install this package and other supported wallet packages.

### Support

The react provider supports all [wallet standard](https://aptos.dev/guides/wallet-standard) functions and feature functions

##### Standard functions

```
connect
disconnect
connected
account
network
signAndSubmitTransaction
signMessage
```

##### Feature functions - functions that may not be supported by all wallets

```
signTransaction
signMessageAndVerify
signAndSubmitBCSTransaction
```

### Usage

#### Install Dependencies

Install wallet dependencies you want to include in your app.
To do that, you can look at our [supported wallets list](https://github.com/aptos-labs/aptos-wallet-adapter#supported-wallet-packages). Each wallet is a link to npm package where you can install it from.

Next, install the `@aptos-labs/wallet-adapter-vue`

```
pnpm i @aptos-labs/wallet-adapter-vue
```

using npm

```
npm i @aptos-labs/wallet-adapter-vue
```

#### Usage

##### With Nuxt 3

To use Wallet Adapter for Vue in a Nuxt 3 project, you need to create client-side plugin for it (e.g., `plugins/wallet.client.ts`)

```js 
import { SomeAptosWallet } from "some-aptos-wallet-package";
import { useWallet } from "@aptos-labs/wallet-adapter-vue";

export default defineNuxtPlugin({
    const wallets = [new SomeAptosWallet()];

    return {
        provide: {
            wallet: useWallet({
                plugins: wallets,
                onError: (error) => {
                    console.log("error", error);
                },
            }),
        },
    };
})
```

###### Use Wallet

On any page you want to use the wallet:

```js
const { $wallet } = useNuxtApp();
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
  signAndSubmitBCSTransaction,
  signTransaction,
  signMessage,
  signMessageAndVerify,
} = $wallet;
```

##### With Vue 3

Create plugin for it (e.g., `plugins/wallet.ts`)

```js 
import { SomeAptosWallet } from "some-aptos-wallet-package";
import { useWallet } from "@aptos-labs/wallet-adapter-vue";

export default {
  install(app: App) {
  const wallets = [new SomeAptosWallet()];

    const wallet = useWallet({
      plugins: wallets,
      onError: (error) => {
        console.log(error);
      },
    });

    app.provide('$wallet', wallet);
    app.config.globalProperties.$wallet = wallet;
  }
}
```

Use it in `main.ts`

```js
const app = createApp()
app.use(wallet);
```

###### Use Wallet

On any page you want to use the wallet:

```js
const $wallet = inject('$wallet');
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
  signAndSubmitBCSTransaction,
  signTransaction,
  signMessage,
  signMessageAndVerify,
} = $wallet;
```


#### Examples

##### connect(walletName)

```js
const onConnect = async (walletName) => {
  await connect(walletName);
};

<button @click="onConnect(wallet.name)">{{ wallet.name }}</button>;
```

##### disconnect()

```js
<button @click="disconnect">Disconnect</button>
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
    const response = await signAndSubmitTransaction(payload);
    // if you want to wait for transaction
    try {
      await aptosClient.waitForTransaction(response?.hash || "");
    } catch (error) {
      console.error(error);
    }
  };

<button @click="onSignAndSubmitTransaction">
  Sign and submit transaction
</button>
```

##### signAndSubmitBCSTransaction(payload)

```js
   const onSignAndSubmitBCSTransaction = async () => {
    const token = new TxnBuilderTypes.TypeTagStruct(
      TxnBuilderTypes.StructTag.fromString("0x1::aptos_coin::AptosCoin")
    );
    const entryFunctionBCSPayload =
      new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
          "0x1::coin",
          "transfer",
          [token],
          [
            BCS.bcsToBytes(
              TxnBuilderTypes.AccountAddress.fromHex(account!.address)
            ),
            BCS.bcsSerializeUint64(2),
          ]
        )
      );

    const response = await signAndSubmitBCSTransaction(entryFunctionBCSPayload);
    // if you want to wait for transaction
    try {
      await aptosClient.waitForTransaction(response?.hash || "");
    } catch (error) {
      console.error(error);
    }
  };

<button @click="onSignAndSubmitTransaction">
  Sign and submit BCS transaction
</button>
```

##### signMessage(payload)

```js
const onSignMessage = async () => {
  const payload = {
    message: "Hello from Aptos Wallet Adapter",
    nonce: "random_string",
  };
  const response = await signMessage(payload);
};

<button @click="onSignMessage">Sign message</button>;
```

##### Account

```js
<div>{{ account?.address }}</div>
<div>{{ account?.publicKey }}</div>
```

##### Network

```js
<div>{{ network?.name }}</div>
```

##### Wallet

```js
<div>{{ wallet?.name }}</div>
<div>{{ wallet?.icon }}</div>
<div>{{ wallet?.url }}</div>
```

##### Wallets

```js
<p v-for="wallet in wallets">{{ wallet.name }}</p>
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
    const response = await signTransaction(payload);
};

<button @click="onSignTransaction">
    Sign transaction
</button>
```

##### signMessageAndVerify(payload)

```js
const onSignMessageAndVerify = async () => {
    const payload = {
        message: "Hello from Aptos Wallet Adapter",
        nonce: "random_string",
    };
    const response = await signMessageAndVerify(payload);
};

<button @click="onSignMessageAndVerify">Sign message and verify</button>;
```
