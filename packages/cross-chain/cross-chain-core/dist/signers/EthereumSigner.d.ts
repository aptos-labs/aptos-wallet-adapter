import { EvmUnsignedTransaction, EvmChains } from "@wormhole-foundation/sdk-evm";
import { Network } from "@wormhole-foundation/sdk";
import { Eip6963Wallet } from "@xlabs-libs/wallet-aggregator-evm";
export declare function signAndSendTransaction(request: EvmUnsignedTransaction<Network, EvmChains>, wallet: Eip6963Wallet, chainName: string, options: any): Promise<string>;
//# sourceMappingURL=EthereumSigner.d.ts.map