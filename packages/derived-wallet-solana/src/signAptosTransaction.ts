import { createSignInMessage } from '@solana/wallet-standard-util';
import { mapUserResponse, DerivableAbstractPublicKey } from '@aptos-labs/derived-wallet-base';
import {
  AccountAuthenticator,
  AccountAuthenticatorAbstraction,
  AnyRawTransaction,
  Ed25519Signature,
  generateSigningMessageForTransaction,
  hashValues,
  Serializer,
} from '@aptos-labs/ts-sdk';
import { PublicKey as SolanaPublicKey } from '@solana/web3.js';
import { StandardWalletAdapter as SolanaWalletAdapter } from "@solana/wallet-standard-wallet-adapter-base";
import { createSiwsEnvelopeForAptosTransaction } from './createSiwsEnvelope';
import { wrapSolanaUserResponse } from './shared';

/**
 * A first byte of the signature that indicates the "message type", this is defined in the
 * authentication function on chain, and lets us identify the type of the message and to make
 * changes in the future if needed.
 */
export const SIGNATURE_TYPE = 0;
export interface SignAptosTransactionWithSolanaInput {
  solanaWallet: SolanaWalletAdapter;
  authenticationFunction: string;
  rawTransaction: AnyRawTransaction;
  domain: string;
}

export async function signAptosTransactionWithSolana(input: SignAptosTransactionWithSolanaInput) {
  const { solanaWallet, authenticationFunction, rawTransaction, domain } = input;

  const solanaPublicKey = solanaWallet.publicKey;
  if (!solanaPublicKey) {
    throw new Error('Account not connected');
  }

  const signingMessage = generateSigningMessageForTransaction(rawTransaction);
  const signingMessageDigest = hashValues([signingMessage]);

  const siwsInput = createSiwsEnvelopeForAptosTransaction({
    solanaPublicKey,
    rawTransaction,
    signingMessageDigest,
    domain
  });

  // Prioritize SIWS if available
  if(solanaWallet.signIn){

    const response = await wrapSolanaUserResponse(solanaWallet.signIn!(siwsInput));
    return mapUserResponse(response, (output): AccountAuthenticator => {
      if (output.signatureType && output.signatureType !== 'ed25519') {
        throw new Error('Unsupported signature type');
      }
  
      // The wallet might change some of the fields in the SIWS input, so we
      // might need to include the finalized input in the signature.
      // For now, we can assume the input is unchanged.
      const signature = new Ed25519Signature(output.signature);
  
      return createAccountAuthenticatorForSolanaTransaction(signature, solanaPublicKey, domain, authenticationFunction, signingMessageDigest);
    });
  }else if(solanaWallet.signMessage){
    // Fallback to signMessage if SIWS is not available
    const response = await wrapSolanaUserResponse(solanaWallet.signMessage(createSignInMessage(siwsInput)));
    return mapUserResponse(response, (output): AccountAuthenticator => {
      
      // Solana signMessage standard always returns a Ed25519 signature type
      const signature = new Ed25519Signature(output);

      return createAccountAuthenticatorForSolanaTransaction(signature, solanaPublicKey, domain, authenticationFunction, signingMessageDigest);
    });
  }else{
    throw new Error(`${solanaWallet.name} does not support SIWS or signMessage`);
  }
}

// A helper function to create an AccountAuthenticator from a Solana signature
function createAccountAuthenticatorForSolanaTransaction(
  signature: Ed25519Signature, 
  solanaPublicKey: SolanaPublicKey, 
  domain: string, 
  authenticationFunction: string, 
  signingMessageDigest: Uint8Array
) : AccountAuthenticator {
  // Serialize the signature with the signature type as the first byte.
  const serializer = new Serializer();
  serializer.serializeU8(SIGNATURE_TYPE);
  serializer.serializeBytes(signature.toUint8Array());
  const abstractSignature = serializer.toUint8Array();

  // Serialize the abstract public key.
  const abstractPublicKey = new DerivableAbstractPublicKey(solanaPublicKey.toBase58(), domain);

  return new AccountAuthenticatorAbstraction(
    authenticationFunction,
    signingMessageDigest,
    abstractSignature,
    abstractPublicKey.bcsToBytes()
  );
}
