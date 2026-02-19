---
"@aptos-labs/cross-chain-core": major
---

Renamed `sourceChain` to `claimChain` in `WormholeClaimWithdrawRequest` to clarify that it refers to the chain where the claim transaction executes (the bridge destination), not the chain that burns USDC. Added JSDoc to `WormholeWithdrawRequest.sourceChain` explaining its meaning. Wire format for server-side claims is unchanged for backward compatibility.

