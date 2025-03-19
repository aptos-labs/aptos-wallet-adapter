import {
  UserApproval,
  UserRejection,
  UserResponse,
  UserResponseStatus,
} from '@aptos-labs/wallet-standard';

export function makeUserApproval<T>(args: T): UserApproval<T> {
  return {
    status: UserResponseStatus.APPROVED,
    args,
  };
}

export function makeUserRejection(): UserRejection {
  return { status: UserResponseStatus.REJECTED };
}

export type MaybeAsync<T> = T | Promise<T>;

export function mapUserResponse<Src, Dst>(response: UserResponse<Src>, mapFn: (src: Src) => Dst): UserResponse<Dst>
export function mapUserResponse<Src, Dst>(response: UserResponse<Src>, mapFn: (src: Src) => Promise<Dst>): Promise<UserResponse<Dst>>
export function mapUserResponse<Src, Dst>(response: UserResponse<Src>, mapFn: (src: Src) => MaybeAsync<Dst>): MaybeAsync<UserResponse<Dst>> {
  if (response.status === UserResponseStatus.REJECTED) {
    return makeUserRejection();
  }
  const mappedResponse = mapFn(response.args);
  return mappedResponse instanceof Promise
    ? mappedResponse.then((args) => makeUserApproval(args))
    : makeUserApproval(mappedResponse);
}
