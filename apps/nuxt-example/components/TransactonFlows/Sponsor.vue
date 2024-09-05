<script setup lang="ts">
import { ref, computed, h } from "vue";
import { aptosClient, isSendableNetwork } from "@/utils";
import {
  AccountAddress,
  AccountAuthenticator,
  AnyRawTransaction,
  Account,
} from "@aptos-labs/ts-sdk";
import TransactionHash from "~/components/TransactionHash.vue";
import { useToast } from "~/components/ui/toast";
const { toast } = useToast();
const { $walletAdapter } = useNuxtApp();
const { network, connected, account, signTransaction, submitTransaction } =
  $walletAdapter || {};

const APTOS_COIN = "0x1::aptos_coin::AptosCoin";

const transactionToSubmit = ref<AnyRawTransaction>();
const senderAuthenticator = ref<AccountAuthenticator>();
const feepayerAuthenticator = ref<AccountAuthenticator>();
const feepayerAddress = ref<AccountAddress>();

const isSendable = computed(() =>
  isSendableNetwork(connected.value, network.value?.name || undefined),
);

  // create sponsor account
  const SPONSOR_INITIAL_BALANCE = 100_000_000;
  const sponsor = Account.generate();

// Generate a raw transaction using the SDK
const generateTransaction = async (): Promise<AnyRawTransaction> => {
  if (!account.value) {
    throw new Error("no account");
  }
  const transactionToSign = await aptosClient(
    network.value,
  ).transaction.build.simple({
    sender: account.value?.address,
    withFeePayer: true,
    data: {
      function: "0x1::coin::transfer",
      typeArguments: [APTOS_COIN],
      functionArguments: [account.value?.address, 1], // 1 is in Octas
    },
  });
  return transactionToSign;
};

const onSignTransaction = async () => {
  const transaction = await generateTransaction();
  transactionToSubmit.value = transaction;

  try {
    senderAuthenticator.value = await signTransaction(transaction);
  } catch (error) {
    console.error(error);
  }
};

const onSignTransactionAsSponsor = async () => {
  if (!transactionToSubmit.value) {
    throw new Error("No Transaction to sign");
  }
  try {
    await aptosClient(network.value).fundAccount({
        accountAddress: sponsor.accountAddress,
        amount: SPONSOR_INITIAL_BALANCE,
      });
    feepayerAuthenticator.value = await aptosClient(
        network.value
      ).transaction.signAsFeePayer({
        signer: sponsor,
        transaction: transactionToSubmit.value,
      });
  } catch (error) {
    console.error(error);
  }
};

const onSubmitTransaction = async () => {
  if (!transactionToSubmit.value) {
    throw new Error("No Transaction to sign");
  }
  if (!senderAuthenticator.value) {
    throw new Error("No senderAuthenticator");
  }
  if (!feepayerAuthenticator.value) {
    throw new Error("No feepayerAuthenticator");
  }
  try {
    const response = await submitTransaction({
      transaction: transactionToSubmit.value,
      senderAuthenticator: senderAuthenticator.value,
      feePayerAuthenticator: feepayerAuthenticator.value,
    });
    toast({
      title: "Success",
      description: h(TransactionHash, {
        hash: response.hash,
        network: network.value,
      }),
    });
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Sponsor Transaction Flow</CardTitle>
    </CardHeader>
    <CardContent class="flex flex-wrap gap-4">
      <Button @click="onSignTransaction" :disabled="!isSendable">
        Sign as sender
      </Button>
      <Button
        @click="onSignTransactionAsSponsor"
        :disabled="!isSendable || !senderAuthenticator"
      >
        Sign as sponsor
      </Button>
      <Button
        @click="onSignTransaction"
        :disabled="!isSendable || !senderAuthenticator"
      >
        Submit transaction
      </Button>
    </CardContent>
  </Card>
</template>
