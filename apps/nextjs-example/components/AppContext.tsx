import { BloctoWallet } from "@blocto/aptos-wallet-adapter-plugin";
import { FaceWallet } from "@haechi-labs/face-aptos-adapter-plugin";
import { FewchaWallet } from "fewcha-plugin-wallet-adapter";
import { FlipperWallet } from "@flipperplatform/wallet-adapter-plugin";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { NightlyWallet } from "@nightlylabs/aptos-wallet-adapter-plugin";
import { OpenBlockWallet } from "@openblockhq/aptos-wallet-adapter";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { PontemWallet } from "@pontem/wallet-adapter-plugin";
import { RiseWallet } from "@rise-wallet/wallet-adapter";
import { TokenPocketWallet } from "@tp-lab/aptos-wallet-adapter";
import { TrustWallet } from "@trustwallet/aptos-wallet-adapter";
import { MSafeWalletAdapter } from "@msafe/aptos-wallet-adapter";
import { WelldoneWallet } from "@welldone-studio/aptos-wallet-adapter";
import {
  AptosWalletAdapterProvider,
  NetworkName,
} from "@aptos-labs/wallet-adapter-react";
import { AutoConnectProvider, useAutoConnect } from "./AutoConnectProvider";
import { FC, ReactNode } from "react";
import face from "../lib/faceInitialization";
import { AlertProvider, useAlert } from "./AlertProvider";
import { IdentityConnectWallet } from "@identity-connect/wallet-adapter-plugin";

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { autoConnect } = useAutoConnect();
  const { setErrorAlertMessage } = useAlert();

  const wallets = [
    // TODO IdentityConnectWallet and BloctoWallet to use Network enum from @aptos-labs/ts-sdk
    new IdentityConnectWallet("57fa42a9-29c6-4f1e-939c-4eefa36d9ff5", {
      networkName: NetworkName.Testnet,
    }),
    // Blocto supports Testnet/Mainnet for now.
    new BloctoWallet({
      network: NetworkName.Testnet,
      bloctoAppId: "6d85f56e-5f2e-46cd-b5f2-5cf9695b4d46",
    }),
    new FaceWallet(face!),
    new FewchaWallet(),
    new FlipperWallet(),
    new MartianWallet(),
    new MSafeWalletAdapter(),
    new NightlyWallet(),
    new OpenBlockWallet(),
    new PetraWallet(),
    new PontemWallet(),
    new RiseWallet(),
    new TokenPocketWallet(),
    new TrustWallet(),
    new WelldoneWallet(),
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
