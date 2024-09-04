# @aptos-labs/wallet-adapter-react

## 3.6.1

### Patch Changes

- Updated dependencies [3419043]
- Updated dependencies [ee95b8b]
  - @aptos-labs/wallet-adapter-core@4.15.1

## 3.6.0

### Minor Changes

- a2391db: Support a boolean flag to disable the adapter telemetry tool

### Patch Changes

- Updated dependencies [a2391db]
- Updated dependencies [92f7187]
  - @aptos-labs/wallet-adapter-core@4.15.0

## 3.5.10

### Patch Changes

- Updated dependencies [0e37588]
- Updated dependencies [4240f8b]
  - @aptos-labs/wallet-adapter-core@4.14.0

## 3.5.9

### Patch Changes

- Updated dependencies [754f6e1]
- Updated dependencies [754f6e1]
  - @aptos-labs/wallet-adapter-core@4.13.2

## 3.5.8

### Patch Changes

- Updated dependencies [ae2351b]
  - @aptos-labs/wallet-adapter-core@4.13.1

## 3.5.7

### Patch Changes

- Updated dependencies [74f99d2]
- Updated dependencies [3d9ae51]
  - @aptos-labs/wallet-adapter-core@4.13.0

## 3.5.6

### Patch Changes

- Updated dependencies [4fd4527]
  - @aptos-labs/wallet-adapter-core@4.12.1

## 3.5.5

### Patch Changes

- Updated dependencies [d9ce63d]
  - @aptos-labs/wallet-adapter-core@4.12.0

## 3.5.4

### Patch Changes

- Updated dependencies [0b7d07f]
  - @aptos-labs/wallet-adapter-core@4.11.1

## 3.5.3

### Patch Changes

- 91fe52c: Corrected a typo in the last education screen of the `AboutAptosConnect` component.

## 3.5.2

### Patch Changes

- Updated dependencies [f1fb4a5]
  - @aptos-labs/wallet-adapter-core@4.11.0

## 3.5.1

### Patch Changes

- Updated dependencies [249331f]
- Updated dependencies [6bfeb14]
- Updated dependencies [ed4f483]
  - @aptos-labs/wallet-adapter-core@4.10.0

## 3.5.0

### Minor Changes

- 96df1f7: Added `AboutAptosConnect` headless component for building Aptos Connect education screens.
- f23cf43: Fix adapter event communication

### Patch Changes

- Updated dependencies [96df1f7]
- Updated dependencies [f23cf43]
  - @aptos-labs/wallet-adapter-core@4.9.0

## 3.4.3

### Patch Changes

- Updated dependencies [79a0212]
  - @aptos-labs/wallet-adapter-core@4.8.2

## 3.4.2

### Patch Changes

- cbbbe23: Added Dapp id to dappConfig
- Updated dependencies [1644cfc]
- Updated dependencies [cbbbe23]
  - @aptos-labs/wallet-adapter-core@4.8.1

## 3.4.1

### Patch Changes

- 0bdbb0d: Fixed the SVG attributes for the graphic of the Aptos logo.

## 3.4.0

### Minor Changes

- 6bec234: Added `AptosPrivacyPolicy` headless component for building the privacy policy disclaimer that should be displayed below Aptos Connect login options.

## 3.3.1

### Patch Changes

- Updated dependencies [e3df2db]
- Updated dependencies [1580df8]
  - @aptos-labs/wallet-adapter-core@4.8.0

## 3.3.0

### Minor Changes

- 07ee265: Support dappConfig user prop to set SDK wallets configuration

### Patch Changes

- Updated dependencies [07ee265]
  - @aptos-labs/wallet-adapter-core@4.7.0

## 3.2.0

### Minor Changes

- 2e9b7df: Added `getAptosConnectWallets` utility function

### Patch Changes

- Updated dependencies [0672ff4]
  - @aptos-labs/wallet-adapter-core@4.6.0

## 3.1.1

### Patch Changes

- Updated dependencies [c1a9f41]
  - @aptos-labs/wallet-adapter-core@4.5.0

## 3.1.0

### Minor Changes

- 2e9c156: Added `partitionWallets`, `isInstalledOrLoadable`, `isInstallRequired`, and `truncateAddress` utility functions to make it easier to implement custom wallet selectors.
- 2e9c156: Added `WalletItem` headless component for implementing custom wallet selectors.

### Patch Changes

- 2e9c156: Fixed a bug where `WalletProvider` would not automatically attempt to reconnect the wallet when the `autoConnect` is set to true after the initial render.
- Updated dependencies [2e9c156]
  - @aptos-labs/wallet-adapter-core@4.4.0

