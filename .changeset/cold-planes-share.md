---
"@aptos-labs/wallet-adapter-react": patch
---

Fix React JSX intrinsic element typing by importing `JSX` and `ClassAttributes` types directly from React to avoid namespace resolution issues across TypeScript/React setups.
