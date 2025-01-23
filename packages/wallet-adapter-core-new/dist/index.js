"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  APTOS_CONNECT_ACCOUNT_URL: () => APTOS_CONNECT_ACCOUNT_URL,
  APTOS_CONNECT_BASE_URL: () => APTOS_CONNECT_BASE_URL,
  ChainIdToAnsSupportedNetworkMap: () => ChainIdToAnsSupportedNetworkMap,
  NetworkName: () => NetworkName,
  TxnBuilderTypes: () => import_aptos3.TxnBuilderTypes,
  Types: () => import_aptos3.Types,
  WalletCoreNew: () => WalletCoreNew,
  WalletCoreV1: () => WalletCoreV1,
  WalletReadyState: () => WalletReadyState,
  WalletStandardCore: () => WalletStandardCore,
  areBCSArguments: () => areBCSArguments,
  convertNetwork: () => convertNetwork,
  convertPayloadInputV1ToV2: () => convertPayloadInputV1ToV2,
  convertV2PayloadToV1JSONPayload: () => convertV2PayloadToV1JSONPayload,
  convertV2TransactionPayloadToV1BCSPayload: () => convertV2TransactionPayloadToV1BCSPayload,
  fetchDevnetChainId: () => fetchDevnetChainId,
  generalizedErrorMessage: () => generalizedErrorMessage,
  generateTransactionPayloadFromV1Input: () => generateTransactionPayloadFromV1Input,
  getAptosConfig: () => getAptosConfig,
  getAptosConnectWallets: () => getAptosConnectWallets,
  getLocalStorage: () => getLocalStorage,
  groupAndSortWallets: () => groupAndSortWallets,
  handlePublishPackageTransaction: () => handlePublishPackageTransaction,
  isAptosConnectWallet: () => isAptosConnectWallet,
  isAptosLiveNetwork: () => isAptosLiveNetwork,
  isAptosNetwork: () => isAptosNetwork,
  isInAppBrowser: () => isInAppBrowser,
  isInstallRequired: () => isInstallRequired,
  isInstalled: () => isInstalled,
  isMobile: () => isMobile,
  isRedirectable: () => isRedirectable,
  partitionWallets: () => partitionWallets,
  removeLocalStorage: () => removeLocalStorage,
  setLocalStorage: () => setLocalStorage,
  truncateAddress: () => truncateAddress
});
module.exports = __toCommonJS(src_exports);

// src/version.ts
var WALLET_ADAPTER_CORE_VERSION = "4.23.0";

// src/WalletCoreNew.ts
var import_eventemitter3 = __toESM(require("eventemitter3"));

// src/ga/index.ts
var GA4 = class {
  constructor() {
    this.aptosGAID = "G-GNVVWBL3J9";
    this.injectGA(this.aptosGAID);
  }
  gtag(a, b, c) {
    let dataLayer = window.dataLayer || [];
    dataLayer.push(arguments);
  }
  injectGA(gaID) {
    if (typeof window === "undefined")
      return;
    if (!gaID)
      return;
    const head = document.getElementsByTagName("head")[0];
    var myScript = document.createElement("script");
    myScript.setAttribute(
      "src",
      `https://www.googletagmanager.com/gtag/js?id=${gaID}`
    );
    const that = this;
    myScript.onload = function() {
      that.gtag("js", new Date());
      that.gtag("config", `${gaID}`, {
        send_page_view: false
      });
    };
    head.insertBefore(myScript, head.children[1]);
  }
};

// src/constants.ts
var WalletReadyState = /* @__PURE__ */ ((WalletReadyState2) => {
  WalletReadyState2["Installed"] = "Installed";
  WalletReadyState2["NotDetected"] = "NotDetected";
  WalletReadyState2["Loadable"] = "Loadable";
  WalletReadyState2["Unsupported"] = "Unsupported";
  return WalletReadyState2;
})(WalletReadyState || {});
var NetworkName = /* @__PURE__ */ ((NetworkName2) => {
  NetworkName2["Mainnet"] = "mainnet";
  NetworkName2["Testnet"] = "testnet";
  NetworkName2["Devnet"] = "devnet";
  return NetworkName2;
})(NetworkName || {});
var ChainIdToAnsSupportedNetworkMap = {
  "1": "mainnet",
  "2": "testnet"
};
var APTOS_CONNECT_BASE_URL = "https://aptosconnect.app";
var APTOS_CONNECT_ACCOUNT_URL = "https://aptosconnect.app/dashboard/main-account";

// src/AIP62StandardWallets/sdkWallets.ts
var import_wallet_adapter_plugin = require("@aptos-connect/wallet-adapter-plugin");
var import_ts_sdk = require("@aptos-labs/ts-sdk");
var import_aptos_wallet_adapter = require("@atomrigslab/aptos-wallet-adapter");
var import_aptos_wallet_adapter2 = require("@mizuwallet-sdk/aptos-wallet-adapter");
function getSDKWallets(dappConfig) {
  const sdkWallets = [];
  if (typeof window !== "undefined") {
    sdkWallets.push(
      new import_wallet_adapter_plugin.AptosConnectGoogleWallet({
        network: dappConfig == null ? void 0 : dappConfig.network,
        dappId: dappConfig == null ? void 0 : dappConfig.aptosConnectDappId,
        ...dappConfig == null ? void 0 : dappConfig.aptosConnect
      }),
      new import_wallet_adapter_plugin.AptosConnectAppleWallet({
        network: dappConfig == null ? void 0 : dappConfig.network,
        dappId: dappConfig == null ? void 0 : dappConfig.aptosConnectDappId,
        ...dappConfig == null ? void 0 : dappConfig.aptosConnect
      })
    );
    if ((dappConfig == null ? void 0 : dappConfig.mizuwallet) && (dappConfig == null ? void 0 : dappConfig.network) && [import_ts_sdk.Network.MAINNET, import_ts_sdk.Network.TESTNET].includes(dappConfig.network)) {
      sdkWallets.push(
        new import_aptos_wallet_adapter2.MizuWallet({
          network: dappConfig.network,
          manifestURL: dappConfig.mizuwallet.manifestURL,
          appId: dappConfig.mizuwallet.appId
        })
      );
    }
  }
  if ((dappConfig == null ? void 0 : dappConfig.network) === import_ts_sdk.Network.MAINNET) {
    sdkWallets.push(new import_aptos_wallet_adapter.TWallet());
  } else {
    sdkWallets.push(new import_aptos_wallet_adapter.DevTWallet());
  }
  return sdkWallets;
}

// src/utils/helpers.ts
var import_ts_sdk3 = require("@aptos-labs/ts-sdk");

