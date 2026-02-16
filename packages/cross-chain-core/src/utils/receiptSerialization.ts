import {
  routes,
  AttestationReceipt,
  UniversalAddress,
} from "@wormhole-foundation/sdk";

/**
 * Serializes a Wormhole receipt for JSON transport.
 *
 * JSON doesn't natively support BigInt, Uint8Array, or class instances.
 * This function converts these types to a serializable format with type markers
 * that can be reconstructed by `deserializeReceipt`.
 *
 * @example
 * ```typescript
 * import { serializeReceipt } from "@aptos-labs/cross-chain-core";
 *
 * // On the client side, before sending to server
 * const serialized = serializeReceipt(receipt);
 * await fetch("/api/claim", {
 *   method: "POST",
 *   body: JSON.stringify({ receipt: serialized }),
 * });
 * ```
 */
export function serializeReceipt(
  receipt: routes.Receipt<AttestationReceipt>,
): unknown {
  return JSON.parse(
    JSON.stringify(receipt, (_key, value) => {
      if (typeof value === "bigint") {
        return { __type: "bigint", value: value.toString() };
      }
      if (value instanceof Uint8Array) {
        return {
          __type: "Uint8Array",
          value: Buffer.from(value).toString("base64"),
        };
      }
      return value;
    }),
  );
}

/**
 * Deserializes a Wormhole receipt from JSON transport format.
 *
 * Reconstructs BigInt, Uint8Array, and UniversalAddress instances from
 * the serialized format produced by `serializeReceipt`.
 *
 * @example
 * ```typescript
 * import { deserializeReceipt, SolanaLocalSigner } from "@aptos-labs/cross-chain-core";
 *
 * // On the server side, after receiving from client
 * const receipt = deserializeReceipt(body.receipt);
 * await cctpRoute.complete(signer, receipt);
 * ```
 */
export function deserializeReceipt(
  obj: unknown,
): routes.Receipt<AttestationReceipt> {
  function revive(value: unknown, key?: string): unknown {
    if (value && typeof value === "object") {
      const objValue = value as Record<string, unknown>;

      // Handle serialized BigInt and Uint8Array
      if ("__type" in objValue) {
        if (objValue.__type === "bigint") {
          return BigInt(objValue.value as string);
        }
        if (objValue.__type === "Uint8Array") {
          return new Uint8Array(
            Buffer.from(objValue.value as string, "base64"),
          );
        }
      }

      // Reconstruct UniversalAddress objects for CCTP message address fields
      const addressFields = [
        "sender",
        "recipient",
        "destinationCaller",
        "burnToken",
        "mintRecipient",
        "messageSender",
      ];
      if (key && addressFields.includes(key) && "address" in objValue) {
        const addressBytes = revive(objValue.address);
        if (addressBytes instanceof Uint8Array) {
          return new UniversalAddress(addressBytes);
        }
      }

      // Recursively process nested objects and arrays
      if (Array.isArray(value)) {
        return value.map((v, i) => revive(v, String(i)));
      }
      const result: Record<string, unknown> = {};
      for (const k in objValue) {
        result[k] = revive(objValue[k], k);
      }
      return result;
    }
    return value;
  }

  return revive(obj) as routes.Receipt<AttestationReceipt>;
}

