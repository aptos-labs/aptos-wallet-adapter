/// <reference types="react" />
import { AdapterNotDetectedWallet, AdapterWallet } from "@aptos-labs/wallet-adapter-core-new";
import { HeadlessComponentProps } from "./utils";
export interface WalletItemProps extends HeadlessComponentProps {
    /** The wallet option to be displayed. */
    wallet: AdapterWallet | AdapterNotDetectedWallet;
    /** A callback to be invoked when the wallet is connected. */
    onConnect?: () => void;
}
/** A headless component for rendering a wallet option's name, icon, and either connect button or install link. */
export declare const WalletItem: import("react").ForwardRefExoticComponent<WalletItemProps & import("react").RefAttributes<HTMLDivElement>> & {
    Icon: import("react").ForwardRefExoticComponent<HeadlessComponentProps & import("react").RefAttributes<HTMLImageElement>>;
    Name: import("react").ForwardRefExoticComponent<HeadlessComponentProps & import("react").RefAttributes<HTMLDivElement>>;
    ConnectButton: import("react").ForwardRefExoticComponent<HeadlessComponentProps & import("react").RefAttributes<HTMLButtonElement>>;
    InstallLink: import("react").ForwardRefExoticComponent<HeadlessComponentProps & import("react").RefAttributes<HTMLAnchorElement>>;
};
//# sourceMappingURL=WalletItem.d.ts.map