# @aptos-labs/wallet-adapter-core

## 4.11.0

### Minor Changes

- f1fb4a5: Add proper dappconfig type to wallet core

## 4.10.0

### Minor Changes

- 6bfeb14: Add dapp id to be passed to AptosConnect

### Patch Changes

- 249331f: it stops emitting register event to prevent TWallet button to render twice
- ed4f483: resolves connection issues with Twallet due to hardcoded twallet url

## 4.9.0

### Minor Changes

- 96df1f7: Added `groupAndSortWallets` utility function.
- f23cf43: Fix adapter event communication

## 4.8.2

### Patch Changes

- 79a0212: Bumped to `@aptos-connect/wallet-adapter-plugin` v1.0.1

## 4.8.1

### Patch Changes

- 1644cfc: use isAptosConnectWallet function to verify a wallet is an AptosConnect wallet in excludeWallet function
- cbbbe23: Added Dapp id to dappConfig

## 4.8.0

### Minor Changes

- e3df2db: Added the following utility functions: `getAptosConnectWallets`, `partitionWallets`, `isInstalledOrLoadable`, `isInstallRequired`, and `truncateAddress`.
- 1580df8: Add Petra to the AIP-62 wallet registry

## 4.7.0

### Minor Changes

- 07ee265: Support dappConfig user prop to set SDK wallets configuration

## 4.6.0

### Minor Changes

- 0672ff4: Added `APTOS_CONNECT_BASE_URL`, `APTOS_CONNECT_ACCOUNT_URL`, and `isAptosConnectWallet`

## 4.5.0

### Minor Changes

- c1a9f41: Bumped auto-injected AptosConnect plugin version

## 4.4.0

### Minor Changes

- 2e9c156: Added `AnyAptosWallet` union type alias.

## 4.3.0

### Minor Changes

- 79b1bf8: Add AptosConnect

### Patch Changes

- 9566c50: Bumped @aptos-connect/wallet-adapter-plugin version to include args normalization fix

## 4.2.1

### Patch Changes

- 4db7a8d: Trigger release to update WALLET_ADAPTER_CORE_VERSION injected variable

## 4.2.0

### Minor Changes

- 9f94e4d: Support signAndSubmitTransaction standard function feature version 1.1.0

## 4.1.3

### Patch Changes

- cc4021b: Add the `local` case to the switch statement that converts a string to a Network.
- ec6cb0c: it bumps @atomrigslab/aptos-wallet-adapter version to fixe redirection issue with Twallet URL

## 4.1.2

### Patch Changes

- 1ff5230: [hot fix] remove petra from aip-62 wallet registry

## 4.1.1

### Patch Changes

- 6e152e4: Revert Support account prop to be of AIP-62 AccountInfo type

## 4.1.0

### Minor Changes

- 3ed84cd: Query ANS name with account address as string

## 4.0.0

### Major Changes

- 2c826a4: Support account prop to be of AIP-62 AccountInfo type

## 3.16.0

### Minor Changes

- 6a58c61: Add Petra as a AIP-62 compatible wallet

## 3.15.0

### Minor Changes

- 4832532: Wallets opt-in support

## 3.14.0

### Minor Changes

- 69b6101: Add multisig transaction support
- 870ee0c: Support T Wallet as a SDK wallet in the adapter core
- ef53f38: AIP-62 standard compatible wallet registry list

## 3.13.0

### Minor Changes

- 19f4fdd: Exposing wallet adapter core version into window object

## 3.12.1

### Patch Changes

- 106d55c: Export all Interfaces and types

## 3.12.0

### Minor Changes

- 2cc2eb5: Trigger connect if iOS extension is detected.
- e46b930: Add change network request support

### Patch Changes

- 740e909: Block scam transaction submission

## 3.11.2

### Patch Changes

- ec02b10: Monkey-patched `signTransaction` v1 to be compatible with AIP62 wallets

## 3.11.1

### Patch Changes

- 55f9970: Update aptos ts-sdk to latest version 1.13.2

## 3.11.0

### Minor Changes

- 245ce8d: Support a custom network defined in a Wallet

## 3.10.0

### Minor Changes

