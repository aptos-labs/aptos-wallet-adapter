---
"@aptos-labs/cross-chain-core": minor
---

Track last source-chain transaction ID on `CrossChainCore` for error recovery. Added `TransferError` class (analogous to `WithdrawError`) that preserves the source-chain burn hash when the transfer claim phase fails. Consumers can now recover the tx hash via `error.originChainTxnId` or `crossChainCore._lastSourceChainTxId`.
