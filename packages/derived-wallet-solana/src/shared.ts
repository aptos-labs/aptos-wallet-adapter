import { makeUserApproval, makeUserRejection } from '@aptos-labs/derived-wallet-base';
import { UserResponse } from '@aptos-labs/wallet-standard';
import { WalletError } from '@solana/wallet-adapter-base';

export const defaultAuthenticationFunction = '0x1::solana_derivable_account::authenticate';

/**
 * Adapt SolanaWalletAdapter response into a UserResponse.
 * `WalletError` will be converted into a rejection.
 */
export async function wrapSolanaUserResponse<TResponse>(promise: Promise<TResponse>): Promise<UserResponse<TResponse>> {
  try {
    const response = await promise;
    return makeUserApproval(response);
  } catch (err) {
    if (err instanceof WalletError && err.message === 'User rejected the request.') {
      return makeUserRejection();
    }
    throw err;
  }
}
