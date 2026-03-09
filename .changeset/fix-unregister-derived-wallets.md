---
"@aptos-labs/derived-wallet-ethereum": patch
"@aptos-labs/derived-wallet-solana": patch
"@aptos-labs/derived-wallet-sui": patch
---

Unregister old derived wallets before re-registering on provider re-announcement, preventing stale wallets from remaining in the registry.
