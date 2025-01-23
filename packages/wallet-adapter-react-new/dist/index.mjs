// src/index.tsx
export * from "@aptos-labs/wallet-adapter-core-new";

// src/WalletProviderNew.tsx
import {
  WalletCoreNew
} from "@aptos-labs/wallet-adapter-core-new";
import { useState, useEffect, useCallback } from "react";

// src/useWalletNew.tsx
import { useContext } from "react";
import { createContext } from "react";
var DEFAULT_CONTEXT = {
  connected: false
};
var WalletContextNew = createContext(
  DEFAULT_CONTEXT
);
function useWalletNew() {
  const context = useContext(WalletContextNew);
  if (!context) {
    throw new Error("useWallet must be used within a WalletContextState");
  }
  return context;
}

// src/WalletProviderNew.tsx
import { jsx } from "react/jsx-runtime";
var initialState = {
  connected: false,
  account: null,
  network: null,
  wallet: null
};
var AptosWalletAdapterProviderNew = ({
  children,
  optInWallets,
  autoConnect = false,
  dappConfig,
  disableTelemetry = false,
  onError
}) => {
  const [{ account, network, connected, wallet }, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [walletCore, setWalletCore] = useState();
  const [wallets, setWallets] = useState([]);
  const [notDetectedWallets, setNotDetectedWallets] = useState([]);
  useEffect(() => {
    const walletCore2 = new WalletCoreNew(
      optInWallets,
      dappConfig,
      disableTelemetry
    );
    setWalletCore(walletCore2);
  }, []);
  useEffect(() => {
    var _a, _b;
    setWallets((_a = walletCore == null ? void 0 : walletCore.wallets) != null ? _a : []);
    setNotDetectedWallets((_b = walletCore == null ? void 0 : walletCore.notDetectedWallets) != null ? _b : []);
  }, [walletCore]);
  useEffect(() => {
    if (autoConnect) {
      if (localStorage.getItem("AptosWalletName") && !connected) {
        connect(localStorage.getItem("AptosWalletName"));
      } else {
        setIsLoading(false);
      }
    }
  }, [autoConnect, wallets]);
  const connect = async (walletName) => {
    try {
      setIsLoading(true);
      await (walletCore == null ? void 0 : walletCore.connect(walletName));
    } catch (error) {
      if (onError)
        onError(error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };
  const disconnect = async () => {
    try {
      await (walletCore == null ? void 0 : walletCore.disconnect());
    } catch (error) {
      if (onError)
        onError(error);
      return Promise.reject(error);
    }
  };
  const signAndSubmitTransaction = async (transaction) => {
    try {
      if (!walletCore) {
        throw new Error("WalletCore is not initialized");
      }
      return await walletCore.signAndSubmitTransaction(transaction);
    } catch (error) {
      if (onError)
        onError(error);
      return Promise.reject(error);
    }
  };
  const signTransaction = async (transactionOrPayload, asFeePayer, options) => {
    if (!walletCore) {
      throw new Error("WalletCore is not initialized");
    }
    try {
      return await walletCore.signTransaction(
        transactionOrPayload,
        asFeePayer,
        options
      );
    } catch (error) {
      if (onError)
        onError(error);
      return Promise.reject(error);
    }
  };
  const signMessage = async (message) => {
    if (!walletCore) {
      throw new Error("WalletCore is not initialized");
    }
    try {
      return await (walletCore == null ? void 0 : walletCore.signMessage(message));
    } catch (error) {
      if (onError)
        onError(error);
      return Promise.reject(error);
    }
  };
  const signMessageAndVerify = async (message) => {
    if (!walletCore) {
      throw new Error("WalletCore is not initialized");
    }
    try {
      return await (walletCore == null ? void 0 : walletCore.signMessageAndVerify(message));
    } catch (error) {
      if (onError)
        onError(error);
      return Promise.reject(error);
    }
  };
  const handleConnect = () => {
    setState((state) => {
      return {
        ...state,
        connected: true,
        account: (walletCore == null ? void 0 : walletCore.account) || null,
        network: (walletCore == null ? void 0 : walletCore.network) || null,
        wallet: (walletCore == null ? void 0 : walletCore.wallet) || null
      };
    });
  };
  const handleAccountChange = useCallback(() => {
    if (!connected)
      return;
    if (!(walletCore == null ? void 0 : walletCore.wallet))
      return;
    setState((state) => {
      return {
        ...state,
        account: (walletCore == null ? void 0 : walletCore.account) || null
      };
    });
  }, [connected]);
  const handleNetworkChange = useCallback(() => {
    if (!connected)
      return;
    if (!(walletCore == null ? void 0 : walletCore.wallet))
      return;
    setState((state) => {
      return {
        ...state,
        network: (walletCore == null ? void 0 : walletCore.network) || null
      };
    });
  }, [connected]);
  useEffect(() => {
    if (connected) {
      walletCore == null ? void 0 : walletCore.onAccountChange();
      walletCore == null ? void 0 : walletCore.onNetworkChange();
    }
  }, [connected]);
  const handleDisconnect = () => {
    if (!connected)
      return;
    setState((state) => {
      return {
        ...state,
        connected: false,
        account: (walletCore == null ? void 0 : walletCore.account) || null,
        network: (walletCore == null ? void 0 : walletCore.network) || null,
        wallet: null
      };
    });
  };
  const handleStandardWalletsAdded = (standardWallet) => {
    const existingWalletIndex = wallets.findIndex(
      (wallet2) => wallet2.name == standardWallet.name
    );
    if (existingWalletIndex !== -1) {
      setWallets((wallets2) => [
        ...wallets2.slice(0, existingWalletIndex),
        standardWallet,
        ...wallets2.slice(existingWalletIndex + 1)
      ]);
    } else {
      setWallets((wallets2) => [...wallets2, standardWallet]);
    }
  };
  const handleStandardNotDetectedWalletsAdded = (notDetectedWallet) => {
    const existingWalletIndex = wallets.findIndex(
      (wallet2) => wallet2.name == notDetectedWallet.name
    );
    if (existingWalletIndex !== -1) {
      setNotDetectedWallets((wallets2) => [
        ...wallets2.slice(0, existingWalletIndex),
        notDetectedWallet,
        ...wallets2.slice(existingWalletIndex + 1)
      ]);
    } else {
      setNotDetectedWallets((wallets2) => [...wallets2, notDetectedWallet]);
    }
  };
  useEffect(() => {
    walletCore == null ? void 0 : walletCore.on("connect", handleConnect);
    walletCore == null ? void 0 : walletCore.on("accountChange", handleAccountChange);
    walletCore == null ? void 0 : walletCore.on("networkChange", handleNetworkChange);
    walletCore == null ? void 0 : walletCore.on("disconnect", handleDisconnect);
    walletCore == null ? void 0 : walletCore.on("standardWalletsAdded", handleStandardWalletsAdded);
    walletCore == null ? void 0 : walletCore.on(
      "standardNotDetectedWalletAdded",
      handleStandardNotDetectedWalletsAdded
    );
    return () => {
      walletCore == null ? void 0 : walletCore.off("connect", handleConnect);
      walletCore == null ? void 0 : walletCore.off("accountChange", handleAccountChange);
      walletCore == null ? void 0 : walletCore.off("networkChange", handleNetworkChange);
      walletCore == null ? void 0 : walletCore.off("disconnect", handleDisconnect);
      walletCore == null ? void 0 : walletCore.off("standardWalletsAdded", handleStandardWalletsAdded);
      walletCore == null ? void 0 : walletCore.off(
        "standardNotDetectedWalletAdded",
        handleStandardNotDetectedWalletsAdded
      );
    };
  }, [wallets, account]);
  return /* @__PURE__ */ jsx(WalletContextNew.Provider, {
    value: {
      connect,
      disconnect,
      signAndSubmitTransaction,
      signTransaction,
      signMessage,
      signMessageAndVerify,
      account,
      network,
      connected,
      wallet,
      wallets,
      notDetectedWallets,
      isLoading
    },
    children
  });
};

// src/components/AboutAptosConnect.tsx
import {
  createContext as createContext2,
  useContext as useContext2,
  useMemo,
  useState as useState2
} from "react";

// src/graphics/LinkGraphic.tsx
import { forwardRef } from "react";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var LinkGraphic = forwardRef(
  (props, ref) => {
    return /* @__PURE__ */ jsx2("svg", {
      ref,
      width: "102",
      height: "132",
      viewBox: "0 0 102 132",
      fill: "none",
      ...props,
      children: /* @__PURE__ */ jsxs("g", {
        stroke: "currentColor",
        strokeMiterlimit: "10",
        children: [
          /* @__PURE__ */ jsx2("path", {
            d: "M59.633 80.66c11.742-2.814 17.48-7.018 20.925-13.254l17.518-31.69c6.257-11.317 2.142-25.55-9.189-31.798C82.737.53 75.723.188 69.593 2.398M60.7 69.565a14.09 14.09 0 0 1-6.907-1.767l-.228-.108"
          }),
          /* @__PURE__ */ jsx2("path", {
            d: "m52.365 41.075 12.507-22.627a14.146 14.146 0 0 1 4.727-5.062M32.407 118.619a14.139 14.139 0 0 1-7.034-1.768c-6.857-3.78-9.353-12.402-5.561-19.25l16.634-30.1a14.097 14.097 0 0 1 4.518-4.923"
          }),
          /* @__PURE__ */ jsx2("path", {
            d: "M41.211 78.85c11.332 6.248 25.583 2.14 31.84-9.177l17.518-31.691c6.256-11.317 2.142-25.55-9.19-31.798-6.085-3.357-13.018-3.724-19.104-1.59A23.31 23.31 0 0 0 49.541 15.36L36.863 38.298l7.989 5.036 12.506-22.627c3.786-6.848 12.419-9.34 19.276-5.554 6.856 3.78 9.353 12.402 5.561 19.25l-16.634 30.1c-3.785 6.848-12.418 9.341-19.275 5.555l-5.075 8.791ZM29.5 130.447c12.361-1.37 19.2-6.994 22.966-13.804l12.678-22.936-8.305-5.239"
          }),
          /* @__PURE__ */ jsx2("path", {
            d: "m55.72 61.947-.442.764 5.511-9.55c-6.901-3.806-18.65-3.124-27.105.814M44.85 43.523l7.635-2.486m-4.221 23.264 7.217-1.723m-9.316 7.517 7.59-2.405m-.562-12.156 7.508-2.221m10.136-51.32L62.761 4.43M49.642 90.778l7.514-2.26m.474 7.448 7.514-2.26m-50.306-60.13c7.135 0 12.918-5.776 12.918-12.9 0-7.126-5.783-12.902-12.918-12.902-7.134 0-12.917 5.776-12.917 12.901s5.783 12.901 12.918 12.901Z"
          }),
          /* @__PURE__ */ jsx2("path", {
            d: "M15.724 7.774h3.197c7.135 0 12.918 5.776 12.918 12.901 0 7.126-5.783 12.901-12.918 12.901h-3.425m65.112 66.935h3.198c7.135 0 12.918 5.775 12.918 12.901 0 7.125-5.783 12.9-12.918 12.9h-3.425"
          }),
          /* @__PURE__ */ jsx2("path", {
            d: "M79.717 126.312c7.135 0 12.918-5.775 12.918-12.9s-5.783-12.901-12.918-12.901c-7.134 0-12.917 5.776-12.917 12.901s5.783 12.9 12.917 12.9ZM53.281 55.414c-11.33-6.248-25.582-2.14-31.839 9.177L3.924 96.281c-6.257 11.318-2.142 25.55 9.189 31.799 11.331 6.248 25.582 2.139 31.839-9.177l12.677-22.937-7.988-5.036-12.507 22.627c-3.785 6.848-12.418 9.341-19.275 5.554-6.857-3.781-9.353-12.402-5.561-19.25l16.633-30.1c3.786-6.848 12.419-9.341 19.276-5.555l5.074-8.792Z"
          })
        ]
      })
    });
  }
);
LinkGraphic.displayName = "LinkGraphic";

// src/graphics/WalletGraphic.tsx
import { forwardRef as forwardRef2 } from "react";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var WalletGraphic = forwardRef2(
  (props, ref) => {
    return /* @__PURE__ */ jsxs2("svg", {
      ref,
      width: "128",
      height: "102",
      viewBox: "0 0 128 102",
      fill: "none",
      ...props,
      children: [
        /* @__PURE__ */ jsx3("path", {
          fill: "currentColor",
          d: "m.96 25.93-.36-.35.36.85v-.5Zm7.79-7.81v-.5h-.21l-.15.15.36.35ZM1.3 26.28l7.79-7.8-.7-.71-7.8 7.8.7.71Zm7.44-7.66H10v-1H8.75v1Zm29.22 6.8h-37v1h37.01v-1Z"
        }),
        /* @__PURE__ */ jsx3("path", {
          stroke: "currentColor",
          strokeMiterlimit: "10",
          d: "M82.25 26.08c0 12.25-9.92 22.2-22.14 22.2a22.17 22.17 0 0 1-22.14-22.2H1.1v74.82h118.02V26.08H82.25Zm44.33 67.02h.33V18.27h-5.7"
        }),
        /* @__PURE__ */ jsx3("path", {
          stroke: "currentColor",
          strokeMiterlimit: "10",
          d: "M74.52 42.92a22.4 22.4 0 0 1-11.43 3.3 22.5 22.5 0 0 1-22.46-22.53H9.52M119.22 101l7.78-7.82m-7.88-67.1 7.79-7.81m-44.78 7.72 2.73-2.3m-46.89 2.39 2.39-2.4"
        }),
        /* @__PURE__ */ jsx3("path", {
          stroke: "currentColor",
          strokeMiterlimit: "10",
          d: "M9.86 23.69V5.72h107.97v18.04H84.65"
        }),
        /* @__PURE__ */ jsx3("path", {
          stroke: "currentColor",
          strokeMiterlimit: "10",
          d: "M117.83 20.46h3.39V1H13.25v4.72M9.36 23.69h31.78"
        })
      ]
    });
  }
);
WalletGraphic.displayName = "WalletGraphic";

// src/graphics/Web3Graphic.tsx
import { forwardRef as forwardRef3 } from "react";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var Web3Graphic = forwardRef3(
  (props, ref) => {
    return /* @__PURE__ */ jsx4("svg", {
      ref,
      width: "142",
      height: "108",
      viewBox: "0 0 142 108",
      fill: "none",
      ...props,
      children: /* @__PURE__ */ jsxs3("g", {
        stroke: "currentColor",
        strokeLinejoin: "round",
        children: [
          /* @__PURE__ */ jsx4("path", {
            d: "m91.26 35.8.06-10.46L71.3 1v10.53L87 30.5m-36.11 5.24-.06-10.45L71.3 1v10.53L55 30.5"
          }),
          /* @__PURE__ */ jsx4("path", {
            d: "M71 59.55V49.17L50.83 25.3l.06 10.45L57 42.5m14 17.05V49.18l20.33-23.84-.07 10.45L86 42M1 59.68l.22-9.07 35.33-19.8-.1 9L9 55"
          }),
          /* @__PURE__ */ jsx4("path", {
            d: "M36.55 30.8s-.08 5.92-.1 9l.1-9ZM71 59.51v-9.07L36.55 30.8l-.1 9L63.5 55"
          }),
          /* @__PURE__ */ jsx4("path", {
            d: "M71 59.51v-9.07L36.44 70.78l-.1 9.14L55.5 68.5"
          }),
          /* @__PURE__ */ jsx4("path", {
            d: "M1.22 50.6a77387.2 77387.2 0 0 0 35.22 20.18l-.1 9.14L1 59.68l.23-9.07h-.01ZM141 59.68l-.23-9.07-35.33-19.8.11 9L133 55"
          }),
          /* @__PURE__ */ jsx4("path", {
            d: "m105.44 30.8.11 9-.1-9Z"
          }),
          /* @__PURE__ */ jsx4("path", {
            d: "M71 59.51v-9.07l34.44-19.64.11 9L78.5 55"
          }),
          /* @__PURE__ */ jsx4("path", {
            d: "M71 59.51v-9.07l34.56 20.34.1 9.14L87 69"
          }),
          /* @__PURE__ */ jsx4("path", {
            d: "M140.78 50.6a78487.3 78487.3 0 0 1-35.23 20.18l.11 9.14L141 59.68l-.23-9.07ZM50.83 80.15l.06-6.33 20.1-23.38H71v9.26L55 79"
          }),
          /* @__PURE__ */ jsx4("path", {
            d: "M71.3 97.6 50.89 73.81l-.06 9.33L71.3 107v-9.4Zm20.03-14.5-.07-9.33L71 50.44v9.26l16 18.8"
          }),
          /* @__PURE__ */ jsx4("path", {
            d: "m71.3 97.6 19.96-23.83.06 9.33L71.3 107v-9.4Z"
          })
        ]
      })
    });
  }
);
Web3Graphic.displayName = "Web3Graphic";

// src/components/utils.tsx
import { Slot } from "@radix-ui/react-slot";
import { cloneElement, forwardRef as forwardRef4, isValidElement } from "react";
import { jsx as jsx5 } from "react/jsx-runtime";
function createHeadlessComponent(displayName, elementType, props) {
  const component = forwardRef4(({ className, asChild, children }, ref) => {
    const Component = asChild ? Slot : elementType;
    const { children: defaultChildren, ...resolvedProps } = typeof props === "function" ? props(displayName) : props != null ? props : {};
    const resolvedChildren = asChild && isValidElement(children) && !children.props.children ? cloneElement(children, {}, defaultChildren) : children != null ? children : defaultChildren;
    return /* @__PURE__ */ jsx5(Component, {
      ref,
      className,
      ...resolvedProps,
      children: resolvedChildren
    });
  });
  component.displayName = displayName;
  return component;
}

// src/components/AboutAptosConnect.tsx
import { Fragment, jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
var EXPLORE_ECOSYSTEM_URL = "https://aptosfoundation.org/ecosystem/projects/all";
var AboutAptosConnectContext = createContext2(null);
function useAboutAptosConnectContext(displayName) {
  const context = useContext2(AboutAptosConnectContext);
  if (!context) {
    throw new Error(
      `\`${displayName}\` must be used within \`AboutAptosConnect\``
    );
  }
  return context;
}
var educationScreens = [
  {
    Graphic: LinkGraphic,
    Title: createHeadlessComponent("EducationScreen.Title", "h3", {
      children: "A better way to login."
    }),
    Description: createHeadlessComponent("EducationScreen.Description", "p", {
      children: "Aptos Connect is a web3 wallet that uses a Social Login to create accounts on the Aptos blockchain."
    })
  },
  {
    Graphic: WalletGraphic,
    Title: createHeadlessComponent("EducationScreen.Title", "h2", {
      children: "What is a wallet?"
    }),
    Description: createHeadlessComponent("EducationScreen.Description", "p", {
      children: "Wallets are a secure way to send, receive, and interact with digital assets like cryptocurrencies & NFTs."
    })
  },
  {
    Graphic: Web3Graphic,
    Title: createHeadlessComponent("EducationScreen.Title", "h2", {
      children: "Explore more of web3."
    }),
    Description: createHeadlessComponent("EducationScreen.Description", "p", {
      children: /* @__PURE__ */ jsxs4(Fragment, {
        children: [
          "Aptos Connect lets you take one account across any application built on Aptos.",
          " ",
          /* @__PURE__ */ jsx6("a", {
            href: EXPLORE_ECOSYSTEM_URL,
            target: "_blank",
            rel: "noopener noreferrer",
            children: "Explore the ecosystem"
          }),
          "."
        ]
      })
    })
  }
];
var educationScreenIndicators = Array(educationScreens.length).fill(null).map(
  (_, index) => createHeadlessComponent(
    "AboutAptosConnect.ScreenIndicator",
    "button",
    (displayName) => {
      const context = useAboutAptosConnectContext(displayName);
      const isActive = context.screenIndex - 1 === index;
      return {
        "aria-label": `Go to screen ${index + 1}`,
        "aria-current": isActive ? "step" : void 0,
        "data-active": isActive || void 0,
        onClick: () => {
          context.setScreenIndex(index + 1);
        }
      };
    }
  )
);
var Root = ({ renderEducationScreen, children }) => {
  const [screenIndex, setScreenIndex] = useState2(0);
  const currentEducationScreen = useMemo(
    () => educationScreens.map((screen, i) => ({
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
      }
    }))[screenIndex - 1],
    [screenIndex]
  );
  return /* @__PURE__ */ jsx6(AboutAptosConnectContext.Provider, {
    value: { screenIndex, setScreenIndex },
    children: screenIndex === 0 ? children : renderEducationScreen(currentEducationScreen)
  });
};
Root.displayName = "AboutAptosConnect";
var Trigger = createHeadlessComponent(
  "AboutAptosConnect.Trigger",
  "button",
  (displayName) => {
    const context = useAboutAptosConnectContext(displayName);
    return {
      onClick: () => {
        context.setScreenIndex(1);
      }
    };
  }
);
var AboutAptosConnect = Object.assign(Root, {
  Trigger
});

// src/components/AptosPrivacyPolicy.tsx
import { forwardRef as forwardRef6 } from "react";

// src/graphics/SmallAptosLogo.tsx
import { forwardRef as forwardRef5 } from "react";
import { jsx as jsx7 } from "react/jsx-runtime";
var SmallAptosLogo = forwardRef5((props, ref) => {
  return /* @__PURE__ */ jsx7("svg", {
    ref,
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    ...props,
    children: /* @__PURE__ */ jsx7("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12ZM7.17547 3.67976C7.13401 3.72309 7.07649 3.74757 7.01648 3.74757H3.00775C3.69185 2.83824 4.77995 2.25 6.00569 2.25C7.23142 2.25 8.31953 2.83824 9.00362 3.74757H8.28524C8.20824 3.74757 8.13498 3.71468 8.08401 3.65701L7.81608 3.35416C7.77618 3.30896 7.71882 3.28308 7.6585 3.28308H7.6454C7.58805 3.28308 7.53318 3.30646 7.49343 3.34792L7.17547 3.67976ZM8.05656 4.75897H7.39569C7.31869 4.75897 7.24543 4.72593 7.19447 4.66842L6.92638 4.36557C6.88647 4.32036 6.82896 4.29465 6.7688 4.29465C6.70863 4.29465 6.65112 4.32052 6.61121 4.36557L6.38131 4.6254C6.30603 4.71034 6.19801 4.75913 6.08454 4.75913H2.46703C2.36401 5.05278 2.29683 5.36296 2.27002 5.68467H5.68505C5.74506 5.68467 5.80258 5.66019 5.84404 5.61686L6.16201 5.28502C6.20175 5.24356 6.25662 5.22018 6.31398 5.22018H6.32707C6.38739 5.22018 6.44475 5.24606 6.48465 5.29126L6.75258 5.59411C6.80355 5.65178 6.87681 5.68467 6.95381 5.68467H9.74133C9.71452 5.3628 9.64734 5.05263 9.54431 4.75913H8.05641L8.05656 4.75897ZM4.33651 7.63095C4.39652 7.63095 4.45404 7.60648 4.4955 7.56315L4.81347 7.23131C4.85321 7.18985 4.90808 7.16647 4.96544 7.16647H4.97853C5.03885 7.16647 5.09621 7.19234 5.13611 7.23739L5.40404 7.54024C5.45501 7.59791 5.52827 7.6308 5.60527 7.6308H9.38285C9.52438 7.33839 9.62803 7.02463 9.68975 6.69591H6.06383C5.98683 6.69591 5.91357 6.66287 5.8626 6.60535L5.59467 6.3025C5.55477 6.2573 5.49725 6.23158 5.43709 6.23158C5.37692 6.23158 5.31941 6.25746 5.27951 6.3025L5.0496 6.56233C4.97432 6.64728 4.86631 6.69606 4.75268 6.69606H2.32147C2.3832 7.02479 2.487 7.33855 2.62837 7.63095H4.33651ZM5.57359 8.55745H4.59116C4.51417 8.55745 4.44091 8.52441 4.38994 8.46689L4.12201 8.16404C4.0821 8.11884 4.02459 8.09312 3.96442 8.09312C3.90426 8.09312 3.84675 8.119 3.80684 8.16404L3.57694 8.42387C3.50166 8.50882 3.39364 8.55761 3.28001 8.55761H3.26474C3.94915 9.29096 4.92378 9.74998 6.00596 9.74998C7.08815 9.74998 8.06262 9.29096 8.74719 8.55761H5.57359V8.55745Z",
      fill: "currentColor"
    })
  });
});
SmallAptosLogo.displayName = "SmallAptosLogo";

// src/components/AptosPrivacyPolicy.tsx
import { jsx as jsx8, jsxs as jsxs5 } from "react/jsx-runtime";
var APTOS_PRIVACY_POLICY_URL = "https://aptoslabs.com/privacy";
var Root2 = createHeadlessComponent("AptosPrivacyPolicy.Root", "div");
var Disclaimer = createHeadlessComponent(
  "AptosPrivacyPolicy.Disclaimer",
  "span",
  { children: "By continuing, you agree to Aptos Labs'" }
);
var Link = createHeadlessComponent("AptosPrivacyPolicy.Disclaimer", "a", {
  href: APTOS_PRIVACY_POLICY_URL,
  target: "_blank",
  rel: "noopener noreferrer",
  children: "Privacy Policy"
});
var PoweredBy = forwardRef6(({ className }, ref) => {
  return /* @__PURE__ */ jsxs5("div", {
    ref,
    className,
    children: [
      /* @__PURE__ */ jsx8("span", {
        children: "Powered by"
      }),
      /* @__PURE__ */ jsx8(SmallAptosLogo, {}),
      /* @__PURE__ */ jsx8("span", {
        children: "Aptos Labs"
      })
    ]
  });
});
PoweredBy.displayName = "AptosPrivacyPolicy.PoweredBy";
var AptosPrivacyPolicy = Object.assign(Root2, {
  Disclaimer,
  Link,
  PoweredBy
});

// src/components/WalletItem.tsx
import {
  WalletReadyState,
  isMobile,
  isRedirectable
} from "@aptos-labs/wallet-adapter-core-new";
import { Slot as Slot2 } from "@radix-ui/react-slot";
import { createContext as createContext3, forwardRef as forwardRef7, useCallback as useCallback2, useContext as useContext3 } from "react";
import { jsx as jsx9 } from "react/jsx-runtime";
function useWalletItemContext(displayName) {
  const context = useContext3(WalletItemContext);
  if (!context) {
    throw new Error(`\`${displayName}\` must be used within \`WalletItem\``);
  }
  return context;
}
var WalletItemContext = createContext3(null);
var Root3 = forwardRef7(
  ({ wallet, onConnect, className, asChild, children }, ref) => {
    var _a;
    const { connect } = useWalletNew();
    const connectWallet = useCallback2(() => {
      connect(wallet.name);
      onConnect == null ? void 0 : onConnect();
    }, [connect, wallet.name, onConnect]);
    const isWalletReady = wallet.readyState === WalletReadyState.Installed;
    const mobileSupport = "features" in wallet && "aptos:openInMobileApp" in wallet.features && ((_a = wallet.features["aptos:openInMobileApp"]) == null ? void 0 : _a.openInMobileApp);
    if (isMobile()) {
      if (!isWalletReady && isRedirectable() && !mobileSupport)
        return null;
    }
    const Component = asChild ? Slot2 : "div";
    return /* @__PURE__ */ jsx9(WalletItemContext.Provider, {
      value: { wallet, connectWallet },
      children: /* @__PURE__ */ jsx9(Component, {
        ref,
        className,
        children
      })
    });
  }
);
Root3.displayName = "WalletItem";
var Icon = createHeadlessComponent(
  "WalletItem.Icon",
  "img",
  (displayName) => {
    const context = useWalletItemContext(displayName);
    return {
      src: context.wallet.icon,
      alt: `${context.wallet.name} icon`
    };
  }
);
var Name = createHeadlessComponent(
  "WalletItem.Name",
  "div",
  (displayName) => {
    const context = useWalletItemContext(displayName);
    return {
      children: context.wallet.name
    };
  }
);
var ConnectButton = createHeadlessComponent(
  "WalletItem.ConnectButton",
  "button",
  (displayName) => {
    const context = useWalletItemContext(displayName);
    return {
      onClick: context.connectWallet,
      children: "Connect"
    };
  }
);
var InstallLink = createHeadlessComponent(
  "WalletItem.InstallLink",
  "a",
  (displayName) => {
    const context = useWalletItemContext(displayName);
    return {
      href: context.wallet.url,
      target: "_blank",
      rel: "noopener noreferrer",
      children: "Install"
    };
  }
);
var WalletItem = Object.assign(Root3, {
  Icon,
  Name,
  ConnectButton,
  InstallLink
});
export {
  APTOS_PRIVACY_POLICY_URL,
  AboutAptosConnect,
  AptosPrivacyPolicy,
  AptosWalletAdapterProviderNew,
  EXPLORE_ECOSYSTEM_URL,
  WalletContextNew,
  WalletItem,
  useWalletNew
};
//# sourceMappingURL=index.mjs.map