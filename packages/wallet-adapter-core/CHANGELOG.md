# @aptos-labs/wallet-adapter-core

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
