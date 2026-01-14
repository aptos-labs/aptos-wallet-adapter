import {
  makeUserApproval,
  makeUserRejection,
} from "@aptos-labs/derived-wallet-base";
import { UserResponse } from "@aptos-labs/wallet-standard";

export const defaultAuthenticationFunction =
  "0x1::sui_derivable_account::authenticate";

/**
 * Wrap Sui wallet response into a UserResponse.
 * Each wallet will throw different error types, so we need to check the error message
 * for each validated supported wallet.
 */
export async function wrapSuiUserResponse<TResponse>(
  promise: Promise<TResponse>,
): Promise<UserResponse<TResponse>> {
  try {
    const response = await promise;
    return makeUserApproval(response);
  } catch (err) {
    // Sui does not have a standard error code for rejection, so we need to check the error message
    // for each validated supported wallet.
    if (typeof err === "object" && err !== null) {
      // Support OKX wallet
      if ((err as any).code === 4001) {
        return makeUserRejection();
      }
      // Slush throwing TRPCClientError instance (extends Error)
      // Backback throwing Error instance
      if (
        "message" in err &&
        typeof (err as any).message === "string" &&
        ((err as any).message.toLowerCase().includes("rejected") ||
          (err as any).message.toLowerCase().includes("denied"))
      ) {
        return makeUserRejection();
      }
    }
    throw err;
  }
}
