import { AuthenticationKey, DerivableAbstractedAccount } from '@aptos-labs/ts-sdk';

/**
 * @param functionInfo - The authentication function
 * @param accountIdentifier - The account identity
 * @returns The account address
 */
export function computeDomainAuthenticationKey(functionInfo: string, accountIdentifier: Uint8Array): AuthenticationKey {
  try{
    const add = DerivableAbstractedAccount.computeAccountAddress(functionInfo, accountIdentifier);
    return new AuthenticationKey({ data:add });
  } catch (e) {
    throw new Error(`Error computing domain authentication key: ${e}`);
  }
}
