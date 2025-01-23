import { FC, ReactNode } from "react";
import { CrossChainDappConfig, WormholeQuoteResponse, WormholeInitiateTransferResponse } from "@aptos-labs/cross-chain-core";
import { AdapterWallet } from "@aptos-labs/wallet-adapter-aggregator-core";
export interface AptosCrossChainWalletProviderProps {
    children: ReactNode;
    dappConfig: CrossChainDappConfig;
    disableTelemetry?: boolean;
    onError?: (error: any) => void;
}
export type { AdapterWallet };
export type QuoteResponse = WormholeQuoteResponse;
export type InitiateTransferResponse = WormholeInitiateTransferResponse;
export declare const AptosCrossChainWalletProvider: FC<AptosCrossChainWalletProviderProps>;
//# sourceMappingURL=WalletProvider.d.ts.map