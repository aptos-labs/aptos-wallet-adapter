import {
  AccountAuthenticator,
  Ed25519PublicKey,
  Ed25519Signature,
  MultiEd25519PublicKey,
  MultiEd25519Signature,
  NetworkToChainId,
  NetworkToNodeAPI,
  PublicKey,
  Signature,
} from '@aptos-labs/ts-sdk';
import {
  AccountInfo,
  APTOS_CHAINS,
  AptosConnectFeature,
  AptosConnectNamespace,
  AptosDisconnectFeature,
  AptosDisconnectNamespace,
  AptosGetAccountFeature,
  AptosGetAccountNamespace,
  AptosGetNetworkFeature,
  AptosGetNetworkNamespace,
  AptosOnAccountChangeFeature,
  AptosOnAccountChangeNamespace,
  AptosOnNetworkChangeFeature,
  AptosOnNetworkChangeNamespace,
  AptosSignAndSubmitTransactionFeature,
  AptosSignAndSubmitTransactionNamespace,
  AptosSignMessageFeature,
  AptosSignMessageNamespace,
  AptosSignTransactionFeature,
  AptosSignTransactionNamespace,
  AptosWallet,
  NetworkInfo,
  UserResponseStatus,
} from '@aptos-labs/wallet-standard';
import {
  AccountInfo as LegacyAccountInfo,
  AdapterPlugin as LegacyAdapterPlugin,
  NetworkInfo as LegacyNetworkInfo,
} from '../../LegacyWalletPlugins';
import { makeUserApproval } from './approval';

function normalizeAccountInfo(accountInfo: LegacyAccountInfo | AccountInfo) {
  if ('serialize' in accountInfo) {
    return accountInfo;
  }
  const { address, minKeysRequired, publicKey: serializedPublicKey, ansName } = accountInfo;
  let publicKey: PublicKey;
  if (Array.isArray(serializedPublicKey)) {
    publicKey = new MultiEd25519PublicKey({
      publicKeys: serializedPublicKey.map(
        (pk) => new Ed25519PublicKey(pk),
      ),
      threshold: minKeysRequired ?? 0,
    })
  } else {
    publicKey = new Ed25519PublicKey(serializedPublicKey);
  }
  return new AccountInfo({
    address,
    publicKey,
    ansName: ansName || undefined,
  })
}

function normalizeNetworkInfo(networkInfo: LegacyNetworkInfo | NetworkInfo): NetworkInfo {
  const { name, chainId, url } = networkInfo;
  const resolvedNodeURL = url || NetworkToNodeAPI[name];
  const resolvedChainId = chainId ? Number(chainId) : NetworkToChainId[name];
  return { name, chainId: resolvedChainId, url: resolvedNodeURL };
}

export function connectFeatureFromLegacyPlugin(legacyPlugin: LegacyAdapterPlugin): AptosConnectFeature {
  const legacyConnect: () => Promise<AccountInfo | LegacyAccountInfo> = legacyPlugin.connect;
  return {
    [AptosConnectNamespace]: {
      version: '1.0.0',
      connect: async () => {
        // Note: dismissal will be considered as error
        const accountInfo = await legacyConnect();
        return makeUserApproval(normalizeAccountInfo(accountInfo));
      },
    },
  };
}

export function disconnectFeatureFromLegacyPlugin(legacyPlugin: LegacyAdapterPlugin): AptosDisconnectFeature {
  const legacyDisconnect = legacyPlugin.disconnect;
  return {
    [AptosDisconnectNamespace]: {
      version: '1.0.0',
      disconnect: async () => {
        await legacyDisconnect();
      },
    },
  };
}

export function getAccountFeatureFromLegacyPlugin(legacyPlugin: LegacyAdapterPlugin): AptosGetAccountFeature {
  const legacyGetAccount = legacyPlugin.account;
  if (legacyGetAccount === undefined) {
    throw new Error('Required `account` feature is not available');
  }
  return {
    [AptosGetAccountNamespace]: {
      version: '1.0.0',
      account: async () => {
        const accountInfo = await legacyGetAccount();
        return normalizeAccountInfo(accountInfo);
      },
    },
  };
}

export function getNetworkFeatureFromLegacyPlugin(legacyPlugin: LegacyAdapterPlugin): AptosGetNetworkFeature {
  const legacyGetNetwork: () => Promise<LegacyNetworkInfo> = legacyPlugin.network;
  return {
    [AptosGetNetworkNamespace]: {
      version: '1.0.0',
      network: async () => {
        const networkInfo = await legacyGetNetwork();
        return normalizeNetworkInfo(networkInfo);
      },
    },
  };
}

