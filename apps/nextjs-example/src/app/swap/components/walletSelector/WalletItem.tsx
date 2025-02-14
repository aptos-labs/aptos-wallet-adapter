"use client";

import { AdapterWallet } from "@aptos-labs/wallet-adapter-aggregator-core";
import { useCrossChainWallet } from "@aptos-labs/cross-chain-react";
import { Slot } from "@radix-ui/react-slot";
import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  ReactNode,
  useCallback,
  useContext,
} from "react";
import { useToast } from "@/components/ui/use-toast";

export interface WalletItemProps extends HeadlessComponentProps {
  /** The wallet option to be displayed. */
  wallet: AdapterWallet;
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
  wallet: AdapterWallet;
  connectWallet: () => void;
} | null>(null);

const Root = forwardRef<HTMLDivElement, WalletItemProps>(
  ({ wallet, onConnect, className, asChild, children }, ref) => {
    const { connect } = useCrossChainWallet();
    const { toast } = useToast();
    const connectWallet = useCallback(async () => {
      await connect(wallet);
      onConnect?.();
    }, [wallet, onConnect]);

    // const isWalletReady =
    //   wallet.readyState === WalletReadyState.Installed ||
    //   wallet.readyState === WalletReadyState.Loadable;

    // const mobileSupport =
    //   "deeplinkProvider" in wallet && wallet.deeplinkProvider;

    // if (!isWalletReady && isRedirectable() && !mobileSupport) return null;

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

export interface HeadlessComponentProps {
  /** A class name for styling the element. */
  className?: string;
  /**
   * Whether to render as the child element instead of the default element provided.
   * All props will be merged into the child element.
   */
  asChild?: boolean;
  children?: ReactNode;
}

/**
 * Gets an HTML element type from its tag name
 * @example
 * HTMLElementFromTag<"img"> // resolved type: HTMLImageElement
 */
type HTMLElementFromTag<T extends keyof JSX.IntrinsicElements> =
  JSX.IntrinsicElements[T] extends React.ClassAttributes<infer Element>
    ? Element
    : HTMLElement;

export function createHeadlessComponent<
  TElement extends keyof JSX.IntrinsicElements,
>(
  displayName: string,
  elementType: TElement,
  props?:
    | JSX.IntrinsicElements[TElement]
    | ((displayName: string) => JSX.IntrinsicElements[TElement])
) {
  const component = forwardRef<
    HTMLElementFromTag<TElement>,
    HeadlessComponentProps
  >(({ className, asChild, children }, ref) => {
    const Component = asChild ? Slot : elementType;

    const { children: defaultChildren, ...resolvedProps } =
      typeof props === "function" ? props(displayName) : (props ?? {});
    const resolvedChildren =
      /**
       * Use props' default children if no children are set in the component element's children and when asChild is true.
       */
      asChild && isValidElement(children) && !children.props.children
        ? cloneElement(children, {}, defaultChildren)
        : (children ?? defaultChildren);

    return (
      /**
       * Due to the complexity of the types at play, TypeScript reports the
       * following error for our JSX below:
       *
       * `Expression produces a union type that is too complex to represent.`
       *
       * We can safely ignore this error and retain accurate return types for
       * consumers of this function. The only drawback is that type-checking is
       * ignored for the JSX block below.
       */
      // @ts-expect-error
      <Component ref={ref} className={className} {...resolvedProps}>
        {resolvedChildren}
      </Component>
    );
  });
  component.displayName = displayName;

  return component;
}
