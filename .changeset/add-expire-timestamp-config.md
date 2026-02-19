---
"@aptos-labs/cross-chain-core": minor
---

Added `getExpireTimestamp` option to `CrossChainDappConfig` for configuring Aptos transaction expiration timestamps. The callback is invoked at transaction-build time so each transaction in a multi-step bridge flow gets a fresh expiration window. Threaded through both `AptosSigner` and `AptosLocalSigner`.

