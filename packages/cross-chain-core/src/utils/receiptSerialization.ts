import {
  routes,
  AttestationReceipt,
  UniversalAddress,
} from "@wormhole-foundation/sdk";

// Cross-platform base64 helpers (no Node.js Buffer dependency)
function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

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
      // Check UniversalAddress before Uint8Array — if the SDK ever makes
      // UniversalAddress extend Uint8Array the order matters.
      if (value instanceof UniversalAddress) {
        return {
          __type: "UniversalAddress",
          value: uint8ArrayToBase64(value.toUint8Array()),
        };
      }
      if (value instanceof Uint8Array) {
        return {
          __type: "Uint8Array",
          value: uint8ArrayToBase64(value),
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

      // Handle serialized BigInt, Uint8Array, and UniversalAddress
      if ("__type" in objValue) {
        if (objValue.__type === "bigint") {
          return BigInt(objValue.value as string);
        }
        if (objValue.__type === "UniversalAddress") {
          return new UniversalAddress(
            base64ToUint8Array(objValue.value as string),
          );
        }
        if (objValue.__type === "Uint8Array") {
          return base64ToUint8Array(objValue.value as string);
        }
      }

      // Backwards-compatible fallback: reconstruct UniversalAddress for known
      // CCTP message address fields that were serialized without __type markers
      // (i.e. data produced before UniversalAddress-aware serialization).
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
