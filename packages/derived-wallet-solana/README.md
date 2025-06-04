> **_NOTE:_** The feature is currently only available on DEVNET and TESTNET and is considered an alpha version; therefore, you can expect breaking changes.

# Derived Wallet Solana

A light-weight add-on package to the [@aptos-labs/wallet-adapter-react](../wallet-adapter-react/) that enables the functionality to use a Solana wallet as a Native Aptos Wallet

### How does Solana wallet work with the wallet adapter?

When a user connects to a dApp using a supported Solana wallet, the adapter computes the user's Derivable Abstracted Account (DAA) address and converts the Solana account to follow the Aptos wallet standard interface.
This ensures a seamless interaction with the wallet for both developers and end users.

The computation of the DAA address is done using the `authenticationFunction` and the `accountIdentity`, both of which are defined in this package:

- `authenticationFunction`: This is a function that exists on-chain and is used to verify the signature of EVM account. The function lives in `0x1::solana_derivable_account::authenticate`
- `accountIdentity`: This represents the identity of the account used in the on-chain authentication function to verify the signature of the EVM account.
  The EVM DAA account identity is in the format of:
  `${originWalletPublicKey}${domain}`

### How to integrate a Solana wallet in my dApp?

The wallet adapter follows the [Solana Wallet Standard](https://github.com/wallet-standard/wallet-standard/blob/master/DESIGN.md) to discover wallets.
Currently, the wallets that have been tested and support cross-chain accounts are:

|          | Aptos Devnet | Aptos Testnet | Aptos Mainnet |
| -------- | ------------ | ------------- | ------------- |
| Phantom  | ✅           | ✅            |
| Solflare | ✅           | ✅            |
| Backpack | ✅           | ✅            |
| OKX      | ✅           | ✅            |

### Usage

1. Install the [@aptos-labs/wallet-adapter-react](../wallet-adapter-react/) package

```bash
npm install @aptos-labs/wallet-adapter-react
```

2. Install the package `@aptos-labs/derived-wallet-solana`

```bash
npm install @aptos-labs/derived-wallet-solana
```

3. Import the automatic detection function

```tsx
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { setupAutomaticSolanaWalletDerivation } from "@aptos-labs/derived-wallet-solana";

setupAutomaticSolanaWalletDerivation({ defaultNetwork: Network.TESTNET }); // Network.TESTNET is the Aptos network your dapp is working with

.....

<AptosWalletAdapterProvider
 dappConfig={{
    network: Network.TESTNET,
  }}
>
  {children}
<AptosWalletAdapterProvider/>
```

#### Submitting a transaction

In most cases, allowing users to submit a transaction with a Solana account to the Aptos chain requires using a sponsor transaction.
This is because the Solana account might not have APT to pay for gas.
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
  PrivateKey.formatPrivateKey("0x123", PrivateKeyVariants.Ed25519)
);
const sponsor = Account.fromPrivateKey({ privateKey });

const SignAndSubmit = () => {
  const { account, signTransaction } = useWallet();

  const onSignAndSubmitTransaction = async () => {
    if (!account) {
      throw new Error(
        "Account is not connected and unable to sign transaction"
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
      const txnSubmitted = await aptosClient(network).transaction.submit.simple(
        {
          transaction: rawTransaction,
          senderAuthenticator: walletSignedTransaction.authenticator,
          feePayerAuthenticator: sponsorAuthenticator,
        }
      );

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

### Considerations

- Since the origin wallet most likely not integrated with Aptos, simulation is not available in the wallet.
- The package retains the origin wallet, so developers should be able to use it and interact with it by:

```tsx
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const { isSolanaDerivedWallet } = useWallet();

if (isSolanaDerivedWallet(wallet)) {
  const publicKey = wallet.solanaWallet.publicKey;
}
```

### Resources

- X-Chain Accounts Adapter Demo App
  - [Live site](https://aptos-labs.github.io/aptos-wallet-adapter/nextjs-cross-chain-example/)
  - [Source code](../../apps/nextjs-x-chain/)
- [AIP-113 Derivable Account Abstraction](https://github.com/aptos-foundation/AIPs/blob/main/aips/aip-113.md)
- [AIP-121 x-chain DAA authentication using Sign-in-With-Solana](https://github.com/aptos-foundation/AIPs/blob/main/aips/aip-121.md)
