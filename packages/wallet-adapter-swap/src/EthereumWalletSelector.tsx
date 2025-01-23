import { Copy, LogOut } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useToast } from "./ui/use-toast";
import {
  BinanceWallet,
  EVMWallet,
  Eip6963Wallet,
  Eip6963Wallets,
  InjectedWallet,
  InjectedWallets,
  DEFAULT_CHAINS,
} from "@xlabs-libs/wallet-aggregator-evm";
import { truncateAddress } from "@aptos-labs/wallet-adapter-react";
import { Wallet, WalletState } from "@xlabs-libs/wallet-aggregator-core";
import { EthereumWalletItem } from "./EthereumWalletItem";

const eip6963Wallets = Object.entries(Eip6963Wallets).reduce(
  (acc, [key, name]) => ({ [key]: new Eip6963Wallet(name), ...acc }),
  {}
);

export function EthereumWalletSelector({
  setSourceWalletAddress,
  setSourceWallet,
}: {
  setSourceWalletAddress: (address: string | null) => void;
  setSourceWallet: (wallet: Wallet | null) => void;
}) {
  const [connected, setConnected] = useState(false);
  const [accountAddress, setAccountAddress] = useState<string | undefined>(
    undefined
  );
  const [wallet, setWallet] = useState<Eip6963Wallet | undefined>(undefined);

  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const closeDialog = useCallback(() => setIsDialogOpen(false), []);

  const onDisconnect = useCallback(async () => {
    await wallet?.disconnect();
    setConnected(false);
    setSourceWalletAddress(null);
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
        <Button>{truncateAddress(accountAddress) || "Unknown"}</Button>
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
        <Button>Connect a Wallet</Button>
      </DialogTrigger>
      <ConnectWalletDialog
        close={closeDialog}
        setAccountAddress={setAccountAddress}
        setConnected={setConnected}
        setWallet={setWallet}
        setSourceWalletAddress={setSourceWalletAddress}
        setSourceWallet={setSourceWallet}
      />
    </Dialog>
  );
}

interface ConnectWalletDialogProps {
  close: () => void;
  setAccountAddress: (address: string | undefined) => void;
  setConnected: (connected: boolean) => void;
  setWallet: (wallet: Eip6963Wallet | undefined) => void;
  setSourceWalletAddress: (address: string | null) => void;
  setSourceWallet: (wallet: Eip6963Wallet | null) => void;
}

function ConnectWalletDialog({
  close,
  setAccountAddress,
  setConnected,
  setWallet,
  setSourceWalletAddress,
  setSourceWallet,
}: ConnectWalletDialogProps) {
  const [wallets, setEthereumWallets] = useState<Eip6963Wallet[]>([]);

  useEffect(() => {
    const ethereumWallets = Object.values(eip6963Wallets).filter((wallet) =>
      ["MetaMask", "Phantom", "Coinbase Wallet"].includes(
        (wallet as Eip6963Wallet).getName()
      )
    );
    setEthereumWallets(ethereumWallets as Eip6963Wallet[]);
  }, []);

  const onConnectClick = useCallback(
    (wallet: Eip6963Wallet) => {
      setAccountAddress(wallet.getAddress());
      setConnected(true);
      setWallet(wallet);
      setSourceWalletAddress(wallet.getAddress() || null);
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
  wallet: Eip6963Wallet;
  onConnect?: () => void;
}

function WalletRow({ wallet, onConnect }: WalletRowProps) {
  const connectWallet = useCallback(async () => {
    const res = await wallet.connect();
    console.log("res", res);
    onConnect?.();
  }, [wallet, onConnect]);

  return (
    <EthereumWalletItem
      wallet={wallet}
      onConnect={connectWallet}
      className="flex items-center justify-between px-4 py-3 gap-4 border rounded-md"
    >
      <div className="flex items-center gap-4">
        <EthereumWalletItem.Icon className="h-6 w-6" />
        <EthereumWalletItem.Name className="text-base font-normal" />
      </div>
      {wallet.getWalletState() === WalletState.NotDetected ? (
        <Button size="sm" variant="ghost" asChild>
          <EthereumWalletItem.InstallLink />
        </Button>
      ) : (
        <EthereumWalletItem.ConnectButton asChild>
          <Button size="sm">Connect</Button>
        </EthereumWalletItem.ConnectButton>
      )}
    </EthereumWalletItem>
  );
}