// src/LegacyWalletPlugins/conversion.ts
var import_ts_sdk2 = require("@aptos-labs/ts-sdk");
var import_aptos = require("aptos");
function convertNetwork(networkInfo) {
  switch (networkInfo == null ? void 0 : networkInfo.name) {
    case "mainnet":
      return import_ts_sdk2.Network.MAINNET;
    case "testnet":
      return import_ts_sdk2.Network.TESTNET;
    case "devnet":
      return import_ts_sdk2.Network.DEVNET;
    case "local":
      return import_ts_sdk2.Network.LOCAL;
    default:
      throw new Error("Invalid Aptos network name");
  }
}
function convertV2TransactionPayloadToV1BCSPayload(payload) {
  const deserializer = new import_aptos.BCS.Deserializer(payload.bcsToBytes());
  return import_aptos.TxnBuilderTypes.TransactionPayload.deserialize(deserializer);
}
function convertV2PayloadToV1JSONPayload(payload) {
  var _a, _b;
  if ("bytecode" in payload) {
    throw new Error("script payload not supported");
  } else if ("multisigAddress" in payload) {
    const stringTypeTags = (_a = payload.typeArguments) == null ? void 0 : _a.map(
      (typeTag) => {
        if (typeTag instanceof import_ts_sdk2.TypeTag) {
          return typeTag.toString();
        }
        return typeTag;
      }
    );
    const newPayload = {
      type: "multisig_payload",
      multisig_address: payload.multisigAddress.toString(),
      function: payload.function,
      type_arguments: stringTypeTags || [],
      arguments: payload.functionArguments
    };
    return newPayload;
  } else {
    const stringTypeTags = (_b = payload.typeArguments) == null ? void 0 : _b.map(
      (typeTag) => {
        if (typeTag instanceof import_ts_sdk2.TypeTag) {
          return typeTag.toString();
        }
        return typeTag;
      }
    );
    const newPayload = {
      type: "entry_function_payload",
      function: payload.function,
      type_arguments: stringTypeTags || [],
      arguments: payload.functionArguments
    };
    return newPayload;
  }
}
function convertPayloadInputV1ToV2(inputV1) {
  if ("function" in inputV1) {
    const inputV2 = {
      function: inputV1.function,
      functionArguments: inputV1.arguments,
      typeArguments: inputV1.type_arguments
    };
    return inputV2;
  }
  throw new Error("Payload type not supported");
}
async function generateTransactionPayloadFromV1Input(aptosConfig, inputV1) {
  if ("function" in inputV1) {
    const inputV2 = convertPayloadInputV1ToV2(inputV1);
    return (0, import_ts_sdk2.generateTransactionPayload)({ ...inputV2, aptosConfig });
  }
  throw new Error("Payload type not supported");
}

// src/error/index.ts
var WalletError = class extends Error {
  constructor(message, error) {
    super(message);
    this.error = error;
  }
};
var WalletNotSelectedError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletNotSelectedError";
  }
};
var WalletNotReadyError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletNotReadyError";
  }
};
var WalletConnectionError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletConnectionError";
  }
};
var WalletDisconnectionError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletDisconnectionError";
  }
};
var WalletAccountError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletAccountError";
  }
};
var WalletGetNetworkError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletGetNetworkError";
  }
};
var WalletAccountChangeError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletAccountChangeError";
  }
};
var WalletNetworkChangeError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletNetworkChangeError";
  }
};
var WalletNotConnectedError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletNotConnectedError";
  }
};
var WalletSignMessageError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletSignMessageError";
  }
};
var WalletSubmitTransactionError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletSubmitTransactionError";
  }
};
var WalletSignMessageAndVerifyError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletSignMessageAndVerifyError";
  }
};
var WalletSignAndSubmitMessageError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletSignAndSubmitMessageError";
  }
};
var WalletSignTransactionError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletSignTransactionError";
  }
};
var WalletNotSupportedMethod = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletNotSupportedMethod";
  }
};
var WalletChangeNetworkError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletChangeNetworkError";
  }
};

// src/utils/helpers.ts
function isMobile() {
  return /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i.test(
    navigator.userAgent
  );
}
function isInAppBrowser() {
  const isIphone = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
    navigator.userAgent
  );
  const isAndroid = /(Android).*Version\/[\d.]+.*Chrome\/[^\s]+ Mobile/i.test(
    navigator.userAgent
  );
  return isIphone || isAndroid;
}
function isRedirectable() {
  if (typeof navigator === "undefined" || !navigator)
    return false;
  return isMobile() && !isInAppBrowser();
}
function generalizedErrorMessage(error) {
  return typeof error === "object" && "message" in error ? error.message : error;
}
var areBCSArguments = (args) => {
  if (args.length === 0)
    return false;
  return args.every(
    (arg) => arg instanceof import_ts_sdk3.Serializable
  );
};
var getAptosConfig = (networkInfo, dappConfig) => {
  if (!networkInfo) {
    throw new Error("Undefined network");
  }
  const currentNetwork = convertNetwork(networkInfo);
  if (isAptosLiveNetwork(currentNetwork)) {
    const apiKey = dappConfig == null ? void 0 : dappConfig.aptosApiKeys;
    return new import_ts_sdk3.AptosConfig({
      network: currentNetwork,
      clientConfig: { API_KEY: apiKey ? apiKey[currentNetwork] : void 0 }
    });
  }
  if (isAptosNetwork(networkInfo)) {
    return new import_ts_sdk3.AptosConfig({
      network: currentNetwork
    });
  }
  return new import_ts_sdk3.AptosConfig({
    network: import_ts_sdk3.Network.CUSTOM,
    fullnode: networkInfo.url
  });
};
var isAptosNetwork = (networkInfo) => {
  if (!networkInfo) {
    throw new Error("Undefined network");
  }
  return import_ts_sdk3.NetworkToNodeAPI[networkInfo.name] !== void 0;
};
var isAptosLiveNetwork = (networkInfo) => {
  return networkInfo === "devnet" || networkInfo === "testnet" || networkInfo === "mainnet";
};
var fetchDevnetChainId = async () => {
  const aptos = new import_ts_sdk3.Aptos();
  return await aptos.getChainId();
};
var handlePublishPackageTransaction = (transactionInput) => {
  let metadataBytes = transactionInput.data.functionArguments[0];
  if (typeof metadataBytes === "string") {
    metadataBytes = import_ts_sdk3.Hex.fromHexInput(metadataBytes).toUint8Array();
  }
  let byteCode = transactionInput.data.functionArguments[1];
  if (Array.isArray(byteCode)) {
    byteCode = byteCode.map((byte) => {
      if (typeof byte === "string") {
        return import_ts_sdk3.Hex.fromHexInput(byte).toUint8Array();
      }
      return byte;
    });
  } else {
    throw new WalletSignAndSubmitMessageError(
      "The bytecode argument must be an array."
    ).message;
  }
  return { metadataBytes, byteCode };
};

// src/utils/localStorage.ts
var LOCAL_STORAGE_ITEM_KEY = "AptosWalletName";
function setLocalStorage(walletName) {
  localStorage.setItem(LOCAL_STORAGE_ITEM_KEY, walletName);
}
function removeLocalStorage() {
  localStorage.removeItem(LOCAL_STORAGE_ITEM_KEY);
}
function getLocalStorage() {
  localStorage.getItem(LOCAL_STORAGE_ITEM_KEY);
}

// src/utils/walletSelector.ts
function partitionWallets(wallets, partitionFunction = isInstalled) {
  const defaultWallets = [];
  const moreWallets = [];
  for (const wallet of wallets) {
    if (partitionFunction(wallet))
      defaultWallets.push(wallet);
    else
      moreWallets.push(wallet);
  }
  return { defaultWallets, moreWallets };
}
function isInstalled(wallet) {
  return wallet.readyState === "Installed" /* Installed */;
}
function isInstallRequired(wallet) {
  const isWalletReady = isInstalled(wallet);
  const isMobile2 = !isWalletReady && isRedirectable();
  return !isMobile2 && !isWalletReady;
}
function truncateAddress(address) {
  if (!address)
    return;
  return `${address.slice(0, 6)}...${address.slice(-5)}`;
}
function isAptosConnectWallet(wallet) {
  if (!wallet.url)
    return false;
  return wallet.url.startsWith(APTOS_CONNECT_BASE_URL);
}
function getAptosConnectWallets(wallets) {
  const { defaultWallets, moreWallets } = partitionWallets(
    wallets,
    isAptosConnectWallet
  );
  return { aptosConnectWallets: defaultWallets, otherWallets: moreWallets };
}
function groupAndSortWallets(wallets, options) {
  const { aptosConnectWallets, otherWallets } = getAptosConnectWallets(wallets);
  const { defaultWallets, moreWallets } = partitionWallets(otherWallets);
  if (options == null ? void 0 : options.sortAptosConnectWallets) {
    aptosConnectWallets.sort(options.sortAptosConnectWallets);
  }
  if (options == null ? void 0 : options.sortAvailableWallets) {
    defaultWallets.sort(options.sortAvailableWallets);
  }
  if (options == null ? void 0 : options.sortInstallableWallets) {
    moreWallets.sort(options.sortInstallableWallets);
  }
  return {
    aptosConnectWallets,
    availableWallets: defaultWallets,
    installableWallets: moreWallets
  };
}

