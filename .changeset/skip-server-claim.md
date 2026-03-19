---
"@aptos-labs/cross-chain-core": minor
---

Added `skipServerClaim` option to `WormholeClaimWithdrawRequest`. When `true`, `claimWithdraw` bypasses the configured `serverClaimUrl` endpoint and falls through to the client-side wallet-signed claim path. This enables UI-level fallback when the server endpoint is unreachable — users can complete the claim by signing the transaction themselves and paying gas (e.g. SOL on Solana). Default behavior is unchanged; when omitted or `false`, server-side claims are used when available.
