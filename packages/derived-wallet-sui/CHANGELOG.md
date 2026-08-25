# @aptos-labs/derived-wallet-sui

## 1.0.0

### Major Changes

- f7f70a7: Support `@aptos-labs/ts-sdk` 7.x and `@aptos-labs/wallet-standard` 2.x, and ship packages as ESM-only.

  Consumers must upgrade to ts-sdk `^7.1.0` (Node 22+, ESM `import` only — CommonJS `require()` is no longer supported). See the [ts-sdk 7.0 upgrade guide](https://github.com/aptos-labs/aptos-ts-sdk/blob/main/upgrade-guides/UPGRADE_GUIDE_7.0.0.md).

  Package TypeScript configs use `moduleResolution: "bundler"`. Published packages type-check with TypeScript 7.0 (`tsc`). Next.js 15 demo apps keep the TypeScript 6 compiler API (`@typescript/typescript6`) so Next can load `tsconfig` paths, and `@typescript/native` for the TypeScript 7 `tsc` binary.

### Patch Changes

- Updated dependencies [f7f70a7]
  - @aptos-labs/derived-wallet-base@1.0.0

## 0.2.1

### Patch Changes

- 4efd34e: Unregister old derived wallets before re-registering on provider re-announcement, preventing stale wallets from remaining in the registry.

## 0.2.0

### Minor Changes

- 39def14: Add Sui cross-chain CCTP transfers

### Patch Changes

- 494adef: Add Sui cross-chain wallet support
- Updated dependencies [494adef]
  - @aptos-labs/derived-wallet-base@0.11.0
