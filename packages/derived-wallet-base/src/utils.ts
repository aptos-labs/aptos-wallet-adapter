import { AccountPublicKey, Network, NetworkToChainId } from '@aptos-labs/ts-sdk';
import { AccountInfo } from '@aptos-labs/wallet-standard';

export function accountInfoFromPublicKey(publicKey: AccountPublicKey) {
  return new AccountInfo({
    publicKey,
    address: publicKey.authKey().derivedAddress(),
  })
}

export function aptosChainIdToNetwork(chainId: number) {
  for (const [network, otherChainId] of Object.entries(NetworkToChainId)) {
    if (otherChainId === chainId) {
      return network as Network;
    }
  }
  return undefined;
}

export function isNullCallback(callback: Function) {
  return '_isNull' in callback && callback._isNull === true;
}
