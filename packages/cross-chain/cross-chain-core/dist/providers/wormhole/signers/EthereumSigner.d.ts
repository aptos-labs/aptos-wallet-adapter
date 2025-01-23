import { EvmUnsignedTransaction, EvmChains } from "@wormhole-foundation/sdk-evm";
import { Network } from "@wormhole-foundation/sdk";
import { AdapterWallet } from "@aptos-labs/wallet-adapter-aggregator-core";
export declare function signAndSendTransaction(request: EvmUnsignedTransaction<Network, EvmChains>, wallet: AdapterWallet, chainName: string, options: any): Promise<string>;
//# sourceMappingURL=EthereumSigner.d.ts.map