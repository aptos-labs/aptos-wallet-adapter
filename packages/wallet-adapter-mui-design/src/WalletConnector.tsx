import { useState } from "react";
import type { WalletConnectorProps } from "./types";
import WalletButton from "./WalletButton";
import WalletsModal from "./WalletModel";

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
