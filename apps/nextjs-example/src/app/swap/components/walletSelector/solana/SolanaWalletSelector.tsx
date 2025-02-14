"use client";

import { Copy, LogOut } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { SolanaWalletItem } from "./SolanaWalletItem";
import { useToast } from "@/components/ui/use-toast";
import {
  SolanaWallet,
  useCrossChainWallet,
  WalletState,
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
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Chain } from "@aptos-labs/cross-chain-react";
export function SolanaWalletSelector({
  transactionInProgress,
  sourceChain,
}: {
  transactionInProgress: boolean;
  sourceChain: Chain | null;
}) {
  const { connected, disconnect, wallet } = useCrossChainWallet();

  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const closeDialog = useCallback(() => setIsDialogOpen(false), []);

  const copyAddress = useCallback(async () => {
    if (!wallet?.getAddress()) return;
    try {
      await navigator.clipboard.writeText(wallet.getAddress());
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

  return connected ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={transactionInProgress}>
          {wallet?.getAddress() || ""}
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
      <ConnectWalletDialog close={closeDialog} />
    </Dialog>
  );
}

interface ConnectWalletDialogProps {
  close: () => void;
}

function ConnectWalletDialog({ close }: ConnectWalletDialogProps) {
  const { getSolanaWallets } = useCrossChainWallet();

  const [wallets, setWallets] = useState<ReadonlyArray<SolanaWallet>>([]);

  useEffect(() => {
    const solanaWallets = async () => {
      const wallets = getSolanaWallets();
      setWallets(wallets);
    };
    solanaWallets();
  }, []);

  return (
    <DialogContent className="max-h-screen overflow-auto">
      <DialogTitle className="flex flex-col text-center leading-snug">
        Connect Solana Wallet
      </DialogTitle>
      <div className="flex flex-col gap-3 pt-3">
        {wallets.map((wallet) => (
          <WalletRow key={wallet.getName()} wallet={wallet} onConnect={close} />
        ))}
      </div>
    </DialogContent>
  );
}

interface WalletRowProps {
  wallet: SolanaWallet;
  onConnect?: () => void;
}

function WalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <SolanaWalletItem
      wallet={wallet}
      onConnect={onConnect}
      className="flex items-center justify-between px-4 py-3 gap-4 border rounded-md"
    >
      <div className="flex items-center gap-4">
        <SolanaWalletItem.Icon className="h-6 w-6" />
        <SolanaWalletItem.Name className="text-base font-normal" />
      </div>
      {wallet.getWalletState() === WalletState.NotDetected ? (
        <Button size="sm" variant="ghost" asChild>
          <SolanaWalletItem.InstallLink />
        </Button>
      ) : (
        <SolanaWalletItem.ConnectButton asChild>
          <Button size="sm">Connect</Button>
        </SolanaWalletItem.ConnectButton>
      )}
    </SolanaWalletItem>
  );
}
