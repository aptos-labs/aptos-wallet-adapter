import { AccountBalanceWalletOutlined as AccountBalanceWalletOutlinedIcon } from '@mui/icons-material';
import { Breakpoint } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React from "react";
import { useDisclosure } from './useDisclosure';
import { WalletsModal } from './WalletsModal';

export interface DisconnectedWalletButtonProps {
  networkSupport?: string;
  /** The max width of the wallet selector modal. Defaults to `xs`. */
  modalMaxWidth?: Breakpoint;
}

export default function DisconnectedWalletButton({
  networkSupport,
  modalMaxWidth,
}: DisconnectedWalletButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {/* Trigger */}
      <Button
        size="large"
        variant="contained"
        onClick={onOpen}
        className="wallet-button"
        sx={{ borderRadius: "10px" }}
      >
        <AccountBalanceWalletOutlinedIcon sx={{ marginRight: 1 }} />
        <Typography noWrap>Connect Wallet</Typography>
      </Button>
      {/* Modal */}
      <WalletsModal
        onClose={onClose}
        isOpen={isOpen}
        networkSupport={networkSupport}
        modalMaxWidth={modalMaxWidth}
      />
    </>
  );
}
