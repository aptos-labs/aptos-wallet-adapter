import {
  AccountAddress,
  AuthenticationKey,
  hashValues,
  isValidFunctionInfo,
  Serializer,
} from "@aptos-labs/ts-sdk";

/**
 * The domain separator used to calculate the DAA account address.
 */
export const ADDRESS_DOMAIN_SEPARATOR = 5;

/**
 * Compute the account address of the DAA
 * The DAA account address is computed by hashing the function info and the account identity
 * and appending the domain separator (5)
 *
 * @param functionInfo - The authentication function
 * @param accountIdentifier - The account identity
 * @returns The account address
 */
export function computeDomainAuthenticationKey(
  functionInfo: string,
  accountIdentifier: Uint8Array,
) {
  if (!isValidFunctionInfo(functionInfo)) {
    throw new Error(`Invalid authentication function ${functionInfo}`);
  }
  const [moduleAddress, moduleName, functionName] = functionInfo.split("::");

  // Serialize and append the function info
  const serializer = new Serializer();
  AccountAddress.fromString(moduleAddress).serialize(serializer);
  serializer.serializeStr(moduleName);
  serializer.serializeStr(functionName);

  // Serialize and append the account identity
  const s2 = new Serializer();
  s2.serializeBytes(accountIdentifier);

  // Append the domain separator
  const domainSeparator = new Uint8Array([ADDRESS_DOMAIN_SEPARATOR]);

  const data = hashValues([
    serializer.toUint8Array(),
    s2.toUint8Array(),
    domainSeparator,
  ]);

  return new AuthenticationKey({ data });
}