## 3.0.7

### Patch Changes

- Updated dependencies [79b1bf8]
- Updated dependencies [9566c50]
  - @aptos-labs/wallet-adapter-core@4.3.0

## 3.0.6

### Patch Changes

- Updated dependencies [4db7a8d]
  - @aptos-labs/wallet-adapter-core@4.2.1

## 3.0.5

### Patch Changes

- Updated dependencies [9f94e4d]
  - @aptos-labs/wallet-adapter-core@4.2.0

## 3.0.4

### Patch Changes

- Updated dependencies [cc4021b]
- Updated dependencies [ec6cb0c]
  - @aptos-labs/wallet-adapter-core@4.1.3

## 3.0.3

### Patch Changes

- Updated dependencies [1ff5230]
  - @aptos-labs/wallet-adapter-core@4.1.2

## 3.0.2

### Patch Changes

- 6e152e4: Revert Support account prop to be of AIP-62 AccountInfo type
- Updated dependencies [6e152e4]
  - @aptos-labs/wallet-adapter-core@4.1.1

## 3.0.1

### Patch Changes

- Updated dependencies [3ed84cd]
  - @aptos-labs/wallet-adapter-core@4.1.0

## 3.0.0

### Major Changes

- 2c826a4: Support account prop to be of AIP-62 AccountInfo type

### Patch Changes

- Updated dependencies [2c826a4]
  - @aptos-labs/wallet-adapter-core@4.0.0

## 2.5.1

### Patch Changes

- Updated dependencies [6a58c61]
  - @aptos-labs/wallet-adapter-core@3.16.0

## 2.5.0

### Minor Changes

- 4832532: Wallets opt-in support

### Patch Changes

- Updated dependencies [4832532]
  - @aptos-labs/wallet-adapter-core@3.15.0

## 2.4.0

### Minor Changes

- ef53f38: AIP-62 standard compatible wallet registry list

### Patch Changes

- Updated dependencies [69b6101]
- Updated dependencies [870ee0c]
- Updated dependencies [ef53f38]
  - @aptos-labs/wallet-adapter-core@3.14.0

## 2.3.7

### Patch Changes

- Updated dependencies [19f4fdd]
  - @aptos-labs/wallet-adapter-core@3.13.0

## 2.3.6

### Patch Changes

- 92a1801: Fixed the `useEffect` dependency array for auto-connecting to be `[wallets]` instead of `wallets`
- 106d55c: Export all Interfaces and types
- Updated dependencies [106d55c]
  - @aptos-labs/wallet-adapter-core@3.12.1

## 2.3.5

### Patch Changes

- Updated dependencies [740e909]
- Updated dependencies [2cc2eb5]
- Updated dependencies [e46b930]
  - @aptos-labs/wallet-adapter-core@3.12.0

## 2.3.4

### Patch Changes

- Updated dependencies [ec02b10]
  - @aptos-labs/wallet-adapter-core@3.11.2

## 2.3.3

### Patch Changes

- Updated dependencies [55f9970]
  - @aptos-labs/wallet-adapter-core@3.11.1

## 2.3.2

### Patch Changes

- Updated dependencies [245ce8d]
  - @aptos-labs/wallet-adapter-core@3.11.0

## 2.3.1

### Patch Changes

- Updated dependencies [41f9485]
  - @aptos-labs/wallet-adapter-core@3.10.0

## 2.3.0

### Minor Changes

- 444c708: Fix wallet detection

### Patch Changes

- Updated dependencies [6be2a06]
  - @aptos-labs/wallet-adapter-core@3.9.0

## 2.2.1

### Patch Changes

- Updated dependencies [4127cfb]
  - @aptos-labs/wallet-adapter-core@3.8.0

## 2.2.0

### Minor Changes

- 4d6e2f6: Add AIP-62 wallet standard support

### Patch Changes

- Updated dependencies [4d6e2f6]
  - @aptos-labs/wallet-adapter-core@3.7.0

## 2.1.8

### Patch Changes

- Updated dependencies [8ebd4c7]
  - @aptos-labs/wallet-adapter-core@3.6.0

## 2.1.7

### Patch Changes

- Updated dependencies [4ca4201]
  - @aptos-labs/wallet-adapter-core@3.5.0

## 2.1.6

### Patch Changes

- Updated dependencies [e1e9eb2]
  - @aptos-labs/wallet-adapter-core@3.4.0

## 2.1.5

### Patch Changes

- Updated dependencies [570cbda]
  - @aptos-labs/wallet-adapter-core@3.3.0

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
