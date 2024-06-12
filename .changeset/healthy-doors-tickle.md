---
"@aptos-labs/wallet-adapter-react": patch
---

Fixed a bug where `WalletProvider` would not automatically attempt to reconnect the wallet when the `autoConnect` is set to true after the initial render.
