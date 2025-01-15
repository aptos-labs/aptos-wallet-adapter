export enum WalletReadyState {
  /**
   * User-installable wallets can typically be detected by scanning for an API
   * that they've injected into the global context. If such an API is present,
   * we consider the wallet to have been installed.
   */
  Installed = "Installed",
  NotDetected = "NotDetected",
}

export enum NetworkName {
  Mainnet = "mainnet",
  Testnet = "testnet",
  Devnet = "devnet",
}

export const ChainIdToAnsSupportedNetworkMap: Record<string, string> = {
  "1": "mainnet", // mainnet
  "2": "testnet", // testnet
};

/** The base URL for all Aptos Connect wallets. */
export const APTOS_CONNECT_BASE_URL = "https://aptosconnect.app";

/** The URL to the Aptos Connect account page if the user is signed in to Aptos Connect. */
export const APTOS_CONNECT_ACCOUNT_URL =
  "https://aptosconnect.app/dashboard/main-account";