export function onAccountChangeFeatureFromLegacyPlugin(legacyPlugin: LegacyAdapterPlugin): AptosOnAccountChangeFeature {
  const legacyMethod = legacyPlugin.onAccountChange;
  return {
    [AptosOnAccountChangeNamespace]: {
      version: '1.0.0',
      onAccountChange: async (callback) => {
        void legacyMethod(async (accountInfo: LegacyAccountInfo | AccountInfo) => {
          callback(normalizeAccountInfo(accountInfo));
        });
      },
    },
  };
}

export function onNetworkChangeFeatureFromLegacyPlugin(legacyPlugin: LegacyAdapterPlugin): AptosOnNetworkChangeFeature {
  const legacyMethod = legacyPlugin.onNetworkChange;
  return {
    [AptosOnNetworkChangeNamespace]: {
      version: '1.0.0',
      onNetworkChange: async (callback) => {
        void legacyMethod(async (networkInfo: LegacyNetworkInfo | NetworkInfo) => {
          callback(normalizeNetworkInfo(networkInfo));
        });
      },
    },
  };
}

export function signMessageFeatureFromLegacyPlugin(legacyPlugin: LegacyAdapterPlugin): AptosSignMessageFeature {
  const legacyMethod = legacyPlugin.signMessage;
  return {
    [AptosSignMessageNamespace]: {
      version: '1.0.0',
      signMessage: async (input) => {
        const response = await legacyMethod(input);
        if ('status' in response) {
          return response;
        }

        const { signature: serializedSignature, bitmap, ...rest } = response;

        let signature: Signature;
        if (typeof serializedSignature === 'string') {
          signature = new Ed25519Signature(serializedSignature);
        } else if (Array.isArray(serializedSignature)) {
          if (!bitmap) {
            throw new Error('Multi-ed22519 signature bitmap not provided');
          }
          signature = new MultiEd25519Signature({
            signatures: serializedSignature.map(
              (sig) => new Ed25519Signature(sig),
            ),
            bitmap,
          });
        } else {
          signature = serializedSignature;
        }

        return makeUserApproval({
          signature,
          ...rest,
        });
      },
    },
  };
}

export function signTransactionFeatureFromLegacyPlugin(legacyPlugin: LegacyAdapterPlugin): AptosSignTransactionFeature {
  const legacyMethod = legacyPlugin.signTransaction;
  if (legacyMethod === undefined) {
    throw new Error('Required `signTransaction` feature is not available');
  }
  return {
    [AptosSignTransactionNamespace]: {
      version: '1.0.0',
      signTransaction: async (input) => {
        // Note: dismissal will be considered as error
        const accountAuthenticator: AccountAuthenticator = await legacyMethod(input);
        return makeUserApproval(accountAuthenticator);
      },
    },
  };
}

export function signAndSubmitTransactionFeatureFromLegacyPlugin(legacyPlugin: LegacyAdapterPlugin): Partial<AptosSignAndSubmitTransactionFeature> {
  const legacyMethod = legacyPlugin.signAndSubmitTransaction;
  if (legacyMethod === undefined) {
    return {};
  }
  return {
    [AptosSignAndSubmitTransactionNamespace]: {
      version: '1.1.0',
      signAndSubmitTransaction: async (input) => {
        const { payload, maxGasAmount, gasUnitPrice } = input;
        const response = await legacyMethod({
          data: payload,
          options: {
            maxGasAmount,
            gasUnitPrice,
          },
        });
        if ('status' in response && (
          response.status === UserResponseStatus.APPROVED || response.status === UserResponseStatus.REJECTED)) {
          return response;
        }
        const { hash } = response;
        return makeUserApproval({ hash });
      },
    },
  };
}

/**
 * Attempt to convert a legacy plugin into an Aptos wallet compatible with the Aptos wallet standard
 */
export function walletFromLegacyPlugin(legacyPlugin: LegacyAdapterPlugin): AptosWallet {
  return {
    name: legacyPlugin.name,
    version: '1.0.0',
    icon: legacyPlugin.icon,
    chains: APTOS_CHAINS,
    url: legacyPlugin.url,
    features: {
      ...connectFeatureFromLegacyPlugin(legacyPlugin),
      ...disconnectFeatureFromLegacyPlugin(legacyPlugin),
      ...getAccountFeatureFromLegacyPlugin(legacyPlugin),
      ...getNetworkFeatureFromLegacyPlugin(legacyPlugin),
      ...onAccountChangeFeatureFromLegacyPlugin(legacyPlugin),
      ...onNetworkChangeFeatureFromLegacyPlugin(legacyPlugin),
      ...signMessageFeatureFromLegacyPlugin(legacyPlugin),
      ...signTransactionFeatureFromLegacyPlugin(legacyPlugin),
      ...signAndSubmitTransactionFeatureFromLegacyPlugin(legacyPlugin),
    },
    accounts: [],
  }
}
