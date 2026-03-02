---
"@aptos-labs/derived-wallet-solana": patch
---

Improved Solana transaction signing fallback behavior by trying SIWS (`signIn`) first and automatically falling back to `signMessage` when wallets expose `signIn` but throw at runtime (for example, "not implemented"). This removes wallet-name specific handling and makes compatibility more robust across wallet implementations.
