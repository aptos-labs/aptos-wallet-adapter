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
}

export type WithdrawPhase =
  | "initiating"  // User signing Aptos burn transaction
  | "tracking"    // Waiting for Wormhole attestation (~60s)
  | "claiming";   // Claiming on destination chain

export interface WormholeWithdrawRequest {
  sourceChain: Chain;
  wallet: AdapterWallet;
  destinationAddress: AccountAddressInput;
  sponsorAccount?: Account | GasStationApiKey;
  /** Optional callback fired when the withdraw progresses to a new phase. */
  onPhaseChange?: (phase: WithdrawPhase) => void;
}

export interface WormholeSubmitTransferRequest {
  sourceChain: Chain;
  wallet: AdapterWallet;
  destinationAddress: AccountAddressInput;
}

export interface WormholeClaimTransferRequest {
  receipt: routes.Receipt<AttestationReceipt>;
  mainSigner: AptosAccount;
  sponsorAccount?: AptosAccount | GasStationApiKey;
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
}

export interface WormholeClaimWithdrawResponse {
  destinationChainTxnId: string;
}
