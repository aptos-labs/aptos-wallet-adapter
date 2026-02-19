---
"@aptos-labs/cross-chain-core": major
---

Renamed `sourceChain` to `claimChain` in `WormholeClaimWithdrawRequest` and in the server-side claim wire format to clarify that it refers to the chain where the claim transaction executes (the bridge destination), not the chain that burns USDC. Added JSDoc to `WormholeWithdrawRequest.sourceChain` explaining its meaning. Updated the example server-side claim route to match.