- 41f9485: Implement GA4

## 3.9.0

### Minor Changes

- 6be2a06: Convert uppercase network name to lowercase in NetworkInfo

## 3.8.0

### Minor Changes

- 4127cfb: Support AIP-62 connect wallet method response

## 3.7.0

### Minor Changes

- 4d6e2f6: Add AIP-62 wallet standard support

## 3.6.0

### Minor Changes

- 8ebd4c7: Upgrade Aptos ts sdk version to 1.6.0

## 3.5.0

### Minor Changes

- 4ca4201: Export PluginProvider type

## 3.4.0

### Minor Changes

- e1e9eb2: ['Bug fix'] Use current connected wallet to compare to the selected wallet before connecting to a wallet

## 3.3.0

### Minor Changes

- 570cbda: Update @aptos-labs/ts-sdk package version to 1.3.0

## 3.2.1

### Patch Changes

- 3f38c51: Return false from areBCSArguments function if array is empty

## 3.2.0

### Minor Changes

- 12163ca: Updated SDK dependencies

### Patch Changes

- a6f0e46: Fix is bcs argument types check

## 3.1.1

### Patch Changes

- 6266a29: Consolidate options argument on signAndSubmitTransaction

## 3.1.0

### Minor Changes

- 6257015: [deps] Updated aptos and @aptos-labs/ts-sdk dependencies to latest versions
- aa3d15a: Make sender optional when sign and submit single signer transaction

## 3.0.0

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

## 2.6.0

### Minor Changes

- 7acfa69: Adding support for the new Typescript SDK in the package `@aptos-labs/ts-sdk`. The wallet adapter now supports submitting a basic transaction with the new SDK types.

### Patch Changes

- dd6e1ed: Moves dependencies to peer dependencies as needed

## 2.5.1

### Patch Changes

- 7e314e5: Update aptos dependency

## 2.5.0

### Minor Changes

- c95933a: Update the `onNetworkChange` type interface to conform with `WalletCore`'s usage of the callback

## 2.4.0

### Minor Changes

- d2a0bbd: Support error message on connect and disconnect functions

### Patch Changes

- b0586e8: Separate connect and connectWallet for SRP

## 2.3.3

### Patch Changes

- dc98bf4: fix sendAndSubmitTransaction params

## 2.3.2

### Patch Changes

- 22ecf6a: Throw `wallet already connected` error when trying to connect to an already connected wallet

## 2.3.1

### Patch Changes

- 06f334f: @aptos-labs/wallet-adapter-core:
  Fixes ssr issue with checking for mobile wallets

  @aptos-labs/wallet-adapter-mui-design:
  Breaking:
  When on a mobile phone on the native browser, we removed all wallets that are not able to be deep linked to.
  The previous functionally would take them to the extension, which would not help users on mobile phones.

## 2.3.0

### Minor Changes

- bb1595e: Fix deeplink redirect
- 1605d28: Support ReadonlyArray of Wallets in AptosWalletAdapterProvider and WalletCore

## 2.2.0

### Minor Changes

- 814939c: Add deeplink support

## 2.1.0

### Minor Changes

- 50968c4: Support to submit bcs serialized transactions

### Patch Changes

- 8dea640: Fix wallet adapter auto reconnect on page refresh

## 1.0.0

### Major Changes

- e10ea7b: Add ANS support

## 0.2.3

### Patch Changes

- 017556c: connect() to simply return if wallet is not installed

## 0.2.2

### Patch Changes

- d4e298f: Support Lodable wallet
  Implement multi signature verification
  Add a new optional property propertyName for multi-chain wallet
- 5fc6981: Throw wallet not found error when trying to connect to an uninstalled wallet
- d711f43: Import tweetnacl package via default export to support commonJS

## 0.2.1

### Patch Changes

- 1c3576e: Throw Sign Transaction is not supported error

## 0.2.0

### Minor Changes

- 576bb57: Add chainId and url propoerties to NetworkInfo type
- 6e53116: Add support to verify a signed message

### Patch Changes

- 18a0429: Add properties to SignMessageResponse interface
- 42e29f6: Add multisig support for AccountInfo
