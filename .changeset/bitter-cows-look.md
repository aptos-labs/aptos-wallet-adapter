---
"@aptos-labs/wallet-adapter-core": minor
---

Add `hideWallets` and `fallbacks` to `groupAndSortWallets`. `hideWallets` will now allow users optionally hide certain wallets from the results.
`fallbacks` will allow users to specify fallback wallets for wallets that are not installed. This is used to support alternative connection methods for installed wallets, wallets with fallbacks will be moved to a new `availableWalletsWithFallbacks` list.