// src/WalletCoreNew.ts
var import_ts_sdk4 = require("@aptos-labs/ts-sdk");
var import_wallet_standard = require("@aptos-labs/wallet-standard");

// src/AIP62StandardWallets/registry.ts
var aptosStandardSupportedWalletList = [
  {
    name: "Nightly",
    url: "https://chromewebstore.google.com/detail/nightly/fiikommddbeccaoicoejoniammnalkfa?hl=en",
    icon: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyOC4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iV2Fyc3R3YV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDg1MS41IDg1MS41IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA4NTEuNSA4NTEuNTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCgkuc3Qwe2ZpbGw6IzYwNjdGOTt9DQoJLnN0MXtmaWxsOiNGN0Y3Rjc7fQ0KPC9zdHlsZT4NCjxnPg0KCTxnIGlkPSJXYXJzdHdhXzJfMDAwMDAwMTQ2MDk2NTQyNTMxODA5NDY0NjAwMDAwMDg2NDc4NTIwMDIxMTY5MTg2ODhfIj4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTEyNCwwaDYwMy42YzY4LjUsMCwxMjQsNTUuNSwxMjQsMTI0djYwMy42YzAsNjguNS01NS41LDEyNC0xMjQsMTI0SDEyNGMtNjguNSwwLTEyNC01NS41LTEyNC0xMjRWMTI0DQoJCQlDMCw1NS41LDU1LjUsMCwxMjQsMHoiLz4NCgk8L2c+DQoJPGcgaWQ9IldhcnN0d2FfMyI+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik02MjMuNSwxNzAuM2MtMzcuNCw1Mi4yLTg0LjIsODguNC0xMzkuNSwxMTIuNmMtMTkuMi01LjMtMzguOS04LTU4LjMtNy44Yy0xOS40LTAuMi0zOS4xLDIuNi01OC4zLDcuOA0KCQkJYy01NS4zLTI0LjMtMTAyLjEtNjAuMy0xMzkuNS0xMTIuNmMtMTEuMywyOC40LTU0LjgsMTI2LjQtMi42LDI2My40YzAsMC0xNi43LDcxLjUsMTQsMTMyLjljMCwwLDQ0LjQtMjAuMSw3OS43LDguMg0KCQkJYzM2LjksMjkuOSwyNS4xLDU4LjcsNTEuMSw4My41YzIyLjQsMjIuOSw1NS43LDIyLjksNTUuNywyMi45czMzLjMsMCw1NS43LTIyLjhjMjYtMjQuNywxNC4zLTUzLjUsNTEuMS04My41DQoJCQljMzUuMi0yOC4zLDc5LjctOC4yLDc5LjctOC4yYzMwLjYtNjEuNCwxNC0xMzIuOSwxNC0xMzIuOUM2NzguMywyOTYuNyw2MzQuOSwxOTguNyw2MjMuNSwxNzAuM3ogTTI1My4xLDQxNC44DQoJCQljLTI4LjQtNTguMy0zNi4yLTEzOC4zLTE4LjMtMjAxLjVjMjMuNyw2MCw1NS45LDg2LjksOTQuMiwxMTUuM0MzMTIuOCwzNjIuMywyODIuMywzOTQuMSwyNTMuMSw0MTQuOHogTTMzNC44LDUxNy41DQoJCQljLTIyLjQtOS45LTI3LjEtMjkuNC0yNy4xLTI5LjRjMzAuNS0xOS4yLDc1LjQtNC41LDc2LjgsNDAuOUMzNjAuOSw1MTQuNywzNTMsNTI1LjQsMzM0LjgsNTE3LjV6IE00MjUuNyw2NzguNw0KCQkJYy0xNiwwLTI5LTExLjUtMjktMjUuNnMxMy0yNS42LDI5LTI1LjZzMjksMTEuNSwyOSwyNS42QzQ1NC43LDY2Ny4zLDQ0MS43LDY3OC43LDQyNS43LDY3OC43eiBNNTE2LjcsNTE3LjUNCgkJCWMtMTguMiw4LTI2LTIuOC00OS43LDExLjVjMS41LTQ1LjQsNDYuMi02MC4xLDc2LjgtNDAuOUM1NDMuOCw0ODgsNTM5LDUwNy42LDUxNi43LDUxNy41eiBNNTk4LjMsNDE0LjgNCgkJCWMtMjkuMS0yMC43LTU5LjctNTIuNC03Ni04Ni4yYzM4LjMtMjguNCw3MC42LTU1LjQsOTQuMi0xMTUuM0M2MzQuNiwyNzYuNSw2MjYuOCwzNTYuNiw1OTguMyw0MTQuOHoiLz4NCgk8L2c+DQo8L2c+DQo8L3N2Zz4NCg==",
    readyState: "NotDetected" /* NotDetected */
  },
  {
    name: "Petra",
    url: "https://chromewebstore.google.com/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci?hl=en",
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAWbSURBVHgB7Z09c9NYFIaPlFSpUqQNK6rQhbSkWJghLZP9BesxfwAqytg1xe7+AY+3go5ACzObBkpwSqrVQkuRCiqkva8UZW1je22wpHPveZ8ZRU6wwwznueee+6FLJCuSdzrb7nZTNjaOJc9/ctdNiaJESPPkeeq+phLH5/L162k0HJ7JikTLvtEFPnFBf+D+0l/dt9tCNJK6xnjmZOg7GdJlPvC/AhQtPo5P3MsHQvwhiobLiLBQABf82y74z4Qt3ldSybKHToLTeW+I5/1B3u2euOD/JQy+zyRowEUs5zAzA1x+oCckJHrRYNCf/uE3AjD4QfONBBMC5PfvY2j3TEi4ZNmd8eHilQDFMK/s8xMhIXPhJLjuJLjAN/8VgRsbPWHwLbAtm5tXRWGRAS5b/99C7FBmgbTMAGXrJ5aIomJir8wA3S5afyLEEkUtEBezfQy+RYpFvdilgmMhNnGxRw2wL8QqScy1fMNE0T4yQCLEKkksxDQUwDj2BNjbK69pdndn/zxwNsUCCOyNGyJ374psbYkMBiLv30++59o1kW5X5NMnkdFI5OXL8nXghCsAAn10NL/Fz2NnpxQFFyR5/bq8BypDWAIg6AcHIoeH60nn4/K8e1deECIgwhAAQULQEXxIUAf43bju3ZvMDJ7jrwDT/XpToIvABeECqBf8EuB7+/W6CKBe0C/Auvv1uvC0XtArQBP9el14VC/oEqCtfr0uPKgX2hdAW79eF0rrhfYFQPCRKi1RyY4ZyZYF4GKQcSiAcSiAcSiAcSiAcSiAcSiAcSiAcSiAcSiAcSiAcSiAcSiAcShAm3z+LG1DAdqEAhjn40dpGwrQFtgIwgxgGAWtH1CAtsC2cQVQgLZQsk2cArSBoqeHKEAbKHpiiAI0DVq+kv4fUICmQetXMPyroABNgtb/5o1oggI0icJzBChAUyDwr16JNihAUzx+LBqhAE3w5InaU0MoQN08f64y9VdQgDrBkO/FC9EMBagLBB/P/yvHxlGxTYPh3tOn4gMUYN2g4FPc509DAdYFqvxZh1ArhwKsg6rSVzTHvywU4EeoqnyPTxKnAKuCVo4iD4s6ARwhTwGWoTrk8e3bIE4IH4cCVCDI1U6dL1/K73Eh4B727ctCASoQ6MBa9zJwJtA4FMA4FMA4FMA4FMA4FMA4FMA4FMA47Qtg4P/n1Uz7AgQ8zeoD7Qug5KQMq+joApgFWkNHEWhwEUYLFMA4OgRQdGCCNXQIUG28II2jZyKIWaAV9Aig7OgUK+gRAMH36ImaUNC1FoDt1swCjaJLAAQfT9mQxtC3GohugCOCxtC5HIyHLNkVNIJOATAv4Mnz9b6jd0MIhoWsB2pH944gPHmLkQGpDf1bwtAVUILa8GNPICRgd1AL/mwKRXfA0cHa8WtXMArDfp8bSdeIf9vCEfxHj8psQBF+GH/PB0A2wIzhrVsih4ciOztCVsfvAyKQAVAbYPr44EDk6Ehkd1fI8oRxQggKQ2QEXMgEe3ulELhvbQmZT3hHxFRn+1Tn/UAAZAWIUXUTHz4IKQn/jCBkB6Pn/ywDHw41DgUwDgRIhVgljSWKzoXYJM+dAFmWCrHKeewsOBViExd71AAjd10IsUYaDYdnsfty4Uz4U4g1zvClHAbm+e9CbJFlfdwKAVwWSJ0EfwixwrCIuYxPBOV5T1gLWCCtWj+4EqCoBbLsFyFhk2UPq9YPJqaCURW6W19IqPRdjCeG/dGsd+Xdbs/dToSERD8aDHrTP4zmvZsSBMXM4INo0afyTudY4vg39zIR4iNFXXfZtc9k4XJw0V9k2R1OFHkIhvVZdn1R8MHCDDDx+zqdxK0c9tz1szAjaKWc1XUTe+OV/iKWFmAcJ8NtJ8Kxe7kvkCGKEiHN45Zz3b/9yN3/uVzUGxXD+RX4F56985hsqA6SAAAAAElFTkSuQmCC",
    readyState: "NotDetected" /* NotDetected */
  },
  {
    name: "Pontem Wallet",
    url: "https://pontem.network/pontem-wallet",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4IDBDOC4wNzMwNCAwIDAgOC4wNzEzOSAwIDE3Ljk5NjNDMCAyNS4xMjk4IDQuMTczMTYgMzEuMzEwOCAxMC4yMDc2IDM0LjIyMDNWMzQuMjM1MUgxMC4yMzcyQzEyLjU4NiAzNS4zNjQ5IDE1LjIyMjggMzYgMTggMzZDMjcuOTI3IDM2IDM2IDI3LjkyODYgMzYgMTguMDAzN0MzNiA4LjA3MTM4IDI3LjkyNyAwIDE4IDBaTTE4IDEuNDc2OTJDMjcuMTA3MSAxLjQ3NjkyIDM0LjUyMjggOC44OTEwOCAzNC41MjI4IDE3Ljk5NjNDMzQuNTIyOCAyMC42MTA1IDMzLjkwOTcgMjMuMDkxNyAzMi44MjQgMjUuMjkyM0MzMC40NDU2IDI0LjE0MDMgMjguMDMwNCAyMy4yODM3IDI1LjU5MjkgMjIuNzAwM1Y4LjkyMDYyQzI1LjU5MjkgOC40NDA2MiAyNS4yMTYyIDguMDU2NjIgMjQuNzQzNSA4LjA1NjYySDIxLjcxNTJIMTQuMDg1NEgxMS4wNTdDMTAuNTkxNyA4LjA1NjYyIDEwLjIwNzYgOC40NDA2MiAxMC4yMDc2IDguOTIwNjJWMjIuNzY2OEM3Ljg0NDA3IDIzLjM1MDIgNS40OTUyOCAyNC4xOTIgMy4xODM0MiAyNS4yOTk3QzIuMDkwMjcgMjMuMDkxNyAxLjQ3NzIzIDIwLjYxNzggMS40NzcyMyAxNy45OTYzQzEuNDc3MjMgOC44OTEwOCA4Ljg5MjkgMS40NzY5MiAxOCAxLjQ3NjkyWk00LjEzNjIzIDI2Ljk2MTJDNi4wOTM1NiAyNS45OTM4IDguMTI0NzQgMjUuMjQ4IDEwLjIxNSAyNC43MzExVjMyLjU1ODhDNy43NDA2NiAzMS4yMzY5IDUuNjUwMzkgMjkuMzAyMiA0LjEzNjIzIDI2Ljk2MTJaTTE0LjA4NTQgMzQuMDQzMVYxNS42MDM3QzE0LjA4NTQgMTMuNDY5NSAxNS44MzU5IDExLjcwNDYgMTcuOTI2MSAxMS43MDQ2QzIwLjAxNjQgMTEuNzA0NiAyMS43MTUyIDEzLjQzMjYgMjEuNzE1MiAxNS41NTk0QzIxLjcxNTIgMTUuNTc0MiAyMS43MDc4IDE1LjU4ODkgMjEuNzA3OCAxNS42MDM3SDIxLjcxNTJWMjIuMDIwOUMxOS45MzUyIDIxLjgxNDIgMTguMTQ3NyAyMS43NDc3IDE2LjM2MDMgMjEuODQzN0wxNC44OTA0IDIzLjk3NzhDMTcuMTgwMSAyMy43ODU4IDE5LjQxMDcgMjMuODAwNiAyMS42MTE4IDI0LjA1MTdDMjEuNjM0IDI0LjA1MTcgMjEuNjQ4NyAyNC4wNTE3IDIxLjY3MDkgMjQuMDU5MUMyMS42ODU3IDI0LjA1OTEgMjEuNzAwNSAyNC4wNTkxIDIxLjcyMjYgMjQuMDY2NUMyMi4xMDY3IDI0LjExMDggMjMuNTAyNyAyNC4yODggMjQuNzgwNSAyNC42MDU1TDIxLjcyMjYgMjUuNjQ2OFYzNC4xMDIyQzIwLjUyNjEgMzQuMzc1NCAxOS4yODUyIDM0LjUzMDUgMTguMDE0OCAzNC41MzA1QzE2LjY0ODMgMzQuNTE1NyAxNS4zNDEgMzQuMzQ1OCAxNC4wODU0IDM0LjA0MzFaTTI1LjU4NTYgMzIuNjYyMlYyNC43NjhDMjcuNjY4NCAyNS4yOTIzIDI5LjcyOTIgMjYuMDYwMyAzMS43OTczIDI3LjA2NDZDMzAuMjQ2MiAyOS40MjAzIDI4LjEwNDIgMzEuMzU1MSAyNS41ODU2IDMyLjY2MjJaIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMjIyXzE2NzApIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjIyXzE2NzAiIHgxPSIxNy45OTk3IiB5MT0iMzYuNzc4OSIgeDI9IjE3Ljk5OTciIHkyPSItNS41MTk3OCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBvZmZzZXQ9IjAuMDg1OCIgc3RvcC1jb2xvcj0iIzhEMjlDMSIvPgo8c3RvcCBvZmZzZXQ9IjAuMjM4MyIgc3RvcC1jb2xvcj0iIzk0MkJCQiIvPgo8c3RvcCBvZmZzZXQ9IjAuNDY2NyIgc3RvcC1jb2xvcj0iI0E5MkZBQyIvPgo8c3RvcCBvZmZzZXQ9IjAuNzQxMyIgc3RvcC1jb2xvcj0iI0NBMzc5MyIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGMDNGNzciLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K",
    readyState: "NotDetected" /* NotDetected */
  }
];

