---
"@aptos-labs/derived-wallet-solana": patch
---

Improved Solana transaction signing fallback behavior by trying SIWS (`signIn`) first and automatically falling back to `signMessage` when wallets expose `signIn` but throw at runtime (for example, "not implemented"). The fallback only triggers for non-`WalletError` exceptions, so user rejections signaled via `WalletError` (even with non-standard messages) propagate correctly instead of silently double-prompting via `signMessage`.
