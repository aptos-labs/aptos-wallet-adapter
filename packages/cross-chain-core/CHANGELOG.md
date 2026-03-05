# @aptos-labs/cross-chain-core

## 6.0.1

### Patch Changes

- Updated dependencies [67b3d73]
  - @aptos-labs/wallet-adapter-core@8.5.0

## 6.0.0

### Major Changes

- 787ca9d: Renamed `sourceChain` to `claimChain` in `WormholeClaimWithdrawRequest` and in the server-side claim wire format to clarify that it refers to the chain where the claim transaction executes (the bridge destination), not the chain that burns USDC. Added JSDoc to `WormholeWithdrawRequest.sourceChain` explaining its meaning. Updated the example server-side claim route to match.

### Minor Changes

- 24136d6: Added `evmConfig` and `suiConfig` options to `CrossChainDappConfig` so consumers can provide custom RPC endpoints for EVM chains and Sui. Custom RPCs are used for balance lookups (`getWalletUSDCBalance`) and Wormhole SDK initialization, falling back to the built-in `defaultRpc` values when not specified. Also exported the `EvmChainName` type for use in consumer code.
- 48bb1f6: Added `getExpireTimestamp` option to `CrossChainDappConfig` for configuring Aptos transaction expiration timestamps. The callback is invoked at transaction-build time so each transaction in a multi-step bridge flow gets a fresh expiration window. Threaded through both `AptosSigner` and `AptosLocalSigner`.
- 901cd7e: Added `onTransactionSigned` callback to all transfer and withdraw request types (`WormholeWithdrawRequest`, `WormholeTransferRequest`, `WormholeSubmitTransferRequest`, `WormholeClaimTransferRequest`, `WormholeInitiateWithdrawRequest`, `WormholeClaimWithdrawRequest`). The callback fires before and after each individual transaction is signed, enabling rich per-transaction progress UIs (e.g. "Approving USDC…", "Submitting bridge transaction…"). Also added to `Signer`, `AptosLocalSigner`, and `SolanaLocalSigner`.
- f0daf89: Added `retryWithdrawClaim` method to `WormholeProvider` with configurable exponential backoff for retrying failed claim transactions. Also added `RetryWithdrawClaimRequest` and `RetryWithdrawClaimResponse` types. This enables robust error recovery when the claim phase of a withdrawal fails after the irreversible Aptos burn has already been submitted.
- a2d00e9: Allow configuring the default Solana commitment level via `solanaConfig.commitment` in `CrossChainDappConfig`. The client-side `SolanaSigner` now reads this value as a fallback before defaulting to `"finalized"`. Setting `commitment: "confirmed"` reduces confirmation wait from ~30 s to ~0.5 s, which is sufficient for bridge flows where Wormhole guardians independently verify finality.
- 82a2cee: Thread `CrossChainCore` through to `AptosLocalSigner`, replacing individual `dappNetwork` and `getExpireTimestamp` constructor parameters with a single `crossChainCore` instance. Also removed unused `options` parameter from `EthereumSigner.signAndSendTransaction`.
- d555df9: Track last source-chain transaction ID on `CrossChainCore` for error recovery. Added `TransferError` class (analogous to `WithdrawError`) that preserves the source-chain burn hash when the transfer claim phase fails. Consumers can now recover the tx hash via `error.originChainTxnId` or `crossChainCore._lastSourceChainTxId`.

### Patch Changes

- 1bf52d2: Recover EVM transaction hash when `response.wait()` fails in `EthereumSigner`. When the receipt wait fails (e.g., network timeout, RPC instability), the already-submitted `response.hash` is now returned instead of throwing. Also attempts to extract the transaction hash from error messages when `sendTransaction` itself throws after broadcast. This prevents bridge flows from losing the transaction reference after the on-chain transaction has been submitted.
- 60658b4: Handle Solana "block height exceeded" errors gracefully in `sendAndConfirmTransaction`. When the blockhash expires before confirmation completes, the transaction signature is now returned instead of throwing, since the transaction was already sent and may still land on-chain. This prevents bridge flows from failing after the irreversible source-chain transaction has been submitted.
- Updated dependencies [9a671bf]
  - @aptos-labs/derived-wallet-solana@0.12.1

