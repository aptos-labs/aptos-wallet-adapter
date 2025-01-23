import { Chain, Network, WormholeQuoteResponse, AptosAccount } from "@aptos-labs/cross-chain-core";
import { AdapterWallet } from "@aptos-labs/wallet-adapter-aggregator-core";
import { AccountInfo } from "@aptos-labs/wallet-standard";
export interface WalletContextState {
    connected: boolean;
    isLoading: boolean;
    wallet: AdapterWallet | null;
    account: AccountInfo | null;
    getSolanaWallets: () => ReadonlyArray<AdapterWallet>;
    getEthereumWallets: () => ReadonlyArray<AdapterWallet>;
    getAptosWallets: () => ReadonlyArray<AdapterWallet>;
    connect: (wallet: AdapterWallet) => Promise<void>;
    disconnect: () => Promise<void>;
    getQuote: (amount: string, sourceChain: Chain) => Promise<WormholeQuoteResponse>;
    initiateTransfer: (sourceChain: Chain, mainSigner: AptosAccount, sponsorAccount?: AptosAccount | Partial<Record<Network, string>>) => Promise<{
        originChainTxnId: string;
        destinationChainTxnId: string;
    }>;
    sourceChain: Chain | null;
    setSourceChain: (chain: Chain) => void;
}
export declare const WalletContext: import("react").Context<WalletContextState>;
export declare function useCrossChainWallet(): WalletContextState;
//# sourceMappingURL=useWallet.d.ts.map