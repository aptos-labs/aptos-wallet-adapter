"use client";

import { truncateAddress } from "@aptos-labs/ts-sdk";
import {
  ChevronDown,
  ArrowRight,
  Copy,
  LogOut,
  User,
  ArrowLeft,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import {
  useCrossChainWallet,
  AptosNotDetectedWallet,
} from "@aptos-labs/cross-chain-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Chain } from "@aptos-labs/cross-chain-react";
import { AptosWalletItem } from "./WalletItem";
import {
  AdapterWallet,
  WalletReadyState,
} from "@aptos-labs/wallet-adapter-aggregator-core";
import { isAptosConnectWallet } from "@aptos-labs/wallet-adapter-core";
import { CollapsibleContent } from "@/components/ui/collapsible";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { APTOS_CONNECT_ACCOUNT_URL } from "@aptos-labs/wallet-adapter-core";
import {
  AboutAptosConnect,
  AboutAptosConnectEducationScreen,
  AptosPrivacyPolicy,
} from "@aptos-labs/wallet-adapter-react";
import { Collapsible } from "@/components/ui/collapsible";

export function AptosWalletSelector({
  transactionInProgress,
  sourceChain,
  onWalletConnect,
  wallet,
}: {
  transactionInProgress: boolean;
  sourceChain: Chain | null;
  onWalletConnect: (wallet: AdapterWallet) => void;
  wallet: AdapterWallet | undefined;
}) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const closeDialog = useCallback(() => setIsDialogOpen(false), []);

  const [account, setAccount] = useState<any | undefined>(undefined);

  useEffect(() => {
    const getAccount = async () => {
      const account = await wallet?.getAccount();
      setAccount(account);
    };
    getAccount();
  }, [wallet]);

  const disconnect = useCallback(() => {
    wallet?.disconnect();
  }, [wallet]);

  const copyAddress = useCallback(async () => {
    if (!account?.address) return;
    try {
      await navigator.clipboard.writeText(account?.address?.toString());
      toast({
        title: "Success",
        description: "Copied wallet address to clipboard.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy wallet address.",
      });
    }
  }, [wallet, toast]);

  return wallet ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={transactionInProgress}>
          {truncateAddress(account?.address?.toString() || "")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={copyAddress} className="gap-2">
          <Copy className="h-4 w-4" /> Copy address
        </DropdownMenuItem>
        {wallet && isAptosConnectWallet(wallet) && (
          <DropdownMenuItem asChild>
            <a
              href={APTOS_CONNECT_ACCOUNT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-2"
            >
              <User className="h-4 w-4" /> Account
            </a>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={disconnect} className="gap-2">
          <LogOut className="h-4 w-4" /> Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button disabled={!sourceChain}>Connect Aptos Wallet</Button>
      </DialogTrigger>
      <ConnectWalletDialog
        close={closeDialog}
        sourceChain={sourceChain}
        onWalletConnect={onWalletConnect}
      />
    </Dialog>
  );
}

interface ConnectWalletDialogProps {
  close: () => void;
  sourceChain: Chain | null;
  onWalletConnect: (wallet: AdapterWallet) => void;
}

function ConnectWalletDialog({
  close,
  sourceChain,
  onWalletConnect,
}: ConnectWalletDialogProps) {
  const { getAptosWallets, fetchAptosNotDetectedWallets } =
    useCrossChainWallet();
  const [aptosNotDetectedWallets, setAptosNotDetectedWallets] = useState<
    ReadonlyArray<AptosNotDetectedWallet>
  >([]);

  const [wallets, setWallets] = useState<ReadonlyArray<AdapterWallet>>([]);

  const onConnectAction = (wallet: AdapterWallet) => {
    onWalletConnect(wallet);
    close();
  };

  useEffect(() => {
    const getWallets = async () => {
      const aptosWallets = await getAptosWallets();
      const notDetectedWallets = fetchAptosNotDetectedWallets();
      return { aptosWallets, notDetectedWallets };
    };
    getWallets().then(({ aptosWallets, notDetectedWallets }) => {
      setWallets(aptosWallets);
      setAptosNotDetectedWallets(notDetectedWallets);
    });
  }, [sourceChain]);

  const aptosConnectWallets = wallets.filter((item) =>
    isAptosConnectWallet(item)
  );
  const aptosWallets = wallets.filter((item) => !isAptosConnectWallet(item));

  return (
    <DialogContent className="max-h-screen overflow-auto">
      <AboutAptosConnect renderEducationScreen={renderEducationScreen}>
        <DialogHeader>
          <DialogTitle className="flex flex-col text-center leading-snug">
            <>
              <span>Log in or sign up</span>
              <span>with Social + Aptos Connect</span>
            </>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 pt-3">
          {aptosConnectWallets.map((wallet) => (
            <AptosConnectWalletRow
              key={wallet.name}
              wallet={wallet}
              onConnect={() => onConnectAction(wallet)}
            />
          ))}
          <p className="flex gap-1 justify-center items-center text-muted-foreground text-sm">
            Learn more about{" "}
            <AboutAptosConnect.Trigger className="flex gap-1 py-3 items-center text-foreground">
              Aptos Connect <ArrowRight size={16} />
            </AboutAptosConnect.Trigger>
          </p>
          <AptosPrivacyPolicy className="flex flex-col items-center py-1">
            <p className="text-xs leading-5">
              <AptosPrivacyPolicy.Disclaimer />{" "}
              <AptosPrivacyPolicy.Link className="text-muted-foreground underline underline-offset-4" />
              <span className="text-muted-foreground">.</span>
            </p>
            <AptosPrivacyPolicy.PoweredBy className="flex gap-1.5 items-center text-xs leading-5 text-muted-foreground" />
          </AptosPrivacyPolicy>
          <div className="flex items-center gap-3 pt-4 text-muted-foreground">
            <div className="h-px w-full bg-secondary" />
            Or
            <div className="h-px w-full bg-secondary" />
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-3">
          {aptosWallets.map((wallet) => (
            <WalletRow
              key={wallet.name}
              wallet={wallet}
              onConnect={() => onConnectAction(wallet)}
            />
          ))}
          {!!aptosNotDetectedWallets.length && (
            <Collapsible className="flex flex-col gap-3">
              <CollapsibleTrigger asChild>
                <Button size="sm" variant="ghost" className="gap-2">
                  More wallets <ChevronDown />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-col gap-3">
                {aptosNotDetectedWallets.map((wallet) => (
                  <WalletRow key={wallet.name} wallet={wallet} />
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </AboutAptosConnect>
    </DialogContent>
  );
}

interface WalletRowProps {
  wallet: AdapterWallet | AptosNotDetectedWallet;
  onConnect?: () => void;
}

function WalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <AptosWalletItem
      wallet={wallet}
      onConnect={onConnect}
      className="flex items-center justify-between px-4 py-3 gap-4 border rounded-md"
    >
      <div className="flex items-center gap-4">
        <AptosWalletItem.Icon className="h-6 w-6" />
        <AptosWalletItem.Name className="text-base font-normal" />
      </div>
      {wallet.readyState === WalletReadyState.NotDetected ? (
        <Button size="sm" variant="ghost" asChild>
          <AptosWalletItem.InstallLink />
        </Button>
      ) : (
        <div className="flex text-right gap-2 items-center">
          <AptosWalletItem.ConnectButton asChild>
            <Button size="sm">Connect</Button>
          </AptosWalletItem.ConnectButton>
        </div>
      )}
    </AptosWalletItem>
  );
}

function AptosConnectWalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <AptosWalletItem wallet={wallet} onConnect={onConnect}>
      <AptosWalletItem.ConnectButton asChild>
        <Button size="lg" variant="outline" className="w-full gap-4">
          <AptosWalletItem.Icon className="h-5 w-5" />
          <AptosWalletItem.Name className="text-base font-normal" />
        </Button>
      </AptosWalletItem.ConnectButton>
    </AptosWalletItem>
  );
}

function renderEducationScreen(screen: AboutAptosConnectEducationScreen) {
  return (
    <>
      <DialogHeader className="grid grid-cols-[1fr_4fr_1fr] items-center space-y-0">
        <Button variant="ghost" size="icon" onClick={screen.cancel}>
          <ArrowLeft />
        </Button>
        <DialogTitle className="leading-snug text-base text-center">
          About Aptos Connect
        </DialogTitle>
      </DialogHeader>

      <div className="flex h-[162px] pb-3 items-end justify-center">
        <screen.Graphic />
      </div>
      <div className="flex flex-col gap-2 text-center pb-4">
        <screen.Title className="text-xl" />
        <screen.Description className="text-sm text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a]:text-foreground" />
      </div>

      <div className="grid grid-cols-3 items-center">
        <Button
          size="sm"
          variant="ghost"
          onClick={screen.back}
          className="justify-self-start"
        >
          Back
        </Button>
        <div className="flex items-center gap-2 place-self-center">
          {screen.screenIndicators.map((ScreenIndicator, i) => (
            <ScreenIndicator key={i} className="py-4">
              <div className="h-0.5 w-6 transition-colors bg-muted [[data-active]>&]:bg-foreground" />
            </ScreenIndicator>
          ))}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={screen.next}
          className="gap-2 justify-self-end"
        >
          {screen.screenIndex === screen.totalScreens - 1 ? "Finish" : "Next"}
          <ArrowRight size={16} />
        </Button>
      </div>
    </>
  );
}
