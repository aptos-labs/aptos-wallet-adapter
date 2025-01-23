import { Chain, CrossChainProvider } from "../../CrossChainCore";
import { routes, TokenId, Wormhole, AttestationReceipt } from "@wormhole-foundation/sdk";
import { CrossChainCore } from "../../CrossChainCore";
import { Account, AccountAddressInput, Network } from "@aptos-labs/ts-sdk";
import { AdapterWallet } from "@aptos-labs/wallet-adapter-aggregator-core";
import { ChainsConfig, TokenConfig, ChainConfig } from "./config";
export type WormholeRouteResponse = routes.Route<"Mainnet" | "Testnet", routes.Options, routes.ValidatedTransferParams<routes.Options>, routes.Receipt>;
export type WormholeRequest = routes.RouteTransferRequest<"Mainnet" | "Testnet">;
export type WormholeQuoteResponse = routes.Quote<routes.Options, routes.ValidatedTransferParams<routes.Options>, any>;
export interface WormholeQuoteRequest {
    amount: string;
    sourceChain: Chain;
}
export interface WormholeInitiateTransferRequest {
    sourceChain: Chain;
    wallet: AdapterWallet;
    destinationAddress: AccountAddressInput;
    mainSigner: Account;
    sponsorAccount?: Account | Partial<Record<Network, string>>;
}
export interface WormholeInitiateTransferResponse {
    destinationChainTxnId: string;
    originChainTxnId: string;
}
export interface WormholeStartTransferResponse {
    originChainTxnId: string;
    receipt: routes.Receipt<AttestationReceipt>;
}
export declare class WormholeProvider implements CrossChainProvider<WormholeQuoteRequest, WormholeQuoteResponse, WormholeInitiateTransferRequest, WormholeInitiateTransferResponse> {
    private crossChainCore;
    private _wormholeContext;
    private wormholeRoute;
    private wormholeRequest;
    private wormholeQuote;
    readonly CHAINS: ChainsConfig;
    readonly TOKENS: Record<string, TokenConfig>;
    readonly APTOS_TOKEN: TokenConfig;
    constructor(core: CrossChainCore);
    get wormholeContext(): Wormhole<"Mainnet" | "Testnet"> | undefined;
    setWormholeContext(sourceChain: Chain): Promise<void>;
    getWormholeCctpRoute(sourceChain: Chain): Promise<{
        route: WormholeRouteResponse;
        request: WormholeRequest;
    }>;
    getQuote(input: WormholeQuoteRequest): Promise<WormholeQuoteResponse>;
    startCCTPTransfer(input: WormholeInitiateTransferRequest): Promise<WormholeStartTransferResponse>;
    initiateCCTPTransfer(input: WormholeInitiateTransferRequest): Promise<WormholeInitiateTransferResponse>;
    getChainConfig(chain: Chain): ChainConfig;
    getTokenInfo(sourceChain: Chain): {
        sourceToken: TokenId;
        destToken: TokenId;
    };
}
//# sourceMappingURL=index.d.ts.map