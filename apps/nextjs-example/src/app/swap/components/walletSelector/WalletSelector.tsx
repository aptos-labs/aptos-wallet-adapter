"use client";

import { Copy, LogOut } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import { useCrossChainWallet } from "@aptos-labs/cross-chain-react";
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
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Chain } from "@aptos-labs/cross-chain-react";
import { WalletItem } from "./WalletItem";
import {
  AdapterWallet,
  WalletReadyState,
} from "@aptos-labs/wallet-adapter-aggregator-core";

export function WalletSelector({
  transactionInProgress,
  sourceChain,
}: {
  transactionInProgress: boolean;
  sourceChain: Chain | null;
}) {
  const { connected, disconnect, wallet, account } = useCrossChainWallet();

  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const closeDialog = useCallback(() => setIsDialogOpen(false), []);

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

  return connected ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={transactionInProgress}>
          {account?.address?.toString() || ""}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={copyAddress} className="gap-2">
          <Copy className="h-4 w-4" /> Copy address
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={disconnect} className="gap-2">
          <LogOut className="h-4 w-4" /> Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button disabled={!sourceChain}>Connect Wallet</Button>
      </DialogTrigger>
      <ConnectWalletDialog close={closeDialog} sourceChain={sourceChain} />
    </Dialog>
  );
}

interface ConnectWalletDialogProps {
  close: () => void;
  sourceChain: Chain | null;
}

function ConnectWalletDialog({ close, sourceChain }: ConnectWalletDialogProps) {
  const { getSolanaWallets, getAptosWallets, getEthereumWallets } =
    useCrossChainWallet();

  const [wallets, setWallets] = useState<ReadonlyArray<AdapterWallet>>([]);

  useEffect(() => {
    const getWallets = async () => {
      switch (sourceChain) {
        case "Solana":
          const solanaWallets = await getSolanaWallets();
          setWallets(solanaWallets);
          break;
        case "Aptos":
          const aptosWallets = await getAptosWallets();
          setWallets(aptosWallets);
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
            onConnect={close}
            onSignInWith={close}
          />
        ))}
      </div>
    </DialogContent>
  );
}

interface WalletRowProps {
  wallet: AdapterWallet;
  onConnect?: () => void;
  onSignInWith?: () => void;
}

function WalletRow({ wallet, onConnect, onSignInWith }: WalletRowProps) {
  return (
    <WalletItem
      wallet={wallet}
      onConnect={onConnect}
      onSignInWith={onSignInWith}
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
          <span className="text-sm">or</span>
          <WalletItem.SignInWithButton asChild>
            <Button size="sm">Sign In With</Button>
          </WalletItem.SignInWithButton>
        </div>
      )}
    </WalletItem>
  );
}
