import { useActiveWallet } from '@aptos-labs/wallet-adapter-react/new';
import { Breakpoint } from "@mui/material";
import React from "react";
import ConnectedWalletButton from './ConnectedWalletButton';
import DisconnectedWalletButton from './DisconnectedWalletButton';

export interface WalletConnectorProps {
  networkSupport?: string;
  onNavigate?: () => void;
  /** The max width of the wallet selector modal. Defaults to `xs`. */
  modalMaxWidth?: Breakpoint;
}

export function WalletConnector({
  networkSupport,
  onNavigate,
  modalMaxWidth,
}: WalletConnectorProps) {
  const activeWallet = useActiveWallet();

  if (activeWallet.isConnected) {
    return <ConnectedWalletButton wallet={activeWallet} onNavigate={onNavigate} />;
  } else {
    return <DisconnectedWalletButton networkSupport={networkSupport}
                                     modalMaxWidth={modalMaxWidth} />;
  }
}