// src/WalletCoreNew.ts
var WalletCoreNew = class extends import_eventemitter3.default {
  constructor(optInWallets, dappConfig, disableTelemetry) {
    super();
    this._wallet = null;
    this._sdkWallets = [];
    this._standard_wallets = [];
    this._standard_not_detected_wallets = [];
    this._network = null;
    this._connected = false;
    this._connecting = false;
    this._account = null;
    this._optInWallets = [];
    this._disableTelemetry = false;
    this.ga4 = null;
    this._optInWallets = optInWallets || [];
    this._dappConfig = dappConfig;
    this._disableTelemetry = disableTelemetry || false;
    this._sdkWallets = getSDKWallets(this._dappConfig);
    if (!this._disableTelemetry) {
      this.ga4 = new GA4();
    }
    this.fetchExtensionAIP62AptosWallets();
    this.fetchSDKAIP62AptosWallets();
    this.appendNotDetectedStandardSupportedWallets();
  }
  fetchExtensionAIP62AptosWallets() {
    let { aptosWallets, on } = (0, import_wallet_standard.getAptosWallets)();
    this.setExtensionAIP62Wallets(aptosWallets);
    if (typeof window === "undefined")
      return;
    const that = this;
    const removeRegisterListener = on("register", function() {
      let { aptosWallets: aptosWallets2 } = (0, import_wallet_standard.getAptosWallets)();
      that.setExtensionAIP62Wallets(aptosWallets2);
    });
    const removeUnregisterListener = on("unregister", function() {
      let { aptosWallets: aptosWallets2 } = (0, import_wallet_standard.getAptosWallets)();
      that.setExtensionAIP62Wallets(aptosWallets2);
    });
  }
  setExtensionAIP62Wallets(extensionwWallets) {
    const wallets = extensionwWallets.filter(
      (wallet) => wallet.name !== "Dev T wallet" && wallet.name !== "T wallet"
    );
    wallets.map((wallet) => {
      if (this.excludeWallet(wallet)) {
        return;
      }
      this._standard_wallets = this._standard_wallets.filter(
        (item) => item.name !== wallet.name
      );
      const isValid = (0, import_wallet_standard.isWalletWithRequiredFeatureSet)(wallet);
      if (isValid) {
        const index = this._standard_not_detected_wallets.findIndex(
          (notDetctedWallet) => notDetctedWallet.name == wallet.name
        );
        if (index !== -1) {
          this._standard_not_detected_wallets.splice(index, 1);
        }
        wallet.readyState = "Installed" /* Installed */;
        this._standard_wallets.push(wallet);
        this.emit("standardWalletsAdded", wallet);
      }
    });
  }
  fetchSDKAIP62AptosWallets() {
    this._sdkWallets.map((wallet) => {
      if (this.excludeWallet(wallet)) {
        return;
      }
      const isValid = (0, import_wallet_standard.isWalletWithRequiredFeatureSet)(wallet);
      if (isValid) {
        wallet.readyState = "Installed" /* Installed */;
        this._standard_wallets.push(wallet);
      }
    });
  }
  appendNotDetectedStandardSupportedWallets() {
    aptosStandardSupportedWalletList.map((supportedWallet) => {
      const existingStandardWallet = this._standard_wallets.find(
        (wallet) => wallet.name == supportedWallet.name
      );
      if (existingStandardWallet) {
        return;
      }
      if (existingStandardWallet && this.excludeWallet(existingStandardWallet)) {
        return;
      }
      if (!existingStandardWallet) {
        this._standard_not_detected_wallets.push(supportedWallet);
        this.emit("standardNotDetectedWalletAdded", supportedWallet);
      }
    });
  }
  excludeWallet(wallet) {
    if (this._optInWallets.length > 0 && !this._optInWallets.includes(wallet.name)) {
      return true;
    }
    return false;
  }
  recordEvent(eventName, additionalInfo) {
    var _a, _b, _c, _d;
    (_d = this.ga4) == null ? void 0 : _d.gtag("event", `wallet_adapter_${eventName}`, {
      wallet: (_a = this._wallet) == null ? void 0 : _a.name,
      network: (_b = this._network) == null ? void 0 : _b.name,
      network_url: (_c = this._network) == null ? void 0 : _c.url,
      adapter_core_version: WALLET_ADAPTER_CORE_VERSION,
      send_to: "G-GNVVWBL3J9",
      ...additionalInfo
    });
  }
  ensureWalletExists(wallet) {
    if (!wallet) {
      throw new WalletNotConnectedError().name;
    }
    if (!(wallet.readyState === "Installed" /* Installed */))
      throw new WalletNotReadyError("Wallet is not set").name;
  }
  ensureAccountExists(account) {
    if (!account) {
      throw new WalletAccountError("Account is not set").name;
    }
  }
  async setAnsName() {
    var _a;
    if (((_a = this._network) == null ? void 0 : _a.chainId) && this._account) {
      if (this._account.ansName)
        return;
      if (!ChainIdToAnsSupportedNetworkMap[this._network.chainId] || !isAptosNetwork(this._network)) {
        this._account.ansName = void 0;
        return;
      }
      const aptosConfig = getAptosConfig(this._network, this._dappConfig);
      const aptos = new import_ts_sdk4.Aptos(aptosConfig);
      const name = await aptos.ans.getPrimaryName({
        address: this._account.address.toString()
      });
      this._account.ansName = name;
    }
  }
  clearData() {
    this._connected = false;
    this.setWallet(null);
    this.setAccount(null);
    this.setNetwork(null);
    removeLocalStorage();
  }
  setWallet(wallet) {
    this._wallet = wallet;
  }
  setAccount(account) {
    this._account = account;
  }
  setNetwork(network) {
    this._network = network;
  }
  isConnected() {
    return this._connected;
  }
  get wallets() {
    return this._standard_wallets;
  }
  get notDetectedWallets() {
    return this._standard_not_detected_wallets;
  }
  get wallet() {
    try {
      if (!this._wallet)
        return null;
      return this._wallet;
    } catch (error) {
      throw new WalletNotSelectedError(error).message;
    }
  }
  get account() {
    try {
      return this._account;
    } catch (error) {
      throw new WalletAccountError(error).message;
    }
  }
  get network() {
    try {
      return this._network;
    } catch (error) {
      throw new WalletGetNetworkError(error).message;
    }
  }
  async connect(walletName) {
    var _a, _b, _c;
    const allDetectedWallets = this._standard_wallets;
    const selectedWallet = allDetectedWallets.find(
      (wallet) => wallet.name === walletName
    );
    if (!selectedWallet)
      return;
    if (this._connected) {
      if (((_a = this._wallet) == null ? void 0 : _a.name) === walletName)
        throw new WalletConnectionError(
          `${walletName} wallet is already connected`
        ).message;
    }
    if (isRedirectable() && selectedWallet.readyState !== "Installed" /* Installed */) {
      if ((_b = selectedWallet.features["aptos:openInMobileApp"]) == null ? void 0 : _b.openInMobileApp) {
        (_c = selectedWallet.features["aptos:openInMobileApp"]) == null ? void 0 : _c.openInMobileApp();
        return;
      }
      return;
    }
    if (selectedWallet.readyState !== "Installed" /* Installed */) {
      return;
    }
    await this.connectWallet(selectedWallet);
  }
  async connectWallet(selectedWallet) {
    var _a;
    try {
      this._connecting = true;
      this.setWallet(selectedWallet);
      const response = await selectedWallet.features["aptos:connect"].connect();
      if (response.status === import_wallet_standard.UserResponseStatus.REJECTED) {
        throw new WalletConnectionError("User has rejected the request").message;
      }
      const account = response.args;
      this.setAccount(account);
      const network = await ((_a = selectedWallet.features["aptos:network"]) == null ? void 0 : _a.network());
      this.setNetwork(network);
      await this.setAnsName();
      setLocalStorage(selectedWallet.name);
      this._connected = true;
      this.recordEvent("wallet_connect");
      this.emit("connect", account);
    } catch (error) {
      this.clearData();
      const errMsg = generalizedErrorMessage(error);
      throw new WalletConnectionError(errMsg).message;
    } finally {
      this._connecting = false;
    }
  }
  async disconnect() {
    try {
      this.ensureWalletExists(this._wallet);
      await this._wallet.features["aptos:disconnect"].disconnect();
      this.clearData();
      this.recordEvent("wallet_disconnect");
      this.emit("disconnect");
    } catch (error) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletDisconnectionError(errMsg).message;
    }
  }
  async signAndSubmitTransaction(transactionInput) {
    var _a, _b, _c;
    try {
      if ("function" in transactionInput.data) {
        if (transactionInput.data.function === "0x1::account::rotate_authentication_key_call") {
          throw new WalletSignAndSubmitMessageError("SCAM SITE DETECTED").message;
        }
        if (transactionInput.data.function === "0x1::code::publish_package_txn") {
          ({
            metadataBytes: transactionInput.data.functionArguments[0],
            byteCode: transactionInput.data.functionArguments[1]
          } = handlePublishPackageTransaction(transactionInput));
        }
      }
      this.ensureWalletExists(this._wallet);
      this.ensureAccountExists(this._account);
      this.recordEvent("sign_and_submit_transaction");
      if (this._wallet.features["aptos:signAndSubmitTransaction"]) {
        if (((_a = this._wallet.features["aptos:signAndSubmitTransaction"]) == null ? void 0 : _a.version) !== "1.1.0") {
          const aptosConfig2 = getAptosConfig(this._network, this._dappConfig);
          const aptos2 = new import_ts_sdk4.Aptos(aptosConfig2);
          const transaction2 = await aptos2.transaction.build.simple({
            sender: this._account.address.toString(),
            data: transactionInput.data,
            options: transactionInput.options
          });
          const signAndSubmitTransactionMethod = this._wallet.features["aptos:signAndSubmitTransaction"].signAndSubmitTransaction;
          const response3 = await signAndSubmitTransactionMethod(
            transaction2
          );
          if (response3.status === import_wallet_standard.UserResponseStatus.REJECTED) {
            throw new WalletConnectionError("User has rejected the request").message;
          }
          return response3.args;
        }
        const response2 = await this._wallet.features["aptos:signAndSubmitTransaction"].signAndSubmitTransaction({
          payload: transactionInput.data,
          gasUnitPrice: (_b = transactionInput.options) == null ? void 0 : _b.gasUnitPrice,
          maxGasAmount: (_c = transactionInput.options) == null ? void 0 : _c.maxGasAmount
        });
        if (response2.status === import_wallet_standard.UserResponseStatus.REJECTED) {
          throw new WalletConnectionError("User has rejected the request").message;
        }
        return response2.args;
      }
      const aptosConfig = getAptosConfig(this._network, this._dappConfig);
      const aptos = new import_ts_sdk4.Aptos(aptosConfig);
      const transaction = await aptos.transaction.build.simple({
        sender: this._account.address,
        data: transactionInput.data,
        options: transactionInput.options
      });
      const signTransactionResponse = await this.signTransaction(transaction);
      const response = await this.submitTransaction({
        transaction,
        senderAuthenticator: "authenticator" in signTransactionResponse ? signTransactionResponse.authenticator : signTransactionResponse
      });
      return { hash: response.hash };
    } catch (error) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSignAndSubmitMessageError(errMsg).message;
    }
  }
  async signTransaction(transactionOrPayload, asFeePayer, options) {
    var _a, _b, _c, _d;
    try {
      this.ensureWalletExists(this._wallet);
      this.ensureAccountExists(this._account);
      this.recordEvent("sign_transaction");
      if ("rawTransaction" in transactionOrPayload) {
        const response = await ((_a = this._wallet) == null ? void 0 : _a.features["aptos:signTransaction"].signTransaction(
          transactionOrPayload,
          asFeePayer
        ));
        if (response.status === import_wallet_standard.UserResponseStatus.REJECTED) {
          throw new WalletConnectionError("User has rejected the request").message;
        }
        return response.args;
      } else if (((_b = this._wallet.features["aptos:signTransaction"]) == null ? void 0 : _b.version) === "1.1") {
        const signTransactionV1_1StandardInput = {
          payload: transactionOrPayload.data,
          expirationTimestamp: options == null ? void 0 : options.expirationTimestamp,
          expirationSecondsFromNow: options == null ? void 0 : options.expirationSecondsFromNow,
          gasUnitPrice: options == null ? void 0 : options.gasUnitPrice,
          maxGasAmount: options == null ? void 0 : options.maxGasAmount,
          sequenceNumber: options == null ? void 0 : options.accountSequenceNumber,
          sender: transactionOrPayload.sender ? { address: import_ts_sdk4.AccountAddress.from(transactionOrPayload.sender) } : void 0
        };
        const walletSignTransactionMethod = (_c = this._wallet) == null ? void 0 : _c.features["aptos:signTransaction"].signTransaction;
        const response = await walletSignTransactionMethod(
          signTransactionV1_1StandardInput
        );
        if (response.status === import_wallet_standard.UserResponseStatus.REJECTED) {
          throw new WalletConnectionError("User has rejected the request").message;
        }
        return response.args;
      } else {
        const aptosConfig = getAptosConfig(this._network, this._dappConfig);
        const payload = await (0, import_ts_sdk4.generateTransactionPayload)({
          ...transactionOrPayload.data,
          aptosConfig
        });
        const rawTransaction = await (0, import_ts_sdk4.generateRawTransaction)({
          aptosConfig,
          payload,
          sender: this._account.address,
          options
        });
        const response = await ((_d = this._wallet) == null ? void 0 : _d.features["aptos:signTransaction"].signTransaction(
          new import_ts_sdk4.SimpleTransaction(rawTransaction),
          asFeePayer
        ));
        if (response.status === import_wallet_standard.UserResponseStatus.REJECTED) {
          throw new WalletConnectionError("User has rejected the request").message;
        }
        return response.args;
      }
    } catch (error) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSignTransactionError(errMsg).message;
    }
  }
  async signMessage(message) {
    var _a, _b;
    try {
      this.ensureWalletExists(this._wallet);
      this.recordEvent("sign_message");
      const response = await ((_b = (_a = this._wallet) == null ? void 0 : _a.features["aptos:signMessage"]) == null ? void 0 : _b.signMessage(message));
      if (response.status === import_wallet_standard.UserResponseStatus.REJECTED) {
        throw new WalletConnectionError("User has rejected the request").message;
      }
      return response.args;
    } catch (error) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSignMessageError(errMsg).message;
    }
  }
  async submitTransaction(transaction) {
    try {
      this.ensureWalletExists(this._wallet);
      const { additionalSignersAuthenticators } = transaction;
      const transactionType = additionalSignersAuthenticators !== void 0 ? "multi-agent" : "simple";
      this.recordEvent("submit_transaction", {
        transaction_type: transactionType
      });
      const aptosConfig = getAptosConfig(this._network, this._dappConfig);
      const aptos = new import_ts_sdk4.Aptos(aptosConfig);
      if (additionalSignersAuthenticators !== void 0) {
        const multiAgentTxn = {
          ...transaction,
          additionalSignersAuthenticators
        };
        return aptos.transaction.submit.multiAgent(multiAgentTxn);
      } else {
        return aptos.transaction.submit.simple(transaction);
      }
    } catch (error) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSubmitTransactionError(errMsg).message;
    }
  }
  async onAccountChange() {
    var _a;
    try {
      this.ensureWalletExists(this._wallet);
      await ((_a = this._wallet.features["aptos:onAccountChange"]) == null ? void 0 : _a.onAccountChange(
        async (data) => {
          this.setAccount(data);
          await this.setAnsName();
          this.recordEvent("account_change");
          this.emit("accountChange", this._account);
        }
      ));
    } catch (error) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletAccountChangeError(errMsg).message;
    }
  }
  async onNetworkChange() {
    var _a;
    try {
      this.ensureWalletExists(this._wallet);
      await ((_a = this._wallet.features["aptos:onNetworkChange"]) == null ? void 0 : _a.onNetworkChange(
        async (data) => {
          this.setNetwork(data);
          await this.setAnsName();
          this.emit("networkChange", this._network);
        }
      ));
    } catch (error) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletNetworkChangeError(errMsg).message;
    }
  }
  async changeNetwork(network) {
    var _a;
    try {
      this.ensureWalletExists(this._wallet);
      this.recordEvent("change_network_request", {
        from: (_a = this._network) == null ? void 0 : _a.name,
        to: network
      });
      const chainId = network === import_ts_sdk4.Network.DEVNET ? await fetchDevnetChainId() : import_ts_sdk4.NetworkToChainId[network];
      const networkInfo = {
        name: network,
        chainId
      };
      if (this._wallet.features["aptos:changeNetwork"]) {
        const response = await this._wallet.features["aptos:changeNetwork"].changeNetwork(
          networkInfo
        );
        if (response.status === import_wallet_standard.UserResponseStatus.REJECTED) {
          throw new WalletConnectionError("User has rejected the request").message;
        }
        return response.args;
      }
      throw new WalletChangeNetworkError(
        `${this._wallet.name} does not support changing network request`
      ).message;
    } catch (error) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletChangeNetworkError(errMsg).message;
    }
  }
  async signMessageAndVerify(message) {
    try {
      this.ensureWalletExists(this._wallet);
      this.ensureAccountExists(this._account);
      this.recordEvent("sign_message_and_verify");
      try {
        const response = await this._wallet.features["aptos:signMessage"].signMessage(message);
        if (response.status === import_wallet_standard.UserResponseStatus.REJECTED) {
          throw new WalletConnectionError("Failed to sign a message").message;
        }
        if (this._account.publicKey instanceof import_ts_sdk4.AnyPublicKey && this._account.publicKey.variant === import_ts_sdk4.AnyPublicKeyVariant.Keyless) {
          return true;
        }
        let verified = false;
        if (response.args.signature instanceof import_ts_sdk4.MultiEd25519Signature) {
          if (!(this._account.publicKey instanceof import_ts_sdk4.MultiEd25519PublicKey)) {
            throw new WalletSignMessageAndVerifyError(
              "Public key and Signature type mismatch"
            ).message;
          }
          const { fullMessage, signature } = response.args;
          const bitmap = signature.bitmap;
          if (bitmap) {
            const minKeysRequired = this._account.publicKey.threshold;
            if (signature.signatures.length < minKeysRequired) {
              verified = false;
            } else {
              verified = this._account.publicKey.verifySignature({
                message: new TextEncoder().encode(fullMessage),
                signature
              });
            }
          }
        } else {
          verified = this._account.publicKey.verifySignature({
            message: new TextEncoder().encode(response.args.fullMessage),
            signature: response.args.signature
          });
        }
        return verified;
      } catch (error) {
        const errMsg = generalizedErrorMessage(error);
        throw new WalletSignMessageAndVerifyError(errMsg).message;
      }
    } catch (error) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSignMessageAndVerifyError(errMsg).message;
    }
  }
};

