import { Network as AptosNetwork, Account } from "@aptos-labs/ts-sdk";
import { Chain, Network, SignAndSendSigner, TxHash, UnsignedTransaction } from "@wormhole-foundation/sdk";
import { AptosChains } from "@wormhole-foundation/sdk-aptos";
export declare class AptosLocalSigner<N extends Network, C extends Chain> implements SignAndSendSigner<N, C> {
    _chain: C;
    _options: any;
    _wallet: Account;
    _sponsorAccount: Account | Partial<Record<AptosNetwork, string>> | undefined;
    _claimedTransactionHashes: string;
    constructor(chain: C, options: any, wallet: Account, feePayerAccount: Account | Partial<Record<AptosNetwork, string>> | undefined);
    chain(): C;
    address(): string;
    claimedTransactionHashes(): string;
    signAndSend(txs: UnsignedTransaction<N, C>[]): Promise<TxHash[]>;
}
export declare function signAndSendTransaction(request: UnsignedTransaction<Network, AptosChains>, wallet: Account, sponsorAccount: Account | Partial<Record<AptosNetwork, string>> | undefined): Promise<string>;
//# sourceMappingURL=AptosLocalSigner.d.ts.map