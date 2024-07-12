<script setup lang="ts">
import { ToastTitle, ToastTitleProps } from "radix-vue";

defineProps<ToastTitleProps>();
</script>

<template>
  <ToastTitle class="text-sm font-semibold" v-bind="$props">
    <slot />
  </ToastTitle>
</template>
