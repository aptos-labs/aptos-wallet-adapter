# @aptos-labs/wallet-adapter-react

## 2.1.4

### Patch Changes

- Updated dependencies [3f38c51]
  - @aptos-labs/wallet-adapter-core@3.2.1

## 2.1.3

### Patch Changes

- Updated dependencies [12163ca]
- Updated dependencies [a6f0e46]
  - @aptos-labs/wallet-adapter-core@3.2.0

## 2.1.2

### Patch Changes

- a1c08cc: Export missing InputTransactionData type

## 2.1.1

### Patch Changes

- 6266a29: Consolidate options argument on signAndSubmitTransaction
- Updated dependencies [6266a29]
  - @aptos-labs/wallet-adapter-core@3.1.1

## 2.1.0

### Minor Changes

- aa3d15a: Make sender optional when sign and submit single signer transaction

### Patch Changes

- Updated dependencies [6257015]
- Updated dependencies [aa3d15a]
  - @aptos-labs/wallet-adapter-core@3.1.0

## 2.0.0

### Major Changes

- 31e0084: Support TypeScript SDK V2. Fully compatible with existing SDK V1 and Wallet Adapter V1
  but with a full SDK V2 support for the dapp.

  - Add support for SDK V2 input types
  - `signAndSubmitTransaction()` accept only SDK V2 transaction input type
  - Implement a `submitTransaction()` function for multi signers transactions
  - `signTransaction()` to support both SDK V1 and V2 versions
  - Convert wallet `SignedTransaction` response from `signTransaction()` to TS SDK V2 `AccountAuthenticator`
  - Demo app to demonstrate different trnsaction flows - single signer, sponsor and multi agent transactions
  - Reject promise on core and/or provider errors instead of just returning `false`
  - Use `@aptos-labs/ts-sdk@experimental` version `0.0.7`

### Patch Changes

- Updated dependencies [31e0084]
  - @aptos-labs/wallet-adapter-core@3.0.0

## 1.4.0

### Minor Changes

- 7acfa69: Adding support for the new Typescript SDK in the package `@aptos-labs/ts-sdk`. The wallet adapter now supports submitting a basic transaction with the new SDK types.

### Patch Changes

- dd6e1ed: Moves dependencies to peer dependencies as needed
- Updated dependencies [7acfa69]
- Updated dependencies [dd6e1ed]
  - @aptos-labs/wallet-adapter-core@2.6.0

## 1.3.2

### Patch Changes

- 7e314e5: Update aptos dependency
- Updated dependencies [7e314e5]
  - @aptos-labs/wallet-adapter-core@2.5.1

## 1.3.1

### Patch Changes

- Updated dependencies [c95933a]
  - @aptos-labs/wallet-adapter-core@2.5.0

## 1.3.0

### Minor Changes

- 3834890: Add an optional `onError` prop to error handle wallet callbacks

### Patch Changes

- Updated dependencies [d2a0bbd]
- Updated dependencies [b0586e8]
  - @aptos-labs/wallet-adapter-core@2.4.0

## 1.2.3

### Patch Changes

- dc98bf4: fix sendAndSubmitTransaction params
- Updated dependencies [dc98bf4]
  - @aptos-labs/wallet-adapter-core@2.3.3

## 1.2.2

### Patch Changes

- 22ecf6a: Throw `wallet already connected` error when trying to connect to an already connected wallet
- e4b06de: Await for wallet connect request before setting isLoading state
- Updated dependencies [22ecf6a]
  - @aptos-labs/wallet-adapter-core@2.3.2

## 1.2.1

### Patch Changes

- Updated dependencies [06f334f]
  - @aptos-labs/wallet-adapter-core@2.3.1

## 1.2.0

### Minor Changes

- 1605d28: Support ReadonlyArray of Wallets in AptosWalletAdapterProvider and WalletCore

### Patch Changes

- Updated dependencies [bb1595e]
- Updated dependencies [1605d28]
  - @aptos-labs/wallet-adapter-core@2.3.0

## 1.1.0

### Minor Changes

- d8d5a8a: Support deeplink on React Provider and Nextjs demo app

## 1.0.6

### Patch Changes

- Updated dependencies [814939c]
  - @aptos-labs/wallet-adapter-core@2.2.0

## 1.0.5

### Patch Changes

- 56a3f9f: BCS transaction support in react provider package

## 1.0.4

### Patch Changes

- 8dea640: Fix wallet adapter auto reconnect on page refresh
- Updated dependencies [50968c4]
- Updated dependencies [8dea640]
  - @aptos-labs/wallet-adapter-core@2.1.0

## 1.0.3

### Patch Changes

- 03eb0f5: Define core package version to use

## 0.2.4

### Patch Changes

- e03f79c: Update Blocto and Martian package version and fix a minor autoConnect bug

## 0.2.3

### Patch Changes

- 7498973: Support Loadable wallet for ant-design and export NetworkName

## 0.2.2

### Patch Changes

- 552d255: Add react package as a dependency

## 0.2.1

### Patch Changes

- c3eb031: Export WalletReadyState enum from react package

## 0.2.0

### Minor Changes

- 6e53116: Add support to verify a signed message

### Patch Changes

- Updated dependencies [18a0429]
- Updated dependencies [42e29f6]
- Updated dependencies [576bb57]
- Updated dependencies [6e53116]
  - @aptos-labs/wallet-adapter-core@0.2.0
