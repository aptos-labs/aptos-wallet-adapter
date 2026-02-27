---
"@aptos-labs/cross-chain-core": patch
---

Handle Solana "block height exceeded" errors gracefully in `sendAndConfirmTransaction`. When the blockhash expires before confirmation completes, the transaction signature is now returned instead of throwing, since the transaction was already sent and may still land on-chain. This prevents bridge flows from failing after the irreversible source-chain transaction has been submitted.

