"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var src_exports = {};
__export(src_exports, {
  default: () => WalletConnector
});
module.exports = __toCommonJS(src_exports);
var import_react3 = require("react");

// src/WalletButton.tsx
var import_material2 = require("@mui/material");
var import_react2 = require("react");
var import_wallet_adapter_react2 = require("@aptos-labs/wallet-adapter-react");

// src/WalletMenu.tsx
var import_material = require("@mui/material");
var import_wallet_adapter_react = require("@aptos-labs/wallet-adapter-react");
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
function WalletMenu({
  popoverAnchor,
  handlePopoverClose,
  handleNavigate
}) {
  const { account, disconnect } = (0, import_wallet_adapter_react.useWallet)();
  const popoverOpen = Boolean(popoverAnchor);
  const id = popoverOpen ? "wallet-popover" : void 0;
  const onAccountOptionClicked = () => {
    handleNavigate && handleNavigate();
    handlePopoverClose();
  };
  const [tooltipOpen, setTooltipOpen] = (0, import_react.useState)(false);
  const copyAddress = async (event) => {
    await navigator.clipboard.writeText(account == null ? void 0 : account.address);
    setTooltipOpen(true);
    setTimeout(() => {
      setTooltipOpen(false);
    }, 2e3);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material.Popover, {
    id,
    open: popoverOpen,
    anchorEl: popoverAnchor,
    onClose: handlePopoverClose,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left"
    },
    children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_material.List, {
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material.Tooltip, {
          title: "Copied",
          placement: "bottom-end",
          open: tooltipOpen,
          disableFocusListener: true,
          disableHoverListener: true,
          disableTouchListener: true,
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material.ListItem, {
            disablePadding: true,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material.ListItemButton, {
              onClick: copyAddress,
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material.ListItemText, {
                primary: "Copy Address"
              })
            })
          })
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material.ListItem, {
          disablePadding: true,
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material.ListItemButton, {
            onClick: onAccountOptionClicked,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material.ListItemText, {
              primary: "Account"
            })
          })
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material.ListItem, {
          disablePadding: true,
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material.ListItemButton, {
            onClick: () => disconnect(),
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material.ListItemText, {
              primary: "Logout"
            })
          })
        })
      ]
    })
  });
}

// src/utils.tsx
function truncate(str, frontLen, backLen, truncateStr) {
  if (!str) {
    return "";
  }
  if (!Number.isInteger(frontLen) || !Number.isInteger(backLen)) {
    throw `${frontLen} and ${backLen} should be an Integer`;
  }
  var strLen = str.length;
  frontLen = frontLen;
  backLen = backLen;
  truncateStr = truncateStr || "\u2026";
  if (frontLen === 0 && backLen === 0 || frontLen >= strLen || backLen >= strLen || frontLen + backLen >= strLen) {
    return str;
  } else if (backLen === 0) {
    return str.slice(0, frontLen) + truncateStr;
  } else {
    return str.slice(0, frontLen) + truncateStr + str.slice(strLen - backLen);
  }
}
function truncateAddress(accountAddress) {
  return truncate(accountAddress, 6, 4, "\u2026");
}

// src/WalletButton.tsx
var import_AccountBalanceWalletOutlined = __toESM(require("@mui/icons-material/AccountBalanceWalletOutlined"));
var import_jsx_runtime = require("react/jsx-runtime");
function WalletButton({
  handleModalOpen,
  handleNavigate
}) {
  const { connected, account, wallet } = (0, import_wallet_adapter_react2.useWallet)();
  const [popoverAnchor, setPopoverAnchor] = (0, import_react2.useState)(
    null
  );
  const handleClick = (event) => {
    setPopoverAnchor(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setPopoverAnchor(null);
  };
  const onConnectWalletClick = () => {
    handlePopoverClose();
    handleModalOpen();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material2.Stack, {
    justifyContent: "center",
    alignItems: "center",
    children: connected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, {
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_material2.Button, {
          size: "large",
          variant: "contained",
          onClick: handleClick,
          className: "wallet-button",
          sx: { borderRadius: "10px" },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material2.Avatar, {
              alt: wallet == null ? void 0 : wallet.name,
              src: wallet == null ? void 0 : wallet.icon,
              sx: { width: 24, height: 24 }
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material2.Typography, {
              noWrap: true,
              ml: 2,
              children: truncateAddress(account == null ? void 0 : account.address)
            })
          ]
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletMenu, {
          popoverAnchor,
          handlePopoverClose,
          handleNavigate
        })
      ]
    }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_material2.Button, {
      size: "large",
      variant: "contained",
      onClick: onConnectWalletClick,
      className: "wallet-button",
      sx: { borderRadius: "10px" },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_AccountBalanceWalletOutlined.default, {
          sx: { marginRight: 1 }
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material2.Typography, {
          noWrap: true,
          children: "Connect Wallet"
        })
      ]
    })
  });
}

