import {
  Account,
  Ed25519PrivateKey,
  Network,
  PrivateKey,
  PrivateKeyVariants,
} from "@aptos-labs/ts-sdk";
import { CrossChainCore, GasStationApiKey } from "@aptos-labs/cross-chain-core";

/**
 * Shared configuration for the x-chain demo app.
 * All components should import from here to ensure consistency.
 */

// The network the dapp operates on (defaults to testnet if not set)
export const DAPP_NETWORK: Network.MAINNET | Network.TESTNET =
  (process.env.NEXT_PUBLIC_DAPP_NETWORK as Network.MAINNET | Network.TESTNET) || Network.TESTNET;

// Initialize cross-chain core (singleton)
// For mainnet, use custom Solana RPC from env; for testnet, use CrossChainCore defaults
export const crossChainCore = new CrossChainCore({
  dappConfig: {
    aptosNetwork: DAPP_NETWORK,
  },
});

// Initialize the Wormhole provider
export const crossChainProvider = crossChainCore.getProvider("Wormhole");

// Main signer account (used for claiming CCTP transfers)
const mainSignerPrivateKey =
  process.env.NEXT_PUBLIC_SWAP_CCTP_MAIN_SIGNER_PRIVATE_KEY ||
  "0x0000000000000000000000000000000000000000000000000000000000000000";
const mainSignerKey = new Ed25519PrivateKey(
  PrivateKey.formatPrivateKey(mainSignerPrivateKey, PrivateKeyVariants.Ed25519),
);
export const mainSigner = Account.fromPrivateKey({ privateKey: mainSignerKey });

// Sponsor account (fee payer for sponsored transactions)
const sponsorPrivateKey =
  process.env.NEXT_PUBLIC_SWAP_CCTP_SPONSOR_ACCOUNT_PRIVATE_KEY ||
  "0x0000000000000000000000000000000000000000000000000000000000000000";
const sponsorKey = new Ed25519PrivateKey(
  PrivateKey.formatPrivateKey(sponsorPrivateKey, PrivateKeyVariants.Ed25519),
);
export const claimSponsorAccount = Account.fromPrivateKey({
  privateKey: sponsorKey,
});

export const sponsorAccount: GasStationApiKey = {
  [Network.TESTNET]: process.env.NEXT_PUBLIC_SWAP_CCTP_SPONSOR_ACCOUNT_GAS_STATION_API_KEY_TESTNET || "",
  [Network.MAINNET]: process.env.NEXT_PUBLIC_SWAP_CCTP_SPONSOR_ACCOUNT_GAS_STATION_API_KEY_MAINNET || "",
};
