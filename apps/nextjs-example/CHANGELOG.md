# @aptos-labs/wallet-adapter-nextjs-example

## 2.4.1

### Patch Changes

- Updated dependencies [e1e9eb2]
  - @aptos-labs/wallet-adapter-core@3.4.0
  - @aptos-labs/wallet-adapter-react@2.1.6

## 2.4.0

### Minor Changes

- 570cbda: Update @aptos-labs/ts-sdk package version to 1.3.0

### Patch Changes

- Updated dependencies [570cbda]
  - @aptos-labs/wallet-adapter-core@3.3.0
  - @aptos-labs/wallet-adapter-react@2.1.5

## 2.3.1

### Patch Changes

- Updated dependencies [3f38c51]
  - @aptos-labs/wallet-adapter-core@3.2.1
  - @aptos-labs/wallet-adapter-react@2.1.4

## 2.3.0

### Minor Changes

- 12163ca: Updated SDK dependencies

### Patch Changes

- Updated dependencies [12163ca]
- Updated dependencies [a6f0e46]
  - @aptos-labs/wallet-adapter-mui-design@2.1.0
  - @aptos-labs/wallet-adapter-core@3.2.0
  - @aptos-labs/wallet-adapter-react@2.1.3

## 2.2.2

### Patch Changes

- a1c08cc: Export missing InputTransactionData type
- Updated dependencies [a1c08cc]
  - @aptos-labs/wallet-adapter-react@2.1.2

## 2.2.1

### Patch Changes

- Updated dependencies [6266a29]
  - @aptos-labs/wallet-adapter-react@2.1.1
  - @aptos-labs/wallet-adapter-core@3.1.1

## 2.2.0

### Minor Changes

- 6257015: [deps] Updated aptos and @aptos-labs/ts-sdk dependencies to latest versions
- aa3d15a: Make sender optional when sign and submit single signer transaction

### Patch Changes

- Updated dependencies [6257015]
- Updated dependencies [aa3d15a]
  - @aptos-labs/wallet-adapter-core@3.1.0
  - @aptos-labs/wallet-adapter-react@2.1.0

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
  - @aptos-labs/wallet-adapter-ant-design@2.0.0
  - @aptos-labs/wallet-adapter-mui-design@2.0.0
  - @aptos-labs/wallet-adapter-react@2.0.0
  - @aptos-labs/wallet-adapter-core@3.0.0

## 1.3.0

### Minor Changes

- 7acfa69: Adding support for the new Typescript SDK in the package `@aptos-labs/ts-sdk`. The wallet adapter now supports submitting a basic transaction with the new SDK types.

### Patch Changes

- Updated dependencies [7acfa69]
- Updated dependencies [dd6e1ed]
  - @aptos-labs/wallet-adapter-react@1.4.0
  - @aptos-labs/wallet-adapter-core@2.6.0
  - @aptos-labs/wallet-adapter-ant-design@1.2.7
  - @aptos-labs/wallet-adapter-mui-design@1.0.7

## 1.2.11

### Patch Changes

- Updated dependencies [7e314e5]
  - @aptos-labs/wallet-adapter-ant-design@1.2.5
  - @aptos-labs/wallet-adapter-mui-design@1.0.5
  - @aptos-labs/wallet-adapter-react@1.3.2

## 1.2.10

### Patch Changes

- 0a60c6f: Refactor to use onError adapter provider prop
- 63cf617: Use ReactNode for the AlertProvider success/error text

## 1.2.9

### Patch Changes

- 13a0b37: Add PetraWallet back into the example dApp

## 1.2.8

### Patch Changes

- @aptos-labs/wallet-adapter-react@1.3.1
- @aptos-labs/wallet-adapter-ant-design@1.2.4
- @aptos-labs/wallet-adapter-mui-design@1.0.4

## 1.2.7

### Patch Changes

- Updated dependencies [3834890]
  - @aptos-labs/wallet-adapter-react@1.3.0
  - @aptos-labs/wallet-adapter-ant-design@1.2.3
  - @aptos-labs/wallet-adapter-mui-design@1.0.3

## 1.2.6

### Patch Changes

- Updated dependencies [a42a197]
  - @aptos-labs/wallet-adapter-ant-design@1.2.2

## 1.2.5

### Patch Changes

- Updated dependencies [ae47ccd]
  - @aptos-labs/wallet-adapter-ant-design@1.2.1

## 1.2.4

### Patch Changes

- Updated dependencies [927cfc6]
  - @aptos-labs/wallet-adapter-ant-design@1.2.0

## 1.2.3

### Patch Changes

- Updated dependencies [dc98bf4]
  - @aptos-labs/wallet-adapter-react@1.2.3
  - @aptos-labs/wallet-adapter-ant-design@1.1.3
  - @aptos-labs/wallet-adapter-mui-design@1.0.2

## 1.2.2

### Patch Changes

