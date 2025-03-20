import { AccountAddressInput } from '@aptos-labs/ts-sdk';

export const structuredMessagePrefix = 'APTOS' as const;

export interface StructuredMessageInput {
  message: string;
  nonce: string;
  application?: boolean;
  chainId?: number | boolean;
  address?: AccountAddressInput | boolean;
}

export interface StructuredMessage {
  message: string;
  nonce: string;
  application?: string;
  chainId?: number;
  address?: string;
}

export function encodeStructuredMessage(structuredMessage: StructuredMessage): Uint8Array {
  const { address, application, chainId, message, nonce } = structuredMessage;

  const optionalParts: string[] = [];
  if (address !== undefined) {
    optionalParts.push(`address: ${address}`);
  }
  if (application !== undefined) {
    optionalParts.push(`application: ${application}`);
  }
  if (chainId !== undefined) {
    optionalParts.push(`chainId: ${chainId}`);
  }

  const parts = [
    structuredMessagePrefix,
    ...optionalParts,
    `message: ${message}`,
    `nonce: ${nonce}`,
  ];

  const input = parts.join('\n');
  return new TextEncoder().encode(input);
}

function parsePart(part: string, name: string) {
  const partPrefix = `${name}: `;
  return part.startsWith(partPrefix) ? part.slice(partPrefix.length) : undefined;
}

export function decodeStructuredMessage(encoded: Uint8Array): StructuredMessage {
  const utf8Decoded = new TextDecoder().decode(encoded);
  const [prefix, ...parts] = utf8Decoded.split('\n');
  if (prefix !== structuredMessagePrefix) {
    throw new Error('Invalid message prefix');
  }

  let i = 0;

  const address = parsePart(parts[i], 'address');
  if (address !== undefined) {
    i += 1;
  }

  const application = parsePart(parts[i], 'application');
  if (application !== undefined) {
    i += 1;
  }

  const chainIdStr = parsePart(parts[i], 'chainId');
  if (chainIdStr !== undefined) {
    i += 1;
  }

  const nonce = parsePart(parts[parts.length - 1], 'nonce');
  if (!nonce) {
    throw new Error('Expected nonce');
  }

  const messageParts = parts.slice(i, parts.length - 1).join('\n');
  const message = parsePart(messageParts, 'message');
  if (!message) {
    throw new Error('Expected message');
  }

  return {
    address,
    application,
    chainId: chainIdStr ? Number(chainIdStr) : undefined,
    message,
    nonce,
  };
}