// src/LegacyWalletPlugins/WalletCoreV1.ts
var import_aptos2 = require("aptos");
var import_eventemitter32 = __toESM(require("eventemitter3"));
var import_buffer = require("buffer");
var import_ts_sdk5 = require("@aptos-labs/ts-sdk");
var import_tweetnacl = __toESM(require("tweetnacl"));
var WalletCoreV1 = class extends import_eventemitter32.default {
  async connect(wallet) {
    const account = await wallet.connect();
    return account;
  }
  async resolveSignAndSubmitTransaction(payloadData, network, wallet, transactionInput, dappConfig) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (areBCSArguments(payloadData.functionArguments)) {
      const aptosConfig = getAptosConfig(network, dappConfig);
      const newPayload = await (0, import_ts_sdk5.generateTransactionPayload)({
        ...payloadData,
        aptosConfig
      });
      const oldTransactionPayload2 = convertV2TransactionPayloadToV1BCSPayload(newPayload);
      return await this.signAndSubmitBCSTransaction(
        oldTransactionPayload2,
        wallet,
        {
          max_gas_amount: ((_a = transactionInput.options) == null ? void 0 : _a.maxGasAmount) ? BigInt((_b = transactionInput.options) == null ? void 0 : _b.maxGasAmount) : void 0,
          gas_unit_price: ((_c = transactionInput.options) == null ? void 0 : _c.gasUnitPrice) ? BigInt((_d = transactionInput.options) == null ? void 0 : _d.gasUnitPrice) : void 0
        }
      );
    }
    const oldTransactionPayload = convertV2PayloadToV1JSONPayload(payloadData);
    return await this.signAndSubmitTransaction(oldTransactionPayload, wallet, {
      max_gas_amount: ((_e = transactionInput.options) == null ? void 0 : _e.maxGasAmount) ? BigInt((_f = transactionInput.options) == null ? void 0 : _f.maxGasAmount) : void 0,
      gas_unit_price: ((_g = transactionInput.options) == null ? void 0 : _g.gasUnitPrice) ? BigInt((_h = transactionInput.options) == null ? void 0 : _h.gasUnitPrice) : void 0
    });
  }
  async signAndSubmitTransaction(transaction, wallet, options) {
    try {
      const response = await wallet.signAndSubmitTransaction(
        transaction,
        options
      );
      return response;
    } catch (error) {
      const errMsg = typeof error == "object" && "message" in error ? error.message : error;
      throw new WalletSignAndSubmitMessageError(errMsg).message;
    }
  }
  async signAndSubmitBCSTransaction(transaction, wallet, options) {
    if (!("signAndSubmitBCSTransaction" in wallet)) {
      throw new WalletNotSupportedMethod(
        `Submit a BCS Transaction is not supported by ${wallet.name}`
      ).message;
    }
    try {
      const response = await wallet.signAndSubmitBCSTransaction(
        transaction,
        options
      );
      return response;
    } catch (error) {
      const errMsg = typeof error == "object" && "message" in error ? error.message : error;
      throw new WalletSignAndSubmitMessageError(errMsg).message;
    }
  }
  async signTransaction(transaction, wallet, options) {
    try {
      const response = await wallet.signTransaction(
        transaction,
        options
      );
      return response;
    } catch (error) {
      const errMsg = typeof error == "object" && "message" in error ? error.message : error;
      throw new WalletSignTransactionError(errMsg).message;
    }
  }
  async signMessageAndVerify(message, wallet, account) {
    try {
      const response = await wallet.signMessage(message);
      if (!response)
        throw new WalletSignMessageAndVerifyError("Failed to sign a message").message;
      console.log("signMessageAndVerify signMessage response", response);
      let verified = false;
      if (Array.isArray(response.signature)) {
        const { fullMessage, signature, bitmap } = response;
        if (bitmap) {
          const minKeysRequired = account.minKeysRequired;
          if (signature.length < minKeysRequired) {
            verified = false;
          } else {
            const bits = Array.from(bitmap).flatMap(
              (n) => Array.from({ length: 8 }).map((_, i) => n >> i & 1)
            );
            const index = bits.map((_, i) => i).filter((i) => bits[i]);
            const publicKeys = account.publicKey;
            const matchedPublicKeys = publicKeys.filter(
              (_, i) => index.includes(i)
            );
            verified = true;
            for (let i = 0; i < signature.length; i++) {
              const isSigVerified = import_tweetnacl.default.sign.detached.verify(
                import_buffer.Buffer.from(fullMessage),
                import_buffer.Buffer.from(signature[i], "hex"),
                import_buffer.Buffer.from(matchedPublicKeys[i], "hex")
              );
              if (!isSigVerified) {
                verified = false;
                break;
              }
            }
          }
        } else {
          throw new WalletSignMessageAndVerifyError("Failed to get a bitmap").message;
        }
      } else {
        const currentAccountPublicKey = new import_aptos2.HexString(
          account.publicKey
        );
        const signature = new import_aptos2.HexString(
          response.signature
        );
        verified = import_tweetnacl.default.sign.detached.verify(
          import_buffer.Buffer.from(response.fullMessage),
          import_buffer.Buffer.from(signature.noPrefix(), "hex"),
          import_buffer.Buffer.from(currentAccountPublicKey.noPrefix(), "hex")
        );
      }
      return verified;
    } catch (error) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSignMessageAndVerifyError(errMsg).message;
    }
  }
};

