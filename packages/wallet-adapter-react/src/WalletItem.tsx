import {
  AnyAptosWallet,
  WalletReadyState,
  isRedirectable,
} from "@aptos-labs/wallet-adapter-core";
import { Slot } from "@radix-ui/react-slot";
import {
  ReactNode,
  createContext,
  forwardRef,
  useCallback,
  useContext,
} from "react";
import { useWallet } from "./useWallet";

export interface WalletItemProps {
  /** The wallet option to be displayed. */
  wallet: AnyAptosWallet;
  /** A callback to be invoked when the wallet is connected. */
  onConnect?: () => void;
  /** A class name for styling the wrapper element. */
  className?: string;
  /**
   * Whether to render as the child element instead of the default `div` provided.
   * All props will be merged into the child element.
   */
  asChild?: boolean;
  children?: ReactNode;
}

export interface WalletItemElementProps {
  /** A class name for styling the element. */
  className?: string;
  /**
   * Whether to render as the child element instead of the default element provided.
   * All props will be merged into the child element.
   */
  asChild?: boolean;
  children?: ReactNode;
}

const WalletItemContext = createContext<{
  wallet: AnyAptosWallet;
  connectWallet: () => void;
} | null>(null);

const WalletItemRoot = forwardRef<HTMLDivElement, WalletItemProps>(
  ({ wallet, onConnect, className, asChild, children }, ref) => {
    const { connect } = useWallet();

    const connectWallet = useCallback(() => {
      connect(wallet.name);
      onConnect?.();
    }, [connect, wallet.name, onConnect]);

    const isWalletReady =
      wallet.readyState === WalletReadyState.Installed ||
      wallet.readyState === WalletReadyState.Loadable;

    const mobileSupport =
      "deeplinkProvider" in wallet && wallet.deeplinkProvider;

    if (!isWalletReady && isRedirectable() && !mobileSupport) return null;

    const Component = asChild ? Slot : "div";

    return (
      <WalletItemContext.Provider value={{ wallet, connectWallet }}>
        <Component ref={ref} className={className}>
          {children}
        </Component>
      </WalletItemContext.Provider>
    );
  }
);
WalletItemRoot.displayName = "WalletItem";

const WalletItemIcon = forwardRef<HTMLImageElement, WalletItemElementProps>(
  ({ className, asChild, children }, ref) => {
    const context = useContext(WalletItemContext);

    if (!context) {
      throw new Error("`WalletItem.Icon` must be used within `WalletItem`");
    }

    const Component = asChild ? Slot : "img";

    return (
      <Component
        ref={ref}
        src={context.wallet.icon}
        alt={`${context.wallet.name} icon`}
        className={className}
      >
        {children}
      </Component>
    );
  }
);
WalletItemIcon.displayName = "WalletItem.Icon";

const WalletItemName = forwardRef<HTMLDivElement, WalletItemElementProps>(
  ({ className, asChild, children }, ref) => {
    const context = useContext(WalletItemContext);

    if (!context) {
      throw new Error("`WalletItem.Name` must be used within `WalletItem`");
    }

    const Component = asChild ? Slot : "div";

    return (
      <Component ref={ref} className={className}>
        {children ?? context.wallet.name}
      </Component>
    );
  }
);
WalletItemName.displayName = "WalletItem.Name";

const WalletItemConnectButton = forwardRef<
  HTMLButtonElement,
  WalletItemElementProps
>(({ className, asChild, children }, ref) => {
  const context = useContext(WalletItemContext);

  if (!context) {
    throw new Error(
      "`WalletItem.ConnectButton` must be used within `WalletItem`"
    );
  }

  const Component = asChild ? Slot : "button";

  return (
    <Component ref={ref} className={className} onClick={context.connectWallet}>
      {children ?? "Connect"}
    </Component>
  );
});
WalletItemConnectButton.displayName = "WalletItem.ConnectButton";

const WalletItemInstallLink = forwardRef<
  HTMLAnchorElement,
  WalletItemElementProps
>(({ className, asChild, children }, ref) => {
  const context = useContext(WalletItemContext);

  if (!context) {
    throw new Error(
      "`WalletItem.InstallLink` must be used within `WalletItem`"
    );
  }

  const Component = asChild ? Slot : "a";

  return (
    <Component
      ref={ref}
      className={className}
      href={context.wallet.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children ?? "Install"}
    </Component>
  );
});
WalletItemInstallLink.displayName = "WalletItem.InstallLink";

/** A headless component for rendering a wallet option's name, icon, and either connect button or install link. */
export const WalletItem = Object.assign(WalletItemRoot, {
  Icon: WalletItemIcon,
  Name: WalletItemName,
  ConnectButton: WalletItemConnectButton,
  InstallLink: WalletItemInstallLink,
});
