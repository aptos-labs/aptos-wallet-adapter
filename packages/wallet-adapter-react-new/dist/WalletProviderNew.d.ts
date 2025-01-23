import { AvailableWallets, DappConfig } from "@aptos-labs/wallet-adapter-core-new";
import { ReactNode, FC } from "react";
export interface AptosWalletProviderPropsNew {
    children: ReactNode;
    optInWallets?: ReadonlyArray<AvailableWallets>;
    autoConnect?: boolean;
    dappConfig?: DappConfig;
    disableTelemetry?: boolean;
    onError?: (error: any) => void;
}
export declare const AptosWalletAdapterProviderNew: FC<AptosWalletProviderPropsNew>;
//# sourceMappingURL=WalletProviderNew.d.ts.map