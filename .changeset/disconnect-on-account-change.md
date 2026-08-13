---
"@aptos-labs/wallet-adapter-react": minor
---

Add `disconnectOnAccountChange` prop to `AptosWalletAdapterProvider`. When enabled, switching accounts in the wallet extension triggers a full disconnect instead of silently updating the account, preventing stale session state for apps using session keys or per-account authorization. The function form receives `(newAccount, previousAccount)` for selective handling.
