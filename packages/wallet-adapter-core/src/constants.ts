export enum WalletReadyState {
  /**
   * Wallet can only be in one of two states - installed or not installed
   * Installed: wallets are detected by the browser event listeners and means they are installed on the user's browser.
   * NotDetected: wallets are not detected by the browser event listeners and means they are not installed on the user's browser.
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

/**
 * The base URL for all Aptos Connect wallets.
 *
 * @deprecated Use {@link PETRA_WEB_BASE_URL} instead.
 */
export const APTOS_CONNECT_BASE_URL = "https://aptosconnect.app";

/** The base URL for all Petra Web wallets. */
export const PETRA_WEB_BASE_URL = "https://web.petra.app";

/** The name of the generic wallet for Petra Web. */
export const PETRA_WEB_GENERIC_WALLET_NAME = "Petra Web";

/** The name of the Petra wallet. */
export const PETRA_WALLET_NAME = "Petra";

/** The default fallbacks for wallets that are not installed. */
export const DEFAULT_WALLET_FALLBACKS = {
  [PETRA_WALLET_NAME]: PETRA_WEB_GENERIC_WALLET_NAME,
};

/**
 * The URL to the Aptos Connect account page if the user is signed in to Aptos Connect.
 *
 * @deprecated Use {@link PETRA_WEB_ACCOUNT_URL} instead.
 */
export const APTOS_CONNECT_ACCOUNT_URL =
  "https://aptosconnect.app/dashboard/main-account";

/** The URL to the Petra Web account page if the user is signed in to Petra Web. */
export const PETRA_WEB_ACCOUNT_URL =
  "https://web.petra.app/dashboard/main-account";
