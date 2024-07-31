<script setup lang="ts">
import { DialogOverlay } from "radix-vue";
</script>

<template>
  <DialogOverlay
    class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
  >
    <slot />
  </DialogOverlay>
</template>
