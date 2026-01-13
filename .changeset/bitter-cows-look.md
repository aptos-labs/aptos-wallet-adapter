---
"@aptos-labs/wallet-adapter-core": minor
---

Added `hideWallets` to `WalletCore` which will allow users optionally hide certain wallets from the default lists of wallets but will be available through the `hiddenWallets` property.

Also added `fallbacks` to `groupAndSortWallets` which will allow users to specify fallback wallets for wallets that are not installed. This is used to support alternative connection methods for installed wallets, wallets with fallbacks will be moved to a new `availableWalletsWithFallbacks` list.
