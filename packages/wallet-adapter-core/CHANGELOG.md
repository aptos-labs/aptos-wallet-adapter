# @aptos-labs/wallet-adapter-core

## 5.4.1

### Patch Changes

- cdcec83: Rename Msafe wallet to MSafe in AvailableWallets + Add Rimosafe

## 5.4.0

### Minor Changes

- 613e592: Added support for MSafe Wallet

## 5.3.0

### Minor Changes

- 2ab3a0c: Adds multikey and keyless signAndVerify functionality

### Patch Changes

- f4a423b: include "Continue with Apple" in AvailableWallets type
- 6d7b28c: include "OKX Wallet" in AvailableWallets type

## 5.2.0

### Minor Changes

- ad3b6bb: Introduce x chain wallets logic in the react adapter provider

## 5.1.4

### Patch Changes

- 6bfd2fb: Upgrade the ts-sdk version

## 5.1.3

### Patch Changes

- 25ab2ef: Allow users to perform connections when the wallet is `_connected` but `_account` is `null`

## 5.1.2

### Patch Changes

- 6a5737a: Fix signIn method to throw the message property

## 5.1.1

### Patch Changes

- 3b5f4cf: Fix mobile redirect logic

## 5.1.0

### Minor Changes

- f11ea12: Add support for aptos:signIn feature

## 5.0.2

### Patch Changes

- 62d860d: Update @aptos-connect/wallet-adapter-plugin to 2.4.1

## 5.0.1

### Patch Changes

- 792dadf: Update @aptos-labs/wallet-standard to 0.3.0 and @aptos-connect/wallet-adapter-plugin to 2.4.0

## 5.0.0

### Major Changes

- ce53a2b: Major upgrade to only support AIP-62 standard compatible wallets

## 4.25.0

### Minor Changes

- c2de332: Deeplink Provider for Nightly Wallet
- 99dc712: Bump package versions

## 4.24.0

### Minor Changes

- b8cae2d: Fix deeplink redirect on mobile view

## 4.23.1

### Patch Changes

- 31fe032: Fix unexpected exceptions when submitting transaction with a CUSTOM network

## 4.23.0

### Minor Changes

- 80a3c8a: Support network based API key

## 4.22.2

### Patch Changes

- af7c080: Bump wallet adapter ts-sdk peer dependency version

## 4.22.1

### Patch Changes

- ca1dc8e: Bump all packages version to fix broken previous version

## 4.22.0

### Minor Changes

- fix publish

## 4.21.0

### Minor Changes

- bump mizu dep

### Patch Changes

- 6915184: @mizuwallet-sdk/aptos-wallet-adapter Bump version to 0.3.2

## 4.20.0

### Minor Changes

- f5ba2f2: Bump `@aptos-connect/wallet-adapter-plugin` to 2.3.2 to support Apple logins

## 4.19.0

### Minor Changes

- 66ad437: Bumped the Aptos Connect plugin to support claims

## 4.18.1

### Patch Changes

- 737bd2b: Bump @mizuwallet-sdk/aptos-wallet-adapter to v0.3.1 and add '--experimental-https' flag to nextjs-example's dev command.
- f9ecf18: Bump @aptos-labs/wallet-adapter-core version to v0.2.6

## 4.18.0

### Minor Changes

- 67440bf: Bumped `@aptos-connect/wallet-adapter-plugin` to 2.1.0 to enable Telegram support
- bde8112: Handle arguments conversion when submitting a package publish transaction

## 4.17.0

### Minor Changes

- e252fce: Add support for a dapp generated api key
- bd54d77: Bumped `@aptos-connect/wallet-adapter-plugin` to 2.0.2 and exposed `preferredWalletName` option

### Patch Changes

- d348384: Bump @mizuwallet-sdk/aptos-wallet-adapter version to 0.2.5

## 4.16.0

### Minor Changes

- 3795c56: Added transaction input support for `signTransaction`

## 4.15.1

### Patch Changes

- 3419043: Bump @mizuwallet-sdk/aptos-wallet-adapter version to 0.2.3
- ee95b8b: Upgrade @aptos-labe/ts-sdk version

## 4.15.0

### Minor Changes

- a2391db: Support a boolean flag to disable the adapter telemetry tool

### Patch Changes

- 92f7187: Bump @mizuwallet-sdk/aptos-wallet-adapter version to 0.2.0

## 4.14.0

### Minor Changes

- 4240f8b: Have the option to exclude AptosConnect from the wallet selector modal

### Patch Changes

- 0e37588: Bump @mizuwallet-sdk/aptos-wallet-adapter version to 0.1.5

## 4.13.2

### Patch Changes

- 754f6e1: Bump @mizuwallet-sdk/aptos-wallet-adapter version to 0.1.2
- 754f6e1: Bump @mizuwallet-sdk/aptos-wallet-adapter version to 0.1.3

## 4.13.1

### Patch Changes

- ae2351b: Change mizuWallet config to an optional prop

## 4.13.0

### Minor Changes

- 74f99d2: Add support for Mizu Wallet as an AIP-62 standarad compatible.

### Patch Changes

- 3d9ae51: Fix Keyless sign and verify

## 4.12.1

### Patch Changes

- 4fd4527: Skip verification for Keyless accounts

## 4.12.0

### Minor Changes

- d9ce63d: Add support for Pontem wallet as an AIP-62 standard compatible

## 4.11.1

### Patch Changes

- 0b7d07f: [Hot Fix] Pontem wallet version 2.6.7 does not include a URL prop

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
