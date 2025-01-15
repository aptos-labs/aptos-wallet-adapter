// src/MultiChain.tsx
import { useEffect as useEffect4, useState as useState5 } from "react";
import { Loader2, MoveDown } from "lucide-react";
import {
  Network as AptosNetwork2,
  Ed25519PrivateKey as Ed25519PrivateKey2,
  Account as Account2
} from "@aptos-labs/ts-sdk";
import {
  chainToPlatform,
  routes,
  Wormhole,
  wormhole,
  TransferState,
  amount as amountUtils
} from "@wormhole-foundation/sdk";
import { chainToIcon as chainToIcon2 } from "@wormhole-foundation/sdk-icons";
import aptos from "@wormhole-foundation/sdk/aptos";
import solana from "@wormhole-foundation/sdk/solana";
import evm from "@wormhole-foundation/sdk/evm";

// src/ui/card.tsx
import * as React from "react";

// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/ui/card.tsx
import { jsx } from "react/jsx-runtime";
var Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
  ref,
  className: cn(
    "rounded-lg border bg-card text-card-foreground shadow-sm",
    className
  ),
  ...props
}));
Card.displayName = "Card";
var CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
  ref,
  className: cn("flex flex-col space-y-1.5 p-6", className),
  ...props
}));
CardHeader.displayName = "CardHeader";
var CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("h3", {
  ref,
  className: cn(
    "text-2xl font-semibold leading-none tracking-tight",
    className
  ),
  ...props
}));
CardTitle.displayName = "CardTitle";
var CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("p", {
  ref,
  className: cn("text-sm text-muted-foreground", className),
  ...props
}));
CardDescription.displayName = "CardDescription";
var CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
  ref,
  className: cn("p-6 pt-0", className),
  ...props
}));
CardContent.displayName = "CardContent";
var CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
  ref,
  className: cn("flex items-center p-6 pt-0", className),
  ...props
}));
CardFooter.displayName = "CardFooter";

// src/ui/button.tsx
import * as React2 from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { jsx as jsx2 } from "react/jsx-runtime";
var buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var Button = React2.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx2(Comp, {
      className: cn(buttonVariants({ variant, size, className })),
      ref,
      ...props
    });
  }
);
Button.displayName = "Button";

// src/components/walletSelector/solana/SolanaWalletSelector.tsx
import { Copy, LogOut } from "lucide-react";
import { useCallback as useCallback2, useEffect as useEffect2, useState as useState2 } from "react";

// src/ui/dialog.tsx
import * as React3 from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { jsx as jsx3, jsxs } from "react/jsx-runtime";
var Dialog = DialogPrimitive.Root;
var DialogTrigger = DialogPrimitive.Trigger;
var DialogPortal = DialogPrimitive.Portal;
var DialogOverlay = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx3(DialogPrimitive.Overlay, {
  ref,
  className: cn(
    "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    className
  ),
  ...props
}));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
var DialogContent = React3.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, {
  children: [
    /* @__PURE__ */ jsx3(DialogOverlay, {}),
    /* @__PURE__ */ jsxs(DialogPrimitive.Content, {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, {
          className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
          children: [
            /* @__PURE__ */ jsx3(X, {
              className: "h-4 w-4"
            }),
            /* @__PURE__ */ jsx3("span", {
              className: "sr-only",
              children: "Close"
            })
          ]
        })
      ]
    })
  ]
}));
DialogContent.displayName = DialogPrimitive.Content.displayName;
var DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx3("div", {
  className: cn(
    "flex flex-col space-y-1.5 text-center sm:text-left",
    className
  ),
  ...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx3("div", {
  className: cn(
    "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
    className
  ),
  ...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx3(DialogPrimitive.Title, {
  ref,
  className: cn(
    "text-lg font-semibold leading-none tracking-tight",
    className
  ),
  ...props
}));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
var DialogDescription = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx3(DialogPrimitive.Description, {
  ref,
  className: cn("text-sm text-muted-foreground", className),
  ...props
}));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// src/ui/dropdown-menu.tsx
import * as React4 from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import { jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";
var DropdownMenu = DropdownMenuPrimitive.Root;
var DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
var DropdownMenuSubTrigger = React4.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs2(DropdownMenuPrimitive.SubTrigger, {
  ref,
  className: cn(
    "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
    inset && "pl-8",
    className
  ),
  ...props,
  children: [
    children,
    /* @__PURE__ */ jsx4(ChevronRight, {
      className: "ml-auto h-4 w-4"
    })
  ]
}));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
var DropdownMenuSubContent = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx4(DropdownMenuPrimitive.SubContent, {
  ref,
  className: cn(
    "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
    className
  ),
  ...props
}));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
var DropdownMenuContent = React4.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx4(DropdownMenuPrimitive.Portal, {
  children: /* @__PURE__ */ jsx4(DropdownMenuPrimitive.Content, {
    ref,
    sideOffset,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  })
}));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
var DropdownMenuItem = React4.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx4(DropdownMenuPrimitive.Item, {
  ref,
  className: cn(
    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    inset && "pl-8",
    className
  ),
  ...props
}));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
var DropdownMenuCheckboxItem = React4.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs2(DropdownMenuPrimitive.CheckboxItem, {
  ref,
  className: cn(
    "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    className
  ),
  checked,
  ...props,
  children: [
    /* @__PURE__ */ jsx4("span", {
      className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
      children: /* @__PURE__ */ jsx4(DropdownMenuPrimitive.ItemIndicator, {
        children: /* @__PURE__ */ jsx4(Check, {
          className: "h-4 w-4"
        })
      })
    }),
    children
  ]
}));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
var DropdownMenuRadioItem = React4.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs2(DropdownMenuPrimitive.RadioItem, {
  ref,
  className: cn(
    "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    className
  ),
  ...props,
  children: [
    /* @__PURE__ */ jsx4("span", {
      className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
      children: /* @__PURE__ */ jsx4(DropdownMenuPrimitive.ItemIndicator, {
        children: /* @__PURE__ */ jsx4(Circle, {
          className: "h-2 w-2 fill-current"
        })
      })
    }),
    children
  ]
}));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
var DropdownMenuLabel = React4.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx4(DropdownMenuPrimitive.Label, {
  ref,
  className: cn(
    "px-2 py-1.5 text-sm font-semibold",
    inset && "pl-8",
    className
  ),
  ...props
}));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
var DropdownMenuSeparator = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx4(DropdownMenuPrimitive.Separator, {
  ref,
  className: cn("-mx-1 my-1 h-px bg-muted", className),
  ...props
}));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
var DropdownMenuShortcut = ({
  className,
  ...props
}) => {
  return /* @__PURE__ */ jsx4("span", {
    className: cn("ml-auto text-xs tracking-widest opacity-60", className),
    ...props
  });
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

// src/ui/use-toast.ts
import * as React5 from "react";
var TOAST_LIMIT = 1;
var TOAST_REMOVE_DELAY = 1e6;
var count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}
var toastTimeouts = /* @__PURE__ */ new Map();
var addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId
    });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
};
var reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === action.toast.id ? { ...t, ...action.toast } : t
        )
      };
    case "DISMISS_TOAST": {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast2) => {
          addToRemoveQueue(toast2.id);
        });
      }
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === toastId || toastId === void 0 ? {
            ...t,
            open: false
          } : t
        )
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === void 0) {
        return {
          ...state,
          toasts: []
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
      };
  }
};
var listeners = [];
var memoryState = { toasts: [] };
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}
function toast({ ...props }) {
  const id = genId();
  const update = (props2) => dispatch({
    type: "UPDATE_TOAST",
    toast: { ...props2, id }
  });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open)
          dismiss();
      }
    }
  });
  return {
    id,
    dismiss,
    update
  };
}
function useToast() {
  const [state, setState] = React5.useState(memoryState);
  React5.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);
  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId })
  };
}

// src/components/walletSelector/solana/SolanaWalletSelector.tsx
import {
  getSolanaStandardWallets
} from "@xlabs-libs/wallet-aggregator-solana";
import { WalletState } from "@xlabs-libs/wallet-aggregator-core";
import { Connection } from "@solana/web3.js";

