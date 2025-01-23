import { ConfirmOptions, VersionedTransaction } from "@solana/web3.js";
import { Transaction } from "@solana/web3.js";
import { SolanaUnsignedTransaction } from "@wormhole-foundation/sdk-solana";
import { Connection } from "@solana/web3.js";
import { Network } from "@wormhole-foundation/sdk";
import { AdapterWallet } from "@aptos-labs/wallet-adapter-aggregator-core";
export type SolanaRpcProvider = "triton" | "helius" | "ankr" | "unknown";
export declare function signAndSendTransaction(request: SolanaUnsignedTransaction<Network>, wallet: AdapterWallet | undefined, options?: ConfirmOptions): Promise<string>;
export declare function setPriorityFeeInstructions(connection: Connection, blockhash: string, lastValidBlockHeight: number, request: SolanaUnsignedTransaction<Network>): Promise<Transaction | VersionedTransaction>;
export declare function sleep(timeout: number): Promise<unknown>;
/**
 * Checks whether an object is empty.
 *
 * isEmptyObject(null)
 * // => true
 *
 * isEmptyObject(undefined)
 * // => true
 *
 * isEmptyObject({})
 * // => true
 *
 * isEmptyObject({ 'a': 1 })
 * // => false
 */
export declare const isEmptyObject: (value: object | null | undefined) => boolean;
//# sourceMappingURL=SolanaSigner.d.ts.map