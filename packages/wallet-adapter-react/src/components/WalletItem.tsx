import {
  AnyAptosWallet,
  WalletReadyState,
  isRedirectable,
} from "@aptos-labs/wallet-adapter-core";
import { Slot } from "@radix-ui/react-slot";
import { createContext, forwardRef, useCallback, useContext } from "react";
import { useWallet } from "../useWallet";
import { HeadlessComponentProps, createHeadlessComponent } from "./utils";

export interface WalletItemProps extends HeadlessComponentProps {
  /** The wallet option to be displayed. */
  wallet: AnyAptosWallet;
  /** A callback to be invoked when the wallet is connected. */
  onConnect?: () => void;
}

function useWalletItemContext(displayName: string) {
  const context = useContext(WalletItemContext);

  if (!context) {
    throw new Error(`\`${displayName}\` must be used within \`WalletItem\``);
  }

  return context;
}

const WalletItemContext = createContext<{
  wallet: AnyAptosWallet;
  connectWallet: () => void;
} | null>(null);

const Root = forwardRef<HTMLDivElement, WalletItemProps>(
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
Root.displayName = "WalletItem";

const Icon = createHeadlessComponent(
  "WalletItem.Icon",
  "img",
  (displayName) => {
    const context = useWalletItemContext(displayName);

    return {
      src: context.wallet.icon,
      alt: `${context.wallet.name} icon`,
    };
  }
);

const Name = createHeadlessComponent(
  "WalletItem.Name",
  "div",
  (displayName) => {
    const context = useWalletItemContext(displayName);

    return {
      children: context.wallet.name,
    };
  }
);

const ConnectButton = createHeadlessComponent(
  "WalletItem.ConnectButton",
  "button",
  (displayName) => {
    const context = useWalletItemContext(displayName);

    return {
      onClick: context.connectWallet,
      children: "Connect",
    };
  }
);

const InstallLink = createHeadlessComponent(
  "WalletItem.InstallLink",
  "a",
  (displayName) => {
    const context = useWalletItemContext(displayName);

    return {
      href: context.wallet.url,
      target: "_blank",
      rel: "noopener noreferrer",
      children: "Install",
    };
  }
);

/** A headless component for rendering a wallet option's name, icon, and either connect button or install link. */
export const WalletItem = Object.assign(Root, {
  Icon,
  Name,
  ConnectButton,
  InstallLink,
});
