<script setup lang="ts">
import { AdapterWallet } from "@aptos-labs/wallet-adapter-core";
interface WalletItemProps {
  name: AdapterWallet["name"];
}
defineProps<WalletItemProps>();
</script>

<template>
  <template v-if="$slots.name">
    <slot name="name" />
  </template>
  <template v-else-if="name">
    <div v-bind="$attrs">{{ name }}</div>
  </template>
</template>
