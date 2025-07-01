<script setup lang="ts">
import { computed, h } from "vue";
import { aptosClient, isSendableNetwork } from "@/utils";
import {
  Account,
  AccountAuthenticator,
  AnyRawTransaction,
  Ed25519Account,
} from "@aptos-labs/ts-sdk";
import TransactionHash from "~/components/TransactionHash.vue";
import { toast } from "~/components/ui/toast";

const { $walletAdapter } = useNuxtApp();
const {
  network,
  connected,
  account,
  signAndSubmitTransaction,
  signMessageAndVerify,
  signMessage,
  signTransaction,
  submitTransaction,
} = $walletAdapter;

const APTOS_COIN = "0x1::aptos_coin::AptosCoin";

const secondarySignerAccount = ref<Ed25519Account>();
const transactionToSubmit = ref<AnyRawTransaction>();
const senderAuthenticator = ref<AccountAuthenticator>();
const secondarySignerAuthenticator = ref<AccountAuthenticator>();

const isSendable = computed(() =>
  isSendableNetwork(connected.value, network.value?.name || undefined),
);

const generateTransaction = async (): Promise<AnyRawTransaction> => {
  if (!account) {
    throw new Error("no account");
  }
  if (!network) {
    throw new Error("no network");
  }

  const secondarySigner = Account.generate();
  // TODO: support custom network
  await aptosClient(network.value).fundAccount({
    accountAddress: secondarySigner.accountAddress.toString(),
    amount: 100_000_000,
  });
  secondarySignerAccount.value = secondarySigner;

  const transactionToSign = await aptosClient(
    network.value,
  ).transaction.build.multiAgent({
    sender: account.address,
    secondarySignerAddresses: [secondarySigner.accountAddress],
    data: {
      function: "0x1::coin::transfer",
      typeArguments: [APTOS_COIN],
      functionArguments: [account.value?.address.toString(), 1], // 1 is in Octas
    },
  });
  return transactionToSign;
};

const onSenderSignTransaction = async () => {
  const transaction = await generateTransaction();
  transactionToSubmit.value = transaction;
  try {
    senderAuthenticator.value = await signTransaction(transaction);
  } catch (error) {
    console.error(error);
  }
};

const onSecondarySignerSignTransaction = async () => {
  if (!transactionToSubmit.value) {
    throw new Error("No Transaction to sign");
  }
  try {
    secondarySignerAuthenticator.value = await signTransaction(
      transactionToSubmit.value,
    );
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
  if (!secondarySignerAuthenticator.value) {
    throw new Error("No secondarySignerAuthenticator");
  }
  try {
    const response = await submitTransaction({
      transaction: transactionToSubmit.value,
      senderAuthenticator: senderAuthenticator.value,
      additionalSignersAuthenticators: [secondarySignerAuthenticator.value],
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
      <CardTitle>Multi Agent Transaction Flow</CardTitle>
    </CardHeader>
    <CardContent class="flex flex-col gap-8">
      <div class="flex flex-wrap gap-4">
        <Button @click="onSenderSignTransaction" :disabled="!isSendable">
          Sign as sender
        </Button>
        <Button
          @click="onSecondarySignerSignTransaction"
          :disabled="!isSendable || !senderAuthenticator"
        >
          Sign as secondary signer
        </Button>
        <Button
          @click="onSubmitTransaction"
          :disabled="!isSendable || !secondarySignerAuthenticator"
        >
          Submit transaction
        </Button>
      </div>

      <template v-if="secondarySignerAccount && senderAuthenticator">
        <div class="flex flex-col gap-6">
          <h4 class="text-lg font-medium">Secondary Signer details</h4>
          <LabelValueGrid
            :items="[
              {
                label: 'Private Key',
                value: secondarySignerAccount.privateKey.toString(),
              },
              {
                label: 'Public Key',
                value: secondarySignerAccount.publicKey.toString(),
              },
              {
                label: 'Address',
                value: secondarySignerAccount.accountAddress.toString(),
              },
            ]"
          />
        </div>
      </template>
    </CardContent>
  </Card>
</template>
