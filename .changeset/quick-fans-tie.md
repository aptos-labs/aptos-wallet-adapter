---
"@aptos-labs/wallet-adapter-core": patch
---

This update ensures that the Twallet provider emits a networkChange event even if the chainId remains the same, such as when switching between the Ethereum mainnet and the Aptos mainnet.
