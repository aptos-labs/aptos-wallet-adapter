<script setup lang="ts">
import { AnyAptosWallet } from "@aptos-labs/wallet-adapter-core";

interface WalletIconProps {
  icon: AnyAptosWallet["icon"] | undefined;
  name: AnyAptosWallet["name"] | undefined;
}

defineProps<WalletIconProps>();
</script>

<template>
  <template v-if="$slots.icon">
    <slot name="icon" />
  </template>
  <template v-else-if="icon && name">
    <img :src="icon" :alt="name" class="icon" />
  </template>
</template>

<style scoped>
.icon {
  height: 1.25rem;
  width: 1.25rem;
}
</style>
