# @aptos-labs/derived-wallet-solana

## 0.3.0

### Minor Changes

- 4e3fe69: Use the default cross-chain wallet's signMessage API for when signing a regular message

### Patch Changes

- Updated dependencies [4e3fe69]
  - @aptos-labs/derived-wallet-base@0.3.0

## 0.2.5

### Patch Changes

- 33d0055: Use aptos ts-sdk version 2.0.0 as a peer dependency
- Updated dependencies [33d0055]
  - @aptos-labs/derived-wallet-base@0.2.1

## 0.2.4

### Patch Changes

- 476003f: Add the accountIdentity when creating the AccountAuthenticatorAbstraction in the derived wallet"
- 1b67719: Add Solana sign message fallback support
- Updated dependencies [1b67719]
- Updated dependencies [476003f]
  - @aptos-labs/derived-wallet-base@0.2.0

## 0.2.3

### Patch Changes

- 3effbab: Only allowing Phantom as whitelisted wallet for now
- Updated dependencies [c62ccb7]
  - @aptos-labs/derived-wallet-base@0.1.2

## 0.2.2

### Patch Changes

- 255400a: Add the accountIdentity when creating the AccountAuthenticatorAbstraction in the derived wallet"

## 0.2.1

### Patch Changes

- 1779749: Updated DAA SIWS authentication function identifier

## 0.2.0

### Minor Changes

- ad3b6bb: Introduce x chain wallets logic in the react adapter provider

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

- 5ba8ae3: Extracted `signAptosTransactionWithSolana` and `signAptosStructuredMessageWithSolana`
- Updated dependencies [5da289f]
  - @aptos-labs/derived-wallet-base@0.1.0
