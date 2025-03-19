import { WalletAdapter } from "@aptos-labs/wallet-adapter-core/new";
import { AboutAptosConnect } from "@aptos-labs/wallet-adapter-react";
import { useWalletManager } from "@aptos-labs/wallet-adapter-react/new";
import { Close as CloseIcon, ExpandMore, LanOutlined as LanOutlinedIcon } from "@mui/icons-material";
import { Box, Breakpoint, Button, Collapse, Dialog, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { useMemo, useState } from "react";
import { grey } from "../../aptosColorPalette";
import { AptosConnectEducationScreen } from '../../AptosConnectEducationScreen';
import { AptosConnectSection } from './AptosConnectSection';
import { RegisteredWalletRow } from "./RegisteredWalletRow";
import { UnregisteredWalletRow } from './UnregisteredWalletRow';

export interface WalletsModalProps {
  onClose: () => void;
  isOpen: boolean;
  networkSupport?: string;
  modalMaxWidth?: Breakpoint;
}

export function WalletsModal({
  onClose,
  isOpen,
  networkSupport,
  modalMaxWidth,
}: WalletsModalProps) {
  const theme = useTheme();
  const [showUnregisteredWallets, setShowUnregisteredWallets] = useState(false);

  const { registeredWallets, unregisteredWallets } = useWalletManager();
  const [acWallets, otherWallets] = useMemo(() => {
    const acWallets: WalletAdapter[] = [];
    const otherWallets: WalletAdapter[] = [];
    for (const wallet of registeredWallets) {
      const isAcWallet = wallet.name.includes('Continue with');
      (isAcWallet ? acWallets : otherWallets).push(wallet);
    }
    return [acWallets, otherWallets];
  }, [registeredWallets]);

  const dialogTitle = acWallets.length > 0 ?
    <span>Log in or sign up <br /> with Social + Aptos Connect</span> : "Connect Wallet";

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-label="wallet selector modal"
      sx={{ borderRadius: `${theme.shape.borderRadius}px` }}
      maxWidth={modalMaxWidth ?? "xs"}
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
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: grey[450],
          }}
        >
          <CloseIcon />
        </IconButton>
        {/* Wrapper that will conditionally render the education screen when AboutAptosConnect.Trigger is pressed,
        instead of `children` */}
        <AboutAptosConnect renderEducationScreen={AptosConnectEducationScreen}>
          <Typography
            align="center"
            variant="h5"
            component="h2"
            pt={2}
          >
            {dialogTitle}
          </Typography>
          {networkSupport && (
            <Box sx={{ display: "flex", gap: 0.5, alignItems: "center", justifyContent: "center" }}>
              <LanOutlinedIcon sx={{ fontSize: "0.9rem", color: grey[400] }} />
              <Typography sx={{ display: "inline-flex", fontSize: "0.9rem", color: grey[400] }} align="center">
                {networkSupport} only
              </Typography>
            </Box>
          )}
          {acWallets.length > 0 && (
            <AptosConnectSection
              acWallets={acWallets}
              onConnect={onClose}
            />
          )}
          <Stack sx={{ gap: 1 }}>
            {otherWallets.map((wallet) => (
              <RegisteredWalletRow
                key={wallet.name}
                wallet={wallet}
                onConnect={onClose}
              />
            ))}
            {unregisteredWallets.length > 0 ? (
              <>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setShowUnregisteredWallets((prev) => !prev)}
                  endIcon={
                    <ExpandMore sx={{ height: "20px", width: "20px" }} />
                  }
                >
                  More Wallets
                </Button>
                <Collapse in={showUnregisteredWallets} timeout="auto" unmountOnExit>
                  <Stack sx={{ gap: 1 }}>
                    {unregisteredWallets.map((wallet) => (
                      <UnregisteredWalletRow
                        key={wallet.name}
                        wallet={wallet}
                      />
                    ))}
                  </Stack>
                </Collapse>
              </>
            ) : null}
          </Stack>
        </AboutAptosConnect>
      </Stack>
    </Dialog>
  );
}
