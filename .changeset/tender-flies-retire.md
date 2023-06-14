---
"@aptos-labs/wallet-adapter-mui-design": major
"@aptos-labs/wallet-adapter-core": patch
---

@aptos-labs/wallet-adapter-core:
Fixes ssr issue with checking for mobile wallets

@aptos-labs/wallet-adapter-mui-design:
Breaking:
When on a mobile phone on the native browser, we removed all wallets that are not able to be deep linked to.
The previous functionally would take them to the extension, which would not help users on mobile phones.
