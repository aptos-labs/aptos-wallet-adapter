export enum WalletReadyState {
  /**
   * User-installable wallets can typically be detected by scanning for an API
   * that they've injected into the global context. If such an API is present,
   * we consider the wallet to have been installed.
   */
  Installed = "Installed",
  NotDetected = "NotDetected",
  /**
   * Loadable wallets are always available to you. Since you can load them at
   * any time, it's meaningless to say that they have been detected.
   */
  Loadable = "Loadable",
  /**
   * If a wallet is not supported on a given platform (eg. server-rendering, or
   * mobile) then it will stay in the `Unsupported` state.
   */
  Unsupported = "Unsupported",
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
