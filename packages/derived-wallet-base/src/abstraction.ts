import {
  AccountAddress,
  AuthenticationKey,
  Deserializer,
  hashValues,
  isValidFunctionInfo,
  Serializable,
  Serializer,
} from "@aptos-labs/ts-sdk";

/**
 * The domain separator used to calculate the DAA account address.
 */
export const ADDRESS_DOMAIN_SEPARATOR = 5;

/**
 * @param functionInfo - The authentication function
 * @param identity - The account identity. Typically it is the wallet public key or account address
 * @param domain - The dapp domain
 * @returns The account address authentication key
 */
export function computeDerivableAuthenticationKey(
  functionInfo: string,
  identity: string,
  domain: string
): AuthenticationKey {
  try {
    // TODO: move it to the ts-sdk as the general computation function once we are finalized on the on-chain auth function
    if (!isValidFunctionInfo(functionInfo)) {
      throw new Error(`Invalid authentication function ${functionInfo}`);
    }
    const [moduleAddress, moduleName, functionName] = functionInfo.split("::");

    // Serialize and append the function info
    const serializer = new Serializer();
    AccountAddress.fromString(moduleAddress).serialize(serializer);
    serializer.serializeStr(moduleName);
    serializer.serializeStr(functionName);

    // Serialize and append the abstract public key
    const s2 = new Serializer();
    const abstractPublicKey = new DerivableAbstractPublicKey(identity, domain);
    s2.serializeBytes(abstractPublicKey.bcsToBytes());

    // Append the domain separator
    const domainSeparator = new Uint8Array([ADDRESS_DOMAIN_SEPARATOR]);

    const data = hashValues([
      serializer.toUint8Array(),
      s2.toUint8Array(),
      domainSeparator,
    ]);

    return new AuthenticationKey({ data });
  } catch (e) {
    throw `Error computing domain authentication key: ${e}`;
  }
}

/**
 * The derivable abstract public key of the DAA account.
 * 
 * @param identity - The identity of the account. Typically it is the wallet public key or account address
 * @param domain - The dapp domain
 */
export class DerivableAbstractPublicKey extends Serializable {
  constructor(
    public identity: string,
    public domain: string
  ) {
    super();
  }

  serialize(serializer: Serializer): void {
    serializer.serializeStr(this.identity);
    serializer.serializeStr(this.domain);
  }

  static deserialize(deserializer: Deserializer): DerivableAbstractPublicKey {
    const identity = deserializer.deserializeStr();
    const domain = deserializer.deserializeStr();
    return new DerivableAbstractPublicKey(identity, domain);
  }
}
