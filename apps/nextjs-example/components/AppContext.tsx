import { PetraWallet, MartianWallet, RiseWallet } from "../wallets";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import {
  AutoConnectProvider,
  useAutoConnect,
} from "../components/AutoConnectProvider";
import { FC, ReactNode } from "react";

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { autoConnect } = useAutoConnect();
  console.log(autoConnect);

  const wallets = [new PetraWallet(), new MartianWallet(), new RiseWallet()];

  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={autoConnect}>
      {children}
    </AptosWalletAdapterProvider>
  );
};

export const AppContext: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AutoConnectProvider>
      <WalletContextProvider>{children}</WalletContextProvider>
    </AutoConnectProvider>
  );
};