// src/LegacyWalletPlugins/types.ts
var import_aptos3 = require("aptos");

// src/AIP62StandardWallets/WalletStandard.ts
var import_wallet_standard2 = require("@aptos-labs/wallet-standard");
var import_ts_sdk6 = require("@aptos-labs/ts-sdk");
var WalletStandardCore = class {
  async connect(wallet) {
    const response = await wallet.connect();
    if (response.status === import_wallet_standard2.UserResponseStatus.REJECTED) {
      throw new WalletConnectionError("User has rejected the request").message;
    }
    return response.args;
  }
  async signAndSubmitTransaction(transactionInput, aptos, account, wallet, standardWallets) {
    var _a, _b, _c;
    try {
      const standardWallet = standardWallets.find(
        (standardWallet2) => wallet.name === standardWallet2.name
      );
      if (((_a = standardWallet == null ? void 0 : standardWallet.features["aptos:signAndSubmitTransaction"]) == null ? void 0 : _a.version) !== "1.1.0") {
        const transaction2 = await aptos.transaction.build.simple({
          sender: account.address.toString(),
          data: transactionInput.data,
          options: transactionInput.options
        });
        const response2 = await wallet.signAndSubmitTransaction(
          transaction2
        );
        if (response2.status === import_wallet_standard2.UserResponseStatus.REJECTED) {
          throw new WalletConnectionError("User has rejected the request").message;
        }
        return response2.args;
      }
      const transaction = {
        gasUnitPrice: (_b = transactionInput.options) == null ? void 0 : _b.gasUnitPrice,
        maxGasAmount: (_c = transactionInput.options) == null ? void 0 : _c.maxGasAmount,
        payload: transactionInput.data
      };
      const response = await wallet.signAndSubmitTransaction(
        transaction
      );
      if (response.status === import_wallet_standard2.UserResponseStatus.REJECTED) {
        throw new WalletConnectionError("User has rejected the request").message;
      }
      return response.args;
    } catch (error) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSignAndSubmitMessageError(errMsg).message;
    }
  }
  async signTransaction(transactionOrInput, wallet, asFeePayer) {
    const response = await wallet.signTransaction(
      transactionOrInput,
      asFeePayer
    );
    if (response.status === import_wallet_standard2.UserResponseStatus.REJECTED) {
      throw new WalletConnectionError("User has rejected the request").message;
    }
    return response.args;
  }
  async signMessage(message, wallet) {
    try {
      const response = await wallet.signMessage(
        message
      );
      if (response.status === import_wallet_standard2.UserResponseStatus.REJECTED) {
        throw new WalletConnectionError("User has rejected the request").message;
      }
      return response.args;
    } catch (error) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSignMessageError(errMsg).message;
    }
  }
  async signMessageAndVerify(message, wallet) {
    try {
      const response = await wallet.signMessage(
        message
      );
      const account = await wallet.account();
      if (response.status === import_wallet_standard2.UserResponseStatus.REJECTED) {
        throw new WalletConnectionError("Failed to sign a message").message;
      }
      if (account.publicKey instanceof import_ts_sdk6.AnyPublicKey && account.publicKey.variant === import_ts_sdk6.AnyPublicKeyVariant.Keyless) {
        return true;
      }
      let verified = false;
      if (response.args.signature instanceof import_ts_sdk6.MultiEd25519Signature) {
        if (!(account.publicKey instanceof import_ts_sdk6.MultiEd25519PublicKey)) {
          throw new WalletSignMessageAndVerifyError(
            "Public key and Signature type mismatch"
          ).message;
        }
        const { fullMessage, signature } = response.args;
        const bitmap = signature.bitmap;
        if (bitmap) {
          const minKeysRequired = account.publicKey.threshold;
          if (signature.signatures.length < minKeysRequired) {
            verified = false;
          } else {
            verified = account.publicKey.verifySignature({
              message: new TextEncoder().encode(fullMessage),
              signature
            });
          }
        }
      } else {
        verified = account.publicKey.verifySignature({
          message: new TextEncoder().encode(response.args.fullMessage),
          signature: response.args.signature
        });
      }
      return verified;
    } catch (error) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSignMessageAndVerifyError(errMsg).message;
    }
  }
};

