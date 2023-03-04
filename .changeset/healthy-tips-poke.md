---
"@aptos-labs/wallet-adapter-core": major
"@aptos-labs/wallet-adapter-react": major
"@aptos-labs/wallet-adapter-nextjs-example": minor
---

- Add isLoading state to react provider when wallet tries to connect https://github.com/aptos-labs/aptos-wallet-adapter/pull/99
- Add onError prop to react provider to catch and display adapter errors
- Expose fetch ANS name method
- Separate ANS name fetch request and connect wallet action to make it undepandable