- 22ecf6a: Throw `wallet already connected` error when trying to connect to an already connected wallet
- Updated dependencies [22ecf6a]
- Updated dependencies [e4b06de]
  - @aptos-labs/wallet-adapter-react@1.2.2
  - @aptos-labs/wallet-adapter-ant-design@1.1.2
  - @aptos-labs/wallet-adapter-mui-design@1.0.1

## 1.2.1

### Patch Changes

- Updated dependencies [06f334f]
  - @aptos-labs/wallet-adapter-mui-design@1.0.0
  - @aptos-labs/wallet-adapter-react@1.2.1
  - @aptos-labs/wallet-adapter-ant-design@1.1.1

## 1.2.0

### Minor Changes

- 1672a0e: Add mobile wallet support on Ant Design wallet selector modal

### Patch Changes

- Updated dependencies [1672a0e]
  - @aptos-labs/wallet-adapter-ant-design@1.1.0

## 1.1.1

### Patch Changes

- bb1595e: Fix deeplink redirect
- Updated dependencies [1605d28]
  - @aptos-labs/wallet-adapter-react@1.2.0
  - @aptos-labs/wallet-adapter-ant-design@1.0.6
  - @aptos-labs/wallet-adapter-mui-design@0.3.5

## 1.1.0

### Minor Changes

- d8d5a8a: Support deeplink on React Provider and Nextjs demo app

### Patch Changes

- Updated dependencies [d8d5a8a]
  - @aptos-labs/wallet-adapter-react@1.1.0
  - @aptos-labs/wallet-adapter-ant-design@1.0.5
  - @aptos-labs/wallet-adapter-mui-design@0.3.4

## 1.0.7

### Patch Changes

- @aptos-labs/wallet-adapter-react@1.0.6
- @aptos-labs/wallet-adapter-ant-design@1.0.4
- @aptos-labs/wallet-adapter-mui-design@0.3.3

## 1.0.6

### Patch Changes

- 56a3f9f: BCS transaction support in react provider package
- Updated dependencies [56a3f9f]
  - @aptos-labs/wallet-adapter-react@1.0.5
  - @aptos-labs/wallet-adapter-ant-design@1.0.3
  - @aptos-labs/wallet-adapter-mui-design@0.3.2

## 1.0.5

### Patch Changes

- Updated dependencies [8dea640]
  - @aptos-labs/wallet-adapter-react@1.0.4
  - @aptos-labs/wallet-adapter-ant-design@1.0.2
  - @aptos-labs/wallet-adapter-mui-design@0.3.1

## 1.0.4

### Patch Changes

- Updated dependencies [55727e0]
  - @aptos-labs/wallet-adapter-mui-design@0.3.0

## 1.0.3

### Patch Changes

- Updated dependencies [be2e1ac]
  - @aptos-labs/wallet-adapter-mui-design@0.2.0

## 1.0.2

### Patch Changes

- Updated dependencies [03eb0f5]
  - @aptos-labs/wallet-adapter-ant-design@1.0.1
  - @aptos-labs/wallet-adapter-mui-design@0.1.2
  - @aptos-labs/wallet-adapter-react@1.0.3

## 0.4.2

### Patch Changes

- Updated dependencies [e10ea7b]
  - @aptos-labs/wallet-adapter-ant-design@1.0.0

## 0.4.1

### Patch Changes

- Updated dependencies [2678efe]
  - @aptos-labs/wallet-adapter-mui-design@0.1.1

## 0.4.0

### Minor Changes

- e03f79c: Update Blocto and Martian package version and fix a minor autoConnect bug

### Patch Changes

- Updated dependencies [e03f79c]
  - @aptos-labs/wallet-adapter-react@0.2.4

## 0.3.0

### Minor Changes

- f62830b: Add MUI framework design package to the wallet adapter with updated nextjs example

### Patch Changes

- Updated dependencies [f62830b]
  - @aptos-labs/wallet-adapter-mui-design@0.1.0

## 0.2.2

### Patch Changes

- Updated dependencies [7498973]
  - @aptos-labs/wallet-adapter-ant-design@0.1.1
  - @aptos-labs/wallet-adapter-react@0.2.3

## 0.2.1

### Patch Changes

- Updated dependencies [552d255]
  - @aptos-labs/wallet-adapter-react@0.2.2

## 0.2.0

### Minor Changes

- 8124d54: Create wallet selector modal with ant design

### Patch Changes

- Updated dependencies [8124d54]
  - @aptos-labs/wallet-adapter-ant-design@0.1.0

## 0.1.1

### Patch Changes

- c3eb031: Export WalletReadyState enum from react package
- Updated dependencies [c3eb031]
  - @aptos-labs/wallet-adapter-react@0.2.1

## 0.1.0

### Minor Changes

- 6e53116: Add support to verify a signed message

### Patch Changes

- Updated dependencies [18a0429]
- Updated dependencies [42e29f6]
- Updated dependencies [576bb57]
- Updated dependencies [6e53116]
  - @aptos-labs/wallet-adapter-core@0.2.0
  - @aptos-labs/wallet-adapter-react@0.2.0