// src/components/walletSelector/solana/SolanaWalletItem.tsx
import { Slot as Slot2 } from "@radix-ui/react-slot";
import {
  cloneElement,
  createContext,
  forwardRef as forwardRef5,
  isValidElement,
  useCallback,
  useContext
} from "react";
import { jsx as jsx5 } from "react/jsx-runtime";
function useSolanaWalletItemContext(displayName) {
  const context = useContext(SolanaWalletItemContext);
  if (!context) {
    throw new Error(
      `\`${displayName}\` must be used within \`SolanaWalletItem\``
    );
  }
  return context;
}
var SolanaWalletItemContext = createContext(null);
var Root3 = forwardRef5(
  ({ wallet, onConnect, className, asChild, children }, ref) => {
    const connectWallet = useCallback(async () => {
      await wallet.connect();
      onConnect == null ? void 0 : onConnect();
    }, [wallet, onConnect]);
    const Component = asChild ? Slot2 : "div";
    return /* @__PURE__ */ jsx5(SolanaWalletItemContext.Provider, {
      value: { wallet, connectWallet },
      children: /* @__PURE__ */ jsx5(Component, {
        ref,
        className,
        children
      })
    });
  }
);
Root3.displayName = "SolanaWalletItem";
var Icon = createHeadlessComponent(
  "SolanaWalletItem.Icon",
  "img",
  (displayName) => {
    const context = useSolanaWalletItemContext(displayName);
    return {
      src: context.wallet.getIcon(),
      alt: `${context.wallet.getName()} icon`
    };
  }
);
var Name = createHeadlessComponent(
  "SolanaWalletItem.Name",
  "div",
  (displayName) => {
    const context = useSolanaWalletItemContext(displayName);
    return {
      children: context.wallet.getName()
    };
  }
);
var ConnectButton = createHeadlessComponent(
  "SolanaWalletItem.ConnectButton",
  "button",
  (displayName) => {
    const context = useSolanaWalletItemContext(displayName);
    return {
      onClick: context.connectWallet,
      children: "Connect"
    };
  }
);
var InstallLink = createHeadlessComponent(
  "SolanaWalletItem.InstallLink",
  "a",
  (displayName) => {
    const context = useSolanaWalletItemContext(displayName);
    return {
      href: context.wallet.getUrl(),
      target: "_blank",
      rel: "noopener noreferrer",
      children: "Install"
    };
  }
);
var SolanaWalletItem = Object.assign(Root3, {
  Icon,
  Name,
  ConnectButton,
  InstallLink
});
function createHeadlessComponent(displayName, elementType, props) {
  const component = forwardRef5(({ className, asChild, children }, ref) => {
    const Component = asChild ? Slot2 : elementType;
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

// src/components/walletSelector/solana/SolanaWalletSelector.tsx
import { truncateAddress } from "@aptos-labs/wallet-adapter-react";
import { jsx as jsx6, jsxs as jsxs3 } from "react/jsx-runtime";
function SolanaWalletSelector({
  setSourceWallet,
  transactionInProgress
}) {
  const [connected, setConnected] = useState2(false);
  const [accountAddress, setAccountAddress] = useState2(
    void 0
  );
  const [wallet, setWallet] = useState2(void 0);
  const { toast: toast2 } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState2(false);
  const closeDialog = useCallback2(() => setIsDialogOpen(false), []);
  const onDisconnect = useCallback2(async () => {
    await (wallet == null ? void 0 : wallet.disconnect());
    setConnected(false);
    setSourceWallet(null);
    setAccountAddress(void 0);
    setWallet(void 0);
  }, [wallet]);
  const copyAddress = useCallback2(async () => {
    if (!accountAddress)
      return;
    try {
      await navigator.clipboard.writeText(accountAddress);
      toast2({
        title: "Success",
        description: "Copied wallet address to clipboard."
      });
    } catch {
      toast2({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy wallet address."
      });
    }
  }, [accountAddress, toast2]);
  return connected ? /* @__PURE__ */ jsxs3(DropdownMenu, {
    children: [
      /* @__PURE__ */ jsx6(DropdownMenuTrigger, {
        asChild: true,
        children: /* @__PURE__ */ jsx6(Button, {
          disabled: transactionInProgress,
          children: truncateAddress(accountAddress) || "Unknown"
        })
      }),
      /* @__PURE__ */ jsxs3(DropdownMenuContent, {
        align: "end",
        children: [
          /* @__PURE__ */ jsxs3(DropdownMenuItem, {
            onSelect: copyAddress,
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsx6(Copy, {
                className: "h-4 w-4"
              }),
              " Copy address"
            ]
          }),
          /* @__PURE__ */ jsxs3(DropdownMenuItem, {
            onSelect: onDisconnect,
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsx6(LogOut, {
                className: "h-4 w-4"
              }),
              " Disconnect"
            ]
          })
        ]
      })
    ]
  }) : /* @__PURE__ */ jsxs3(Dialog, {
    open: isDialogOpen,
    onOpenChange: setIsDialogOpen,
    children: [
      /* @__PURE__ */ jsx6(DialogTrigger, {
        asChild: true,
        children: /* @__PURE__ */ jsx6(Button, {
          children: "Connect Solana Wallet"
        })
      }),
      /* @__PURE__ */ jsx6(ConnectWalletDialog, {
        close: closeDialog,
        setAccountAddress,
        setConnected,
        setWallet,
        setSourceWallet
      })
    ]
  });
}
function ConnectWalletDialog({
  close,
  setAccountAddress,
  setConnected,
  setWallet,
  setSourceWallet
}) {
  const [wallets, setSolanaWallets] = useState2([]);
  useEffect2(() => {
    const solanaWallets = async () => {
      const isDevnet = true;
      const connection = isDevnet ? "https://api.devnet.solana.com" : "https://solana-mainnet.rpc.extrnode.com/eb370d10-948a-4f47-8017-a80241a5c7fc";
      const wallets2 = await getSolanaStandardWallets(
        new Connection(connection)
      );
      setSolanaWallets(wallets2);
    };
    solanaWallets();
  }, []);
  const onConnectClick = useCallback2(
    (wallet) => {
      setAccountAddress(wallet.getAddress());
      setConnected(true);
      setWallet(wallet);
      setSourceWallet(wallet);
      close();
    },
    [setAccountAddress, close, setSourceWallet]
  );
  return /* @__PURE__ */ jsx6(DialogContent, {
    className: "max-h-screen overflow-auto",
    children: /* @__PURE__ */ jsx6("div", {
      className: "flex flex-col gap-3 pt-3",
      children: wallets.map((wallet) => /* @__PURE__ */ jsx6(WalletRow, {
        wallet,
        onConnect: () => onConnectClick(wallet)
      }, wallet.getName()))
    })
  });
}
function WalletRow({ wallet, onConnect }) {
  const connectWallet = useCallback2(async () => {
    const res = await wallet.connect();
    console.log("res", res);
    onConnect == null ? void 0 : onConnect();
  }, [wallet, onConnect]);
  return /* @__PURE__ */ jsxs3(SolanaWalletItem, {
    wallet,
    onConnect: connectWallet,
    className: "flex items-center justify-between px-4 py-3 gap-4 border rounded-md",
    children: [
      /* @__PURE__ */ jsxs3("div", {
        className: "flex items-center gap-4",
        children: [
          /* @__PURE__ */ jsx6(SolanaWalletItem.Icon, {
            className: "h-6 w-6"
          }),
          /* @__PURE__ */ jsx6(SolanaWalletItem.Name, {
            className: "text-base font-normal"
          })
        ]
      }),
      wallet.getWalletState() === WalletState.NotDetected ? /* @__PURE__ */ jsx6(Button, {
        size: "sm",
        variant: "ghost",
        asChild: true,
        children: /* @__PURE__ */ jsx6(SolanaWalletItem.InstallLink, {})
      }) : /* @__PURE__ */ jsx6(SolanaWalletItem.ConnectButton, {
        asChild: true,
        children: /* @__PURE__ */ jsx6(Button, {
          size: "sm",
          children: "Connect"
        })
      })
    ]
  });
}

// src/utils/chains/mainnet/index.ts
var mainnetChains = {
  Ethereum: {
    key: "Ethereum",
    id: 2,
    context: "Ethereum",
    finalityThreshold: 64,
    displayName: "Ethereum",
    explorerUrl: "https://etherscan.io/",
    explorerName: "Etherscan",
    gasToken: "ETH",
    chainId: 1,
    icon: "Ethereum",
    maxBlockSearch: 2e3,
    symbol: "ETH"
  },
  Solana: {
    key: "Solana",
    id: 1,
    context: "Solana",
    finalityThreshold: 32,
    displayName: "Solana",
    explorerUrl: "https://explorer.solana.com/",
    explorerName: "Solana Explorer",
    gasToken: "SOL",
    chainId: 0,
    icon: "Solana",
    maxBlockSearch: 2e3,
    symbol: "SOL"
  }
};

// src/utils/chains/testnet/index.ts
var testnetChains = {
  Sepolia: {
    key: "Sepolia",
    id: 10002,
    context: "Ethereum",
    finalityThreshold: 0,
    displayName: "Sepolia",
    explorerUrl: "https://sepolia.etherscan.io/",
    explorerName: "Etherscan",
    gasToken: "ETHsepolia",
    chainId: 11155111,
    icon: "Ethereum",
    maxBlockSearch: 2e3,
    symbol: "ETH",
    sdkName: "Sepolia",
    wrappedGasToken: "0xeef12A83EE5b7161D3873317c8E0E7B76e0B5D9c"
  },
  Solana: {
    key: "Solana",
    id: 1,
    context: "Solana",
    finalityThreshold: 32,
    displayName: "Solana",
    explorerUrl: "https://explorer.solana.com/",
    explorerName: "Solana Explorer",
    gasToken: "SOL",
    chainId: 0,
    icon: "Solana",
    maxBlockSearch: 2e3,
    symbol: "SOL",
    sdkName: "Solana",
    wrappedGasToken: "So11111111111111111111111111111111111111112"
  }
};

// src/utils/tokens/mainnet.ts
var mainnetChainTokens = {
  Ethereum: {
    key: "USDCeth",
    symbol: "USDC",
    nativeChain: "Ethereum",
    tokenId: {
      chain: "Ethereum",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    },
    icon: "USDC",
    coinGeckoId: "usd-coin",
    color: "#ffffff",
    decimals: 6
  },
  Solana: {
    key: "USDCsol",
    symbol: "USDC",
    nativeChain: "Solana",
    tokenId: {
      chain: "Solana",
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
    },
    icon: "USDC",
    coinGeckoId: "usd-coin",
    color: "#2774CA",
    decimals: 6
  }
};
var AptosMainnetUSDCToken = {
  key: "USDCapt",
  symbol: "USDC",
  nativeChain: "Aptos",
  tokenId: {
    chain: "Aptos",
    address: "0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b"
  },
  icon: "USDC",
  coinGeckoId: "usd-coin",
  color: "#2774CA",
  decimals: 6
};

// src/utils/tokens/testnet.ts
var testnetChainTokens = {
  Avalanche: {
    symbol: "USDC",
    icon: "USDC",
    decimals: 6,
    tokenId: {
      chain: "Avalanche",
      address: "0x5425890298aed601595a70AB815c96711a31Bc65"
    }
  },
  Sepolia: {
    symbol: "USDC",
    icon: "USDC",
    decimals: 6,
    tokenId: {
      chain: "Sepolia",
      address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
    }
  },
  Solana: {
    symbol: "USDC",
    tokenId: {
      chain: "Solana",
      address: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
    },
    icon: "USDC",
    decimals: 6
  }
};
var AptosTestnetUSDCToken = {
  symbol: "USDC",
  decimals: 6,
  tokenId: {
    chain: "Aptos",
    address: "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832"
  },
  icon: "USDC"
};

// src/components/ChainSelect.tsx
import * as React6 from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { chainToIcon } from "@wormhole-foundation/sdk-icons";
import { truncateAddress as truncateAddress2 } from "@aptos-labs/wallet-adapter-react";
import { Fragment, jsx as jsx7, jsxs as jsxs4 } from "react/jsx-runtime";
function ChainSelect({
  setSelectedSourceChain,
  selectedSourceChain,
  isMainnet
}) {
  const [selectedItem, setSelectedItem] = React6.useState(selectedSourceChain);
  const onSelectedSourceChainChangeClicked = (chain) => {
    setSelectedItem(chain);
    setSelectedSourceChain(chain);
  };
  const chains = isMainnet ? mainnetChains : testnetChains;
  const chainTokens = isMainnet ? mainnetChainTokens : testnetChainTokens;
  return /* @__PURE__ */ jsxs4(DropdownMenu, {
    children: [
      /* @__PURE__ */ jsx7(DropdownMenuTrigger, {
        asChild: true,
        children: /* @__PURE__ */ jsxs4(Button, {
          variant: "outline",
          className: "w-full justify-between",
          children: [
            selectedItem ? /* @__PURE__ */ jsxs4(Fragment, {
              children: [
                /* @__PURE__ */ jsx7("img", {
                  src: chainToIcon(selectedItem),
                  alt: selectedItem,
                  height: "32px",
                  width: "32px"
                }),
                /* @__PURE__ */ jsx7("span", {
                  className: "ml-2",
                  children: "USDC"
                })
              ]
            }) : "Select an item",
            /* @__PURE__ */ jsx7(ChevronDown, {
              className: "ml-2 h-4 w-4"
            })
          ]
        })
      }),
      /* @__PURE__ */ jsx7(DropdownMenuContent, {
        children: Object.values(chains).map((chain, index) => /* @__PURE__ */ jsxs4(DropdownMenuItem, {
          onSelect: () => onSelectedSourceChainChangeClicked(chain.displayName),
          children: [
            /* @__PURE__ */ jsx7("img", {
              src: chainToIcon(chain.icon),
              alt: chain.key,
              height: "32px",
              width: "32px"
            }),
            /* @__PURE__ */ jsxs4("div", {
              children: [
                /* @__PURE__ */ jsx7("span", {
                  className: "ml-2",
                  children: "USDC"
                }),
                /* @__PURE__ */ jsxs4("a", {
                  href: `${chain.explorerUrl}/address/${chainTokens[chain.key].tokenId.address}`,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  onClick: (e) => e.stopPropagation(),
                  className: "ml-2 underline flex flex-row gap-2",
                  children: [
                    truncateAddress2(chainTokens[chain.key].tokenId.address),
                    /* @__PURE__ */ jsx7(ExternalLink, {
                      className: "h-4 w-4"
                    })
                  ]
                })
              ]
            })
          ]
        }, index))
      })
    ]
  });
}

// src/ui/input.tsx
import * as React7 from "react";
import { jsx as jsx8 } from "react/jsx-runtime";
var Input = React7.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx8("input", {
      type,
      className: cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ref,
      ...props
    });
  }
);
Input.displayName = "Input";

