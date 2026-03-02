---
"@aptos-labs/cross-chain-core": minor
---

Added `evmConfig` and `suiConfig` options to `CrossChainDappConfig` so consumers can provide custom RPC endpoints for EVM chains and Sui. Custom RPCs are used for balance lookups (`getWalletUSDCBalance`) and Wormhole SDK initialization, falling back to the built-in `defaultRpc` values when not specified. Also exported the `EvmChainName` type for use in consumer code.

