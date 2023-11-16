---
"@aptos-labs/wallet-adapter-ant-design": major
"@aptos-labs/wallet-adapter-mui-design": major
"@aptos-labs/wallet-adapter-react": major
"@aptos-labs/wallet-adapter-core": major
"@aptos-labs/wallet-adapter-nextjs-example": major
---

Support TypeScript SDK V2. Fully compatible with existing SDK V1 and Wallet Adapter V1
but with a full SDK V2 support for the dapp.

- Add support for SDK V2 input types
- `signAndSubmitTransaction()` accept only SDK V2 transaction input type
- Implement a `submitTransaction()` function for multi signers transactions
- `signTransaction()` to support both SDK V1 and V2 versions
- Convert wallet `SignedTransaction` response from `signTransaction()` to TS SDK V2 `AccountAuthenticator`
- Demo app to demonstrate different trnsaction flows - single signer, sponsor and multi agent transactions
- Reject promise on core and/or provider errors instead of just returning `false`
- Use `@aptos-labs/ts-sdk@experimental` version `0.0.7`
