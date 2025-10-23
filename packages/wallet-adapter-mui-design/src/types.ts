import { WalletSortingOptions } from "@aptos-labs/wallet-adapter-react";
import { Breakpoint } from "@mui/material";

export interface WalletConnectorProps extends WalletSortingOptions {
  networkSupport?: string;
  handleNavigate?: () => void;
  /** The max width of the wallet selector modal. Defaults to `xs`. */
  modalMaxWidth?: Breakpoint;
  crossChainWallets?: {
    evm: boolean;
    solana: boolean;
  };
}
