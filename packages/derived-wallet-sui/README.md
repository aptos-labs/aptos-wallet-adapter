# Derived Wallet Sui

A light-weight add-on package to the [@aptos-labs/wallet-adapter-react](../wallet-adapter-react/) that enables the functionality to use a Sui wallet as a Native Aptos Wallet

### How does Sui wallet work with the wallet adapter?

When a user connects to a dApp using a supported Sui wallet, the adapter computes the user's Derivable Abstracted Account (DAA) address and converts the Sui account to follow the Aptos wallet standard interface.
This ensures a seamless interaction with the wallet for both developers and end users.

The computation of the DAA address is done using the `authenticationFunction` and the `accountIdentity`, both of which are defined in this package:

- `authenticationFunction`: This is a function that exists on-chain and is used to verify the signature of Sui account. The function lives in `0x1::sui_derivable_account::authenticate`
- `accountIdentity`: This represents the identity of the account used in the on-chain authentication function to verify the signature of the Sui account.
  The Sui DAA account identity is in the format of:
  `${originWalletPublicKey}${domain}`

### How to integrate a Sui wallet in my dApp?

The wallet adapter follows the [Sui Wallet Standard](https://docs.sui.io/standards/wallet-standard) to discover wallets.
Currently, the wallets that have been tested and support cross-chain accounts are:

|          | Aptos Devnet | Aptos Testnet | Aptos Mainnet |
| -------- | ------------ | ------------- | ------------- |
| Backpack | ✅           | ✅            |               |
| Nightly  | ✅           | ✅            |               |
| OKX      | ✅           | ✅            |               |
| Phantom  | ✅           | ✅            |               |
| Slush    | ✅           | ✅            |               | 

## Usage

### Automatic Wallet Detection

Use this approach when building a dApp where users connect their Sui wallets.

1. Install the packages

```bash
npm install @aptos-labs/wallet-adapter-react @aptos-labs/derived-wallet-sui
```

2. Set up automatic detection

```tsx
import { AptosWalletAdapterProvider, Network } from "@aptos-labs/wallet-adapter-react";
import { setupAutomaticSuiWalletDerivation } from "@aptos-labs/derived-wallet-sui";

setupAutomaticSuiWalletDerivation({ defaultNetwork: Network.TESTNET });

// ...

<AptosWalletAdapterProvider
  dappConfig={{
    network: Network.TESTNET,
  }}
>
  {children}
</AptosWalletAdapterProvider>
```

## Submitting a Transaction (with Fee Payer)

In most cases, allowing users to submit a transaction with a Sui account to the Aptos chain requires using a sponsor transaction.
This is because the Sui account might not have APT to pay for gas.
Therefore, the dApp should consider maintaining a sponsor account to sponsor the transactions.

```tsx filename="SignAndSubmitDemo.tsx"
import React from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  Aptos,
  AptosConfig,
  Network,
  Ed25519PrivateKey,
  PrivateKey,
  PrivateKeyVariants,
  Account,
} from "@aptos-labs/ts-sdk";

// Initialize an Aptos client
const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

// Generate a sponsor account or use an existing account
const privateKey = new Ed25519PrivateKey(
  PrivateKey.formatPrivateKey("0x123", PrivateKeyVariants.Ed25519),
);
const sponsor = Account.fromPrivateKey({ privateKey });

const SignAndSubmit = () => {
  const { account, signTransaction } = useWallet();

  const onSignAndSubmitTransaction = async () => {
    if (!account) {
      throw new Error(
        "Account is not connected and unable to sign transaction",
      );
    }

    try {
      // Build the transaction
      const rawTransaction = await aptos.transaction.build.simple({
        data: {
          function: "0x1::aptos_account::transfer",
          functionArguments: [account.address.toString(), 1],
        },
        sender: account.address,
        withFeePayer: true,
      });

      // Send it to the wallet to sign
      const walletSignedTransaction = await signTransaction({
        transactionOrPayload: rawTransaction,
      });

      // Sponsor account signs the transaction to pay for the gas fees
      const sponsorAuthenticator = aptos.transaction.signAsFeePayer({
        signer: sponsor,
        transaction: rawTransaction,
      });

      // Submit the transaction to chain
      const txnSubmitted = await aptos.transaction.submit.simple({
        transaction: rawTransaction,
        senderAuthenticator: walletSignedTransaction.authenticator,
        feePayerAuthenticator: sponsorAuthenticator,
      });

      // if you want to wait for transaction
      await aptos.waitForTransaction({ transactionHash: txnSubmitted.hash });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={onSignAndSubmitTransaction}>
      Sign and submit transaction
    </button>
  );
};

export default SignAndSubmit;
```

## Considerations

- Since the origin wallet most likely not integrated with Aptos, simulation is not available in the wallet.
- The package retains the origin wallet, so developers should be able to use it and interact with it by:

```tsx
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const { isSuiDerivedWallet } = useWallet();

if (isSuiDerivedWallet(wallet)) {
  const publicKey = wallet.suiWallet.accounts[0]?.publicKey;
}
```

## Resources

- X-Chain Accounts Adapter Demo App
  - [Live site](https://aptos-labs.github.io/aptos-wallet-adapter/nextjs-cross-chain-example/)
  - [Source code](../../apps/nextjs-x-chain/)
- [AIP-113 Derivable Account Abstraction](https://github.com/aptos-foundation/AIPs/blob/main/aips/aip-113.md)