## 5.9.0

### Minor Changes

- a01321e: feat(cross-chain-core): add server-side Solana claim support for CCTP withdrawals

### Patch Changes

- Updated dependencies [f2e7a4e]
  - @aptos-labs/wallet-adapter-core@8.4.0

## 5.8.2

### Patch Changes

- Updated dependencies [935eb4c]
  - @aptos-labs/wallet-adapter-core@8.3.0

## 5.8.1

### Patch Changes

- 01e2df0: Fix Solana multi-signer transaction order

## 5.8.0

### Minor Changes

- ae37654: Support gas station for cctp withdraw transactions

## 5.7.0

### Minor Changes

- 9f119d7: Improve cross-chain config and Solana RPC handling

## 5.6.2

### Patch Changes

- 7d936dc: fix: handle missing Solana USDC balance, add devnet warning, and fix Sepolia CORS

## 5.6.1

### Patch Changes

- Updated dependencies [df2f715]
- Updated dependencies [127ce88]
  - @aptos-labs/derived-wallet-ethereum@0.9.0
  - @aptos-labs/derived-wallet-solana@0.12.0

## 5.6.0

### Minor Changes

- 39def14: Add Sui cross-chain CCTP transfers

### Patch Changes

- Updated dependencies [39def14]
- Updated dependencies [e226684]
- Updated dependencies [494adef]
  - @aptos-labs/derived-wallet-solana@0.11.0
  - @aptos-labs/derived-wallet-sui@0.2.0
  - @aptos-labs/derived-wallet-ethereum@0.8.6
  - @aptos-labs/wallet-adapter-core@8.2.0

## 5.5.0

### Minor Changes

- f70e69b: Revert cross-chain wallet initialization in AptosWalletAdapterProvider

### Patch Changes

- Updated dependencies [f70e69b]
  - @aptos-labs/derived-wallet-solana@0.10.0
  - @aptos-labs/wallet-adapter-core@8.1.0

## 5.4.16

### Patch Changes

- 7f28e7b: [Fix] Build packages for release
- Updated dependencies [7f28e7b]
  - @aptos-labs/derived-wallet-ethereum@0.8.5
  - @aptos-labs/derived-wallet-solana@0.9.2
  - @aptos-labs/wallet-adapter-core@8.0.1

## 5.4.15

### Patch Changes

- Updated dependencies [69c5d26]
- Updated dependencies [378146b]
  - @aptos-labs/wallet-adapter-core@8.0.0

## 5.4.14

### Patch Changes

- Updated dependencies [6b78103]
  - @aptos-labs/wallet-adapter-core@7.10.2

## 5.4.13

### Patch Changes

- Updated dependencies [0fdeec3]
  - @aptos-labs/wallet-adapter-core@7.10.1

## 5.4.12

### Patch Changes

- Updated dependencies [1817e27]
- Updated dependencies [1817e27]
  - @aptos-labs/derived-wallet-solana@0.9.1
  - @aptos-labs/wallet-adapter-core@7.10.0
  - @aptos-labs/derived-wallet-ethereum@0.8.4

## 5.4.11

### Patch Changes

- Updated dependencies [c0220f0]
  - @aptos-labs/wallet-adapter-core@7.9.2

## 5.4.10

### Patch Changes

- Updated dependencies [518b72d]
  - @aptos-labs/derived-wallet-solana@0.9.0
  - @aptos-labs/derived-wallet-ethereum@0.8.3

## 5.4.9

### Patch Changes

- Updated dependencies [962b02f]
  - @aptos-labs/wallet-adapter-core@7.9.1

## 5.4.8

### Patch Changes

- Updated dependencies [e6e3f2e]
  - @aptos-labs/wallet-adapter-core@7.9.0

## 5.4.7

### Patch Changes

- Updated dependencies [511427e]
- Updated dependencies [511427e]
  - @aptos-labs/derived-wallet-ethereum@0.8.2
  - @aptos-labs/derived-wallet-solana@0.8.2

## 5.4.6

### Patch Changes

- Updated dependencies [2695a5d]
  - @aptos-labs/wallet-adapter-core@7.8.0

## 5.4.5

