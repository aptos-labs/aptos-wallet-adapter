<script setup lang="ts">
import { aptosClient, isSendableNetwork } from "@/utils";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-vue";
import { useToast } from "~/components/ui/toast";
const { toast } = useToast();
const { $walletAdapter } = useNuxtApp();
const { network, connected, account, wallet, signAndSubmitTransaction } =
  $walletAdapter || {};

const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
const MaxGasAMount = 10000;

const isSendable = computed(() =>
  isSendableNetwork(connected.value, network.value?.name || undefined),
);

const onSignAndSubmitTransaction = async () => {
  if (!account) return;
  const transaction: InputTransactionData = {
    data: {
      function: "0x1::coin::transfer",
      typeArguments: [APTOS_COIN],
      functionArguments: [account.value?.address, 1], // 1 is in Octas
    },
    options: { maxGasAmount: MaxGasAMount },
  };
  try {
    const commitedTransaction = await signAndSubmitTransaction(transaction);
    const executedTransaction = await aptosClient(
      network.value,
    ).waitForTransaction({
      transactionHash: commitedTransaction.hash,
    });
    // Check maxGasAmount is respected by the current connected Wallet
    if ((executedTransaction as any).max_gas_amount == MaxGasAMount) {
      toast({
        title: "Success",
        description: `${wallet.value?.name ?? "Wallet"} transaction ${executedTransaction.hash} executed with a max gas amount of ${MaxGasAMount}`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: `${wallet.value?.name ?? "Wallet"} transaction ${executedTransaction.hash} executed with a max gas amount of ${(executedTransaction as any).max_gas_amount}`,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle> Validate Transaction Parameters </CardTitle>
    </CardHeader>
    <CardContent class="flex flex-wrap gap-4">
      <Button @click="onSignAndSubmitTransaction" :disabled="!isSendable">
        With MaxGasAmount
      </Button>
    </CardContent>
  </Card>
</template>
