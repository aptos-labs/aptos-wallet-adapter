import {
  Aptos,
  AptosConfig,
  Hex,
  Network,
  NetworkToNodeAPI,
} from "@aptos-labs/ts-sdk";
import {
  NetworkInfo,
  NetworkInfo as StandardNetworkInfo,
} from "@aptos-labs/wallet-standard";

import { DappConfig } from "../WalletCore";
import { WalletSignAndSubmitMessageError } from "../error";
import { InputTransactionData } from "./types";

export function isMobile(): boolean {
  return /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i.test(
    navigator.userAgent
  );
}

export function isInAppBrowser(): boolean {
  const isIphone = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
    navigator.userAgent
  );

  const isAndroid = /(Android).*Version\/[\d.]+.*Chrome\/[^\s]+ Mobile/i.test(
    navigator.userAgent
  );

  return isIphone || isAndroid;
}

export function isRedirectable(): boolean {
  // SSR: return false
  if (typeof navigator === "undefined" || !navigator) return false;

  // if we are on mobile and NOT in a in-app browser we will redirect to a wallet app

  return isMobile() && !isInAppBrowser();
}

export function generalizedErrorMessage(error: any): string {
  return typeof error === "object" && "message" in error
    ? error.message
    : error;
}

/**
 * Helper function to get AptosConfig that supports Aptos and Custom networks
 *
 * @param networkInfo
 * @param dappConfig
 * @returns AptosConfig
 */
export const getAptosConfig = (
  networkInfo: NetworkInfo | null,
  dappConfig: DappConfig | undefined
): AptosConfig => {
  if (!networkInfo) {
    throw new Error("Undefined network");
  }

  if (isAptosNetwork(networkInfo)) {
    const currentNetwork = convertNetwork(networkInfo);

    if (isAptosLiveNetwork(currentNetwork)) {
      const apiKey = dappConfig?.aptosApiKeys;
      return new AptosConfig({
        network: currentNetwork,
        clientConfig: { API_KEY: apiKey ? apiKey[currentNetwork] : undefined },
      });
    }

    return new AptosConfig({
      network: currentNetwork,
    });
  }

  const knownNetworks = {
    okx: "https://wallet.okx.com/fullnode/aptos/discover/rpc",
  };

  if (networkInfo.url) {
    const isKnownNetwork = Object.values(knownNetworks).includes(
      networkInfo.url
    );

    if (isKnownNetwork) {
      return new AptosConfig({
        network: Network.CUSTOM,
        fullnode: networkInfo.url,
      });
    }
  }

  // Custom networks are not supported, please ensure that the wallet is returning the appropriate network Mainnet, Testnet, Devnet, Local
  throw new Error(
    `Invalid network, network ${networkInfo.name} not supported with Aptos wallet adapter to prevent user from using an unexpected network.`
  );
};

/**
 * Helper function to resolve if the current connected network is an Aptos network
 *
 * @param networkInfo
 * @returns boolean
 */
export const isAptosNetwork = (
  networkInfo: NetworkInfo | StandardNetworkInfo | null
): boolean => {
  if (!networkInfo) {
    throw new Error("Undefined network");
  }
  return NetworkToNodeAPI[networkInfo.name] !== undefined;
};

export const isAptosLiveNetwork = (networkInfo: Network): boolean => {
  return (
    networkInfo === "devnet" ||
    networkInfo === "testnet" ||
    networkInfo === "mainnet"
  );
};

/**
 * Helper function to fetch Devnet chain id
 */
export const fetchDevnetChainId = async (): Promise<number> => {
  const aptos = new Aptos(); // default to devnet
  return await aptos.getChainId();
};

/**
 * A helper function to handle the publish package transaction.
 * The Aptos SDK expects the metadataBytes and byteCode to be Uint8Array, but in case the arguments are passed in
 * as a string, this function converts the string to Uint8Array.
 */
export const handlePublishPackageTransaction = (
  transactionInput: InputTransactionData
) => {
  // convert the first argument, metadataBytes, to uint8array if is a string
  let metadataBytes = transactionInput.data.functionArguments[0];
  if (typeof metadataBytes === "string") {
    metadataBytes = Hex.fromHexInput(metadataBytes).toUint8Array();
  }

  // convert the second argument, byteCode, to uint8array if is a string
  let byteCode = transactionInput.data.functionArguments[1];
  if (Array.isArray(byteCode)) {
    byteCode = byteCode.map((byte) => {
      if (typeof byte === "string") {
        return Hex.fromHexInput(byte).toUint8Array();
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

// old => new
export function convertNetwork(networkInfo: NetworkInfo | null): Network {
  switch (networkInfo?.name) {
    case "mainnet" as Network:
      return Network.MAINNET;
    case "testnet" as Network:
      return Network.TESTNET;
    case "devnet" as Network:
      return Network.DEVNET;
    case "local" as Network:
      return Network.LOCAL;
    default:
      throw new Error("Invalid Aptos network name");
  }
}
