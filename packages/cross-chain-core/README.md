# Aptos Cross Chain CCTP

A wrapper for CCTP cross chain transactions.

#### Supported Providers

- Wormhole

### Usage

Install the `@aptos-labs/cross-chain-core` package

```cli
pnpm i @aptos-labs/cross-chain-core
```

Import the `CrossChainCore` class

```ts
import { CrossChainCore } from "@aptos-labs/cross-chain-core";
```

Initialize `CrossChainCore` and chosen provider

```ts
const crossChainCore = new CrossChainCore({
  dappConfig: { aptosNetwork: dappNetwork },
});

const provider = crossChainCore.getProvider("Wormhole");
```

Once you have your provider setup, you can use it to query for:

- `getQuote` can be used to calculate the cost and parameters for transferring tokens between different blockchain networks using the provider's cross-chain bridge.

```ts
const quote = await provider?.getQuote({
  // How much to transfer
  amount,
  // The origin network involved (besides Aptos, e.g Solana, Ethereum)
  originChain: sourceChain,
  // The transaction type:
  // transfer - transfer funds from a cross chain (Solana, Ethereum) wallet to Aptos
  // withdraw - transfer funds from an Aptos wallet to a cross chain (Solana, Ethereum) wallet
  type: "transfer",
});
```

The function returns pricing, fees, and transfer details needed to execute the cross-chain transaction.

- `transfer` can be used to initiate a transfer of USDC funds from the source chain wallet to Aptos wallet

```ts
const { originChainTxnId, destinationChainTxnId } = await provider.transfer({
  // The blockchain to transfer from
  sourceChain,
  // The source chain wallet to sign the transfer transaction
  wallet,
  // The destination address for the funds to go to
  destinationAddress: account?.address?.toString() ?? "",
  // The wallet/signer for the destination (Aptos) chain
  mainSigner,
  // (optional) Account to sponsor gas fees
  sponsorAccount,
});
```

This function returns:
`originChainTxnId`: Transaction hash on the source chain
`destinationChainTxnId`: Transaction hash on the Aptos destination chain

- `withdraw` can be used to initiate a transfer of USDC funds an Aptos wallet to the destination chain wallet

```ts
const { originChainTxnId, destinationChainTxnId } = await provider.withdraw({
  // The blockchain to transfer from
  sourceChain,
  // The source chain wallet to sign the transfer transaction
  wallet,
  // The destination address for the funds to go to
  destinationAddress: originWalletDetails?.address.toString(),
  // (optional) Account to sponsor gas fees
  sponsorAccount,
});
```

This function returns:
`originChainTxnId`: Transaction hash on the source chain
`destinationChainTxnId`: Transaction hash on the Aptos destination chain
