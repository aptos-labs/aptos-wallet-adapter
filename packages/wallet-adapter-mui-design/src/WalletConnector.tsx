import { useState } from "react";
import WalletButton from "./WalletButton";
import WalletsModal from "./WalletModel";
import { WalletConnectorProps } from "./types";

export function WalletConnector({
  networkSupport,
  handleNavigate,
  modalMaxWidth,
  crossChainWallets,
  ...walletSortingOptions
}: WalletConnectorProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  return (
    <>
      <WalletButton
        handleModalOpen={handleModalOpen}
        handleNavigate={handleNavigate}
      />
      <WalletsModal
        handleClose={handleClose}
        modalOpen={modalOpen}
        networkSupport={networkSupport}
        modalMaxWidth={modalMaxWidth}
        crossChainWallets={crossChainWallets}
        {...walletSortingOptions}
      />
    </>
  );
}