// src/signer/SolanaSigner.ts
import {
  ComputeBudgetProgram,
  LAMPORTS_PER_SOL,
  TransactionMessage
} from "@solana/web3.js";
import {
  determinePriorityFee,
  determinePriorityFeeTritonOne,
  isVersionedTransaction
} from "@wormhole-foundation/sdk-solana";
import { Connection as Connection2 } from "@solana/web3.js";
async function signAndSendTransaction(request, wallet, options) {
  var _a;
  if (!wallet)
    throw new Error("Wallet not found");
  const commitment = (_a = options == null ? void 0 : options.commitment) != null ? _a : "finalized";
  console.log("SolanaSigner", wallet);
  const connection = new Connection2(wallet.connection._rpcEndpoint);
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash(commitment);
  const unsignedTx = await setPriorityFeeInstructions(
    connection,
    blockhash,
    lastValidBlockHeight,
    request
  );
  let confirmTransactionPromise = null;
  let confirmedTx = null;
  let txSendAttempts = 1;
  let signature = "";
  const tx = await wallet.signTransaction(unsignedTx);
  const serializedTx = tx.serialize();
  const sendOptions = {
    skipPreflight: true,
    maxRetries: 0,
    preFlightCommitment: commitment
  };
  signature = await connection.sendRawTransaction(serializedTx, sendOptions);
  confirmTransactionPromise = connection.confirmTransaction(
    {
      signature,
      blockhash,
      lastValidBlockHeight
    },
    commitment
  );
  const txRetryInterval = 5e3;
  while (!confirmedTx) {
    confirmedTx = await Promise.race([
      confirmTransactionPromise,
      new Promise(
        (resolve) => setTimeout(() => {
          resolve(null);
        }, txRetryInterval)
      )
    ]);
    if (confirmedTx) {
      break;
    }
    console.log(
      `Tx not confirmed after ${txRetryInterval * txSendAttempts++}ms, resending`
    );
    try {
      await connection.sendRawTransaction(serializedTx, sendOptions);
    } catch (e) {
      console.error("Failed to resend transaction:", e);
    }
  }
  if (confirmedTx.value.err) {
    let errorMessage = `Transaction failed: ${confirmedTx.value.err}`;
    if (typeof confirmedTx.value.err === "object") {
      try {
        errorMessage = `Transaction failed: ${JSON.stringify(
          confirmedTx.value.err,
          (_key, value) => typeof value === "bigint" ? value.toString() : value
        )}`;
      } catch (e) {
        errorMessage = `Transaction failed: Unknown error`;
      }
    }
    throw new Error(`Transaction failed: ${errorMessage}`);
  }
  return signature;
}
async function setPriorityFeeInstructions(connection, blockhash, lastValidBlockHeight, request) {
  var _a;
  const unsignedTx = request.transaction.transaction;
  const computeBudgetIxFilter = (ix) => ix.programId.toString() !== "ComputeBudget111111111111111111111111111111";
  if (isVersionedTransaction(unsignedTx)) {
    const luts = (await Promise.all(
      unsignedTx.message.addressTableLookups.map(
        (acc) => connection.getAddressLookupTable(acc.accountKey)
      )
    )).map((lut) => lut.value).filter((lut) => lut !== null);
    const message = TransactionMessage.decompile(unsignedTx.message, {
      addressLookupTableAccounts: luts
    });
    message.recentBlockhash = blockhash;
    unsignedTx.message.recentBlockhash = blockhash;
    message.instructions = message.instructions.filter(computeBudgetIxFilter);
    message.instructions.push(
      ...await createPriorityFeeInstructions(connection, unsignedTx)
    );
    unsignedTx.message = message.compileToV0Message(luts);
    unsignedTx.sign((_a = request.transaction.signers) != null ? _a : []);
  } else {
    unsignedTx.recentBlockhash = blockhash;
    unsignedTx.lastValidBlockHeight = lastValidBlockHeight;
    unsignedTx.instructions = unsignedTx.instructions.filter(
      computeBudgetIxFilter
    );
    unsignedTx.add(
      ...await createPriorityFeeInstructions(connection, unsignedTx)
    );
    if (request.transaction.signers) {
      unsignedTx.partialSign(...request.transaction.signers);
    }
  }
  return unsignedTx;
}
async function createPriorityFeeInstructions(connection, transaction, commitment) {
  let unitsUsed = 2e5;
  let simulationAttempts = 0;
  simulationLoop:
    while (true) {
      if (isVersionedTransaction(transaction) && !transaction.message.recentBlockhash) {
        const { blockhash } = await connection.getLatestBlockhash(commitment);
        transaction.message.recentBlockhash = blockhash;
      }
      const response = await (isVersionedTransaction(transaction) ? connection.simulateTransaction(transaction, {
        commitment,
        replaceRecentBlockhash: true
      }) : connection.simulateTransaction(transaction));
      if (response.value.err) {
        if (checkKnownSimulationError(response.value)) {
          if (simulationAttempts < 5) {
            simulationAttempts++;
            await sleep(1e3);
            continue simulationLoop;
          }
        } else if (simulationAttempts < 3) {
          simulationAttempts++;
          await sleep(1e3);
          continue simulationLoop;
        }
        throw new Error(
          `Simulation failed: ${JSON.stringify(response.value.err)}
Logs:
${(response.value.logs || []).join("\n  ")}`
        );
      } else {
        if (response.value.unitsConsumed) {
          unitsUsed = response.value.unitsConsumed;
        }
        break;
      }
    }
  const unitBudget = Math.floor(unitsUsed * 1.2);
  const instructions = [];
  instructions.push(
    ComputeBudgetProgram.setComputeUnitLimit({
      units: unitBudget
    })
  );
  const percentile = 0.9;
  const percentileMultiple = 1;
  const min = 1e5;
  const max = 1e8;
  const calculateFee = async (rpcProvider2) => {
    if (rpcProvider2 === "triton") {
      try {
        const fee2 = await determinePriorityFeeTritonOne(
          connection,
          transaction,
          percentile,
          percentileMultiple,
          min,
          max
        );
        return {
          fee: fee2,
          methodUsed: "triton"
        };
      } catch (e) {
        console.warn(`Failed to determine priority fee using Triton RPC:`, e);
      }
    }
    try {
      const fee2 = await determinePriorityFee(
        connection,
        transaction,
        percentile,
        percentileMultiple,
        min,
        max
      );
      return {
        fee: fee2,
        methodUsed: "default"
      };
    } catch (e) {
      console.warn(`Failed to determine priority fee using Triton RPC:`, e);
      return {
        fee: min,
        methodUsed: "minimum"
      };
    }
  };
  const rpcProvider = determineRpcProvider(connection.rpcEndpoint);
  const { fee, methodUsed } = await calculateFee(rpcProvider);
  const maxFeeInSol = fee / 1e6 / LAMPORTS_PER_SOL * unitBudget;
  console.table({
    "RPC Provider": rpcProvider,
    "Method used": methodUsed,
    "Percentile used": percentile,
    "Multiple used": percentileMultiple,
    "Compute budget": unitBudget,
    "Priority fee": fee,
    "Max fee in SOL": maxFeeInSol
  });
  instructions.push(
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports: fee })
  );
  return instructions;
}
function checkKnownSimulationError(response) {
  const errors = {};
  if (response.err === "BlockhashNotFound") {
    errors["BlockhashNotFound"] = "Blockhash not found during simulation. Trying again.";
  }
  if (response.logs) {
    for (const line of response.logs) {
      if (line.includes("SlippageToleranceExceeded")) {
        errors["SlippageToleranceExceeded"] = "Slippage failure during simulation. Trying again.";
      }
      if (line.includes("RequireGteViolated")) {
        errors["RequireGteViolated"] = "Swap instruction failure during simulation. Trying again.";
      }
    }
  }
  if (isEmptyObject(errors)) {
    return false;
  }
  console.table(errors);
  return true;
}
async function sleep(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}
var isEmptyObject = (value) => {
  if (value === null || value === void 0) {
    return true;
  }
  for (const key in value) {
    if (value.hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
};
function determineRpcProvider(endpoint) {
  if (endpoint.includes("rpcpool.com")) {
    return "triton";
  } else if (endpoint.includes("helius-rpc.com")) {
    return "helius";
  } else if (endpoint.includes("rpc.ankr.com")) {
    return "ankr";
  } else {
    return "unknown";
  }
}

// src/signer/EthereumSigner.ts
import { getBigInt } from "ethers";
async function signAndSendTransaction2(request, wallet, chainName, options) {
  console.log("wallet", wallet);
  const provider = await wallet.getNetworkInfo();
  console.log("provider", provider);
  if (!provider)
    throw new Error("No signer found for chain" + chainName);
  const expectedChainId = request.transaction.chainId ? getBigInt(request.transaction.chainId) : void 0;
  const actualChainId = provider == null ? void 0 : provider.chainId;
  console.log("actualChainId", actualChainId);
  console.log("expectedChainId", expectedChainId);
  if (!actualChainId || !expectedChainId || BigInt(actualChainId) !== expectedChainId) {
    throw new Error(
      `Signer is not connected to the right chain. Expected ${expectedChainId}, got ${actualChainId}`
    );
  }
  const tx = await wallet.sendTransaction(request.transaction);
  console.log("tx.hash", tx.id);
  return tx.id;
}

// src/signer/Signer.ts
var Signer = class {
  constructor(chain, address, options, wallet) {
    this._chain = chain;
    this._address = address;
    this._options = options;
    this._wallet = wallet;
  }
  chain() {
    return this._chain;
  }
  address() {
    return this._address;
  }
  async signAndSend(txs) {
    console.log("Signer signAndSend txs", txs);
    const txHashes = [];
    for (const tx of txs) {
      const txId = await signAndSendTransaction3(
        this._chain,
        tx,
        this._wallet,
        this._options
      );
      txHashes.push(txId);
    }
    return txHashes;
  }
};
var signAndSendTransaction3 = async (chain, request, wallet, options = {}) => {
  if (!wallet) {
    throw new Error("wallet is undefined");
  }
  const chainContext = testnetChains[chain].context;
  console.log("chainContext", chainContext);
  if (chainContext === "Solana") {
    const signature = await signAndSendTransaction(
      request,
      wallet,
      options
    );
    return signature;
  } else if (chainContext === "Ethereum") {
    const tx = await signAndSendTransaction2(
      request,
      wallet,
      chain,
      options
    );
    return tx;
  } else {
    throw new Error(`Unsupported chain: ${chain}`);
  }
};

// src/components/walletSelector/ethereum/EthereumWalletSelector.tsx
import { Copy as Copy2, LogOut as LogOut2 } from "lucide-react";
import { useCallback as useCallback4, useEffect as useEffect3, useState as useState4 } from "react";
import {
  Eip6963Wallet,
  Eip6963Wallets
} from "@xlabs-libs/wallet-aggregator-evm";
import { truncateAddress as truncateAddress3 } from "@aptos-labs/wallet-adapter-react";
import { WalletState as WalletState2 } from "@xlabs-libs/wallet-aggregator-core";

// src/components/walletSelector/ethereum/EthereumWalletItem.tsx
import { Slot as Slot3 } from "@radix-ui/react-slot";
import {
  cloneElement as cloneElement2,
  createContext as createContext2,
  forwardRef as forwardRef7,
  isValidElement as isValidElement2,
  useCallback as useCallback3,
  useContext as useContext2
} from "react";
import { jsx as jsx9 } from "react/jsx-runtime";
function useEthereumWalletItemContext(displayName) {
  const context = useContext2(EthereumWalletItemContext);
  if (!context) {
    throw new Error(
      `\`${displayName}\` must be used within \`EthereumWalletItem\``
    );
  }
  return context;
}
var EthereumWalletItemContext = createContext2(null);
var Root4 = forwardRef7(
  ({ wallet, onConnect, className, asChild, children }, ref) => {
    const connectWallet = useCallback3(async () => {
      await wallet.connect();
      onConnect == null ? void 0 : onConnect();
    }, [wallet, onConnect]);
    const Component = asChild ? Slot3 : "div";
    return /* @__PURE__ */ jsx9(EthereumWalletItemContext.Provider, {
      value: { wallet, connectWallet },
      children: /* @__PURE__ */ jsx9(Component, {
        ref,
        className,
        children
      })
    });
  }
);
Root4.displayName = "EthereumWalletItem";
var Icon2 = createHeadlessComponent2(
  "EthereumWalletItem.Icon",
  "img",
  (displayName) => {
    const context = useEthereumWalletItemContext(displayName);
    return {
      src: context.wallet.getIcon(),
      alt: `${context.wallet.getName()} icon`
    };
  }
);
var Name2 = createHeadlessComponent2(
  "EthereumWalletItem.Name",
  "div",
  (displayName) => {
    const context = useEthereumWalletItemContext(displayName);
    return {
      children: context.wallet.getName()
    };
  }
);
var ConnectButton2 = createHeadlessComponent2(
  "EthereumWalletItem.ConnectButton",
  "button",
  (displayName) => {
    const context = useEthereumWalletItemContext(displayName);
    return {
      onClick: context.connectWallet,
      children: "Connect"
    };
  }
);
var InstallLink2 = createHeadlessComponent2(
  "EthereumWalletItem.InstallLink",
  "a",
  (displayName) => {
    const context = useEthereumWalletItemContext(displayName);
    return {
      href: context.wallet.getUrl(),
      target: "_blank",
      rel: "noopener noreferrer",
      children: "Install"
    };
  }
);
var EthereumWalletItem = Object.assign(Root4, {
  Icon: Icon2,
  Name: Name2,
  ConnectButton: ConnectButton2,
  InstallLink: InstallLink2
});
function createHeadlessComponent2(displayName, elementType, props) {
  const component = forwardRef7(({ className, asChild, children }, ref) => {
    const Component = asChild ? Slot3 : elementType;
    const { children: defaultChildren, ...resolvedProps } = typeof props === "function" ? props(displayName) : props != null ? props : {};
    const resolvedChildren = asChild && isValidElement2(children) && !children.props.children ? cloneElement2(children, {}, defaultChildren) : children != null ? children : defaultChildren;
    return /* @__PURE__ */ jsx9(Component, {
      ref,
      className,
      ...resolvedProps,
      children: resolvedChildren
    });
  });
  component.displayName = displayName;
  return component;
}

// src/components/walletSelector/ethereum/EthereumWalletSelector.tsx
import { jsx as jsx10, jsxs as jsxs5 } from "react/jsx-runtime";
var eip6963Wallets = Object.entries(Eip6963Wallets).reduce(
  (acc, [key, name]) => ({ [key]: new Eip6963Wallet(name), ...acc }),
  {}
);
function EthereumWalletSelector({
  setSourceWallet,
  transactionInProgress
}) {
  const [connected, setConnected] = useState4(false);
  const [accountAddress, setAccountAddress] = useState4(
    void 0
  );
  const [wallet, setWallet] = useState4(void 0);
  const { toast: toast2 } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState4(false);
  const closeDialog = useCallback4(() => setIsDialogOpen(false), []);
  const onDisconnect = useCallback4(async () => {
    await (wallet == null ? void 0 : wallet.disconnect());
    setConnected(false);
    setSourceWallet(null);
    setAccountAddress(void 0);
    setWallet(void 0);
  }, [wallet]);
  const copyAddress = useCallback4(async () => {
    if (!accountAddress)
      return;
    try {
      await navigator.clipboard.writeText(accountAddress);
      toast2({
        title: "Success",
        description: "Copied wallet address to clipboard."
      });
    } catch {
      toast2({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy wallet address."
      });
    }
  }, [accountAddress, toast2]);
  return connected ? /* @__PURE__ */ jsxs5(DropdownMenu, {
    children: [
      /* @__PURE__ */ jsx10(DropdownMenuTrigger, {
        asChild: true,
        children: /* @__PURE__ */ jsx10(Button, {
          disabled: transactionInProgress,
          children: truncateAddress3(accountAddress) || "Unknown"
        })
      }),
      /* @__PURE__ */ jsxs5(DropdownMenuContent, {
        align: "end",
        children: [
          /* @__PURE__ */ jsxs5(DropdownMenuItem, {
            onSelect: copyAddress,
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsx10(Copy2, {
                className: "h-4 w-4"
              }),
              " Copy address"
            ]
          }),
          /* @__PURE__ */ jsxs5(DropdownMenuItem, {
            onSelect: onDisconnect,
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsx10(LogOut2, {
                className: "h-4 w-4"
              }),
              " Disconnect"
            ]
          })
        ]
      })
    ]
  }) : /* @__PURE__ */ jsxs5(Dialog, {
    open: isDialogOpen,
    onOpenChange: setIsDialogOpen,
    children: [
      /* @__PURE__ */ jsx10(DialogTrigger, {
        asChild: true,
        children: /* @__PURE__ */ jsx10(Button, {
          children: "Connect Ethereum Wallet"
        })
      }),
      /* @__PURE__ */ jsx10(ConnectWalletDialog2, {
        close: closeDialog,
        setAccountAddress,
        setConnected,
        setWallet,
        setSourceWallet
      })
    ]
  });
}
function ConnectWalletDialog2({
  close,
  setAccountAddress,
  setConnected,
  setWallet,
  setSourceWallet
}) {
  const [wallets, setEthereumWallets] = useState4([]);
  useEffect3(() => {
    const ethereumWallets = Object.values(eip6963Wallets).filter(
      (wallet) => ["MetaMask", "Phantom", "Coinbase Wallet"].includes(
        wallet.getName()
      )
    );
    setEthereumWallets(ethereumWallets);
  }, []);
  const onConnectClick = useCallback4(
    (wallet) => {
      setAccountAddress(wallet.getAddress());
      setConnected(true);
      setWallet(wallet);
      setSourceWallet(wallet);
      close();
    },
    [setAccountAddress, close, setSourceWallet]
  );
  return /* @__PURE__ */ jsx10(DialogContent, {
    className: "max-h-screen overflow-auto",
    children: /* @__PURE__ */ jsx10("div", {
      className: "flex flex-col gap-3 pt-3",
      children: wallets.map((wallet) => /* @__PURE__ */ jsx10(WalletRow2, {
        wallet,
        onConnect: () => onConnectClick(wallet)
      }, wallet.getName()))
    })
  });
}
function WalletRow2({ wallet, onConnect }) {
  const connectWallet = useCallback4(async () => {
    const res = await wallet.connect();
    console.log("res", res);
    onConnect == null ? void 0 : onConnect();
  }, [wallet, onConnect]);
  return /* @__PURE__ */ jsxs5(EthereumWalletItem, {
    wallet,
    onConnect: connectWallet,
    className: "flex items-center justify-between px-4 py-3 gap-4 border rounded-md",
    children: [
      /* @__PURE__ */ jsxs5("div", {
        className: "flex items-center gap-4",
        children: [
          /* @__PURE__ */ jsx10(EthereumWalletItem.Icon, {
            className: "h-6 w-6"
          }),
          /* @__PURE__ */ jsx10(EthereumWalletItem.Name, {
            className: "text-base font-normal"
          })
        ]
      }),
      wallet.getWalletState() === WalletState2.NotDetected ? /* @__PURE__ */ jsx10(Button, {
        size: "sm",
        variant: "ghost",
        asChild: true,
        children: /* @__PURE__ */ jsx10(EthereumWalletItem.InstallLink, {})
      }) : /* @__PURE__ */ jsx10(EthereumWalletItem.ConnectButton, {
        asChild: true,
        children: /* @__PURE__ */ jsx10(Button, {
          size: "sm",
          children: "Connect"
        })
      })
    ]
  });
}

