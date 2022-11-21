import { NetworkName } from "@aptos/wallet-adapter-core/src/constants";
import {
  AccountInfo,
  AdapterPlugin,
  NetworkInfo,
  SignMessagePayload,
  SignMessageResponse,
  WalletName,
} from "@aptos/wallet-adapter-core/src/types";
import { Types } from "aptos";

interface IPetraErrorResult {
  code: number;
  name: string;
  message: string;
}

interface IPetraWallet {
  connect: () => Promise<AccountInfo>;
  account: () => Promise<AccountInfo>;
  disconnect(): Promise<void>;
  signAndSubmitTransaction(
    transaction: any,
    options?: any
  ): Promise<{ hash: Types.HexEncodedBytes } | IPetraErrorResult>;
  signTransaction(
    transaction: any,
    options?: any
  ): Promise<Uint8Array | IPetraErrorResult>;
  isConnected: () => Promise<boolean>;
  signMessage(message: SignMessagePayload): Promise<SignMessageResponse>;
  network(): Promise<NetworkName>;
  requestId: Promise<number>;
  onAccountChange: (
    listener: (newAddress: AccountInfo) => Promise<void>
  ) => Promise<void>;
  onNetworkChange: (
    listener: (network: { networkName: NetworkInfo }) => Promise<void>
  ) => Promise<void>;
}

interface PetraWindow extends Window {
  petra?: IPetraWallet;
}

declare const window: PetraWindow;

export const PetraWalletName = "Petra" as WalletName<"Petra">;

export class PetraWallet implements AdapterPlugin {
  name = PetraWalletName;
  url = "https://petra-wallet.com";
  icon = "https://petra-wallet.com.png";

  provider: IPetraWallet | undefined =
    typeof window !== "undefined" ? window.petra : undefined;

  async connect(): Promise<AccountInfo> {
    try {
      const addressInfo = await this.provider?.connect();
      if (!addressInfo) throw `${PetraWalletName} Address Info Error`;
      return addressInfo;
    } catch (error: any) {
      throw error;
    }
  }

  async account(): Promise<AccountInfo> {
    const response = await this.provider?.account();
    if (!response) throw `${PetraWalletName} Account Error`;
    return response;
  }

  async disconnect(): Promise<void> {
    try {
      await this.provider?.disconnect();
    } catch (error: any) {
      throw error;
    }
  }

  async signAndSubmitTransaction(
    transaction: Types.TransactionPayload,
    options?: any
  ): Promise<{ hash: Types.HexEncodedBytes }> {
    try {
      const response = await this.provider?.signAndSubmitTransaction(
        transaction,
        options
      );
      if ((response as IPetraErrorResult).code) {
        throw new Error((response as IPetraErrorResult).message);
      }
      return response as { hash: Types.HexEncodedBytes };
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async signMessage(message: SignMessagePayload): Promise<SignMessageResponse> {
    try {
      if (typeof message !== "object" || !message.nonce) {
        throw `${PetraWalletName} Invalid signMessage Payload`;
      }
      const response = await this.provider?.signMessage(message);
      if (response) {
        return response;
      } else {
        throw `${PetraWalletName} Sign Message failed`;
      }
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async onNetworkChange(callback: any): Promise<void> {
    try {
      const handleNetworkChange = async (newNetwork: {
        networkName: NetworkInfo;
      }): Promise<void> => {
        callback({
          name: newNetwork.networkName,
          chainId: undefined,
          api: undefined,
        });
      };
      await this.provider?.onNetworkChange(handleNetworkChange);
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async onAccountChange(callback: any): Promise<void> {
    try {
      const handleAccountChange = async (
        newAccount: AccountInfo
      ): Promise<void> => {
        if (newAccount?.publicKey) {
          callback({
            publicKey: newAccount.publicKey,
            address: newAccount.address,
          });
        } else {
          const response = await this.connect();
          callback({
            address: response?.address,
            publicKey: response?.publicKey,
          });
        }
      };
      await this.provider?.onAccountChange(handleAccountChange);
    } catch (error: any) {
      console.log(error);
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async network(): Promise<NetworkInfo> {
    try {
      const response = await this.provider?.network();
      if (!response) throw `${PetraWalletName} Network Error`;
      return {
        name: response as NetworkName,
      };
    } catch (error: any) {
      throw error;
    }
  }
}
