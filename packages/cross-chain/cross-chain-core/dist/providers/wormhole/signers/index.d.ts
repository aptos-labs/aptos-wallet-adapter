import { UnsignedTransaction, Network, Chain, TxHash, SignAndSendSigner } from "@wormhole-foundation/sdk";
import { AdapterWallet } from "@aptos-labs/wallet-adapter-aggregator-core";
import { ChainConfig } from "../config";
export declare class Signer<N extends Network, C extends Chain> implements SignAndSendSigner<N, C> {
    _chain: ChainConfig;
    _address: string;
    _options: any;
    _wallet: AdapterWallet;
    constructor(chain: ChainConfig, address: string, options: any, wallet: AdapterWallet);
    chain(): C;
    address(): string;
    signAndSend(txs: UnsignedTransaction<N, C>[]): Promise<TxHash[]>;
}
export declare const signAndSendTransaction: (chain: ChainConfig, request: UnsignedTransaction<Network, Chain>, wallet: AdapterWallet, options?: any) => Promise<string>;
//# sourceMappingURL=index.d.ts.map