<script setup lang="ts">
import { ToastDescription, ToastDescriptionProps } from "radix-vue";
defineProps<ToastDescriptionProps>();
</script>

<template>
  <ToastDescription class="text-sm opacity-90 break-all" v-bind="$props">
    <slot />
  </ToastDescription>
</template>
