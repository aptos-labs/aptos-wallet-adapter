---
"@aptos-labs/wallet-adapter-core": patch
"@aptos-labs/wallet-adapter-nextjs-example": patch
---

Add the `local` case to the switch statement that converts a string to a Network.

Narrow the type for `Account` to `Ed25519Account` to avoid a future linting error when the `@aptos-labs/ts-sdk` dependency is updated, since the new `Account` type does not have a private key.
