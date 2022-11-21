import { NetworkName } from "@aptos/wallet-adapter-core/src/constants";
import {
  AccountInfo,
  AdapterPlugin,
  NetworkInfo,
  SignMessagePayload,
  SignMessageResponse,
  WalletName,
} from "@aptos/wallet-adapter-core/src/types";
import { MaybeHexString, Types } from "aptos";

interface IMartianErrorResult {
  code: number;
  name: string;
  message: string;
}

interface MartianAccount extends AccountInfo {
  method: string;
  id: number;
  status: number;
}

interface IMartianWallet {
  connect: () => Promise<MartianAccount>;
  account: () => Promise<MartianAccount>;
  disconnect(): Promise<void>;
  signAndSubmitTransaction(transaction: any, options?: any): Promise<string>;
  generateTransaction(
    sender: MaybeHexString,
    payload: any,
    options?: any
  ): Promise<any>;
  signTransaction(
    transaction: any,
    options?: any
  ): Promise<Uint8Array | IMartianErrorResult>;
  isConnected: () => Promise<boolean>;
  signMessage(message: SignMessagePayload): Promise<SignMessageResponse>;
  network(): Promise<NetworkName>;
  requestId: Promise<number>;
  onAccountChange: (
    listener: (newAddress: MartianAccount) => Promise<void>
  ) => Promise<void>;
  onNetworkChange: (
    listener: (network: { networkName: NetworkInfo }) => Promise<void>
  ) => Promise<void>;
}

interface MartianWindow extends Window {
  martian?: IMartianWallet;
}

declare const window: MartianWindow;

export const MartianWalletName = "Martian" as WalletName<"Martian">;

export class MartianWallet implements AdapterPlugin {
  name = MartianWalletName;
  url = "https://aptos-wallet.com";
  icon = "https://aptos-wallet.com.png";

  provider: IMartianWallet | undefined =
    typeof window !== "undefined" ? window.martian : undefined;

  async connect(): Promise<MartianAccount> {
    try {
      const addressInfo = await this.provider?.connect();
      if (!addressInfo) throw `${MartianWalletName} Address Info Error`;
      return addressInfo;
    } catch (error: any) {
      throw error;
    }
  }

  async account(): Promise<MartianAccount> {
    const response = await this.provider?.account();
    if (!response) throw `${MartianWalletName} Account Error`;
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
      const signer = await this.account();
      const tx = await this.provider?.generateTransaction(
        signer.address,
        transaction,
        options
      );
      if (!tx)
        throw new Error("Cannot generate transaction") as IMartianErrorResult;
      const response = await this.provider?.signAndSubmitTransaction(tx);

      if (!response) {
        throw new Error("No response") as IMartianErrorResult;
      }
      return { hash: response };
    } catch (error: any) {
      throw error;
    }
  }

  async signTransaction(
    transaction: Types.TransactionPayload,
    options?: any
  ): Promise<Uint8Array | IMartianErrorResult> {
    try {
      const signer = await this.account();
      const tx = await this.provider?.generateTransaction(
        signer.address,
        transaction,
        options
      );
      if (!tx)
        throw new Error("Cannot generate transaction") as IMartianErrorResult;
      const response = await this.provider?.signTransaction(tx);
      if (!response) {
        throw new Error("No response") as IMartianErrorResult;
      }
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async signMessage(message: SignMessagePayload): Promise<SignMessageResponse> {
    try {
      if (typeof message !== "object" || !message.nonce) {
        `${MartianWalletName} Invalid signMessage Payload`;
      }
      const response = await this.provider?.signMessage(message);
      if (response) {
        return response;
      } else {
        throw `${MartianWalletName} Sign Message failed`;
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
          name: newNetwork,
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
        newAccount: MartianAccount
      ): Promise<void> => {
        if (newAccount?.publicKey) {
          callback({
            ...newAccount,
          });
        } else {
          const response = await this.connect();
          callback({
            ...response,
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
      if (!response) throw `${MartianWalletName} Network Error`;
      return {
        name: response as NetworkName,
      };
    } catch (error: any) {
      throw error;
    }
  }
}
