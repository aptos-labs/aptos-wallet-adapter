import {
  EntryFunctionArgumentTypes,
  Serializable,
  SimpleEntryFunctionArgumentTypes,
} from "@aptos-labs/ts-sdk";

export function isMobile(): boolean {
  return /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i.test(
    navigator.userAgent
  );
}

export function isInAppBrowser(): boolean {
  const isIphone = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
    navigator.userAgent
  );

  const isAndroid = /(Android).*Version\/[\d.]+.*Chrome\/[^\s]+ Mobile/i.test(
    navigator.userAgent
  );

  return isIphone || isAndroid;
}

export function isRedirectable(): boolean {
  // SSR: return false
  if (typeof navigator === "undefined" || !navigator) return false;

  // if we are on mobile and NOT in a in-app browser we will redirect to a wallet app

  return isMobile() && !isInAppBrowser();
}

export function generalizedErrorMessage(error: any): string {
  return typeof error === "object" && "message" in error
    ? error.message
    : error;
}

// Helper function to check if input arguments are BCS serialized arguments.
// In @aptos-labs/ts-sdk each move representative class extends
// Serializable, so if each argument is of an instance of a class
// the extends Serializable - we know these are BCS arguments
export const areBCSArguments = (
  args: Array<EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes>
): boolean => {
  // `every` returns true if the array is empty, so
  // first check the array length
  if (args.length === 0) return false;
  return args.every(
    (arg: EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes) =>
      arg instanceof Serializable
  );
};
