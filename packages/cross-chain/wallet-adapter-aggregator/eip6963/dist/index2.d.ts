import { AptosFeatures, WalletAccount } from "@aptos-labs/wallet-standard";
import { AdapterWallet, WalletReadyState } from "@aptos-labs/wallet-adapter-aggregator-core";
export type EIP6963ProviderInfo = {
    info: {
        uuid: string;
        name: string;
        icon: `data:image/svg+xml;base64,${string}`;
        rdns: string;
    };
    provider: any;
};
export declare function fetchEthereumWallets(): AdapterWallet[];
export declare class Eip6963Wallet extends AdapterWallet {
    readonly eip6963Wallet: EIP6963ProviderInfo;
    private provider?;
    readonly version = "1.0.0";
    accounts: WalletAccount[];
    constructor(eip6963Wallet: EIP6963ProviderInfo);
    get icon(): `data:image/svg+xml;base64,${string}`;
    get name(): string;
    get url(): string;
    get readyState(): WalletReadyState;
    get chains(): readonly ["aptos:devnet", "aptos:testnet", "aptos:localnet", "aptos:mainnet"];
    get features(): AptosFeatures;
}
//# sourceMappingURL=index2.d.ts.map