// src/icons/USDC.tsx
import { jsx as jsx11, jsxs as jsxs6 } from "react/jsx-runtime";
function USDC() {
  return /* @__PURE__ */ jsxs6("svg", {
    style: { maxHeight: "100%", maxWidth: "100%" },
    xmlns: "http://www.w3.org/2000/svg",
    "data-name": "86977684-12db-4850-8f30-233a7c267d11",
    width: "2000",
    height: "2000",
    viewBox: "0 0 2000 2000",
    children: [
      /* @__PURE__ */ jsx11("path", {
        fill: "#2775ca",
        d: "M1000 2000c554.17 0 1000-445.83 1000-1000S1554.17 0 1000 0 0 445.83 0 1000s445.83 1000 1000 1000z"
      }),
      /* @__PURE__ */ jsx11("path", {
        fill: "#fff",
        d: "M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84z"
      }),
      /* @__PURE__ */ jsx11("path", {
        fill: "#fff",
        d: "M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5zm441.67-1300c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67z"
      })
    ]
  });
}
var USDC_default = USDC;

// src/utils/logger.ts
var logger = {
  log: (...args) => {
    if (process.env.NODE_ENV === "development") {
      console.log(...args);
    }
  },
  warn: (...args) => {
    if (process.env.NODE_ENV === "development") {
      console.warn(...args);
    }
  },
  error: (...args) => {
    if (process.env.NODE_ENV === "development") {
      console.error(...args);
    }
  }
};

