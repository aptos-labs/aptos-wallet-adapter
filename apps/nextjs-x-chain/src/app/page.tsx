"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { SingleSigner } from "@/components/transactionFlows/SingleSigner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// Imports for registering a browser extension wallet plugin on page load
import { MyWallet } from "@/utils/standardWallet";
import { Network } from "@aptos-labs/ts-sdk";
import {
  OriginWalletDetails,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { registerWallet } from "@aptos-labs/wallet-standard";
import { init as initTelegram } from "@telegram-apps/sdk";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

import {
  AccountBalance,
  CCTPTransfer,
  WalletConnection,
  WalletSelection,
} from "./components";
import { getOriginWalletDetails } from "@/utils/derivedWallet";

// Example of how to register a browser extension wallet plugin.
// Browser extension wallets should call registerWallet once on page load.
// When you click "Connect Wallet", you should see "Example Wallet"
(function () {
  if (typeof window === "undefined") return;
  const myWallet = new MyWallet();
  registerWallet(myWallet);
})();

const isTelegramMiniApp =
  typeof window !== "undefined" &&
  (window as any).TelegramWebviewProxy !== undefined;
if (isTelegramMiniApp) {
  initTelegram();
}

export default function Home() {
  const { account, connected, network, wallet, changeNetwork } = useWallet();

  const [originWalletDetails, setOriginWalletDetails] = useState<
    OriginWalletDetails | undefined
  >(undefined);

  useEffect(() => {
    if (!wallet) return;
    const fetchOriginWalletDetails = async () => {
      const details = await getOriginWalletDetails(wallet);
      setOriginWalletDetails(details);
    };
    void fetchOriginWalletDetails();
  }, [wallet, getOriginWalletDetails]);

  return (
    <main className="flex flex-col w-1/2 p-6 pb-12 md:px-8 gap-6">
      <div className="flex justify-between gap-6 pb-10">
        <div className="flex flex-col gap-2 md:gap-3">
          <h1 className="text-xl sm:text-3xl font-semibold tracking-tight">
            Aptos X-Chain Wallet Adapter Tester
            {network?.name ? ` — ${network.name}` : ""}
          </h1>
          <a
            href="https://github.com/aptos-labs/aptos-wallet-adapter/tree/main/apps/nextjs-x-chain-example"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground underline underline-offset-2 font-medium leading-none"
          >
            Demo App Source Code
          </a>
        </div>
        <ThemeToggle />
      </div>
      <WalletSelection />

      {connected && wallet && account && network && (
        <>
          <WalletConnection
            account={account}
            network={network}
            wallet={wallet}
            changeNetwork={changeNetwork}
            originWalletDetails={originWalletDetails}
          />
          {network?.name === Network.MAINNET && (
            <>
              <Alert variant="warning">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  The transactions flows below will not work on the Mainnet
                  network.
                </AlertDescription>
              </Alert>
              {/* Transaction actions are disabled on mainnet */}
              <SingleSigner />
            </>
          )}
          {network?.name === Network.TESTNET && (
            <>
              {/* CCTP transfer is enabled for non-Aptos wallets */}
              {!wallet.isAptosNativeWallet && (
                <CCTPTransfer
                  wallet={wallet}
                  originWalletDetails={originWalletDetails}
                />
              )}
              <SingleSigner
                sponsorPrivateKeyHex={
                  process.env.NEXT_PUBLIC_SWAP_CCTP_SPONSOR_ACCOUNT_PRIVATE_KEY
                }
              />
            </>
          )}
          {network?.name === Network.DEVNET && (
            <>
              {/* Fund + balance account is enabled for non-Aptos wallets */}
              {!wallet.isAptosNativeWallet && (
                <AccountBalance
                  account={account}
                  network={network}
                  wallet={wallet}
                />
              )}
              <SingleSigner />
            </>
          )}
        </>
      )}
    </main>
  );
}
