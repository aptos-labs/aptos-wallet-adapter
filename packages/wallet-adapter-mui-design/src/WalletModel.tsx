import {
  AboutAptosConnect,
  AboutAptosConnectEducationScreen,
  AnyAptosWallet,
  AptosPrivacyPolicy,
  WalletItem,
  getAptosConnectWallets,
  isInstallRequired,
  partitionWallets,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import {
  Box,
  Breakpoint,
  Button,
  Collapse,
  Dialog,
  Divider,
  IconButton,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { grey } from "./aptosColorPalette";
// reported bug with loading mui icons with esm, therefore need to import like this https://github.com/mui/material-ui/issues/35233
import {
  ArrowBack,
  ArrowForward,
  Close as CloseIcon,
  ExpandMore,
  LanOutlined as LanOutlinedIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { WalletConnectorProps } from "./WalletConnector";

interface WalletsModalProps
  extends Pick<
    WalletConnectorProps,
    "networkSupport" | "sortDefaultWallets" | "sortMoreWallets"
  > {
  handleClose: () => void;
  modalOpen: boolean;
  maxWidth?: Breakpoint;
}

export default function WalletsModal({
  handleClose,
  modalOpen,
  networkSupport,
  sortDefaultWallets,
  sortMoreWallets,
  maxWidth,
}: WalletsModalProps): JSX.Element {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const { wallets = [] } = useWallet();

  const {
    /** Wallets that use social login to create an account on the blockchain */
    aptosConnectWallets,
    /** Wallets that use traditional wallet extensions */
    otherWallets,
  } = getAptosConnectWallets(wallets);

  const {
    /** Wallets that are currently installed or loadable. */
    defaultWallets,
    /** Wallets that are NOT currently installed or loadable. */
    moreWallets,
  } = partitionWallets(otherWallets);

  if (sortDefaultWallets) defaultWallets.sort(sortDefaultWallets);
  if (sortMoreWallets) moreWallets.sort(sortMoreWallets);

  const hasAptosConnectWallets = !!aptosConnectWallets.length;

  return (
    <Dialog
      open={modalOpen}
      onClose={handleClose}
      aria-label="wallet selector modal"
      sx={{ borderRadius: `${theme.shape.borderRadius}px` }}
      maxWidth={maxWidth ?? "xs"}
      fullWidth
    >
      <Stack
        sx={{
          top: "50%",
          left: "50%",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
          gap: 2,
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: grey[450],
          }}
        >
          <CloseIcon />
        </IconButton>
        <AboutAptosConnect renderEducationScreen={renderEducationScreen}>
          <Typography
            align="center"
            variant="h5"
            component="h2"
            pt={2}
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {hasAptosConnectWallets ? (
              <>
                <span>Log in or sign up</span>
                <span>with Social + Aptos Connect</span>
              </>
            ) : (
              "Connect Wallet"
            )}
          </Typography>
          {networkSupport && (
            <Box
              sx={{
                display: "flex",
                gap: 0.5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LanOutlinedIcon
                sx={{
                  fontSize: "0.9rem",
                  color: grey[400],
                }}
              />
              <Typography
                sx={{
                  display: "inline-flex",
                  fontSize: "0.9rem",
                  color: grey[400],
                }}
                align="center"
              >
                {networkSupport} only
              </Typography>
            </Box>
          )}
          {hasAptosConnectWallets && (
            <Stack gap={1}>
              {aptosConnectWallets.map((wallet) => (
                <AptosConnectWalletRow
                  key={wallet.name}
                  wallet={wallet}
                  onConnect={handleClose}
                />
              ))}
              <Typography
                component="p"
                fontSize="14px"
                sx={{
                  display: "flex",
                  gap: 0.5,
                  justifyContent: "center",
                  alignItems: "center",
                  color: grey[400],
                }}
              >
                Learn more about{" "}
                <Box
                  component={AboutAptosConnect.Trigger}
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    py: 1.5,
                    alignItems: "center",
                    color: theme.palette.text.primary,
                  }}
                >
                  Aptos Connect <ArrowForward sx={{ height: 16, width: 16 }} />
                </Box>
              </Typography>

              <Stack
                component={AptosPrivacyPolicy}
                alignItems="center"
                py={0.5}
              >
                <Typography component="p" fontSize="12px" lineHeight="20px">
                  <AptosPrivacyPolicy.Disclaimer />{" "}
                  <Box
                    component={AptosPrivacyPolicy.Link}
                    sx={{
                      color: grey[400],
                      textDecoration: "underline",
                      textUnderlineOffset: "4px",
                    }}
                  />
                  <span>.</span>
                </Typography>
                <Box
                  component={AptosPrivacyPolicy.PoweredBy}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    fontSize: "12px",
                    lineHeight: "20px",
                    color: grey[400],
                  }}
                />
              </Stack>
              <Divider sx={{ color: grey[400], pt: 2 }}>Or</Divider>
            </Stack>
          )}
          <Stack sx={{ gap: 1 }}>
            {defaultWallets.map((wallet) => (
              <WalletRow
                key={wallet.name}
                wallet={wallet}
                onConnect={handleClose}
              />
            ))}
            {!!moreWallets.length && (
              <>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setExpanded((prev) => !prev)}
                  endIcon={
                    <ExpandMore sx={{ height: "20px", width: "20px" }} />
                  }
                >
                  More Wallets
                </Button>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <Stack sx={{ gap: 1 }}>
                    {moreWallets.map((wallet) => (
                      <WalletRow
                        key={wallet.name}
                        wallet={wallet}
                        onConnect={handleClose}
                      />
                    ))}
                  </Stack>
                </Collapse>
              </>
            )}
          </Stack>
        </AboutAptosConnect>
      </Stack>
    </Dialog>
  );
}

