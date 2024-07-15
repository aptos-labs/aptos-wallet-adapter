import { useWallet, WalletContextState } from "@aptos-labs/wallet-adapter-vue";
import { Network } from "@aptos-labs/ts-sdk";
import { useToast } from "~/components/ui/toast";
import { BitgetWallet } from "@bitget-wallet/aptos-wallet-adapter";
import { FewchaWallet } from "fewcha-plugin-wallet-adapter";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { MSafeWalletAdapter } from "@msafe/aptos-wallet-adapter";
import { PontemWallet } from "@pontem/wallet-adapter-plugin";
import { TrustWallet } from "@trustwallet/aptos-wallet-adapter";
import { OKXWallet } from "@okwallet/aptos-wallet-adapter";
import { useAutoConnect } from "~/composables/useAutoConnect";

export default defineNuxtPlugin({
  name: "walletAdapter",
  async setup(_NuxtApp) {
    const { toast } = useToast();

    const wallets = [
      new BitgetWallet(),
      new FewchaWallet(),
      new MartianWallet(),
      new MSafeWalletAdapter(),
      new PontemWallet(),
      new TrustWallet(),
      new OKXWallet(),
    ];
    const dappConfig = {
      network: Network.DEVNET,
    };

    const handleError = (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error || "Unknown wallet error",
      });
    };

    const walletAdapter = useWallet({
      plugins: wallets,
      dappConfig,
      onError: handleError,
    });

    useAutoConnect(walletAdapter.autoConnect);

    return {
      provide: {
        walletAdapter: useWallet({
          plugins: wallets,
          dappConfig,
          onError: handleError,
        }) as WalletContextState,
      },
    };
  },
});
