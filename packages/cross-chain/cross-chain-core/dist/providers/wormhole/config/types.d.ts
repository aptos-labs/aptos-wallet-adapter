import { Chain, ChainId } from "@wormhole-foundation/sdk";
export declare enum Context {
    ETH = "Ethereum",
    TERRA = "Terra",
    XPLA = "XPLA",
    SOLANA = "Solana",
    ALGORAND = "Algorand",
    NEAR = "Near",
    APTOS = "Aptos",
    SUI = "Sui",
    OTHER = "OTHER"
}
export type BaseChainConfig = {
    key: Chain;
    id: ChainId;
    context: Context;
    finalityThreshold: number;
    disabledAsSource?: boolean;
    disabledAsDestination?: boolean;
};
export interface ChainConfig extends BaseChainConfig {
    sdkName: Chain;
    displayName: string;
    explorerUrl: string;
    explorerName: string;
    gasToken: string;
    wrappedGasToken?: string;
    chainId: number | string;
    icon: Chain;
    maxBlockSearch: number;
    symbol?: string;
}
export type ChainsConfig = {
    [chain in Chain]?: ChainConfig;
};
export type TokenConfig = {
    symbol: string;
    name?: string;
    decimals: number;
    icon: string;
    tokenId: {
        chain: Chain;
        address: string;
    };
};
//# sourceMappingURL=types.d.ts.map