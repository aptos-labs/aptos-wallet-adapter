<script setup lang="ts">
import { DropdownMenuLabel, DropdownMenuLabelProps } from "radix-vue";
withDefaults(defineProps<DropdownMenuLabelProps & { inset?: boolean }>(), {
  inset: false,
});
</script>

<template>
  <DropdownMenuLabel
    class="px-2 py-1.5 text-sm font-semibold"
    :class="inset && 'pl-8'"
  >
    <slot />
  </DropdownMenuLabel>
</template>
