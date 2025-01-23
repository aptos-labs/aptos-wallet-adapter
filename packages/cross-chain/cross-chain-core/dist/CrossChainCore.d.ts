import { Account, Network } from "@aptos-labs/ts-sdk";
export interface CrossChainDappConfig {
    network: Network;
    disableTelemetry?: boolean;
}
export type AptosAccount = Account;
export type Chain = "Solana" | "Ethereum" | "Aptos";
export type CCTPProviders = "Wormhole";
export type UsdcBalance = {
    amount: string;
    decimal: number;
    display: string;
};
export interface CrossChainProvider<TQuoteRequest = any, TQuoteResponse = any, TInitiateTransferRequest = any, TInitiateTransferResponse = any> {
    getQuote(params: TQuoteRequest): Promise<TQuoteResponse>;
    initiateCCTPTransfer(params: TInitiateTransferRequest): Promise<TInitiateTransferResponse>;
}
export declare class CrossChainCore {
    readonly _dappConfig: CrossChainDappConfig | undefined;
    constructor(args: {
        dappConfig: CrossChainDappConfig;
    });
    getProvider(providerType: CCTPProviders): CrossChainProvider;
}
//# sourceMappingURL=CrossChainCore.d.ts.map