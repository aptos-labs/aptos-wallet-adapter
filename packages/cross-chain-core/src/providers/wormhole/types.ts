import { AccountAddressInput, Account, Network } from "@aptos-labs/ts-sdk";
import { AdapterWallet } from "@aptos-labs/wallet-adapter-core";
import { routes, AttestationReceipt } from "@wormhole-foundation/sdk/dist/cjs";
import { Chain, AptosAccount } from "../..";

export type WormholeRouteResponse = routes.Route<
  "Mainnet" | "Testnet",
  routes.Options,
  routes.ValidatedTransferParams<routes.Options>,
  routes.Receipt
>;

export type WormholeRequest = routes.RouteTransferRequest<
  "Mainnet" | "Testnet"
>;

export type WormholeQuoteResponse = routes.Quote<
  routes.Options,
  routes.ValidatedTransferParams<routes.Options>,
  any
>;

export interface WormholeQuoteRequest {
  amount: string;
  originChain: Chain;
  type: "transfer" | "withdraw";
}

export type GasStationApiKey = Partial<Record<Network.TESTNET | Network.MAINNET, string>>;

export interface WormholeTransferRequest {
  sourceChain: Chain;
  wallet: AdapterWallet;
  destinationAddress: AccountAddressInput;
  mainSigner: Account;
  amount?: string;
  sponsorAccount?: Account;
  /** Optional callback fired before and after each individual transaction is signed. */
  onTransactionSigned?: OnTransactionSigned;
}

export type WithdrawPhase =
  | "initiating"  // User signing Aptos burn transaction
  | "tracking"    // Waiting for Wormhole attestation (~60s)
  | "claiming";   // Claiming on destination chain

/**
 * Callback fired before and after each individual transaction is signed
 * and submitted during a bridge flow.
 *
 * @param description - A human-readable description of the transaction
 *   (e.g. "Approving USDC transfer"). Comes from the Wormhole SDK's
 *   `UnsignedTransaction.description`.
 * @param txId - `null` when called *before* signing; the on-chain
 *   transaction hash when called *after* signing.
 */
export type OnTransactionSigned = (description: string, txId: string | null) => void;

export interface WormholeWithdrawRequest {
  sourceChain: Chain;
  wallet: AdapterWallet;
  destinationAddress: AccountAddressInput;
  sponsorAccount?: Account | GasStationApiKey;
  /** Optional callback fired when the withdraw progresses to a new phase. */
  onPhaseChange?: (phase: WithdrawPhase) => void;
  /** Optional callback fired before and after each individual transaction is signed. */
  onTransactionSigned?: OnTransactionSigned;
}

export interface WormholeSubmitTransferRequest {
  sourceChain: Chain;
  wallet: AdapterWallet;
  destinationAddress: AccountAddressInput;
  /** Optional callback fired before and after each individual transaction is signed. */
  onTransactionSigned?: OnTransactionSigned;
}

export interface WormholeClaimTransferRequest {
  receipt: routes.Receipt<AttestationReceipt>;
  mainSigner: AptosAccount;
  sponsorAccount?: AptosAccount | GasStationApiKey;
  /** Optional callback fired before and after each individual transaction is signed. */
  onTransactionSigned?: OnTransactionSigned;
}

export interface WormholeTransferResponse {
  destinationChainTxnId: string;
  originChainTxnId: string;
}

export interface WormholeWithdrawResponse {
  destinationChainTxnId: string;
  originChainTxnId: string;
}

export interface WormholeStartTransferResponse {
  originChainTxnId: string;
  receipt: routes.Receipt<AttestationReceipt>;
}

// --- Split withdraw flow types ---

export interface WormholeInitiateWithdrawRequest {
  wallet: AdapterWallet;
  destinationAddress: AccountAddressInput;
  sponsorAccount?: Account | GasStationApiKey;
  /** Optional callback fired before and after each individual transaction is signed. */
  onTransactionSigned?: OnTransactionSigned;
}

export interface WormholeInitiateWithdrawResponse {
  originChainTxnId: string;
  receipt: routes.Receipt<AttestationReceipt>;
}

export interface WormholeClaimWithdrawRequest {
  sourceChain: Chain;
  destinationAddress: string;
  receipt: routes.Receipt<AttestationReceipt>;
  // Required for wallet-based claim (non-Solana chains, or Solana without serverClaimUrl).
  // Not needed when the SDK uses the configured serverClaimUrl for Solana claims.
  wallet?: AdapterWallet;
  /** Optional callback fired before and after each individual transaction is signed. */
  onTransactionSigned?: OnTransactionSigned;
}

export interface WormholeClaimWithdrawResponse {
  destinationChainTxnId: string;
}

/**
 * Error thrown when the withdraw flow fails *after* the Aptos burn
 * transaction has already been submitted (i.e. during attestation tracking
 * or destination-chain claiming).
 *
 * Consumers should check `instanceof WithdrawError` in their catch block
 * to recover the `originChainTxnId` and display an explorer link so the
 * user can verify their burn on-chain.
 */
export class WithdrawError extends Error {
  /** Aptos burn transaction hash — always available when this error is thrown. */
  readonly originChainTxnId: string;
  /** The withdraw phase that failed ("tracking" or "claiming"). */
  readonly phase: WithdrawPhase;
  /**
   * The underlying error that caused this failure.
   * Mirrors ES2022 Error.cause — declared explicitly because the project's
   * TypeScript lib target does not include ES2022 ErrorOptions.
   */
  readonly cause?: unknown;

  constructor(
    message: string,
    originChainTxnId: string,
    phase: WithdrawPhase,
    cause?: unknown,
  ) {
    super(message);
    this.name = "WithdrawError";
    this.originChainTxnId = originChainTxnId;
    this.phase = phase;
    this.cause = cause;
  }
}
