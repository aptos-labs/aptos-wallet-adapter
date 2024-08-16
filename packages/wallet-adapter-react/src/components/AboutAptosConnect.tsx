import {
  Dispatch,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  SVGProps,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { LinkGraphic } from "../graphics/LinkGraphic";
import { WalletGraphic } from "../graphics/WalletGraphic";
import { Web3Graphic } from "../graphics/Web3Graphic";
import { HeadlessComponentProps, createHeadlessComponent } from "./utils";

export const EXPLORE_ECOSYSTEM_URL =
  "https://aptosfoundation.org/ecosystem/projects/all";

const AboutAptosConnectContext = createContext<{
  screenIndex: number;
  setScreenIndex: Dispatch<SetStateAction<number>>;
} | null>(null);

function useAboutAptosConnectContext(displayName: string) {
  const context = useContext(AboutAptosConnectContext);

  if (!context) {
    throw new Error(
      `\`${displayName}\` must be used within \`AboutAptosConnect\``
    );
  }

  return context;
}

const educationScreens = [
  {
    Graphic: LinkGraphic,
    Title: createHeadlessComponent("EducationScreen.Title", "h3", {
      children: "A better way to login.",
    }),
    Description: createHeadlessComponent("EducationScreen.Description", "p", {
      children:
        "Aptos Connect is a web3 wallet that uses a Social Login to create accounts on the Aptos blockchain.",
    }),
  },
  {
    Graphic: WalletGraphic,
    Title: createHeadlessComponent("EducationScreen.Title", "h2", {
      children: "What is a wallet?",
    }),
    Description: createHeadlessComponent("EducationScreen.Description", "p", {
      children:
        "Wallets are a secure way to send, receive, and interact with digital assets like cryptocurrencies & NFTs.",
    }),
  },
  {
    Graphic: Web3Graphic,
    Title: createHeadlessComponent("EducationScreen.Title", "h2", {
      children: "Explore more of web3.",
    }),
    Description: createHeadlessComponent("EducationScreen.Description", "p", {
      children: (
        <>
          Aptos Connect lets you take one account across any application built
          on Aptos.{" "}
          <a
            href={EXPLORE_ECOSYSTEM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore the ecosystem
          </a>
          .
        </>
      ),
    }),
  },
];

const educationScreenIndicators = Array(educationScreens.length)
  .fill(null)
  .map((_, index) =>
    createHeadlessComponent(
      "AboutAptosConnect.ScreenIndicator",
      "button",
      (displayName) => {
        const context = useAboutAptosConnectContext(displayName);
        const isActive = context.screenIndex - 1 === index;

        return {
          "aria-label": `Go to screen ${index + 1}`,
          "aria-current": isActive ? "step" : undefined,
          "data-active": isActive || undefined,
          onClick: () => {
            context.setScreenIndex(index + 1);
          },
        };
      }
    )
  );

export interface AboutAptosConnectEducationScreen {
  /** A component that renders an SVG to illustrate the idea of the current screen. */
  Graphic: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, "ref"> & RefAttributes<SVGSVGElement>
  >;
  /** A headless component that renders the title of the current screen. */
  Title: ForwardRefExoticComponent<
    HeadlessComponentProps & RefAttributes<HTMLHeadingElement>
  >;
  /** A headless component that renders the description text of the current screen. */
  Description: ForwardRefExoticComponent<
    HeadlessComponentProps & RefAttributes<HTMLParagraphElement>
  >;
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
  renderEducationScreen: (
    screen: AboutAptosConnectEducationScreen
  ) => ReactNode;
  /**
   * The initial wallet selection UI that will be replaced by the education
   * screens when `AboutAptosConnect.Trigger` is clicked.
   */
  children?: ReactNode;
}

const Root = ({ renderEducationScreen, children }: AboutAptosConnectProps) => {
  const [screenIndex, setScreenIndex] = useState(0);

  const currentEducationScreen: AboutAptosConnectEducationScreen = useMemo(
    () =>
      educationScreens.map((screen, i) => ({
        ...screen,
        screenIndex: i,
        totalScreens: educationScreens.length,
        screenIndicators: educationScreenIndicators,
        back: () => {
          setScreenIndex(screenIndex - 1);
        },
        next: () => {
          setScreenIndex(
            screenIndex === educationScreens.length ? 0 : screenIndex + 1
          );
        },
        cancel: () => {
          setScreenIndex(0);
        },
      }))[screenIndex - 1],
    [screenIndex]
  );

  return (
    <AboutAptosConnectContext.Provider value={{ screenIndex, setScreenIndex }}>
      {screenIndex === 0
        ? children
        : renderEducationScreen(currentEducationScreen)}
    </AboutAptosConnectContext.Provider>
  );
};
Root.displayName = "AboutAptosConnect";

const Trigger = createHeadlessComponent(
  "AboutAptosConnect.Trigger",
  "button",
  (displayName) => {
    const context = useAboutAptosConnectContext(displayName);

    return {
      onClick: () => {
        context.setScreenIndex(1);
      },
    };
  }
);

/**
 * A headless component for rendering education screens that explain the basics
 * of Aptos Connect and web3 wallets.
 */
export const AboutAptosConnect = Object.assign(Root, {
  Trigger,
});
