---
"@aptos-labs/cross-chain-core": patch
---

Recover EVM transaction hash when `response.wait()` fails in `EthereumSigner`. When the receipt wait fails (e.g., network timeout, RPC instability), the already-submitted `response.hash` is now returned instead of throwing. Also attempts to extract the transaction hash from error messages when `sendTransaction` itself throws after broadcast. This prevents bridge flows from losing the transaction reference after the on-chain transaction has been submitted.

