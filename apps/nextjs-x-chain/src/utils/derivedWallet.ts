import { AnyPublicKey as AptosAnyPublicKey } from "@aptos-labs/wallet-adapter-core";
import { AccountAddress } from "@aptos-labs/ts-sdk";

import { AccountInfo } from "@aptos-labs/wallet-adapter-core";

import { EIP1193DerivedWallet } from "@aptos-labs/derived-wallet-ethereum";
import {
  SolanaDerivedWallet,
  SolanaPublicKey,
} from "@aptos-labs/derived-wallet-solana";
import { AdapterWallet } from "@aptos-labs/wallet-adapter-react";
import { SuiDerivedWallet } from "@aptos-labs/derived-wallet-sui";

// Define the type for the origin wallet details
export type OriginWalletDetails =
  | {
      address: string | AccountAddress;
      publicKey?: SolanaPublicKey | AptosAnyPublicKey | string | undefined;
    }
  | AccountInfo
  | null;

// Define a function to check if a wallet is a Solana derived wallet
export function isSolanaDerivedWallet(
  wallet: AdapterWallet,
): wallet is SolanaDerivedWallet {
  return wallet instanceof SolanaDerivedWallet;
}

// Define a function to check if a wallet is an EIP1193 derived wallet
export function isEIP1193DerivedWallet(
  wallet: AdapterWallet,
): wallet is EIP1193DerivedWallet {
  return wallet instanceof EIP1193DerivedWallet;
}

// Define a function to check if a wallet is an EIP1193 derived wallet
export function isSuiDerivedWallet(
  wallet: AdapterWallet,
): wallet is SuiDerivedWallet {
  return wallet instanceof SuiDerivedWallet;
}

// Define specific return types based on wallet type
type SolanaWalletDetails = { address: string; publicKey: SolanaPublicKey };
type EVMWalletDetails = { address: string; publicKey?: undefined };
type SuiWalletDetails = { address: string; publicKey: string };

// Define a function to get the origin wallet details based on the wallet type
export async function getOriginWalletDetails(
  wallet: SolanaDerivedWallet,
): Promise<SolanaWalletDetails>;
export async function getOriginWalletDetails(
  wallet: EIP1193DerivedWallet,
): Promise<EVMWalletDetails>;
export async function getOriginWalletDetails(
  wallet: SuiDerivedWallet,
): Promise<SuiWalletDetails>;
export async function getOriginWalletDetails(
  wallet: AdapterWallet,
): Promise<OriginWalletDetails | undefined>;

// Define the implementation of the function
export async function getOriginWalletDetails(
  wallet: AdapterWallet,
): Promise<OriginWalletDetails | undefined> {
  if (isSolanaDerivedWallet(wallet)) {
    const publicKey = wallet.solanaWallet.publicKey;
    return {
      publicKey: publicKey ?? undefined,
      address: publicKey?.toBase58() ?? "",
    };
  } else if (isEIP1193DerivedWallet(wallet)) {
    const [activeAccount] = await wallet.eip1193Ethers.listAccounts();
    return {
      publicKey: undefined, // No public key for EVM wallets
      address: activeAccount.address,
    };
  } else if (isSuiDerivedWallet(wallet)) {
    return {
      address: wallet.suiWallet.accounts[0].address,
      publicKey: new TextDecoder()
        .decode(wallet.suiWallet.accounts[0].publicKey)
        .toString(),
    };
  } else {
    // Assume Aptos Wallet
    return undefined;
  }
}
