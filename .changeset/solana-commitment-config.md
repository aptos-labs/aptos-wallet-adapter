---
"@aptos-labs/cross-chain-core": minor
---

Allow configuring the default Solana commitment level via `solanaConfig.commitment` in `CrossChainDappConfig`. The client-side `SolanaSigner` now reads this value as a fallback before defaulting to `"finalized"`. Setting `commitment: "confirmed"` reduces confirmation wait from ~30 s to ~0.5 s, which is sufficient for bridge flows where Wormhole guardians independently verify finality.

