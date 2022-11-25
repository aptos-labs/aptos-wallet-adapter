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
  readonly name = MartianWalletName;
  readonly url =
    "https://chrome.google.com/webstore/detail/martian-wallet/efbglgofoippbgcjepnhiblaibcnclgk";
  readonly icon =
    "data:image/png;base64,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";

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
