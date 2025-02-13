import { truncateAddress } from '@aptos-labs/wallet-adapter-core';
import type { ConnectedWallet } from "@aptos-labs/wallet-adapter-react/new";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React, { useState } from "react";
import { useDisclosure } from './useDisclosure';

type AccountInfo = ConnectedWallet['activeAccount'];

type ConnectedWalletButtonProps = {
  wallet: ConnectedWallet;
  onNavigate?: (account: AccountInfo) => unknown;
};

export default function ConnectedWalletButton({
  wallet,
  onNavigate,
}: ConnectedWalletButtonProps) {
  const { anchorElement, isOpen, onOpen, onClose } = useDisclosure();

  const [isCopyTooltipOpen, setIsCopyTooltipOpen] = useState<boolean>(false);
  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(wallet.activeAccount.address.toString());
    setIsCopyTooltipOpen(true);
    setTimeout(() => {
      setIsCopyTooltipOpen(false);
    }, 2000);
  };

  const handleNavigate = onNavigate && (() => {
    onNavigate(wallet.activeAccount);
    onClose();
  });

  const handleLogout = async () => {
    await wallet.disconnect();
    onClose();
  };

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
        <Avatar
          alt={wallet.name}
          src={wallet.icon}
          sx={{ width: 24, height: 24 }}
        />
        <Typography noWrap ml={2}>
          {truncateAddress(wallet.activeAccount.address.toString())}
        </Typography>
      </Button>
      {/* Menu */}
      <Menu
        anchorEl={anchorElement}
        open={isOpen}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Tooltip
          title="Copied"
          placement="bottom-end"
          open={isCopyTooltipOpen}
          disableFocusListener
          disableHoverListener
          disableTouchListener
        >
          <MenuItem onClick={handleCopyAddress}>
            Copy Address
          </MenuItem>
        </Tooltip>
        {
          handleNavigate && (
            <MenuItem onClick={handleNavigate}>
              Account
            </MenuItem>
          )
        }
        <MenuItem onClick={handleLogout}>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
