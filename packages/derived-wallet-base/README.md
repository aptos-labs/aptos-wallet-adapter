# Derived Wallet Base

Shared utilities and abstractions for Derivable Abstracted Account (DAA) integrations with the Aptos blockchain.

> **Note:** This is an internal package. If you're building a dApp, use one of the chain-specific packages instead:
> - [@aptos-labs/derived-wallet-ethereum](../derived-wallet-ethereum/)
> - [@aptos-labs/derived-wallet-solana](../derived-wallet-solana/)
> - [@aptos-labs/derived-wallet-sui](../derived-wallet-sui/)

## What's Included

- **DAA Address Computation** - `computeDerivableAuthenticationKey()` for deriving Aptos addresses from cross-chain identities
- **Structured Messages** - Encoding/decoding for Aptos structured message format
- **Signing Message Parsing** - Parse incoming transaction and message signing requests
- **Envelope Utilities** - Create human-readable statements for "Sign in with..." flows
- **User Response Helpers** - Standard wallet response utilities

## Resources

- [X-Chain Account Docs](https://aptos.dev/build/sdks/wallet-adapter/x-chain-accounts)
- [AIP-113 Derivable Account Abstraction](https://github.com/aptos-foundation/AIPs/blob/main/aips/aip-113.md)

## License

Apache-2.0
