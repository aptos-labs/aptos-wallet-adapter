import { forwardRef } from "react";
import { SmallAptosLogo } from "../graphics/SmallAptosLogo";
import { HeadlessComponentProps, createHeadlessComponent } from "./utils";

export const APTOS_PRIVACY_POLICY_URL = "https://aptoslabs.com/privacy";

const Root = createHeadlessComponent("AptosPrivacyPolicy.Root", "div");

const Disclaimer = createHeadlessComponent(
  "AptosPrivacyPolicy.Disclaimer",
  "span",
  { children: "By continuing, you agree to Aptos Labs'" }
);

const Link = createHeadlessComponent("AptosPrivacyPolicy.Disclaimer", "a", {
  href: APTOS_PRIVACY_POLICY_URL,
  target: "_blank",
  rel: "noopener noreferrer",
  children: "Privacy Policy",
});

const PoweredBy = forwardRef<
  HTMLDivElement,
  Pick<HeadlessComponentProps, "className">
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
