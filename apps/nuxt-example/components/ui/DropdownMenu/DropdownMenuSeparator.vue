<script setup lang="ts">
import { DropdownMenuSeparator } from "radix-vue";
</script>

<template>
  <DropdownMenuSeparator class="-mx-1 my-1 h-px bg-muted">
    <slot />
  </DropdownMenuSeparator>
</template>
