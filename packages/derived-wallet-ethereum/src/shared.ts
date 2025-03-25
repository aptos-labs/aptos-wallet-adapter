import { makeUserApproval, makeUserRejection } from '@aptos-labs/derived-wallet-base';
import { UserResponse } from '@aptos-labs/wallet-standard';
import { isError as isEthersError } from 'ethers';

export type EthereumAddress = `0x${string}`;

/**
 * Adapt EIP1193 response into a UserResponse.
 * `UserRejectedRequestError` will be converted into a rejection.
 */
export async function wrapEthersUserResponse<TResponse>(promise: Promise<TResponse>): Promise<UserResponse<TResponse>> {
  try {
    const response = await promise;
    return makeUserApproval(response);
  } catch (err) {
    if (isEthersError(err, 'ACTION_REJECTED')) {
      return makeUserRejection();
    }
    throw err;
  }
}
