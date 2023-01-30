import { Avatar, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import WalletMenu from "./WalletMenu";
import React from "react";
import { truncateAddress } from "./utils";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";

type WalletButtonProps = {
  handleModalOpen: () => void;
  handleNavigate?: () => void;
};

export default function WalletButton({
  handleModalOpen,
  handleNavigate,
}: WalletButtonProps): JSX.Element {
  const { connected, account, wallet } = useWallet();

  const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(
    null
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
        onClick={connected ? handleClick : onConnectWalletClick}
        className="wallet-button"
        sx={{ borderRadius: "10px" }}
      >
        {connected ? (
          <>
            <Avatar
              alt={wallet?.name}
              src={wallet?.icon}
              sx={{ width: 24, height: 24 }}
            />
            <Typography noWrap ml={2}>
              {truncateAddress(account?.address!)}
            </Typography>
          </>
        ) : (
          <>
            <AccountBalanceWalletOutlinedIcon sx={{ marginRight: 1 }} />
            <Typography noWrap>Connect Wallet</Typography>
          </>
        )}
      </Button>
      <WalletMenu
        popoverAnchor={popoverAnchor}
        handlePopoverClose={handlePopoverClose}
        handleNavigate={handleNavigate}
      />
    </>
  );
}
