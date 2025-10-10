"use client";

import {
  AptosWalletAdapterProvider,
  DappConfig,
} from "@aptos-labs/wallet-adapter-react";
import { setupAutomaticEthereumWalletDerivation } from "@aptos-labs/derived-wallet-ethereum";
import { setupAutomaticSolanaWalletDerivation } from "@aptos-labs/derived-wallet-solana";
import { PropsWithChildren } from "react";
import { Network } from "@aptos-labs/ts-sdk";
import { useClaimSecretKey } from "@/hooks/useClaimSecretKey";
import { useAutoConnect } from "./AutoConnectProvider";
import { useToast } from "./ui/use-toast";
import { myTransactionSubmitter } from "@/utils/transactionSubmitter";
import { useTransactionSubmitter } from "./TransactionSubmitterProvider";

const searchParams =
  typeof window !== "undefined"
    ? new URL(window.location.href).searchParams
    : undefined;
const deriveWalletsFrom = searchParams?.get("deriveWalletsFrom")?.split(",");
if (deriveWalletsFrom?.includes("ethereum")) {
  setupAutomaticEthereumWalletDerivation({ defaultNetwork: Network.TESTNET });
}
if (deriveWalletsFrom?.includes("solana")) {
  setupAutomaticSolanaWalletDerivation({ defaultNetwork: Network.TESTNET });
}

let dappImageURI: string | undefined;
if (typeof window !== "undefined") {
  dappImageURI = `${window.location.origin}${window.location.pathname}favicon.ico`;
}

export const WalletProvider = ({ children }: PropsWithChildren) => {
  const { autoConnect } = useAutoConnect();
  const { toast } = useToast();
  const { useCustomSubmitter } = useTransactionSubmitter();

  // Enables claim flow when the `claim` query param is detected
  const claimSecretKey = useClaimSecretKey();

  const dappConfig: DappConfig = {
    network: Network.TESTNET,
    aptosApiKeys: {
      testnet: process.env.NEXT_PUBLIC_APTOS_API_KEY_TESNET,
      devnet: process.env.NEXT_PUBLIC_APTOS_API_KEY_DEVNET,
    },
    aptosConnect: {
      claimSecretKey,
      dappId: "57fa42a9-29c6-4f1e-939c-4eefa36d9ff5",
      dappImageURI,
    },
    transactionSubmitter: useCustomSubmitter
      ? myTransactionSubmitter
      : undefined,
  };

  return (
    <AptosWalletAdapterProvider
      key={useCustomSubmitter ? "custom" : "default"}
      autoConnect={autoConnect}
      dappConfig={dappConfig}
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
