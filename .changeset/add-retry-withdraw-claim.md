---
"@aptos-labs/cross-chain-core": minor
---

Added `retryWithdrawClaim` method to `WormholeProvider` with configurable exponential backoff for retrying failed claim transactions. Also added `RetryWithdrawClaimRequest` and `RetryWithdrawClaimResponse` types. This enables robust error recovery when the claim phase of a withdrawal fails after the irreversible Aptos burn has already been submitted.

