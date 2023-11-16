# @aptos-labs/wallet-adapter-ant-design

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
  - @aptos-labs/wallet-adapter-react@2.0.0

## 1.2.7

### Patch Changes

- dd6e1ed: Moves dependencies to peer dependencies as needed
- Updated dependencies [7acfa69]
- Updated dependencies [dd6e1ed]
  - @aptos-labs/wallet-adapter-react@1.4.0

## 1.2.5

### Patch Changes

- 7e314e5: Update aptos dependency
- Updated dependencies [7e314e5]
  - @aptos-labs/wallet-adapter-react@1.3.2

## 1.2.4

### Patch Changes

- @aptos-labs/wallet-adapter-react@1.3.1

## 1.2.3

### Patch Changes

- Updated dependencies [3834890]
  - @aptos-labs/wallet-adapter-react@1.3.0

## 1.2.2

### Patch Changes

- a42a197: add action to control modal open or not

## 1.2.1

### Patch Changes

- ae47ccd: give wallet adapter ant design modal higher zindex to make sure it always shows up on screen

## 1.2.0

### Minor Changes

- 927cfc6: Add an optional prop for WalletSelector to handle modal open

## 1.1.3

### Patch Changes

- Updated dependencies [dc98bf4]
  - @aptos-labs/wallet-adapter-react@1.2.3

## 1.1.2

### Patch Changes

- Updated dependencies [22ecf6a]
- Updated dependencies [e4b06de]
  - @aptos-labs/wallet-adapter-react@1.2.2

## 1.1.1

### Patch Changes

- @aptos-labs/wallet-adapter-react@1.2.1

## 1.1.0

### Minor Changes

- 1672a0e: Add mobile wallet support on Ant Design wallet selector modal

## 1.0.6

### Patch Changes

- Updated dependencies [1605d28]
  - @aptos-labs/wallet-adapter-react@1.2.0

## 1.0.5

### Patch Changes

- Updated dependencies [d8d5a8a]
  - @aptos-labs/wallet-adapter-react@1.1.0

## 1.0.4

### Patch Changes

- @aptos-labs/wallet-adapter-react@1.0.6

## 1.0.3

### Patch Changes

- Updated dependencies [56a3f9f]
  - @aptos-labs/wallet-adapter-react@1.0.5

## 1.0.2

### Patch Changes

- Updated dependencies [8dea640]
  - @aptos-labs/wallet-adapter-react@1.0.4

## 1.0.1

### Patch Changes

- 03eb0f5: Define core package version to use
- Updated dependencies [03eb0f5]
  - @aptos-labs/wallet-adapter-react@1.0.3

## 1.0.0

### Major Changes

- e10ea7b: Add ANS support

## 0.1.1

### Patch Changes

- 7498973: Support Loadable wallet for ant-design and export NetworkName
- Updated dependencies [7498973]
  - @aptos-labs/wallet-adapter-react@0.2.3

## 0.1.0

### Minor Changes

- 8124d54: Create wallet selector modal with ant design
