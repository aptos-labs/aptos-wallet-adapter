# @aptos-labs/derived-wallet-base

## 0.5.1

### Patch Changes

- fd7f880: Bump aptos ts-sdk version

## 0.5.0

### Minor Changes

- b80eff6: Add support for transactionSubmitter, bump minimum TS SDK version to 3.x.x

## 0.4.0

### Minor Changes

- fae2bf0: Bump @aptos-labs/wallet-standard to 0.5.0 which removes the `message` and `signingMessage` fields from the `AptosSignInInput` of the `signIn` request.

## 0.3.0

### Minor Changes

- 4e3fe69: Use the default cross-chain wallet's signMessage API for when signing a regular message

## 0.2.1

### Patch Changes

- 33d0055: Use aptos ts-sdk version 2.0.0 as a peer dependency

## 0.2.0

### Minor Changes

- 476003f: Add a warning to the message to sign in the wallet

### Patch Changes

- 1b67719: Add Solana sign message fallback support

## 0.1.2

### Patch Changes

- c62ccb7: Add the accountIdentity when creating the AccountAuthenticatorAbstraction in the derived wallet

## 0.1.1

### Patch Changes

- 8a2b3b6: Fetch the devnet chain id when x-chain wallet is configured to use the devnet

## 0.1.0

### Minor Changes

- 5da289f: Finalized "Sign in with ..." envelope format
