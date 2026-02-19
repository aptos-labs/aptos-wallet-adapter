---
"@aptos-labs/cross-chain-core": minor
---

Added `onTransactionSigned` callback to all transfer and withdraw request types (`WormholeWithdrawRequest`, `WormholeTransferRequest`, `WormholeSubmitTransferRequest`, `WormholeClaimTransferRequest`, `WormholeInitiateWithdrawRequest`, `WormholeClaimWithdrawRequest`). The callback fires before and after each individual transaction is signed, enabling rich per-transaction progress UIs (e.g. "Approving USDC…", "Submitting bridge transaction…"). Also added to `Signer`, `AptosLocalSigner`, and `SolanaLocalSigner`.

