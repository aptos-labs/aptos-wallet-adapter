import { NetworkToChainId } from '@aptos-labs/ts-sdk';
import {
  APTOS_DEVNET_CHAIN,
  APTOS_LOCALNET_CHAIN,
  APTOS_MAINNET_CHAIN,
  APTOS_TESTNET_CHAIN,
  ChainsId,
  NetworkInfo,
} from '@aptos-labs/wallet-standard';
import { type Network, StandardNetwork } from '../network';

/**
 * Map chain identifiers to standard networks.
 * Useful to obtain available networks from the `chains` field
 */
export const aptosChainIdentifierToNetworkMap: Record<ChainsId, StandardNetwork> = {
  [APTOS_MAINNET_CHAIN]: StandardNetwork.MAINNET,
  [APTOS_TESTNET_CHAIN]: StandardNetwork.TESTNET,
  [APTOS_DEVNET_CHAIN]: StandardNetwork.DEVNET,
  [APTOS_LOCALNET_CHAIN]: StandardNetwork.LOCAL,
}

/**
 * Try to obtain the standard network associated with a chain id.
 * In case there's no exact match, we assume the network is Devnet since
 * its chain id changes.
 */
export function chainIdToStandardNetwork(chainId: number): StandardNetwork {
  for (const [name, cid] of Object.entries(NetworkToChainId)) {
    if (cid === chainId) {
      return name as StandardNetwork;
    }
  }
  return StandardNetwork.DEVNET;
}

/**
 * Convert `NetworkInfo` from the wallet standard to the newer `Network` type.
 * TODO: make `Network` the new standard type and remove `NetworkInfo`
 */
export function networkInfoToNetwork(info: NetworkInfo): Network {
  if (info.name !== 'custom') {
    return info.name;
  }

  if (info.url === undefined) {
    throw new Error('Missing fullNodeURL from custom network');
  }

  return {
    name: info.name,
    fullNodeURL: info.url,
    chainId: info.chainId,
  }
}
