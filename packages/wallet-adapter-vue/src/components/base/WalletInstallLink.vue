<script setup lang="ts">
import { AnyAptosWallet } from "@aptos-labs/wallet-adapter-core";

interface WalletItemProps {
  installLink: AnyAptosWallet["url"] | undefined;
}
defineProps<WalletItemProps>();
</script>

<template>
  <template v-if="$slots.installLink">
    <slot name="name" />
  </template>
  <template v-else-if="installLink">
    <a
      v-bind="$attrs"
      :href="installLink"
      target="_blank"
      rel="noopener noreferrer"
      >Install</a
    >
  </template>
</template>
