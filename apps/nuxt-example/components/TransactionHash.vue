<script setup lang="ts">
import { NetworkInfo, isAptosNetwork } from "@aptos-labs/wallet-adapter-core";

interface TransactionHashProps {
  hash: string;
  network: NetworkInfo | null;
}

const props = defineProps<TransactionHashProps>();

const { hash, network } = toRefs(props);

const isAptosLink = computed(() => isAptosNetwork(network.value));

const explorerLink = computed(() => {
  if (isAptosLink.value) {
    return `https://explorer.aptoslabs.com/txn/${hash.value}${
      network.value?.name ? `?network=${network.value?.name}` : ""
    }`;
  }
  return hash.value;
});
</script>

<template>
  <template v-if="isAptosLink">
    View on Explorer:
    <a
      :href="explorerLink"
      target="_blank"
      rel="noopener noreferrer"
      class="text-primary hover:underline"
    >
      {{ explorerLink }}
    </a>
  </template>
  <template v-else> Transaction Hash: {{ explorerLink }} </template>
</template>
