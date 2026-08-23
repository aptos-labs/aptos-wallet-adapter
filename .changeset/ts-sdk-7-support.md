---
"@aptos-labs/wallet-adapter-ant-design": major
"@aptos-labs/wallet-adapter-mui-design": major
"@aptos-labs/wallet-adapter-react": major
"@aptos-labs/wallet-adapter-core": major
"@aptos-labs/cross-chain-core": major
"@aptos-labs/derived-wallet-ethereum": major
"@aptos-labs/derived-wallet-solana": major
"@aptos-labs/derived-wallet-base": major
"@aptos-labs/derived-wallet-sui": major
---

Support `@aptos-labs/ts-sdk` 7.x and `@aptos-labs/wallet-standard` 2.x, and ship packages as ESM-only.

Consumers must upgrade to ts-sdk `^7.1.0` (Node 22+, ESM `import` only — CommonJS `require()` is no longer supported). See the [ts-sdk 7.0 upgrade guide](https://github.com/aptos-labs/aptos-ts-sdk/blob/main/upgrade-guides/UPGRADE_GUIDE_7.0.0.md).

Package TypeScript configs use `moduleResolution: "bundler"`. Published packages type-check with TypeScript 7.0 (`tsc`). Next.js 15 demo apps keep the TypeScript 6 compiler API (`@typescript/typescript6`) so Next can load `tsconfig` paths, and `@typescript/native` for the TypeScript 7 `tsc` binary.
