import { RiseWallet } from "@rise-wallet/wallet-adapter";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { PontemWallet } from "@pontem/wallet-adapter-plugin";
import { TrustWallet } from "@trustwallet/aptos-wallet-adapter";
import { SpikaWallet } from "@spika/aptos-plugin";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { FewchaWallet } from "fewcha-plugin-wallet-adapter";
import {
  AutoConnectProvider,
  useAutoConnect,
} from "../components/AutoConnectProvider";
import { FC, ReactNode } from "react";

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { autoConnect } = useAutoConnect();

  const wallets = [
    new PetraWallet(),
    new MartianWallet(),
    new RiseWallet(),
    new PontemWallet(),
    new TrustWallet(),
    new SpikaWallet(),
    new FewchaWallet(),
  ];

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