// src/index.ts
var import_wallet_standard3 = require("@aptos-labs/wallet-standard");
if (typeof window !== "undefined") {
  window.WALLET_ADAPTER_CORE_VERSION = WALLET_ADAPTER_CORE_VERSION;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  APTOS_CONNECT_ACCOUNT_URL,
  APTOS_CONNECT_BASE_URL,
  ChainIdToAnsSupportedNetworkMap,
  NetworkName,
  TxnBuilderTypes,
  Types,
  WalletCoreNew,
  WalletCoreV1,
  WalletReadyState,
  WalletStandardCore,
  areBCSArguments,
  convertNetwork,
  convertPayloadInputV1ToV2,
  convertV2PayloadToV1JSONPayload,
  convertV2TransactionPayloadToV1BCSPayload,
  fetchDevnetChainId,
  generalizedErrorMessage,
  generateTransactionPayloadFromV1Input,
  getAptosConfig,
  getAptosConnectWallets,
  getLocalStorage,
  groupAndSortWallets,
  handlePublishPackageTransaction,
  isAptosConnectWallet,
  isAptosLiveNetwork,
  isAptosNetwork,
  isInAppBrowser,
  isInstallRequired,
  isInstalled,
  isMobile,
  isRedirectable,
  partitionWallets,
  removeLocalStorage,
  setLocalStorage,
  truncateAddress
});
//# sourceMappingURL=index.js.map