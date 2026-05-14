---
"@aptos-labs/cross-chain-core": major
---

Bump `@aptos-labs/ts-sdk` peer dependency to `^7.0.0`. See https://github.com/aptos-labs/aptos-ts-sdk/blob/main/upgrade-guides/UPGRADE_GUIDE_7.0.0.md.

Refactored internal imports to use ts-sdk subpath exports (`@aptos-labs/ts-sdk/bcs`) where available. Re-exported symbols (`Network`, `NetworkToChainId`, `NetworkToNodeAPI`, `AccountAddressInput`) continue to come from the root entry — these do not have a v7 subpath.