interface WalletRowProps {
  wallet: AnyAptosWallet;
  onConnect?: () => void;
}

function WalletRow({ wallet, onConnect }: WalletRowProps) {
  const theme = useTheme();
  return (
    <WalletItem wallet={wallet} onConnect={onConnect} asChild>
      <ListItem disablePadding>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            px: 2,
            py: 1.5,
            gap: 2,
            border: "solid 1px",
            borderColor: theme.palette.mode === "dark" ? grey[700] : grey[200],
            borderRadius: `${theme.shape.borderRadius}px`,
          }}
        >
          <Box component={WalletItem.Icon} sx={{ width: 32, height: 32 }} />
          <ListItemText
            primary={wallet.name}
            primaryTypographyProps={{ fontSize: "1.125rem" }}
          />
          {isInstallRequired(wallet) ? (
            <WalletItem.InstallLink asChild>
              <Button
                LinkComponent={"a"}
                size="small"
                className="wallet-connect-install"
              >
                Install
              </Button>
            </WalletItem.InstallLink>
          ) : (
            <WalletItem.ConnectButton asChild>
              <Button
                variant="contained"
                size="small"
                className="wallet-connect-button"
              >
                Connect
              </Button>
            </WalletItem.ConnectButton>
          )}
        </Box>
      </ListItem>
    </WalletItem>
  );
}

function AptosConnectWalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <WalletItem wallet={wallet} onConnect={onConnect} asChild>
      <WalletItem.ConnectButton asChild>
        <Button
          size="large"
          variant="outlined"
          sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
        >
          <Box component={WalletItem.Icon} sx={{ width: 20, height: 20 }} />
          <WalletItem.Name />
        </Button>
      </WalletItem.ConnectButton>
    </WalletItem>
  );
}

function renderEducationScreen(screen: AboutAptosConnectEducationScreen) {
  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 4fr 1fr",
          alignItems: "center",
          justifyItems: "start",
        }}
      >
        <IconButton onClick={screen.cancel}>
          <ArrowBack />
        </IconButton>
        <Typography variant="body1" component="h2" width="100%" align="center">
          About Aptos Connect
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          pb: 1.5,
          alignItems: "end",
          justifyContent: "center",
          height: "162px",
        }}
      >
        <screen.Graphic />
      </Box>
      <Stack sx={{ gap: 1, textAlign: "center", pb: 2 }}>
        <Typography component={screen.Title} variant="h6" />
        <Typography
          component={screen.Description}
          variant="body2"
          color={(theme) => theme.palette.text.secondary}
          sx={{
            "&>a": {
              color: (theme) => theme.palette.text.primary,
              textDecoration: "underline",
              textUnderlineOffset: "4px",
            },
          }}
        />
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          alignItems: "center",
        }}
      >
        <Button
          size="small"
          variant="text"
          onClick={screen.back}
          sx={{ placeSelf: "start" }}
        >
          Back
        </Button>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            placeSelf: "center",
          }}
        >
          {screen.screenIndicators.map((ScreenIndicator, i) => (
            <Box key={i} component={ScreenIndicator} sx={{ py: 2 }}>
              <Box
                sx={{
                  height: "2px",
                  width: "24px",
                  bgcolor: (theme) => theme.palette.text.disabled,
                  "[data-active]>&": {
                    bgcolor: (theme) => theme.palette.text.primary,
                  },
                }}
              />
            </Box>
          ))}
        </Box>
        <Button
          size="small"
          variant="text"
          onClick={screen.next}
          sx={{ placeSelf: "end" }}
          endIcon={<ArrowForward sx={{ height: 16, width: 16 }} />}
        >
          {screen.screenIndex === screen.totalScreens - 1 ? "Finish" : "Next"}
        </Button>
      </Box>
    </>
  );
}
