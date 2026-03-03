---
"@aptos-labs/cross-chain-core": minor
---

Thread `CrossChainCore` through to `AptosLocalSigner`, replacing individual `dappNetwork` and `getExpireTimestamp` constructor parameters with a single `crossChainCore` instance. Also removed unused `options` parameter from `EthereumSigner.signAndSendTransaction`.
