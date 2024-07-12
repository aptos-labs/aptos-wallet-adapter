<script setup lang="ts">
import { ToastViewport, ToastViewportProps } from "radix-vue";
const props = defineProps<ToastViewportProps>();
</script>

<template>
  <ToastViewport
    v-bind="props"
    class="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
  >
    <slot />
  </ToastViewport>
</template>