### Patch Changes

- 19e7e2a: Deprecate aptos connect functions and constants in favor of petra web
- Updated dependencies [19e7e2a]
  - @aptos-labs/wallet-adapter-core@7.7.1

## 5.4.4

### Patch Changes

- Updated dependencies [d2d308c]
- Updated dependencies [b3474b3]
- Updated dependencies [499e03e]
  - @aptos-labs/wallet-adapter-core@7.7.0

## 5.4.3

### Patch Changes

- 7407a71: Upgrade aptos ts-sdk package
- Updated dependencies [1c631ee]
- Updated dependencies [7407a71]
  - @aptos-labs/wallet-adapter-core@7.6.0
  - @aptos-labs/derived-wallet-ethereum@0.8.1
  - @aptos-labs/derived-wallet-solana@0.8.1

## 5.4.2

### Patch Changes

- Updated dependencies [8c935c8]
  - @aptos-labs/wallet-adapter-core@7.5.1

## 5.4.1

### Patch Changes

- Updated dependencies [3d5d42b]
  - @aptos-labs/wallet-adapter-core@7.5.0

## 5.4.0

### Minor Changes

- e554d03: Upgrade underlying dependencies for the wallet adapter

### Patch Changes

- Updated dependencies [02b3abc]
- Updated dependencies [911f353]
- Updated dependencies [e554d03]
- Updated dependencies [4ddaeaa]
  - @aptos-labs/wallet-adapter-core@7.4.0
  - @aptos-labs/derived-wallet-ethereum@0.8.0
  - @aptos-labs/derived-wallet-solana@0.8.0

## 5.3.0

### Minor Changes

- c066004: Bump wallet-standard and siwa packages

### Patch Changes

- Updated dependencies [c066004]
  - @aptos-labs/derived-wallet-ethereum@0.7.0
  - @aptos-labs/derived-wallet-solana@0.7.0
  - @aptos-labs/wallet-adapter-core@7.3.0

## 5.2.0

### Minor Changes

- b6b9fc8: Fix DAA signing message and bump aptos ts-sdk version to 5.0.0

### Patch Changes

- Updated dependencies [b6b9fc8]
  - @aptos-labs/derived-wallet-ethereum@0.6.0
  - @aptos-labs/derived-wallet-solana@0.6.0
  - @aptos-labs/wallet-adapter-core@7.2.0

## 5.1.2

### Patch Changes

- 14a9cd1: Remove unneeded dependencies from cross chain core package
- Updated dependencies [545b26d]
  - @aptos-labs/wallet-adapter-core@7.1.2

## 5.1.1

### Patch Changes

- Updated dependencies [8ca938e]
  - @aptos-labs/wallet-adapter-core@7.1.1

## 5.1.0

### Minor Changes

- e189651: Support Ethereum L2 networks for CCTP - Avalanche, Base, Arbitrum, Polygon

### Patch Changes

- Updated dependencies [dfa6eb3]
  - @aptos-labs/wallet-adapter-core@7.1.0

## 5.0.2

### Patch Changes

- Updated dependencies [6605dd6]
  - @aptos-labs/wallet-adapter-core@7.0.0

## 5.0.1

### Patch Changes

- fd7f880: Bump aptos ts-sdk version
- Updated dependencies [fd7f880]
  - @aptos-labs/derived-wallet-ethereum@0.5.1
  - @aptos-labs/derived-wallet-solana@0.5.1
  - @aptos-labs/wallet-adapter-core@6.0.1

## 5.0.0

### Major Changes

- b80eff6: Add support for transactionSubmitter, bump minimum TS SDK version to 3.x.x

### Minor Changes

- 73955a7: Support Withdraw flow for x-chain accounts

### Patch Changes

- Updated dependencies [b80eff6]
  - @aptos-labs/derived-wallet-ethereum@0.5.0
  - @aptos-labs/derived-wallet-solana@0.5.0
  - @aptos-labs/wallet-adapter-core@6.0.0

## 4.25.0

### Minor Changes

- fae2bf0: Bump @aptos-labs/wallet-standard to 0.5.0 which removes the `message` and `signingMessage` fields from the `AptosSignInInput` of the `signIn` request.