// src/signer/AptosLocalSigner.ts
import { AptosWallet } from "@xlabs-libs/wallet-aggregator-aptos";
import {
  Aptos,
  AptosConfig,
  Network as AptosNetwork
} from "@aptos-labs/ts-sdk";
var AptosLocalSigner = class {
  constructor(chain, options, wallet, feePayerAccount) {
    this._chain = chain;
    this._options = options;
    this._wallet = wallet;
    this._feePayerAccount = feePayerAccount;
    this._claimedTransactionHashes = [];
  }
  chain() {
    return this._chain;
  }
  address() {
    return this._wallet.accountAddress.toString();
  }
  claimedTransactionHashes() {
    return this._claimedTransactionHashes;
  }
  async signAndSend(txs) {
    console.log("Signer signAndSend txs", txs);
    const txHashes = [];
    for (const tx of txs) {
      const txId = await signAndSendTransaction4(
        tx,
        this._wallet,
        this._feePayerAccount
      );
      txHashes.push(txId);
      this._claimedTransactionHashes.push(txId);
    }
    return txHashes;
  }
};
async function signAndSendTransaction4(request, wallet, feePayerAccount) {
  if (!wallet) {
    throw new Error("Wallet is undefined");
  }
  const payload = request.transaction;
  payload.functionArguments = payload.functionArguments.map((a) => {
    if (a instanceof Uint8Array) {
      return Array.from(a);
    } else if (typeof a === "bigint") {
      return a.toString();
    } else {
      return a;
    }
  });
  const aptosConfig = new AptosConfig({
    network: AptosNetwork.TESTNET
  });
  const aptos2 = new Aptos(aptosConfig);
  const txnToSign = await aptos2.transaction.build.simple({
    data: payload,
    sender: wallet.accountAddress.toString(),
    withFeePayer: feePayerAccount ? true : false
  });
  const senderAuthenticator = await aptos2.transaction.sign({
    signer: wallet,
    transaction: txnToSign
  });
  const txnToSubmit = {
    transaction: txnToSign,
    senderAuthenticator
  };
  if (feePayerAccount) {
    const feePayerSignerAuthenticator = aptos2.transaction.signAsFeePayer({
      signer: feePayerAccount,
      transaction: txnToSign
    });
    txnToSubmit.feePayerAuthenticator = feePayerSignerAuthenticator;
  }
  const response = await aptos2.transaction.submit.simple(txnToSubmit);
  console.log("response", response.hash);
  const tx = await aptos2.waitForTransaction({
    transactionHash: response.hash
  });
  return tx.hash;
}

