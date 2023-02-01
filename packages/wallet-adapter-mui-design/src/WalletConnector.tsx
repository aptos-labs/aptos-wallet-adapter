import { useState } from "react";
import WalletButton from "./WalletButton";
import WalletsModal from "./WalletModel";

type WalletConnectorProps = {
  networkSupport?: string;
  handleNavigate?: () => void;
};

export function WalletConnector({
  networkSupport,
  handleNavigate,
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
      />
    </>
  );
}
