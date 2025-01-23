import { Network } from "@aptos-labs/ts-sdk";
import { AptosWallet as AptosWalletAggregator } from "@xlabs-libs/wallet-aggregator-aptos";
type DappConfig = {
    network: Network;
};
export declare function getAptosStandardWallets(aptosWalletConfig: DappConfig): AptosWallet[];
export declare class AptosWallet extends AptosWalletAggregator {
}
export {};
//# sourceMappingURL=aptos.d.ts.map