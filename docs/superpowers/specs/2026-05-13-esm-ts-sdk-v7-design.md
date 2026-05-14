# ESM-only finalization + Aptos TS SDK v7 + path imports

**Status**: Draft
**Date**: 2026-05-13
**Branch**: `esm-only`

## Goal

Get the Aptos Wallet Adapter monorepo onto a clean ESM-only foundation, upgrade the
`@aptos-labs/ts-sdk` peer dependency to `^7.0.0`, refactor imports to use SDK
subpath exports where they exist to maximize tree-shaking for downstream consumers,
and produce the changeset entries needed to ship the change.

## Background

The `esm-only` branch already converted every published package to:

- `"type": "module"` + `exports` map
- Vite library build (ESM output only, sourcemaps, externalized deps via shared
  `scripts/create-lib-vite-config.mjs`)
- Node 22+ engine constraint, TypeScript 6.0.2

Apps (`apps/nextjs-example`, `apps/nextjs-x-chain`) build on Next 15.5; package
tests pass (170 tests across the suite). The remaining gap is the SDK peer
dependency: every package and both apps still declare `@aptos-labs/ts-sdk: ^5.1.1`.

## Scope

### In scope

1. Bump `@aptos-labs/ts-sdk` peer dep to `^7.0.0` in:
   - `packages/wallet-adapter-core`
   - `packages/derived-wallet-base`
   - `packages/derived-wallet-ethereum`
   - `packages/derived-wallet-solana`
   - `packages/derived-wallet-sui`
   - `packages/cross-chain-core`
2. Bump direct dep to `^7.0.0` in `apps/nextjs-example`, `apps/nextjs-x-chain`.
3. Fix any v5 → v7 breakage uncovered by `pnpm turbo run build` and
   `pnpm turbo run test`.
4. Refactor SDK imports to subpaths where v7 provides one:
   - `Hex`, `Signature`, `AccountPublicKey`, `Ed25519Signature`,
     `Ed25519PublicKey`, `Serializable`, `AccountAuthenticatorAbstraction`,
     `AbstractedAccount` → `@aptos-labs/ts-sdk/crypto`
   - `Serializer`, `Deserializer` → `@aptos-labs/ts-sdk/bcs`
   - `AptosConfig`, `Transaction`, transaction-submission helpers →
     `@aptos-labs/ts-sdk/transaction` (where it ergonomically improves things)
5. Leave at root: `Network`, `NetworkToChainId`, `NetworkToNodeAPI`,
   `RawTransaction`, `SimpleTransaction`, `MultiAgentRawTransaction`,
   `MultiAgentTransaction`, `FeePayerRawTransaction`, `RawTransactionWithData`,
   `Aptos`, `AccountAddress`, `AuthenticationKey`, `TransactionPayloadEntryFunction`,
   `hashValues`, `generateSigningMessageForTransaction`, `RAW_TRANSACTION_SALT`,
   `RAW_TRANSACTION_WITH_DATA_SALT`, `isValidFunctionInfo` — these have no v7
   subpath today. Root imports still tree-shake because v7 sets
   `sideEffects: false`.
6. One changeset per affected package, all `major` (peer-dep bump is a breaking
   change for consumers).

### Out of scope

- Refactoring app code beyond what's needed to compile against v7.
- Introducing new SDK features (encrypted txns, batch encryption, etc.).
- Replacing internal `eventemitter3` or any other dep.
- Touching the cross-chain (Wormhole) packages beyond the SDK bump.

## v5 → v7 breakage we expect to hit

From the v7 CHANGELOG, the only changes that intersect this codebase's call
sites are:

- **Keyless symbols moved off the main entry** — not used here; skip.
- **HD Key / deserialization utils moved out of the crypto barrel** — verify
  none of our packages import them; if they do, move to direct subpath.
- **`generateSignedTransactionForSimulation` is now async** — not called here;
  verify with grep.
- **`AuthenticationKey` BCS wire format gained a 1-byte length prefix** — this
  repo only calls `authKey().derivedAddress()`, never BCS-serializes
  `AuthenticationKey` directly, so no user-visible change. Add a regression
  guard via existing tests.
- **`AccountSequenceNumber.lastUncommintedNumber` typo fix** — not referenced.

If anything else breaks at build/test time, fix it inline rather than expanding
scope.

## Approach

Approach **A** (conservative ladder), two commits:

### Commit 1 — SDK v7 upgrade

- Bump peer dep version in the six packages.
- Bump app deps; run `pnpm install`.
- `pnpm turbo run build` until green.
- `pnpm turbo run test` until green.
- No import-style changes in this commit. Imports keep coming from the root
  `@aptos-labs/ts-sdk`.

### Commit 2 — Subpath imports

- For each source file that imports from `@aptos-labs/ts-sdk`, split the import
  list:
  - Symbols available at `/crypto` → import from `@aptos-labs/ts-sdk/crypto`
  - Symbols available at `/bcs` → import from `@aptos-labs/ts-sdk/bcs`
  - Symbols available at `/transaction` → import from
    `@aptos-labs/ts-sdk/transaction` (apply only where it cleans things up,
    e.g. `AptosConfig`)
  - Everything else stays at the root.
- Same for test files.
- Build + test green.
- Verify the published bundle still resolves correctly (check
  `packages/*/dist/index.js` external graph after build).

### Commit 3 — Changesets

- One file per package under `.changeset/`, all marked `major`, body links to
  the upgrade guide and notes the peer-dep bump.

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| v7 silently renames a symbol we use (not in changelog) | Build will fail; fix at the call site. |
| Subpath imports for v6-only SDK consumers break — not a risk since we set peer dep `^7.0.0`. | n/a |
| Cross-chain-core depends transitively on the older SDK through Wormhole's `sdk-aptos`. | Wormhole packages declare their own SDK version; pnpm hoists ours for direct imports. Verify after install. |
| Two-commit churn in PR review | Commit subjects make scope clear; reviewer can read either independently. |

## Verification

After each commit:

1. `pnpm install --frozen-lockfile=false`
2. `pnpm turbo run build`
3. `pnpm turbo run test`
4. `pnpm dlx publint packages/wallet-adapter-core packages/wallet-adapter-react`
   (sanity-check exports map / ESM compliance on the two highest-traffic
   packages).
5. Manual smoke check: `pnpm turbo run dev` and load `https://localhost:3000`,
   connect a wallet, verify a sign-message round trip.

## Deliverables

- Updated `package.json` files (6 packages + 2 apps).
- Updated `pnpm-lock.yaml`.
- Updated source/test imports for subpath migration.
- 6 `.changeset/*.md` entries (one per published package).
- Green build, green tests, green typecheck.
