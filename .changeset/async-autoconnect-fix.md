---
"@aptos-labs/wallet-adapter-react": patch
---

fix: support async autoConnect and late wallet injection

Previously, autoConnect had two issues:
1. If `autoConnect` started as `false` and later became `true` (e.g., after fetching user preferences), auto-connect would never trigger
2. If a wallet extension injected after the initial render, auto-connect would fail even though the wallet was eventually available

Now, the auto-connect attempt is only marked as complete when we actually find and connect to the wallet, allowing:
- dApps to set `autoConnect` asynchronously
- Wallet extensions that register late to still trigger auto-connect

