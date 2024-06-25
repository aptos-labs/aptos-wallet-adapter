import { Slot } from "@radix-ui/react-slot";
import { ReactNode, forwardRef } from "react";
import { SmallAptosLogo } from "../graphics/SmallAptosLogo";

export const APTOS_PRIVACY_POLICY_URL = "https://aptoslabs.com/privacy";

export interface AptosPrivacyPolicyProps {
  /** A class name for styling the element. */
  className?: string;
  /**
   * Whether to render as the child element instead of the default element provided.
   * All props will be merged into the child element.
   */
  asChild?: boolean;
  children?: ReactNode;
}

const Root = forwardRef<HTMLDivElement, AptosPrivacyPolicyProps>(
  ({ className, asChild, children }, ref) => {
    const Component = asChild ? Slot : "div";

    return (
      <Component ref={ref} className={className}>
        {children}
      </Component>
    );
  }
);
Root.displayName = "AptosPrivacyPolicy.Root";

const Disclaimer = forwardRef<HTMLSpanElement, AptosPrivacyPolicyProps>(
  ({ className, asChild, children }, ref) => {
    const Component = asChild ? Slot : "span";

    return (
      <Component ref={ref} className={className}>
        {children ?? "By continuing, you agree to Aptos Labs'"}
      </Component>
    );
  }
);
Disclaimer.displayName = "AptosPrivacyPolicy.Disclaimer";

const Link = forwardRef<HTMLAnchorElement, AptosPrivacyPolicyProps>(
  ({ className, asChild, children }, ref) => {
    const Component = asChild ? Slot : "a";

    return (
      <Component
        ref={ref}
        className={className}
        href={APTOS_PRIVACY_POLICY_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children ?? "Privacy Policy"}
      </Component>
    );
  }
);
Link.displayName = "AptosPrivacyPolicy.Link";

const PoweredBy = forwardRef<
  HTMLDivElement,
  Pick<AptosPrivacyPolicyProps, "className">
>(({ className }, ref) => {
  return (
    <div ref={ref} className={className}>
      <span>Powered by</span>
      <SmallAptosLogo />
      <span>Aptos Labs</span>
    </div>
  );
});
PoweredBy.displayName = "AptosPrivacyPolicy.PoweredBy";

/**
 * A headless component for rendering the Aptos Labs privacy policy disclaimer
 * that should be placed under the Aptos Connect login options.
 */
export const AptosPrivacyPolicy = Object.assign(Root, {
  Disclaimer,
  Link,
  PoweredBy,
});
