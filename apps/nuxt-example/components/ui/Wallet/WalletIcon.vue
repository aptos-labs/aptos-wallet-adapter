<script setup lang="ts">
interface WalletIconProps {
  icon: string;
  name: string;
}
defineProps<WalletIconProps>();
</script>

<template>
  <img
    :src="icon"
    :alt="name"
    class="icon"
    width="24"
    height="24"
    v-bind="$attrs"
  />
</template>
