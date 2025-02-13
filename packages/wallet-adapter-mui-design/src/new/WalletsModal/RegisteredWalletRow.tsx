/* eslint-disable @next/next/no-img-element */

import { WalletAdapter } from '@aptos-labs/wallet-adapter-core/new';
import { setActiveWalletId } from '@aptos-labs/wallet-adapter-react/new';
import { Box, Button, ListItem, ListItemText, useTheme } from '@mui/material';
import { grey } from '../../aptosColorPalette';

export interface WalletRowProps {
  wallet: WalletAdapter;
  onConnect?: () => void;
}

export function RegisteredWalletRow({ wallet, onConnect }: WalletRowProps) {
  const theme = useTheme();

  const handleConnect = async () => {
    const response = await wallet.connect();
    if (response.status === 'Approved') {
      setActiveWalletId(wallet.name);
      onConnect?.();
    }
  };

  return (
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
        <Box sx={{ width: 32, height: 32 }}>
          <img src={wallet.icon} alt={`${wallet.name} icon`} />
        </Box>
        <ListItemText
          primary={wallet.name}
          primaryTypographyProps={{ fontSize: "1.125rem" }}
        />
        <Button
          variant="contained"
          size="small"
          className="wallet-connect-button"
          onClick={handleConnect}
        >
          Connect
        </Button>
      </Box>
    </ListItem>
  );
}
