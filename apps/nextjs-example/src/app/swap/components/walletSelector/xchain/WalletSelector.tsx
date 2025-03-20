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
import { WalletItem } from "./WalletItem";
import {
  AdapterWallet,
  WalletReadyState,
} from "@aptos-labs/wallet-adapter-aggregator-core";
import { isAptosConnectWallet } from "@aptos-labs/wallet-adapter-core";
import { APTOS_CONNECT_ACCOUNT_URL } from "@aptos-labs/wallet-adapter-core";
import { AboutAptosConnectEducationScreen } from "@aptos-labs/wallet-adapter-react";

export function WalletSelector({
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
      await navigator.clipboard.writeText(account.address.toString());
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
  }, [account, toast]);

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
        <Button disabled={!sourceChain}>Connect {sourceChain} Wallet</Button>
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
  const { getSolanaWallets, getEthereumWallets } = useCrossChainWallet();

  const [wallets, setWallets] = useState<ReadonlyArray<AdapterWallet>>([]);

  const onConnectAction = (wallet: AdapterWallet) => {
    onWalletConnect(wallet);
    close();
  };

  useEffect(() => {
    const getWallets = async () => {
      switch (sourceChain) {
        case "Solana":
          const solanaWallets = await getSolanaWallets();
          setWallets(solanaWallets);
          break;
        default:
          const ethereumWallets = await getEthereumWallets();
          setWallets(ethereumWallets);
      }
    };
    getWallets();
  }, [sourceChain]);

  return (
    <DialogContent className="max-h-screen overflow-auto">
      <DialogTitle className="flex flex-col text-center leading-snug">
        Connect {sourceChain} Wallet
      </DialogTitle>
      <div className="flex flex-col gap-3 pt-3">
        {wallets.map((wallet) => (
          <WalletRow
            key={wallet.name}
            wallet={wallet}
            onConnect={() => onConnectAction(wallet)}
          />
        ))}
      </div>
    </DialogContent>
  );
}

interface WalletRowProps {
  wallet: AdapterWallet | AptosNotDetectedWallet;
  onConnect?: () => void;
}

function WalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <WalletItem
      wallet={wallet}
      onConnect={onConnect}
      className="flex items-center justify-between px-4 py-3 gap-4 border rounded-md"
    >
      <div className="flex items-center gap-4">
        <WalletItem.Icon className="h-6 w-6" />
        <WalletItem.Name className="text-base font-normal" />
      </div>
      {wallet.readyState === WalletReadyState.NotDetected ? (
        <Button size="sm" variant="ghost" asChild>
          <WalletItem.InstallLink />
        </Button>
      ) : (
        <div className="flex text-right gap-2 items-center">
          <WalletItem.ConnectButton asChild>
            <Button size="sm">Connect</Button>
          </WalletItem.ConnectButton>
        </div>
      )}
    </WalletItem>
  );
}

function AptosConnectWalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <WalletItem wallet={wallet} onConnect={onConnect}>
      <WalletItem.ConnectButton asChild>
        <Button size="lg" variant="outline" className="w-full gap-4">
          <WalletItem.Icon className="h-5 w-5" />
          <WalletItem.Name className="text-base font-normal" />
        </Button>
      </WalletItem.ConnectButton>
    </WalletItem>
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
