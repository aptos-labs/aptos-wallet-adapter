import { WalletAdapter } from '@aptos-labs/wallet-adapter-core/new';
import { AboutAptosConnect, AptosPrivacyPolicy } from '@aptos-labs/wallet-adapter-react';
import { ArrowForward } from '@mui/icons-material';
import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import { grey } from '../../aptosColorPalette';
import { AptosConnectWalletRow } from './AptosConnectWalletRow';

export interface AptosConnectSection {
  acWallets: WalletAdapter[];
  onConnect: () => void;
}

export function AptosConnectSection({ acWallets, onConnect }: AptosConnectSection) {
  const theme = useTheme();

  return (
    <Stack gap={1}>
      {acWallets.map((wallet) => (
        <AptosConnectWalletRow
          key={wallet.name}
          wallet={wallet}
          onConnect={onConnect}
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
            background: "none",
            border: "none",
            fontFamily: "inherit",
            fontSize: "inherit",
            cursor: "pointer",
            display: "flex",
            gap: 0.5,
            px: 0,
            py: 1.5,
            alignItems: "center",
            color: theme.palette.text.primary,
            appearance: "none",
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
  );
}
