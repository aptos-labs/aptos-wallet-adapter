// src/index.ts
var AptosWalletName = "Aptos";
var AptosWallet = class {
  constructor() {
    this.name = AptosWalletName;
    this.url = "https://my-wallet.com";
    this.icon = "https://my-wallet.com.png";
    this.provider = typeof window !== "undefined" ? window.aptos : void 0;
  }
  async connect() {
    var _a;
    try {
      const addressInfo = await ((_a = this.provider) == null ? void 0 : _a.connect());
      if (!addressInfo)
        throw `${AptosWalletName} Address Info Error`;
      return addressInfo;
    } catch (error) {
      throw error;
    }
  }
  async account() {
    var _a;
    const response = await ((_a = this.provider) == null ? void 0 : _a.account());
    if (!response)
      throw `${AptosWalletName} Account Error`;
    return response;
  }
  async disconnect() {
    var _a;
    try {
      await ((_a = this.provider) == null ? void 0 : _a.disconnect());
    } catch (error) {
      throw error;
    }
  }
  async signAndSubmitTransaction(transaction, options) {
    var _a;
    try {
      const response = await ((_a = this.provider) == null ? void 0 : _a.signAndSubmitTransaction(
        transaction,
        options
      ));
      if (response.code) {
        throw new Error(response.message);
      }
      return response;
    } catch (error) {
      const errMsg = error.message;
      throw errMsg;
    }
  }
  async signMessage(message) {
    var _a;
    try {
      if (typeof message !== "object" || !message.nonce) {
        `${AptosWalletName} Invalid signMessage Payload`;
      }
      const response = await ((_a = this.provider) == null ? void 0 : _a.signMessage(message));
      if (response) {
        return response;
      } else {
        throw `${AptosWalletName} Sign Message failed`;
      }
    } catch (error) {
      const errMsg = error.message;
      throw errMsg;
    }
  }
  async onNetworkChange(callback) {
    var _a;
    try {
      const handleNetworkChange = async (newNetwork) => {
        callback({
          name: newNetwork.networkName,
          chainId: void 0,
          api: void 0
        });
      };
      await ((_a = this.provider) == null ? void 0 : _a.onNetworkChange(handleNetworkChange));
    } catch (error) {
      const errMsg = error.message;
      throw errMsg;
    }
  }
  async onAccountChange(callback) {
    var _a;
    try {
      const handleAccountChange = async (newAccount) => {
        if (newAccount == null ? void 0 : newAccount.publicKey) {
          callback({
            publicKey: newAccount.publicKey,
            address: newAccount.address
          });
        } else {
          const response = await this.connect();
          callback({
            address: response == null ? void 0 : response.address,
            publicKey: response == null ? void 0 : response.publicKey
          });
        }
      };
      await ((_a = this.provider) == null ? void 0 : _a.onAccountChange(handleAccountChange));
    } catch (error) {
      console.log(error);
      const errMsg = error.message;
      throw errMsg;
    }
  }
  async network() {
    var _a;
    try {
      const response = await ((_a = this.provider) == null ? void 0 : _a.network());
      if (!response)
        throw `${AptosWalletName} Network Error`;
      return {
        name: response
      };
    } catch (error) {
      throw error;
    }
  }
};
export {
  AptosWallet,
  AptosWalletName
};
