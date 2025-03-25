import { useWallet, WalletContextState } from "@aptos-labs/wallet-adapter-vue";
import { Network } from "@aptos-labs/ts-sdk";
import { useToast } from "~/components/ui/toast";
import { useAutoConnect } from "~/composables/useAutoConnect";

export default defineNuxtPlugin({
  name: "walletAdapter",
  async setup(_NuxtApp) {
    const { toast } = useToast();

    const dappConfig = {
      network: Network.TESTNET,
    };

    const handleError = (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error || "Unknown wallet error",
      });
    };

    const walletAdapter = useWallet({
      dappConfig,
      onError: handleError,
    });

    useAutoConnect(walletAdapter.autoConnect);

    return {
      provide: {
        walletAdapter: useWallet({
          dappConfig,
          onError: handleError,
        }) as WalletContextState,
      },
    };
  },
});
