import { NetworkName } from '@aptos/wallet-adapter-core/src/constants';
import { WalletName, AdapterPlugin, AccountInfo, SignMessagePayload, SignMessageResponse, NetworkInfo } from '@aptos/wallet-adapter-core/src/types';
import { Types } from 'aptos';

interface IApotsErrorResult {
    code: number;
    name: string;
    message: string;
}
interface IAptosWallet {
    connect: () => Promise<AccountInfo>;
    account: () => Promise<AccountInfo>;
    disconnect(): Promise<void>;
    signAndSubmitTransaction(transaction: any, options?: any): Promise<{
        hash: Types.HexEncodedBytes;
    } | IApotsErrorResult>;
    signMessage(message: SignMessagePayload): Promise<SignMessageResponse>;
    network(): Promise<NetworkName>;
    onAccountChange: (listener: (newAddress: AccountInfo) => Promise<void>) => Promise<void>;
    onNetworkChange: (listener: (network: {
        networkName: NetworkInfo;
    }) => Promise<void>) => Promise<void>;
}
declare const AptosWalletName: WalletName<"Aptos">;
declare class AptosWallet implements AdapterPlugin {
    name: WalletName<"Aptos">;
    url: string;
    icon: string;
    provider: IAptosWallet | undefined;
    connect(): Promise<AccountInfo>;
    account(): Promise<AccountInfo>;
    disconnect(): Promise<void>;
    signAndSubmitTransaction(transaction: Types.TransactionPayload, options?: any): Promise<{
        hash: Types.HexEncodedBytes;
    }>;
    signMessage(message: SignMessagePayload): Promise<SignMessageResponse>;
    onNetworkChange(callback: any): Promise<void>;
    onAccountChange(callback: any): Promise<void>;
    network(): Promise<NetworkInfo>;
}

export { AptosWallet, AptosWalletName };