// src/MultiChain.tsx
import { jsx as jsx12, jsxs as jsxs7 } from "react/jsx-runtime";
var claimSignerPrivateKey = new Ed25519PrivateKey2(
  "0xddc1abd2ebb35b6ffa7c328f1b1d672e48073adb32cd3c95a911d6df2e205920"
);
var claimSignerAccount = Account2.fromPrivateKey({
  privateKey: claimSignerPrivateKey
});
var feePayerPrivateKey = new Ed25519PrivateKey2(
  "0xedae3fa4f04fdee1e3458b9e38d006ebca0101bd9d8a124db9dd9e8dc3707b45"
);
var feePayerStaticAccount = Account2.fromPrivateKey({
  privateKey: feePayerPrivateKey
});
var destinationAccountAddress = "0x38383091fdd9325e0b8ada990c474da8c7f5aa51580b65eb477885b6ce0a36b7";
var MultiChain = ({
  feePayerAccount = void 0,
  dappConfig
}) => {
  const isMainnet = (dappConfig == null ? void 0 : dappConfig.network) === AptosNetwork2.MAINNET;
  const chainToken = isMainnet ? mainnetChainTokens : testnetChainTokens;
  const [sourceWallet, setSourceWallet] = useState5(null);
  const [selectedSourceChain, setSelectedSourceChain] = useState5("Solana");
  const [amount, setAmount] = useState5("0");
  const [platform, setPlatform] = useState5(void 0);
  const [cctpRequest, setCctpRequest] = useState5(void 0);
  const [cctpRoute, setCctpRoute] = useState5(void 0);
  const [quote, setQuote] = useState5(null);
  const [showQuote, setShowQuote] = useState5(false);
  const [quoteAmount, setQuoteAmount] = useState5(null);
  const [wormholeContext, setWormholeContext] = useState5(void 0);
  const [sourceWalletUSDCBalance, setSourceWalletUSDCBalance] = useState5(null);
  const [progress, setProgress] = useState5(0);
  const [transactionETA, setTransactionETA] = useState5(0);
  const [startTime, setStartTime] = useState5(null);
  const [aptosTransactionId, setAptosTransactionId] = useState5(void 0);
  const [transactionInProgress, setTransactionInProgress] = useState5(false);
  const [transactionCompleted, setTransactionCompleted] = useState5(false);
  const [countdown, setCountdown] = useState5({ minutes: 0, seconds: 0 });
  const [invalidAmount, setInvalidAmount] = useState5(false);
  const [wormholeTransactionId, setWormholeTransactionId] = useState5(void 0);
  const [isCountdownComplete, setIsCountdownComplete] = useState5(false);
  const onSetAmount = (amount2) => {
    if (!cctpRoute) {
      throw new Error("Route is not initialized");
    }
    if (!cctpRequest) {
      throw new Error("Request is not initialized");
    }
    setAmount(amount2);
    setQuoteAmount(null);
    setTimeout(async () => {
      var _a;
      setQuoteAmount(amount2);
      const transferParams = { amount: amount2, options: { nativeGas: 0 } };
      const validated = await cctpRoute.validate(cctpRequest, transferParams);
      if (!validated.valid) {
        logger.log("invalid", validated.valid);
        throw validated.error;
      }
      const quote2 = await cctpRoute.quote(cctpRequest, validated.params);
      if (!quote2.success) {
        logger.log("quote failed", quote2.success);
        throw quote2.error;
      }
      logger.log("quote", quote2);
      setQuote(quote2);
      setTransactionETA(Math.ceil(((_a = quote2.eta) != null ? _a : 0) / 1e3) * 1e3);
      setShowQuote(true);
    }, 800);
  };
  const humanReadableETA = (milliseconds) => {
    if (milliseconds >= 6e4) {
      const minutes = Math.floor(milliseconds / 6e4);
      return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else {
      const seconds = Math.floor(milliseconds / 1e3);
      return `${seconds} second${seconds > 1 ? "s" : ""}`;
    }
  };
  useEffect4(() => {
    if (!startTime || !transactionETA)
      return;
    const updateCountdown = () => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(transactionETA - elapsed, 0);
      const minutes = Math.floor(remainingTime / 6e4);
      const seconds = Math.floor(remainingTime % 6e4 / 1e3);
      setCountdown({ minutes, seconds });
      const progressPercent = Math.min(elapsed / transactionETA * 100, 100);
      setProgress(progressPercent);
      if (remainingTime === 0) {
        setIsCountdownComplete(true);
        clearInterval(interval);
      }
      if (progressPercent >= 100) {
        clearInterval(interval);
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1e3);
    return () => clearInterval(interval);
  }, [startTime, transactionETA]);
  useEffect4(() => {
    if (!sourceWalletUSDCBalance || !amount) {
      return;
    }
    const parsedAmount = amountUtils.parse(
      amount,
      chainToken[selectedSourceChain].decimals
    );
    if (amountUtils.units(parsedAmount) > amountUtils.units(sourceWalletUSDCBalance)) {
      setInvalidAmount(true);
    } else {
      setInvalidAmount(false);
    }
  }, [sourceWalletUSDCBalance, amount]);
  useEffect4(() => {
    const initializeRoute = async () => {
      const wh = await wormhole(isMainnet ? "Mainnet" : "Testnet", [
        solana,
        aptos,
        evm
      ]);
      setWormholeContext(wh);
      const platform2 = wh.getPlatform(chainToPlatform(selectedSourceChain));
      setPlatform(platform2);
      const sourceToken = Wormhole.tokenId(
        chainToken[selectedSourceChain].tokenId.chain,
        chainToken[selectedSourceChain].tokenId.address
      );
      const aptosChainToken = isMainnet ? AptosMainnetUSDCToken : AptosTestnetUSDCToken;
      const destToken = Wormhole.tokenId(
        aptosChainToken.tokenId.chain,
        aptosChainToken.tokenId.address
      );
      const sourceContext = wh.getPlatform(chainToPlatform(selectedSourceChain)).getChain(selectedSourceChain);
      logger.log("sourceContext", sourceContext);
      const destContext = wh.getPlatform(chainToPlatform("Aptos")).getChain("Aptos");
      logger.log("destContext", destContext);
      const req = await routes.RouteTransferRequest.create(
        wh,
        {
          source: sourceToken,
          destination: destToken
        },
        sourceContext,
        destContext
      );
      setCctpRequest(req);
      const resolver = wh.resolver([
        routes.CCTPRoute
      ]);
      const route = await resolver.findRoutes(req);
      const cctpRoute2 = route[0];
      logger.log("cctpRoute", cctpRoute2);
      setCctpRoute(cctpRoute2);
    };
    initializeRoute();
  }, [selectedSourceChain]);
  useEffect4(() => {
    const getBalances = async () => {
      if (!wormholeContext) {
        return;
      }
      if (!sourceWallet) {
        return;
      }
      try {
        const platform2 = wormholeContext.getPlatform(
          chainToPlatform(selectedSourceChain)
        );
        const rpc = platform2.getRpc(selectedSourceChain);
        const result = await platform2.utils().getBalances(selectedSourceChain, rpc, sourceWallet == null ? void 0 : sourceWallet.getAddress(), [
          chainToken[selectedSourceChain].tokenId.address
        ]);
        const currentAmount = result[chainToken[selectedSourceChain].tokenId.address];
        const usdcBalance = amountUtils.fromBaseUnits(
          currentAmount != null ? currentAmount : BigInt(0),
          chainToken[selectedSourceChain].decimals
        );
        return usdcBalance;
      } catch (e) {
        console.error("Failed to get token balances", e);
      }
    };
    getBalances().then((usdcBalance) => {
      if (usdcBalance) {
        setSourceWalletUSDCBalance(usdcBalance);
      }
    });
  }, [sourceWallet, platform]);
  const onSetMaxAmount = () => {
    if (!sourceWalletUSDCBalance) {
      return;
    }
    setAmount(
      amountUtils.display(amountUtils.truncate(sourceWalletUSDCBalance, 6))
    );
  };
  const onSwapClick = async () => {
    if (!sourceWallet) {
      return;
    }
    if (!sourceWallet.getAddress()) {
      throw new Error("Source wallet address is undefined");
    }
    if (!cctpRoute) {
      throw new Error("Route is not initialized");
    }
    if (!cctpRequest) {
      throw new Error("Request is not initialized");
    }
    if (!quote) {
      throw new Error("Quote is not initialized");
    }
    const signer = new Signer(
      selectedSourceChain,
      sourceWallet.getAddress(),
      {},
      sourceWallet
    );
    setTransactionInProgress(true);
    let receipt = await cctpRoute.initiate(
      cctpRequest,
      signer,
      quote,
      Wormhole.chainAddress("Aptos", destinationAccountAddress)
    );
    logger.log("Initiated transfer with receipt: ", receipt);
    setStartTime(Date.now());
    const txId = "originTxs" in receipt ? receipt.originTxs[receipt.originTxs.length - 1].txid : void 0;
    setWormholeTransactionId(txId);
    let retries = 0;
    const maxRetries = 5;
    const baseDelay = 1e3;
    while (retries < maxRetries) {
      try {
        for await (receipt of cctpRoute.track(receipt, 120 * 1e3)) {
          if (receipt.state >= TransferState.SourceInitiated) {
            logger.log("Receipt is on track ", receipt);
            try {
              const signer2 = new AptosLocalSigner(
                "Aptos",
                {},
                claimSignerAccount,
                feePayerStaticAccount
              );
              if (routes.isManual(cctpRoute)) {
                const circleAttestationReceipt = await cctpRoute.complete(
                  signer2,
                  receipt
                );
                logger.log("Claim receipt: ", circleAttestationReceipt);
                signer2.claimedTransactionHashes().forEach((txHash) => {
                  console.log("Claimed transaction hash: ", txHash);
                  setAptosTransactionId(txHash);
                });
                setTransactionInProgress(false);
                setTransactionCompleted(true);
              } else {
                return void 0;
              }
            } catch (e) {
              console.error("Failed to claim", e);
            }
            return;
          }
        }
      } catch (e) {
        console.error(
          `Error tracking transfer (attempt ${retries + 1} / ${maxRetries}):`,
          e
        );
        const delay = baseDelay * Math.pow(2, retries);
        await sleep(delay);
        retries++;
      }
    }
  };
  return /* @__PURE__ */ jsx12("div", {
    className: "w-full flex justify-center items-center p-4",
    children: /* @__PURE__ */ jsx12(Card, {
      className: "w-96",
      children: /* @__PURE__ */ jsxs7(CardContent, {
        className: "flex flex-col gap-8 pt-6",
        children: [
          /* @__PURE__ */ jsx12(ChainSelect, {
            setSelectedSourceChain,
            selectedSourceChain,
            isMainnet
          }),
          /* @__PURE__ */ jsx12("div", {
            className: "flex flex-col w-full",
            children: selectedSourceChain === "Solana" ? /* @__PURE__ */ jsx12(SolanaWalletSelector, {
              setSourceWallet,
              transactionInProgress
            }) : /* @__PURE__ */ jsx12(EthereumWalletSelector, {
              setSourceWallet,
              transactionInProgress
            })
          }),
          /* @__PURE__ */ jsxs7("div", {
            className: "flex flex-row gap-2 items-center",
            children: [
              /* @__PURE__ */ jsx12(Input, {
                value: amount,
                onChange: (e) => onSetAmount(e.target.value)
              }),
              /* @__PURE__ */ jsxs7("div", {
                className: "flex flex-col cursor-pointer",
                onClick: onSetMaxAmount,
                children: [
                  /* @__PURE__ */ jsx12("span", {
                    children: "Max"
                  }),
                  /* @__PURE__ */ jsx12("span", {
                    children: sourceWalletUSDCBalance ? amountUtils.display(
                      amountUtils.truncate(sourceWalletUSDCBalance, 6)
                    ) : "0"
                  })
                ]
              })
            ]
          }),
          invalidAmount && /* @__PURE__ */ jsx12("p", {
            className: "text-red-500",
            children: "Amount is greater than the balance of the source wallet"
          }),
          showQuote && quoteAmount && !invalidAmount && /* @__PURE__ */ jsx12(Card, {
            children: /* @__PURE__ */ jsxs7(CardContent, {
              className: "p-4",
              children: [
                /* @__PURE__ */ jsxs7("div", {
                  className: "flex flex-row items-center",
                  children: [
                    /* @__PURE__ */ jsx12("div", {
                      className: "w-10 h-10",
                      children: /* @__PURE__ */ jsx12(USDC_default, {})
                    }),
                    /* @__PURE__ */ jsx12("div", {
                      className: "w-4 h-4",
                      style: {
                        position: "relative",
                        bottom: 0,
                        top: 15,
                        right: 14,
                        backgroundColor: "black",
                        padding: 4,
                        borderRadius: 4
                      },
                      children: /* @__PURE__ */ jsx12("img", {
                        src: chainToIcon2(selectedSourceChain),
                        alt: selectedSourceChain,
                        height: "32px",
                        width: "32px"
                      })
                    }),
                    /* @__PURE__ */ jsx12("div", {
                      children: /* @__PURE__ */ jsxs7("p", {
                        children: [
                          "-",
                          quoteAmount,
                          " USDC"
                        ]
                      })
                    })
                  ]
                }),
                /* @__PURE__ */ jsx12("div", {
                  className: "p-2",
                  children: /* @__PURE__ */ jsx12(MoveDown, {})
                }),
                /* @__PURE__ */ jsxs7("div", {
                  className: "flex flex-row items-center",
                  children: [
                    /* @__PURE__ */ jsx12("div", {
                      className: "w-10 h-10",
                      children: /* @__PURE__ */ jsx12(USDC_default, {})
                    }),
                    /* @__PURE__ */ jsx12("div", {
                      className: "w-4 h-4",
                      style: {
                        position: "relative",
                        bottom: 0,
                        top: 15,
                        right: 14,
                        backgroundColor: "black",
                        padding: 4,
                        borderRadius: 4
                      },
                      children: /* @__PURE__ */ jsx12("img", {
                        src: chainToIcon2("Aptos"),
                        alt: "Aptos",
                        height: "32px",
                        width: "32px"
                      })
                    }),
                    /* @__PURE__ */ jsx12("div", {
                      children: /* @__PURE__ */ jsxs7("p", {
                        children: [
                          "+",
                          quoteAmount,
                          " USDC"
                        ]
                      })
                    })
                  ]
                }),
                /* @__PURE__ */ jsxs7("div", {
                  className: "flex flex-row justify-between py-4",
                  children: [
                    /* @__PURE__ */ jsx12("div", {
                      className: "flex flex-col",
                      children: /* @__PURE__ */ jsx12("p", {
                        className: "text-sm",
                        children: "via Wormhole"
                      })
                    }),
                    /* @__PURE__ */ jsxs7("p", {
                      className: "text-md",
                      children: [
                        "~",
                        humanReadableETA(transactionETA)
                      ]
                    })
                  ]
                })
              ]
            })
          }),
          !transactionInProgress && !transactionCompleted && /* @__PURE__ */ jsx12(Button, {
            onClick: onSwapClick,
            disabled: !amount || !sourceWallet || !quoteAmount || !quote || invalidAmount,
            children: "Confirm"
          }),
          transactionInProgress && !transactionCompleted && /* @__PURE__ */ jsxs7("div", {
            className: "flex flex-col gap-4",
            children: [
              /* @__PURE__ */ jsx12("p", {
                className: "text-lg text-center",
                children: "Submitting transaction"
              }),
              /* @__PURE__ */ jsx12(Button, {
                disabled: true,
                children: /* @__PURE__ */ jsx12(Loader2, {
                  className: "animate-spin"
                })
              })
            ]
          }),
          !transactionInProgress && transactionCompleted && /* @__PURE__ */ jsx12("div", {
            className: "flex flex-col gap-4",
            children: /* @__PURE__ */ jsx12(Button, {
              children: "Start a new Transaction"
            })
          }),
          transactionCompleted && /* @__PURE__ */ jsxs7("div", {
            className: "flex flex-col items-center justify-center gap-4",
            children: [
              /* @__PURE__ */ jsx12("p", {
                className: "text-lg",
                children: "Transaction submitted"
              }),
              wormholeTransactionId && /* @__PURE__ */ jsx12("a", {
                href: `https://explorer.solana.com/tx/${wormholeTransactionId}?cluster=${isMainnet ? "mainnet" : "devnet"}`,
                target: "_blank",
                rel: "noopener noreferrer",
                children: /* @__PURE__ */ jsx12("p", {
                  className: "text-md underline",
                  children: "View on Solana Explorer"
                })
              }),
              aptosTransactionId && /* @__PURE__ */ jsx12("a", {
                href: `https://explorer.aptoslabs.com/txn/${aptosTransactionId}?network=${isMainnet ? "mainnet" : "testnet"}`,
                target: "_blank",
                rel: "noopener noreferrer",
                children: /* @__PURE__ */ jsx12("p", {
                  className: "text-md underline",
                  children: "View on Aptos Explorer"
                })
              })
            ]
          })
        ]
      })
    })
  });
};
export {
  MultiChain
};
