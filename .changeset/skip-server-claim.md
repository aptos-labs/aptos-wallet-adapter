---
"@aptos-labs/cross-chain-core": minor
---

Add `skipServerClaim` option to `claimWithdraw` in WormholeProvider. When set to `true`, bypasses the server-side claim endpoint and falls back to a client-side wallet-signed claim, allowing users to complete withdrawals when the server is unreachable.
