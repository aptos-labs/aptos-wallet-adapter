import { AccountPublicKey, Aptos } from '@aptos-labs/ts-sdk';
import { AccountInfo } from '@aptos-labs/wallet-standard';

export function accountInfoFromPublicKey(publicKey: AccountPublicKey) {
  return new AccountInfo({
    publicKey,
    address: publicKey.authKey().derivedAddress(),
  })
}

export function isNullCallback(callback: Function) {
  return '_isNull' in callback && callback._isNull === true;
}

/**
 * Helper function to fetch Devnet chain id
 */
export const fetchDevnetChainId = async (): Promise<number> => {
  const aptos = new Aptos(); // default to devnet
  return await aptos.getChainId();
};