### Patch Changes

- Updated dependencies [fae2bf0]
  - @aptos-labs/derived-wallet-ethereum@0.4.0
  - @aptos-labs/derived-wallet-solana@0.4.0
  - @aptos-labs/wallet-adapter-core@5.8.0

## 4.24.13

### Patch Changes

- Updated dependencies [aad3b8d]
  - @aptos-labs/wallet-adapter-core@5.7.1

## 4.24.12

### Patch Changes

- Updated dependencies [1a4ed58]
  - @aptos-labs/wallet-adapter-core@5.7.0

## 4.24.11

### Patch Changes

- Updated dependencies [1a5571b]
- Updated dependencies [17d3f27]
- Updated dependencies [4e3fe69]
- Updated dependencies [e097767]
  - @aptos-labs/wallet-adapter-core@5.6.0
  - @aptos-labs/derived-wallet-ethereum@0.3.0
  - @aptos-labs/derived-wallet-solana@0.3.0

## 4.24.10

### Patch Changes

- Updated dependencies [e2d66c4]
  - @aptos-labs/wallet-adapter-core@5.5.1

## 4.24.9

### Patch Changes

- Updated dependencies [63f5cf7]
  - @aptos-labs/derived-wallet-ethereum@0.2.2

## 4.24.8

### Patch Changes

- Updated dependencies [69f2846]
- Updated dependencies [69f2846]
  - @aptos-labs/wallet-adapter-core@5.5.0

## 4.24.7

### Patch Changes

- 33d0055: Use aptos ts-sdk version 2.0.0 as a peer dependency
- Updated dependencies [33d0055]
- Updated dependencies [a64a658]
  - @aptos-labs/derived-wallet-ethereum@0.2.1
  - @aptos-labs/derived-wallet-solana@0.2.5
  - @aptos-labs/wallet-adapter-core@5.4.2

## 4.24.6

### Patch Changes

- Updated dependencies [476003f]
- Updated dependencies [1b67719]
- Updated dependencies [476003f]
  - @aptos-labs/derived-wallet-solana@0.2.4
  - @aptos-labs/derived-wallet-ethereum@0.2.0

## 4.24.5

### Patch Changes

- Updated dependencies [cdcec83]
  - @aptos-labs/wallet-adapter-core@5.4.1

## 4.24.4

### Patch Changes

- Updated dependencies [c62ccb7]
- Updated dependencies [3effbab]
  - @aptos-labs/derived-wallet-ethereum@0.1.3
  - @aptos-labs/derived-wallet-solana@0.2.3

## 4.24.3

### Patch Changes

- Updated dependencies [255400a]
  - @aptos-labs/derived-wallet-solana@0.2.2

## 4.24.2

### Patch Changes

- Updated dependencies [613e592]
- Updated dependencies [1779749]
  - @aptos-labs/wallet-adapter-core@5.4.0
  - @aptos-labs/derived-wallet-solana@0.2.1

## 4.24.1

### Patch Changes

- Updated dependencies [2ab3a0c]
- Updated dependencies [f4a423b]
- Updated dependencies [6d7b28c]
  - @aptos-labs/wallet-adapter-core@5.3.0

## 4.24.0

### Minor Changes

- ad3b6bb: Introduce x chain wallets logic in the react adapter provider

### Patch Changes

- Updated dependencies [8a2b3b6]
- Updated dependencies [ad3b6bb]
  - @aptos-labs/derived-wallet-ethereum@0.1.2
  - @aptos-labs/derived-wallet-solana@0.2.0
  - @aptos-labs/wallet-adapter-core@5.2.0

## 4.23.2

### Patch Changes

- 6bfd2fb: Upgrade the ts-sdk version
- Updated dependencies [6bfd2fb]
  - @aptos-labs/derived-wallet-ethereum@0.1.1
  - @aptos-labs/derived-wallet-solana@0.1.1
  - @aptos-labs/wallet-adapter-core@5.1.4

## 4.23.1

### Patch Changes

- Updated dependencies [5da289f]
- Updated dependencies [5ba8ae3]
  - @aptos-labs/derived-wallet-ethereum@0.1.0
  - @aptos-labs/derived-wallet-solana@0.1.0
