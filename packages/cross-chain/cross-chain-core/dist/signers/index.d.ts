import { UnsignedTransaction, Network, Chain, TxHash, SignAndSendSigner } from "@wormhole-foundation/sdk";
import { Wallet } from "@xlabs-libs/wallet-aggregator-core";
export declare class Signer<N extends Network, C extends Chain> implements SignAndSendSigner<N, C> {
    _chain: C;
    _address: string;
    _options: any;
    _wallet: Wallet;
    constructor(chain: C, address: string, options: any, wallet: Wallet);
    chain(): C;
    address(): string;
    signAndSend(txs: UnsignedTransaction<N, C>[]): Promise<TxHash[]>;
}
export declare const signAndSendTransaction: (chain: Chain, request: UnsignedTransaction<Network, Chain>, wallet: Wallet, options?: any) => Promise<string>;
//# sourceMappingURL=index.d.ts.map