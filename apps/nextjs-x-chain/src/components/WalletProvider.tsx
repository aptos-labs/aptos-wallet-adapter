"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { setupAutomaticEthereumWalletDerivation } from "@aptos-labs/derived-wallet-ethereum";
import { setupAutomaticSolanaWalletDerivation } from "@aptos-labs/derived-wallet-solana";
import { setupAutomaticSuiWalletDerivation } from "@aptos-labs/derived-wallet-sui";
import { PropsWithChildren } from "react";
import { useClaimSecretKey } from "@/hooks/useClaimSecretKey";
import { useAutoConnect } from "./AutoConnectProvider";
import { useToast } from "./ui/use-toast";
import { DAPP_NETWORK } from "@/config";

setupAutomaticEthereumWalletDerivation({ defaultNetwork: DAPP_NETWORK });
setupAutomaticSolanaWalletDerivation({ defaultNetwork: DAPP_NETWORK });
setupAutomaticSuiWalletDerivation({ defaultNetwork: DAPP_NETWORK });

let dappImageURI: string | undefined;
if (typeof window !== "undefined") {
  dappImageURI = `${window.location.origin}${window.location.pathname}favicon.ico`;
}

export const WalletProvider = ({ children }: PropsWithChildren) => {
  const { autoConnect } = useAutoConnect();
  const { toast } = useToast();

  // Enables claim flow when the `claim` query param is detected
  const claimSecretKey = useClaimSecretKey();

  return (
    <AptosWalletAdapterProvider
      autoConnect={autoConnect}
      dappConfig={{
        network: DAPP_NETWORK,
        aptosApiKeys: {
          testnet: process.env.NEXT_PUBLIC_APTOS_API_KEY_TESNET,
          devnet: process.env.NEXT_PUBLIC_APTOS_API_KEY_DEVNET,
          mainnet: process.env.NEXT_PUBLIC_APTOS_API_KEY_MAINNET,
        },
        aptosConnect: {
          claimSecretKey,
          dappId: "57fa42a9-29c6-4f1e-939c-4eefa36d9ff5",
          dappImageURI,
        },
        crossChainWallets: true,
      }}
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
