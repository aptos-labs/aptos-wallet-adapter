# @aptos-labs/wallet-adapter-core

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
