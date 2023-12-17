# @aptos-labs/wallet-adapter-mui-design

## 2.1.0

### Minor Changes

- 12163ca: Updated SDK dependencies

### Patch Changes

- @aptos-labs/wallet-adapter-react@2.1.3

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

## 1.0.7

### Patch Changes

- dd6e1ed: Moves dependencies to peer dependencies as needed
- Updated dependencies [7acfa69]
- Updated dependencies [dd6e1ed]
  - @aptos-labs/wallet-adapter-react@1.4.0

## 1.0.5

### Patch Changes

- 7e314e5: Update aptos dependency
- Updated dependencies [7e314e5]
  - @aptos-labs/wallet-adapter-react@1.3.2

## 1.0.4

### Patch Changes

- @aptos-labs/wallet-adapter-react@1.3.1

## 1.0.3

### Patch Changes

- Updated dependencies [3834890]
  - @aptos-labs/wallet-adapter-react@1.3.0

## 1.0.2

### Patch Changes

- Updated dependencies [dc98bf4]
  - @aptos-labs/wallet-adapter-react@1.2.3

## 1.0.1

### Patch Changes

- Updated dependencies [22ecf6a]
- Updated dependencies [e4b06de]
  - @aptos-labs/wallet-adapter-react@1.2.2

## 1.0.0

### Major Changes

- 06f334f: @aptos-labs/wallet-adapter-core:
  Fixes ssr issue with checking for mobile wallets

  @aptos-labs/wallet-adapter-mui-design:
  Breaking:
  When on a mobile phone on the native browser, we removed all wallets that are not able to be deep linked to.
  The previous functionally would take them to the extension, which would not help users on mobile phones.

### Patch Changes

- @aptos-labs/wallet-adapter-react@1.2.1

## 0.3.5

### Patch Changes

- Updated dependencies [1605d28]
  - @aptos-labs/wallet-adapter-react@1.2.0

## 0.3.4

### Patch Changes

- Updated dependencies [d8d5a8a]
  - @aptos-labs/wallet-adapter-react@1.1.0

## 0.3.3

### Patch Changes

- @aptos-labs/wallet-adapter-react@1.0.6

## 0.3.2

### Patch Changes

- Updated dependencies [56a3f9f]
  - @aptos-labs/wallet-adapter-react@1.0.5

## 0.3.1

### Patch Changes

- Updated dependencies [8dea640]
  - @aptos-labs/wallet-adapter-react@1.0.4

## 0.3.0

### Minor Changes

- 55727e0: Update mui package design layout

## 0.2.0

### Minor Changes

- be2e1ac: enable ans name display on mui package

## 0.1.2

### Patch Changes

- 03eb0f5: Define core package version to use
- Updated dependencies [03eb0f5]
  - @aptos-labs/wallet-adapter-react@1.0.3

## 0.1.1

### Patch Changes

- 2678efe: Fix Loadable wallet connection for mui design

## 0.1.0

### Minor Changes

- f62830b: Add MUI framework design package to the wallet adapter with updated nextjs example
