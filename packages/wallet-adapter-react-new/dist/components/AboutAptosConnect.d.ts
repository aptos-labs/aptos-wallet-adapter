import { ForwardRefExoticComponent, ReactNode, RefAttributes, SVGProps } from "react";
import { HeadlessComponentProps } from "./utils";
export declare const EXPLORE_ECOSYSTEM_URL = "https://aptosfoundation.org/ecosystem/projects/all";
declare const educationScreenIndicators: ForwardRefExoticComponent<HeadlessComponentProps & RefAttributes<HTMLButtonElement>>[];
export interface AboutAptosConnectEducationScreen {
    /** A component that renders an SVG to illustrate the idea of the current screen. */
    Graphic: ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & RefAttributes<SVGSVGElement>>;
    /** A headless component that renders the title of the current screen. */
    Title: ForwardRefExoticComponent<HeadlessComponentProps & RefAttributes<HTMLHeadingElement>>;
    /** A headless component that renders the description text of the current screen. */
    Description: ForwardRefExoticComponent<HeadlessComponentProps & RefAttributes<HTMLParagraphElement>>;
    /** The index of the current education screen. */
    screenIndex: number;
    /** The total number of education screens. */
    totalScreens: number;
    /**
     * An array of headless components for indicating the current screen of the set.
     * Each indicator will navigate the user to the screen it represents when clicked.
     */
    screenIndicators: typeof educationScreenIndicators;
    /**
     * A function that navigates the user to the previous education screen.
     * If the user is on the first education screen, they will be navigated to the
     * initial wallet selection screen.
     */
    back: () => void;
    /**
     * A function that navigates the user to the next education screen.
     * If the user is on the last education screen, they will be navigated to the
     * initial wallet selection screen.
     */
    next: () => void;
    /** A function that navigates the user to the initial wallet selection screen. */
    cancel: () => void;
}
export interface AboutAptosConnectProps {
    /**
     * A function for defining how each education screen should be rendered.
     * Each screen is modeled as a uniform set of headless components and utilities
     * that allow you to construct your UI and apply your own styles.
     */
    renderEducationScreen: (screen: AboutAptosConnectEducationScreen) => ReactNode;
    /**
     * The initial wallet selection UI that will be replaced by the education
     * screens when `AboutAptosConnect.Trigger` is clicked.
     */
    children?: ReactNode;
}
/**
 * A headless component for rendering education screens that explain the basics
 * of Aptos Connect and web3 wallets.
 */
export declare const AboutAptosConnect: {
    ({ renderEducationScreen, children }: AboutAptosConnectProps): import("react/jsx-runtime").JSX.Element;
    displayName: string;
} & {
    Trigger: ForwardRefExoticComponent<HeadlessComponentProps & RefAttributes<HTMLButtonElement>>;
};
export {};
//# sourceMappingURL=AboutAptosConnect.d.ts.map