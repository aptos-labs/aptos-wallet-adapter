---
"@aptos-labs/derived-wallet-ethereum": patch
---

Forward `domain` in `createSiweEnvelopeForAptosTransaction` so `createTransactionStatement` no longer falls back to `window.location.host`, which is undefined in Node and crashes server-side / programmatic flows (e.g. `EIP1193DerivedAccount.signTransactionWithAuthenticator`).
