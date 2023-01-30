import {
  Box,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme,
  Grid,
  IconButton,
  Dialog,
  Stack,
} from "@mui/material";
import { useWallet, WalletName } from "@aptos-labs/wallet-adapter-react";
import { grey } from "./aptosColorPalette";
import LanOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CloseIcon from "@mui/icons-material/Close";

type WalletsModalProps = {
  handleClose: () => void;
  modalOpen: boolean;
  networkSupport?: string;
};

export default function WalletsModal({
  handleClose,
  modalOpen,
  networkSupport,
}: WalletsModalProps): JSX.Element {
  const { wallets, connect } = useWallet();

  const theme = useTheme();

  const onWalletSelect = (walletName: WalletName) => {
    connect(walletName);
    handleClose();
  };

  const renderWalletsList = () => {
    return wallets.map((wallet) => {
      const option = wallet;
      const icon = option.icon;
      return (
        <Grid key={option.name} xs={12} paddingY={0.5} item>
          {wallet.readyState === "Installed" ? (
            <ListItem disablePadding>
              <ListItemButton
                alignItems="center"
                disableGutters
                onClick={() => onWalletSelect(option.name)}
                sx={{
                  background:
                    theme.palette.mode === "dark" ? grey[700] : grey[200],
                  padding: "1rem 3rem",
                  borderRadius: "10px",
                  display: "flex",
                  gap: "1rem",
                }}
              >
                <ListItemAvatar
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "2rem",
                    height: "2rem",
                    minWidth: "0",
                    color: `${theme.palette.text.primary}`,
                  }}
                >
                  <Box
                    component="img"
                    src={icon}
                    sx={{ width: "100%", height: "100%" }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={option.name}
                  primaryTypographyProps={{
                    fontSize: 18,
                  }}
                />
                <Button
                  variant="contained"
                  size="small"
                  className="wallet-connect-button"
                >
                  Connect
                </Button>
              </ListItemButton>
            </ListItem>
          ) : (
            <ListItem
              alignItems="center"
              sx={{
                borderRadius: `${theme.shape.borderRadius}px`,
                background:
                  theme.palette.mode === "dark" ? grey[700] : grey[200],
                padding: "1rem 3rem",
                gap: "1rem",
              }}
            >
              <ListItemAvatar
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "2rem",
                  height: "2rem",
                  minWidth: "0",
                  opacity: "0.25",
                }}
              >
                <Box
                  component="img"
                  src={icon}
                  sx={{ width: "100%", height: "100%" }}
                />
              </ListItemAvatar>
              <ListItemText
                sx={{
                  opacity: "0.25",
                }}
                primary={option.name}
                primaryTypographyProps={{
                  fontSize: 18,
                }}
              />
              <Button
                LinkComponent={"a"}
                href={option.url}
                target="_blank"
                size="small"
                className="wallet-connect-install"
              >
                Install
              </Button>
            </ListItem>
          )}
        </Grid>
      );
    });
  };

  return (
    <Dialog
      open={modalOpen}
      onClose={handleClose}
      aria-labelledby="wallet selector modal"
      aria-describedby="select a wallet to connect"
      sx={{ borderRadius: "5px" }}
    >
      <Stack
        sx={{
          display: "flex",
          flexDirection: "column",
          top: "50%",
          left: "50%",
          width: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
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
        <Typography align="center" variant="h5" pt={2}>
          Connect Wallet
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            alignItems: "center",
            justifyContent: "center",
            mb: 4,
          }}
        >
          {networkSupport && (
            <>
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
            </>
          )}
        </Box>
        <Box>{renderWalletsList()}</Box>
      </Stack>
    </Dialog>
  );
}
