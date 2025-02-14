// import { Connection } from "@mysten/sui";
// import {
//   Wallet as SuiStandardWallet,
//   Wallets,
//   getWallets,
// } from "@mysten/wallet-standard";
// import { AptosSuiWallet } from "./wallet";

// const WALLET_DETECT_TIMEOUT = 250;

// interface GetReadyWalletsOptions {
//   /** SUI connection */
//   connection?: Connection;
// }
// interface GetWalletsOptions extends GetReadyWalletsOptions {
//   timeout?: number;
// }

// const supportsSui = (wallet: SuiStandardWallet): boolean => {
//   const { features } = wallet;

//   return Object.entries(features).some(([featureName]) =>
//     featureName.startsWith("sui:")
//   );
// };

// /**
//  * Retrieve already detected wallets that support SUI
//  * @param options
//  * @returns An array of SuiWallet instances
//  */
// export const getReadyWallets = (
//   options: GetReadyWalletsOptions = {}
// ): AptosSuiWallet[] => {
//   const wallets: Wallets = getWallets();
//   return wallets
//     .get()
//     .filter(supportsSui)
//     .map((w: SuiStandardWallet) => new AptosSuiWallet(w, options.connection));
// };

// /**
//  * Wait for wallets to be detected until a timeout and return them
//  * @param options
//  * @returns An array of SuiWallet instances
//  */
// export const getSuiWallets = async (
//   options: GetWalletsOptions = {}
// ): Promise<AptosSuiWallet[]> => {
//   const { timeout = WALLET_DETECT_TIMEOUT, connection } = options;
//   const detector: Wallets = getWallets();

//   const wallets: SuiStandardWallet[] = [...detector.get()];
//   return new Promise((resolve) => {
//     let removeListener: (() => void) | undefined = undefined;

//     const createResolutionTimeout = () =>
//       setTimeout(() => {
//         if (removeListener) removeListener();
//         resolve(
//           wallets
//             .filter(supportsSui)
//             .map((w) => new AptosSuiWallet(w, connection))
//         );
//       }, timeout);

//     let resolution = createResolutionTimeout();

//     removeListener = detector.on("register", (wallet: SuiStandardWallet) => {
//       wallets.push(wallet);
//       clearTimeout(resolution);
//       resolution = createResolutionTimeout();
//     });
//   });
// };
