"use client";

import { Network } from "@aptos-labs/ts-sdk";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { BitgetWallet } from "@bitget-wallet/aptos-wallet-adapter";
import { IdentityConnectWallet } from "@identity-connect/wallet-adapter-plugin";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { MSafeWalletAdapter } from "@msafe/aptos-wallet-adapter";
import { OKXWallet } from "@okwallet/aptos-wallet-adapter";
import { PontemWallet } from "@pontem/wallet-adapter-plugin";
import { TrustWallet } from "@trustwallet/aptos-wallet-adapter";
import { FewchaWallet } from "fewcha-plugin-wallet-adapter";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { PropsWithChildren } from "react";
import { useToast } from "./ui/use-toast";

export const WalletProvider = ({ children }: PropsWithChildren) => {
  const { toast } = useToast();

  const wallets = [
    new IdentityConnectWallet("57fa42a9-29c6-4f1e-939c-4eefa36d9ff5", {
      networkName: Network.TESTNET,
    }),
    new BitgetWallet(),
    new FewchaWallet(),
    new MartianWallet(),
    new MSafeWalletAdapter(),
    new PontemWallet(),
    new TrustWallet(),
    new OKXWallet(),
    new PetraWallet(),
  ];

  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={true}
      onError={(error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error || "Unknown wallet error",
        });
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};
