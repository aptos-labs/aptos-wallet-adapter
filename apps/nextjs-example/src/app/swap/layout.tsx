"use client";

import { useToast } from "@/components/ui/use-toast";
import { AptosCrossChainWalletProvider } from "@aptos-labs/cross-chain-react";
import { Network } from "@aptos-labs/ts-sdk";
import { ReactNode } from "react";

export default function SwapLayout({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  return (
    <AptosCrossChainWalletProvider
      dappConfig={{
        network: Network.TESTNET,
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
    </AptosCrossChainWalletProvider>
  );
}
