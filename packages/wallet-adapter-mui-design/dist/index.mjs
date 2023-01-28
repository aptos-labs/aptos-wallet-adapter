// src/index.tsx
import { useState as useState3 } from "react";

// src/WalletButton.tsx
import { Avatar, Button, Stack, Typography } from "@mui/material";
import { useState as useState2 } from "react";
import { useWallet as useWallet2 } from "@aptos-labs/wallet-adapter-react";

// src/WalletMenu.tsx
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  Tooltip
} from "@mui/material";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function WalletMenu({
  popoverAnchor,
  handlePopoverClose,
  handleNavigate
}) {
  const { account, disconnect } = useWallet();
  const popoverOpen = Boolean(popoverAnchor);
  const id = popoverOpen ? "wallet-popover" : void 0;
  const onAccountOptionClicked = () => {
    handleNavigate && handleNavigate();
    handlePopoverClose();
  };
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const copyAddress = async (event) => {
    await navigator.clipboard.writeText(account == null ? void 0 : account.address);
    setTooltipOpen(true);
    setTimeout(() => {
      setTooltipOpen(false);
    }, 2e3);
  };
  return /* @__PURE__ */ jsx(Popover, {
    id,
    open: popoverOpen,
    anchorEl: popoverAnchor,
    onClose: handlePopoverClose,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left"
    },
    children: /* @__PURE__ */ jsxs(List, {
      children: [
        /* @__PURE__ */ jsx(Tooltip, {
          title: "Copied",
          placement: "bottom-end",
          open: tooltipOpen,
          disableFocusListener: true,
          disableHoverListener: true,
          disableTouchListener: true,
          children: /* @__PURE__ */ jsx(ListItem, {
            disablePadding: true,
            children: /* @__PURE__ */ jsx(ListItemButton, {
              onClick: copyAddress,
              children: /* @__PURE__ */ jsx(ListItemText, {
                primary: "Copy Address"
              })
            })
          })
        }),
        /* @__PURE__ */ jsx(ListItem, {
          disablePadding: true,
          children: /* @__PURE__ */ jsx(ListItemButton, {
            onClick: onAccountOptionClicked,
            children: /* @__PURE__ */ jsx(ListItemText, {
              primary: "Account"
            })
          })
        }),
        /* @__PURE__ */ jsx(ListItem, {
          disablePadding: true,
          children: /* @__PURE__ */ jsx(ListItemButton, {
            onClick: () => disconnect(),
            children: /* @__PURE__ */ jsx(ListItemText, {
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
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { Fragment, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function WalletButton({
  handleModalOpen,
  handleNavigate
}) {
  const { connected, account, wallet } = useWallet2();
  const [popoverAnchor, setPopoverAnchor] = useState2(
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
  return /* @__PURE__ */ jsx2(Stack, {
    justifyContent: "center",
    alignItems: "center",
    children: connected ? /* @__PURE__ */ jsxs2(Fragment, {
      children: [
        /* @__PURE__ */ jsxs2(Button, {
          size: "large",
          variant: "contained",
          onClick: handleClick,
          className: "wallet-button",
          sx: { borderRadius: "10px" },
          children: [
            /* @__PURE__ */ jsx2(Avatar, {
              alt: wallet == null ? void 0 : wallet.name,
              src: wallet == null ? void 0 : wallet.icon,
              sx: { width: 24, height: 24 }
            }),
            /* @__PURE__ */ jsx2(Typography, {
              noWrap: true,
              ml: 2,
              children: truncateAddress(account == null ? void 0 : account.address)
            })
          ]
        }),
        /* @__PURE__ */ jsx2(WalletMenu, {
          popoverAnchor,
          handlePopoverClose,
          handleNavigate
        })
      ]
    }) : /* @__PURE__ */ jsxs2(Button, {
      size: "large",
      variant: "contained",
      onClick: onConnectWalletClick,
      className: "wallet-button",
      sx: { borderRadius: "10px" },
      children: [
        /* @__PURE__ */ jsx2(AccountBalanceWalletOutlinedIcon, {
          sx: { marginRight: 1 }
        }),
        /* @__PURE__ */ jsx2(Typography, {
          noWrap: true,
          children: "Connect Wallet"
        })
      ]
    })
  });
}

// src/WalletModel.tsx
import {
  Box,
  Button as Button2,
  ListItem as ListItem2,
  ListItemAvatar,
  ListItemButton as ListItemButton2,
  ListItemText as ListItemText2,
  Typography as Typography2,
  useTheme,
  Grid,
  IconButton,
  Dialog,
  Stack as Stack2
} from "@mui/material";
import { useWallet as useWallet3 } from "@aptos-labs/wallet-adapter-react";

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
import LanOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { Fragment as Fragment2, jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function WalletsModal({
  handleClose,
  modalOpen,
  networkSupport
}) {
  const { wallets, connect } = useWallet3();
  const theme = useTheme();
  const onWalletSelect = (walletName) => {
    connect(walletName);
    handleClose();
  };
  const renderWalletsList = () => {
    return wallets.map((wallet) => {
      const option = wallet;
      const icon = option.icon;
      return /* @__PURE__ */ jsx3(Grid, {
        xs: 12,
        paddingY: 0.5,
        children: wallet.readyState === "Installed" ? /* @__PURE__ */ jsx3(ListItem2, {
          disablePadding: true,
          children: /* @__PURE__ */ jsxs3(ListItemButton2, {
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
              /* @__PURE__ */ jsx3(ListItemAvatar, {
                sx: {
                  display: "flex",
                  alignItems: "center",
                  width: "2rem",
                  height: "2rem",
                  minWidth: "0",
                  color: `${theme.palette.text.primary}`
                },
                children: /* @__PURE__ */ jsx3(Box, {
                  component: "img",
                  src: icon,
                  sx: { width: "100%", height: "100%" }
                })
              }),
              /* @__PURE__ */ jsx3(ListItemText2, {
                primary: option.name,
                primaryTypographyProps: {
                  fontSize: 18
                }
              }),
              /* @__PURE__ */ jsx3(Button2, {
                variant: "contained",
                size: "small",
                className: "wallet-connect-button",
                children: "Connect"
              })
            ]
          })
        }) : /* @__PURE__ */ jsxs3(ListItem2, {
          alignItems: "center",
          sx: {
            borderRadius: `${theme.shape.borderRadius}px`,
            background: theme.palette.mode === "dark" ? grey[700] : grey[200],
            padding: "1rem 3rem",
            gap: "1rem"
          },
          children: [
            /* @__PURE__ */ jsx3(ListItemAvatar, {
              sx: {
                display: "flex",
                alignItems: "center",
                width: "2rem",
                height: "2rem",
                minWidth: "0",
                opacity: "0.25"
              },
              children: /* @__PURE__ */ jsx3(Box, {
                component: "img",
                src: icon,
                sx: { width: "100%", height: "100%" }
              })
            }),
            /* @__PURE__ */ jsx3(ListItemText2, {
              sx: {
                opacity: "0.25"
              },
              primary: option.name,
              primaryTypographyProps: {
                fontSize: 18
              }
            }),
            /* @__PURE__ */ jsx3(Button2, {
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
  return /* @__PURE__ */ jsx3(Dialog, {
    open: modalOpen,
    onClose: handleClose,
    "aria-labelledby": "wallet selector modal",
    "aria-describedby": "select a wallet to connect",
    sx: { borderRadius: "5px" },
    children: /* @__PURE__ */ jsxs3(Stack2, {
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
        /* @__PURE__ */ jsx3(IconButton, {
          onClick: handleClose,
          sx: {
            position: "absolute",
            right: 12,
            top: 12,
            color: grey[450]
          },
          children: /* @__PURE__ */ jsx3(CloseIcon, {})
        }),
        /* @__PURE__ */ jsx3(Typography2, {
          align: "center",
          variant: "h5",
          pt: 2,
          children: "Connect Wallet"
        }),
        /* @__PURE__ */ jsx3(Box, {
          sx: {
            display: "flex",
            gap: 0.5,
            alignItems: "center",
            justifyContent: "center",
            mb: 4
          },
          children: networkSupport && /* @__PURE__ */ jsxs3(Fragment2, {
            children: [
              /* @__PURE__ */ jsx3(LanOutlinedIcon, {
                sx: {
                  fontSize: "0.9rem",
                  color: grey[400]
                }
              }),
              /* @__PURE__ */ jsxs3(Typography2, {
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
        /* @__PURE__ */ jsx3(Box, {
          children: renderWalletsList()
        })
      ]
    })
  });
}

// src/index.tsx
import { Fragment as Fragment3, jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
function WalletConnector({
  networkSupport,
  handleNavigate
}) {
  const [modalOpen, setModalOpen] = useState3(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  return /* @__PURE__ */ jsxs4(Fragment3, {
    children: [
      /* @__PURE__ */ jsx4(WalletButton, {
        handleModalOpen,
        handleNavigate
      }),
      /* @__PURE__ */ jsx4(WalletsModal, {
        handleClose,
        modalOpen,
        networkSupport
      })
    ]
  });
}
export {
  WalletConnector as default
};
