---
"@aptos-labs/wallet-adapter-core": major
---

Bump `@aptos-labs/ts-sdk` peer dependency to `^7.0.0`. Consumers must upgrade to ts-sdk v7 (Node 22+, ESM-only). See https://github.com/aptos-labs/aptos-ts-sdk/blob/main/upgrade-guides/UPGRADE_GUIDE_7.0.0.md.

Internal imports were refactored to use ts-sdk subpath exports (`@aptos-labs/ts-sdk/bcs`) where available, producing a leaner type-resolution graph for downstream tooling. Public API of this package is unchanged.
