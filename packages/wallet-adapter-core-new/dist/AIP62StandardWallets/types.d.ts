import { WalletName } from "../LegacyWalletPlugins/types";
import { WalletReadyState } from "../constants";
export interface AptosStandardSupportedWallet<Name extends string = string> {
    name: WalletName<Name>;
    url: string;
    icon: `data:image/${"svg+xml" | "webp" | "png" | "gif"};base64,${string}`;
    readyState: WalletReadyState.NotDetected;
}
export type AvailableWallets = "Nightly" | "Petra" | "T wallet" | "Pontem Wallet" | "Mizu Wallet" | "Continue with Google";
//# sourceMappingURL=types.d.ts.map