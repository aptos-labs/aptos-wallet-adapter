import { NetworkName } from "@aptos/wallet-adapter-core";
import type {
  AccountInfo,
  AdapterPlugin,
  NetworkInfo,
  SignMessagePayload,
  SignMessageResponse,
  WalletName,
} from "@aptos/wallet-adapter-core";
import { MaybeHexString, Types } from "aptos";

interface IRiseErrorResult {
  code: number;
  name: string;
  message: string;
}

interface RiseAccount extends AccountInfo {
  authKey: MaybeHexString;
  isConnected: boolean;
}

interface IRiseWallet {
  connect: () => Promise<RiseAccount>;
  account: () => Promise<RiseAccount>;
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
  ): Promise<Uint8Array | IRiseErrorResult>;
  isConnected: () => Promise<boolean>;
  signMessage(message: SignMessagePayload): Promise<SignMessageResponse>;
  network(): Promise<NetworkName>;
  requestId: Promise<number>;
  onAccountChange: (
    listener: (newAddress: RiseAccount) => Promise<void>
  ) => Promise<void>;
  onNetworkChange: (
    listener: (network: { networkName: NetworkInfo }) => Promise<void>
  ) => Promise<void>;
}

interface RiseWindow extends Window {
  rise?: IRiseWallet;
}

declare const window: RiseWindow;

export const RiseWalletName = "Rise" as WalletName<"Rise">;

export class RiseWallet implements AdapterPlugin {
  readonly name = RiseWalletName;
  readonly url = "https://risewallet.io";
  readonly icon =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAFcUExURRvC7f///xWj+BiP+xKw9iVm/hK78xuF+xTF8BKX/DZE/yX82iD03iZ/+heZ+RXL7hS38xSs9jNM/xfW6xnd6Ds//ypd/jJT/+Xx/x7u4eX4/un8/RWs9heb+RiU+hXA8Bp+/huF/BfK7ytY/x59/RSJ/h94/TRL/yJv/iJx/Shi/h9z/hrh5zhF/w6j+xbQ7Rvm5CH13Tw9/zs//yl7/iL52jmy/DWV/U1t/zDK9O3x/7PD/yDU7hni5xnq4yX92Dz34RqI/BWv8xW88Bei9hWk+BW38SB5/RS19BfN7C5W/jRN/xjW6Rrf5hTA8RXG8BqM+j0+/yX/1y25+kV5/zGj/MDk/ou9/x5/+z0+/xGh+Ynh98Hp/rnd/yH13Orv/7rq/CNs/Xjt8CP52kpe/jjh7H2n/jzr6Ctb/jRK/iX917L88qn48x7u4Sf+1iH13Sf+1xvl5kdwTEdwTN7znrIAAAB0dFJOUwj///////////////8B//7///////v////+///3+Gf+/yZ3//7//3n/u9r/uSf///92CWj/JP////////////f/2GYlhYbXeWe52rzX19Ym1tkB//////94iP/////W///Z/2X/////u9eE///XZrnV1wAAvQMeLgAAAPpJREFUGNMdj2VzwlAQRTckIUQoFIiQ4MWlLe7SQt3dHeo67//PdB8z++WcuTP3LhBCnMPYxvZOvlg9RAC85dWwy+tb9N8+USIwCnB2xwIKpf+OSEJB26wbI92eIve/CUT32Rk0js7kZTCQf6twLgjU2K8sy/qQ5SJkknGBFS+5e4ZhPhXlBx7SuUq9flK7Nk3zsef/gizPPxuGcVo7ajY7vu4fvGpaG9M34jwt9+Yhpevt1l3rLDE1rhgU3jzjRuO4EkmINs69uwekrEqSZ47PRbA9sI5LSxeqKukanxTY4AqdTkrlAxpJx5dC0+fw/UJqazObWYs6Ef4B14Evtqt67PgAAAAASUVORK5CYII=";

  provider: IRiseWallet | undefined =
    typeof window !== "undefined" ? window.rise : undefined;

  async connect(): Promise<RiseAccount> {
    try {
      const addressInfo = await this.provider?.connect();
      if (!addressInfo) throw `${RiseWalletName} Address Info Error`;
      return addressInfo;
    } catch (error: any) {
      throw error;
    }
  }

  async account(): Promise<RiseAccount> {
    const response = await this.provider?.account();
    if (!response) throw `${RiseWalletName} Account Error`;
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
        throw new Error("Cannot generate transaction") as IRiseErrorResult;
      const response = await this.provider?.signAndSubmitTransaction(tx);

      if (!response) {
        throw new Error("No response") as IRiseErrorResult;
      }
      return { hash: response };
    } catch (error: any) {
      throw error;
    }
  }

  async signTransaction(
    transaction: Types.TransactionPayload,
    options?: any
  ): Promise<Uint8Array | IRiseErrorResult> {
    try {
      const signer = await this.account();
      const tx = await this.provider?.generateTransaction(
        signer.address,
        transaction,
        options
      );
      if (!tx)
        throw new Error("Cannot generate transaction") as IRiseErrorResult;
      const response = await this.provider?.signTransaction(tx);
      if (!response) {
        throw new Error("No response") as IRiseErrorResult;
      }
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async signMessage(message: SignMessagePayload): Promise<SignMessageResponse> {
    try {
      if (typeof message !== "object" || !message.nonce) {
        `${RiseWalletName} Invalid signMessage Payload`;
      }
      const response = await this.provider?.signMessage(message);
      if (response) {
        return response;
      } else {
        throw `${RiseWalletName} Sign Message failed`;
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
        newAccount: RiseAccount
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
      if (!response) throw `${RiseWalletName} Network Error`;
      return {
        name: response as NetworkName,
      };
    } catch (error: any) {
      throw error;
    }
  }
}
