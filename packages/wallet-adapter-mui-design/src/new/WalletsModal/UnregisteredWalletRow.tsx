/* eslint-disable @next/next/no-img-element */

import type { DiscoverableWallet } from '@aptos-labs/wallet-adapter-core/new';
import { Box, Button, ListItem, ListItemText, useTheme } from '@mui/material';
import { grey } from '../../aptosColorPalette';

export interface UnregisteredWalletRowProps {
  wallet: DiscoverableWallet;
}

export function UnregisteredWalletRow({ wallet }: UnregisteredWalletRowProps) {
  const theme = useTheme();

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
          LinkComponent={"a"}
          size="small"
          className="wallet-connect-install"
          href={wallet.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Install
        </Button>
      </Box>
    </ListItem>
  );
}
