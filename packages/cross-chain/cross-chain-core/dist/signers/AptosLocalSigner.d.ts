import { Ed25519Account } from "@aptos-labs/ts-sdk";
import { Chain, Network, SignAndSendSigner, TxHash, UnsignedTransaction } from "@wormhole-foundation/sdk";
import { AptosChains } from "@wormhole-foundation/sdk-aptos";
export declare class AptosLocalSigner<N extends Network, C extends Chain> implements SignAndSendSigner<N, C> {
    _chain: C;
    _options: any;
    _wallet: Ed25519Account;
    _feePayerAccount: Ed25519Account | undefined;
    _claimedTransactionHashes: string;
    constructor(chain: C, options: any, wallet: Ed25519Account, feePayerAccount: Ed25519Account | undefined);
    chain(): C;
    address(): string;
    claimedTransactionHashes(): string;
    signAndSend(txs: UnsignedTransaction<N, C>[]): Promise<TxHash[]>;
}
export declare function signAndSendTransaction(request: UnsignedTransaction<Network, AptosChains>, wallet: Ed25519Account, feePayerAccount: Ed25519Account | undefined): Promise<string>;
//# sourceMappingURL=AptosLocalSigner.d.ts.map