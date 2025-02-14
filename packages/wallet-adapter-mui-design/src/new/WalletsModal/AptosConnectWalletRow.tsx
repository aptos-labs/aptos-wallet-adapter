/* eslint-disable @next/next/no-img-element */

import { WalletAdapter } from '@aptos-labs/wallet-adapter-core/new';
import { setActiveWalletId } from '@aptos-labs/wallet-adapter-react/new';
import { Box, Button } from '@mui/material';

export interface AptosConnectWalletRowProps {
  wallet: WalletAdapter;
  onConnect?: () => void;
}

export function AptosConnectWalletRow({ wallet, onConnect }: AptosConnectWalletRowProps) {
  const handleConnect = async () => {
    const response = await wallet.connect();
    if (response.status === 'Approved') {
      setActiveWalletId(wallet.name);
      onConnect?.();
    }
  };

  return (
    <Button
      size="large"
      variant="outlined"
      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
      onClick={handleConnect}
    >
      <Box sx={{ width: 20, height: 20 }}>
        <img src={wallet.icon} alt={`${wallet.name} icon`} />
      </Box>
      <div>{wallet.name}</div>
    </Button>
  );
}
