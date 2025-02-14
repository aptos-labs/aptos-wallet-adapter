// import {
//   AttestationReceipt,
//   Chain,
//   Wormhole,
//   routes,
// } from "@wormhole-foundation/sdk";
// import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

// import { UsdcBalance, WormholeRequest } from "../CrossChainCore";

// import { WormholeRouteResponse } from "../CrossChainCore";
// import { WormholeQuote } from "../CrossChainCore";
// import { Signer } from "../providers/wormhole/signers";

// import { CrossChainWallet } from "./core";
// import {
//   isWalletWithRequiredFeatureSet,
//   MinimallyRequiredFeatures,
//   Wallet as StandardWallet,
//   WalletWithFeatures,
//   getWallets,
// } from "@mysten/wallet-standard";

// import { SuiWallet } from "@xlabs-libs/wallet-aggregator-sui";
// import { InputTransactionData } from "./solana";

// const supportsSui = (wallet: StandardWallet): boolean => {
//   const { features } = wallet;

//   return Object.entries(features).some(([featureName]) =>
//     featureName.startsWith("sui:")
//   );
// };

// export const getSuiStandardWallets = (): AptosSuiWallet[] => {
//   const walletsApi = getWallets();
//   const wallets = walletsApi.get();

//   const suiWallets = wallets.filter(supportsSui);
//   return suiWallets.map((wallet) => new AptosSuiWallet(wallet));

//   // return getWallets()
//   //   .get()
//   //   .map((wallet) => {
//   //     if (isWalletWithRequiredFeatureSet(wallet)) {
//   //       return new AptosSuiWallet(wallet);
//   //     }
//   //   });
// };

// export class AptosSuiWallet extends SuiWallet implements CrossChainWallet {
//   constructor(wallet: StandardWallet) {
//     super(wallet);
//   }

//   async CCTPTransfer(
//     chain: Chain,
//     route: WormholeRouteResponse,
//     request: WormholeRequest,
//     quote: WormholeQuote
//   ): Promise<{
//     originChainTxnId: string;
//     receipt: routes.Receipt<AttestationReceipt>;
//   }> {
//     // should be derived from hash(domain_name + source_chain_address + domain_separator)
//     const destinationAccountAddress =
//       "0x38383091fdd9325e0b8ada990c474da8c7f5aa51580b65eb477885b6ce0a36b7";

//     const signer = new Signer(
//       chain, // for now, it is always "Sui"
//       this.getAddress()!,
//       {},
//       this
//     );

//     let receipt = await route.initiate(
//       request,
//       signer,
//       quote,
//       Wormhole.chainAddress("Aptos", destinationAccountAddress)
//     );

//     const originChainTxnId =
//       "originTxs" in receipt
//         ? receipt.originTxs[receipt.originTxs.length - 1].txid
//         : undefined;

//     return { originChainTxnId: originChainTxnId || "", receipt };
//   }

//   async signAndSubmitTransaction(
//     transaction: InputTransactionData
//   ): Promise<string> {
//     console.log("solana not yet implemented, waiting for dAA", transaction);
//     return "";
//   }

//   async getUsdcBalance(): Promise<UsdcBalance> {
//     const rpc = new SuiClient({ url: getFullnodeUrl("testnet") });
//     const { totalBalance } = await rpc.getBalance({
//       owner: this.getAddress()!,
//       coinType:
//         "0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC",
//     });
//     const humanReadable = parseInt(totalBalance, 10) / Math.pow(10, 6);
//     return {
//       amount: totalBalance.toString(),
//       decimal: 6,
//       display: humanReadable.toFixed(1),
//     };
//   }
// }