// src/WalletModel.tsx
var import_material3 = require("@mui/material");
var import_wallet_adapter_react3 = require("@aptos-labs/wallet-adapter-react");

// src/aptosColorPalette.ts
var grey = {
  50: "#fafafa",
  100: "#f4f4f5",
  200: "#e4e4e7",
  300: "#d4d4d8",
  400: "#a1a1aa",
  450: "#909099",
  500: "#4f5352",
  600: "#363a39",
  700: "#272b2a",
  800: "#1b1f1e",
  900: "#121615"
};

// src/WalletModel.tsx
var import_WarningAmberOutlined = __toESM(require("@mui/icons-material/WarningAmberOutlined"));
var import_Close = __toESM(require("@mui/icons-material/Close"));
var import_jsx_runtime = require("react/jsx-runtime");
function WalletsModal({
  handleClose,
  modalOpen,
  networkSupport
}) {
  const { wallets, connect } = (0, import_wallet_adapter_react3.useWallet)();
  const theme = (0, import_material3.useTheme)();
  const onWalletSelect = (walletName) => {
    connect(walletName);
    handleClose();
  };
  const renderWalletsList = () => {
    return wallets.map((wallet) => {
      const option = wallet;
      const icon = option.icon;
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material3.Grid, {
        xs: 12,
        paddingY: 0.5,
        children: wallet.readyState === "Installed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material3.ListItem, {
          disablePadding: true,
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_material3.ListItemButton, {
            alignItems: "center",
            disableGutters: true,
            onClick: () => onWalletSelect(option.name),
            sx: {
              background: theme.palette.mode === "dark" ? grey[700] : grey[200],
              padding: "1rem 3rem",
              borderRadius: "10px",
              display: "flex",
              gap: "1rem"
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material3.ListItemAvatar, {
                sx: {
                  display: "flex",
                  alignItems: "center",
                  width: "2rem",
                  height: "2rem",
                  minWidth: "0",
                  color: `${theme.palette.text.primary}`
                },
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material3.Box, {
                  component: "img",
                  src: icon,
                  sx: { width: "100%", height: "100%" }
                })
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material3.ListItemText, {
                primary: option.name,
                primaryTypographyProps: {
                  fontSize: 18
                }
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material3.Button, {
                variant: "contained",
                size: "small",
                className: "wallet-connect-button",
                children: "Connect"
              })
            ]
          })
        }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_material3.ListItem, {
          alignItems: "center",
          sx: {
            borderRadius: `${theme.shape.borderRadius}px`,
            background: theme.palette.mode === "dark" ? grey[700] : grey[200],
            padding: "1rem 3rem",
            gap: "1rem"
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material3.ListItemAvatar, {
              sx: {
                display: "flex",
                alignItems: "center",
                width: "2rem",
                height: "2rem",
                minWidth: "0",
                opacity: "0.25"
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material3.Box, {
                component: "img",
                src: icon,
                sx: { width: "100%", height: "100%" }
              })
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material3.ListItemText, {
              sx: {
                opacity: "0.25"
              },
              primary: option.name,
              primaryTypographyProps: {
                fontSize: 18
              }
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material3.Button, {
              LinkComponent: "a",
              href: option.url,
              target: "_blank",
              size: "small",
              className: "wallet-connect-install",
              children: "Install"
            })
          ]
        })
      }, option.name);
    });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material3.Dialog, {
    open: modalOpen,
    onClose: handleClose,
    "aria-labelledby": "wallet selector modal",
    "aria-describedby": "select a wallet to connect",
    sx: { borderRadius: "5px" },
    children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_material3.Stack, {
      sx: {
        display: "flex",
        flexDirection: "column",
        top: "50%",
        left: "50%",
        width: 500,
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 3
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material3.IconButton, {
          onClick: handleClose,
          sx: {
            position: "absolute",
            right: 12,
            top: 12,
            color: grey[450]
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_Close.default, {})
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material3.Typography, {
          align: "center",
          variant: "h5",
          pt: 2,
          children: "Connect Wallet"
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material3.Box, {
          sx: {
            display: "flex",
            gap: 0.5,
            alignItems: "center",
            justifyContent: "center",
            mb: 4
          },
          children: networkSupport && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, {
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_WarningAmberOutlined.default, {
                sx: {
                  fontSize: "0.9rem",
                  color: grey[400]
                }
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_material3.Typography, {
                sx: {
                  display: "inline-flex",
                  fontSize: "0.9rem",
                  color: grey[400]
                },
                align: "center",
                children: [
                  networkSupport,
                  " only"
                ]
              })
            ]
          })
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material3.Box, {
          children: renderWalletsList()
        })
      ]
    })
  });
}

// src/index.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function WalletConnector({
  networkSupport,
  handleNavigate
}) {
  const [modalOpen, setModalOpen] = (0, import_react3.useState)(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, {
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletButton, {
        handleModalOpen,
        handleNavigate
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletsModal, {
        handleClose,
        modalOpen,
        networkSupport
      })
    ]
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
