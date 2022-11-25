// src/index.ts
var AptosWalletName = "Aptos";
var AptosWallet = class {
  constructor() {
    this.name = AptosWalletName;
    this.url = "https://chrome.google.com/webstore/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci";
    this.icon = "data:image/png;base64,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";
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
