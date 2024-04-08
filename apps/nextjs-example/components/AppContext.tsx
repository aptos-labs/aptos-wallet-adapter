import { BitgetWallet } from "@bitget-wallet/aptos-wallet-adapter";
import { FewchaWallet } from "fewcha-plugin-wallet-adapter";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { PontemWallet } from "@pontem/wallet-adapter-plugin";
import { TrustWallet } from "@trustwallet/aptos-wallet-adapter";
import { MSafeWalletAdapter } from "@msafe/aptos-wallet-adapter";
import { OKXWallet } from "@okwallet/aptos-wallet-adapter";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { AutoConnectProvider, useAutoConnect } from "./AutoConnectProvider";
import { FC, ReactNode } from "react";
import { AlertProvider, useAlert } from "./AlertProvider";
import { IdentityConnectWallet } from "@identity-connect/wallet-adapter-plugin";
import { Network } from "@aptos-labs/ts-sdk";

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { autoConnect } = useAutoConnect();
  const { setErrorAlertMessage } = useAlert();

  const wallets = [
    new IdentityConnectWallet("57fa42a9-29c6-4f1e-939c-4eefa36d9ff5", {
      networkName: Network.TESTNET,
    }),
    new BitgetWallet(),
    new FewchaWallet(),
    new MartianWallet(),
    new MSafeWalletAdapter(),
    new PetraWallet(),
    new PontemWallet(),
    new TrustWallet(),
    new OKXWallet(),
  ];

  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={autoConnect}
      onError={(error) => {
        console.log("Custom error handling", error);
        setErrorAlertMessage(error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};

export const AppContext: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AutoConnectProvider>
      <AlertProvider>
        <WalletContextProvider>{children}</WalletContextProvider>
      </AlertProvider>
    </AutoConnectProvider>
  );
};
