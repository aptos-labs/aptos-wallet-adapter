import {
  AptosWallet,
  WalletItem,
  isInstallRequired,
  partitionWallets,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export interface ConnectWalletDialogProps {
  close: () => void;
}

export function ConnectWalletDialog({ close }: ConnectWalletDialogProps) {
  const { wallets } = useWallet();
  const { defaultWallets, moreWallets } = partitionWallets(wallets ?? []);

  return (
    <DialogContent className="max-h-screen overflow-auto">
      <DialogHeader>
        <DialogTitle>Connect Wallet</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-3 pt-3">
        {defaultWallets.map((wallet) => (
          <WalletRow key={wallet.name} wallet={wallet} onConnect={close} />
        ))}
      </div>
      <Collapsible className="flex flex-col gap-4">
        <CollapsibleTrigger asChild>
          <Button size="sm" variant="ghost" className="gap-2">
            More wallets <ChevronDown />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex flex-col gap-3">
          {moreWallets.map((wallet) => (
            <WalletRow key={wallet.name} wallet={wallet} onConnect={close} />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </DialogContent>
  );
}

interface WalletRowProps {
  wallet: AptosWallet;
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
      {isInstallRequired(wallet) ? (
        <Button size="sm" variant="ghost" asChild>
          <WalletItem.InstallLink />
        </Button>
      ) : (
        <WalletItem.ConnectButton asChild>
          <Button size="sm">Connect</Button>
        </WalletItem.ConnectButton>
      )}
    </WalletItem>
  );
}
