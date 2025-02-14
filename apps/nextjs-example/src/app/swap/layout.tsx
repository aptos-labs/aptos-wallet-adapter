"use client";

import { AptosCrossChainWalletProvider } from "@aptos-labs/cross-chain-react";
import { Network } from "@aptos-labs/ts-sdk";
import { ReactNode } from "react";

export default function SwapLayout({ children }: { children: ReactNode }) {
  return (
    <AptosCrossChainWalletProvider
      dappConfig={{
        network: Network.TESTNET,
      }}
    >
      {children}
    </AptosCrossChainWalletProvider>
  );
}
