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

interface IApotsErrorResult {
  code: number;
  name: string;
  message: string;
}

interface IAptosWallet {
  connect: () => Promise<AccountInfo>;
  account: () => Promise<AccountInfo>;
  disconnect(): Promise<void>;
  signAndSubmitTransaction(
    transaction: any,
    options?: any
  ): Promise<{ hash: Types.HexEncodedBytes } | IApotsErrorResult>;
  signMessage(
    message: SignMessagePayload
  ): Promise<SignMessageResponse | IApotsErrorResult>;
  network(): Promise<NetworkName>;
  onAccountChange: (
    listener: (newAddress: AccountInfo) => Promise<void>
  ) => Promise<void>;
  onNetworkChange: (
    listener: (network: { networkName: NetworkInfo }) => Promise<void>
  ) => Promise<void>;
}

interface AptosWindow extends Window {
  aptos?: IAptosWallet;
}

declare const window: AptosWindow;

export const AptosWalletName = "Aptos" as WalletName<"Aptos">;

export class AptosWallet implements AdapterPlugin {
  name = AptosWalletName;
  url = "https://my-wallet.com";
  icon = "https://my-wallet.com.png";

  provider: IAptosWallet | undefined =
    typeof window !== "undefined" ? window.aptos : undefined;

  async connect(): Promise<AccountInfo> {
    try {
      const addressInfo = await this.provider?.connect();
      if (!addressInfo) throw `${AptosWalletName} Address Info Error`;
      return addressInfo;
    } catch (error: any) {
      throw error;
    }
  }

  async account(): Promise<AccountInfo> {
    const response = await this.provider?.account();
    if (!response) throw `${AptosWalletName} Account Error`;
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
  ): Promise<{ hash: Types.HexEncodedBytes } | IApotsErrorResult> {
    try {
      const response = await this.provider?.signAndSubmitTransaction(
        transaction,
        options
      );
      if ((response as IApotsErrorResult).code) {
        throw new Error((response as IApotsErrorResult).message);
      }
      return response as { hash: Types.HexEncodedBytes };
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async signMessage(
    message: SignMessagePayload
  ): Promise<SignMessageResponse | IApotsErrorResult> {
    try {
      if (typeof message !== "object" || !message.nonce) {
        `${AptosWalletName} Invalid signMessage Payload`;
      }
      const response = await this.provider?.signMessage(message);
      if (response) {
        return response;
      } else {
        throw `${AptosWalletName} Sign Message failed`;
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
      if (!response) throw `${AptosWalletName} Network Error`;
      return {
        name: response as NetworkName,
      };
    } catch (error: any) {
      throw error;
    }
  }
}
