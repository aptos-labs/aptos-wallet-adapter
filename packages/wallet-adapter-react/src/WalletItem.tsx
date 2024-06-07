import {
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
import { AptosWallet } from "./utils";

export interface WalletItemProps {
  wallet: AptosWallet;
  onConnect?: () => void;
  className?: string;
  asChild?: boolean;
  children?: ReactNode;
}

export interface WalletItemElementProps {
  className?: string;
  asChild?: boolean;
  children?: ReactNode;
}

const WalletItemContext = createContext<{
  wallet: AptosWallet;
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

export const WalletItem = Object.assign(WalletItemRoot, {
  Icon: WalletItemIcon,
  Name: WalletItemName,
  ConnectButton: WalletItemConnectButton,
  InstallLink: WalletItemInstallLink,
});
