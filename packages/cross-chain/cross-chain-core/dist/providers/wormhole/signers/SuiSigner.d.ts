import { SuiChains, SuiUnsignedTransaction } from "@wormhole-foundation/sdk-sui";
import { Network } from "@wormhole-foundation/sdk";
import { AdapterWallet } from "@aptos-labs/wallet-adapter-aggregator-core";
export declare function signAndSendTransaction(request: SuiUnsignedTransaction<Network, SuiChains>, wallet: AdapterWallet): Promise<string>;
//# sourceMappingURL=SuiSigner.d.ts.map