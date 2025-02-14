import { truncateAddress } from "@aptos-labs/wallet-adapter-react";
import { useActiveWallet } from "@aptos-labs/wallet-adapter-react/new";
import { AccountBalanceWalletOutlined as AccountBalanceWalletOutlinedIcon } from "@mui/icons-material";
import { Avatar, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import WalletMenu from "./WalletMenu";

type WalletButtonProps = {
  handleModalOpen: () => void;
  handleNavigate?: () => void;
};

export default function WalletButton({
  handleModalOpen,
  handleNavigate,
}: WalletButtonProps): JSX.Element {
  const wallet = useActiveWallet();

  const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(
    null,
  );
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPopoverAnchor(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
  };

  const onConnectWalletClick = () => {
    handlePopoverClose();
    handleModalOpen();
  };

  return (
    <>
      <Button
        size="large"
        variant="contained"
        onClick={wallet.isConnected ? handleClick : onConnectWalletClick}
        className="wallet-button"
        sx={{ borderRadius: "10px" }}
      >
        {wallet.isConnected ? (
          <>
            <Avatar
              alt={wallet.name}
              src={wallet.icon}
              sx={{ width: 24, height: 24 }}
            />
            <Typography noWrap ml={2}>
              {truncateAddress(wallet.activeAccount.address.toString())}
            </Typography>
          </>
        ) : (
          <>
            <AccountBalanceWalletOutlinedIcon sx={{ marginRight: 1 }} />
            <Typography noWrap>Connect Wallet</Typography>
          </>
        )}
      </Button>
      {wallet.isConnected ? <WalletMenu
        wallet={wallet}
        popoverAnchor={popoverAnchor}
        handlePopoverClose={handlePopoverClose}
        handleNavigate={handleNavigate}
      /> : null}
    </>
  );
}
