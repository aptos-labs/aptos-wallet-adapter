import { Copy, LogOut } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../../../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../../../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { useToast } from "../../../ui/use-toast";
import {
  getSolanaStandardWallets,
  SolanaWallet,
} from "@xlabs-libs/wallet-aggregator-solana";
import { WalletState } from "@xlabs-libs/wallet-aggregator-core";
import { Connection } from "@solana/web3.js";
import { SolanaWalletItem } from "./SolanaWalletItem";
import { truncateAddress } from "@aptos-labs/wallet-adapter-react";

export function SolanaWalletSelector({
  setSourceWallet,
  transactionInProgress,
}: {
  setSourceWallet: (wallet: SolanaWallet | null) => void;
  transactionInProgress: boolean;
}) {
  const [connected, setConnected] = useState(false);
  const [accountAddress, setAccountAddress] = useState<string | undefined>(
    undefined
  );
  const [wallet, setWallet] = useState<SolanaWallet | undefined>(undefined);

  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const closeDialog = useCallback(() => setIsDialogOpen(false), []);

  const onDisconnect = useCallback(async () => {
    await wallet?.disconnect();
    setConnected(false);
    setSourceWallet(null);
    setAccountAddress(undefined);
    setWallet(undefined);
  }, [wallet]);

  const copyAddress = useCallback(async () => {
    if (!accountAddress) return;
    try {
      await navigator.clipboard.writeText(accountAddress);
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
  }, [accountAddress, toast]);

  return connected ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={transactionInProgress}>
          {truncateAddress(accountAddress) || "Unknown"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={copyAddress} className="gap-2">
          <Copy className="h-4 w-4" /> Copy address
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onDisconnect} className="gap-2">
          <LogOut className="h-4 w-4" /> Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Connect Solana Wallet</Button>
      </DialogTrigger>
      <ConnectWalletDialog
        close={closeDialog}
        setAccountAddress={setAccountAddress}
        setConnected={setConnected}
        setWallet={setWallet}
        setSourceWallet={setSourceWallet}
      />
    </Dialog>
  );
}

interface ConnectWalletDialogProps {
  close: () => void;
  setAccountAddress: (address: string | undefined) => void;
  setConnected: (connected: boolean) => void;
  setWallet: (wallet: SolanaWallet | undefined) => void;
  setSourceWallet: (wallet: SolanaWallet | null) => void;
}

function ConnectWalletDialog({
  close,
  setAccountAddress,
  setConnected,
  setWallet,
  setSourceWallet,
}: ConnectWalletDialogProps) {
  const [wallets, setSolanaWallets] = useState<SolanaWallet[]>([]);

  useEffect(() => {
    const solanaWallets = async () => {
      // const cluster = "mainnet-beta";
      // const url = clusterApiUrl(cluster);
      const isDevnet = true;
      const connection = isDevnet
        ? "https://api.devnet.solana.com"
        : "https://solana-mainnet.rpc.extrnode.com/eb370d10-948a-4f47-8017-a80241a5c7fc";
      const wallets = await getSolanaStandardWallets(
        new Connection(connection)
      );
      setSolanaWallets(wallets);
    };
    solanaWallets();
  }, []);

  const onConnectClick = useCallback(
    (wallet: SolanaWallet) => {
      setAccountAddress(wallet.getAddress());
      setConnected(true);
      setWallet(wallet);
      setSourceWallet(wallet);
      close();
    },
    [setAccountAddress, close, setSourceWallet]
  );

  return (
    <DialogContent className="max-h-screen overflow-auto">
      <div className="flex flex-col gap-3 pt-3">
        {wallets.map((wallet) => (
          <WalletRow
            key={wallet.getName()}
            wallet={wallet}
            onConnect={() => onConnectClick(wallet)}
          />
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
  const connectWallet = useCallback(async () => {
    const res = await wallet.connect();
    console.log("res", res);
    onConnect?.();
  }, [wallet, onConnect]);

  return (
    <SolanaWalletItem
      wallet={wallet}
      onConnect={connectWallet}
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
