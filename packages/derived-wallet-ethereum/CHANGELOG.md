# @aptos-labs/derived-wallet-ethereum

## 0.6.0

### Minor Changes

- b6b9fc8: Fix DAA signing message and bump aptos ts-sdk version to 5.0.0

### Patch Changes

- Updated dependencies [b6b9fc8]
  - @aptos-labs/derived-wallet-base@0.6.0

## 0.5.1

### Patch Changes

- fd7f880: Bump aptos ts-sdk version
- Updated dependencies [fd7f880]
  - @aptos-labs/derived-wallet-base@0.5.1

## 0.5.0

### Minor Changes

- b80eff6: Add support for transactionSubmitter, bump minimum TS SDK version to 3.x.x

### Patch Changes

- Updated dependencies [b80eff6]
  - @aptos-labs/derived-wallet-base@0.5.0

## 0.4.0

### Minor Changes

- fae2bf0: Bump @aptos-labs/wallet-standard to 0.5.0 which removes the `message` and `signingMessage` fields from the `AptosSignInInput` of the `signIn` request.

### Patch Changes

- Updated dependencies [fae2bf0]
  - @aptos-labs/derived-wallet-base@0.4.0

## 0.3.0

### Minor Changes

- 4e3fe69: Use the default cross-chain wallet's signMessage API for when signing a regular message

### Patch Changes

- Updated dependencies [4e3fe69]
  - @aptos-labs/derived-wallet-base@0.3.0

## 0.2.2

### Patch Changes

- 63f5cf7: Change the signature type for signing a transaction message signature

## 0.2.1

### Patch Changes

- 33d0055: Use aptos ts-sdk version 2.0.0 as a peer dependency
- a64a658: Add the URI scheme to the message URI field and EIP1193DerivedSignature
- Updated dependencies [33d0055]
  - @aptos-labs/derived-wallet-base@0.2.1

## 0.2.0

### Minor Changes

- 476003f: Add a warning to the message to sign in the wallet

### Patch Changes

- Updated dependencies [1b67719]
- Updated dependencies [476003f]
  - @aptos-labs/derived-wallet-base@0.2.0

## 0.1.3

### Patch Changes

- c62ccb7: Add the accountIdentity when creating the AccountAuthenticatorAbstraction in the derived wallet
- Updated dependencies [c62ccb7]
  - @aptos-labs/derived-wallet-base@0.1.2

## 0.1.2

### Patch Changes

- 8a2b3b6: Fetch the devnet chain id when x-chain wallet is configured to use the devnet
- Updated dependencies [8a2b3b6]
  - @aptos-labs/derived-wallet-base@0.1.1

## 0.1.1

### Patch Changes

- 6bfd2fb: Upgrade the ts-sdk version

## 0.1.0

### Minor Changes

- 5da289f: Finalized "Sign in with ..." envelope format

### Patch Changes

- Updated dependencies [5da289f]
  - @aptos-labs/derived-wallet-base@0.1.0
