<script setup lang="ts">
import { DropdownMenuItem, DropdownMenuItemProps } from "radix-vue";
type Props = DropdownMenuItemProps & {
  inset: boolean;
};
withDefaults(defineProps<Props>(), {
  inset: false,
});
</script>

<template>
  <DropdownMenuItem
    class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    :class="inset && 'pl-8'"
  >
    <slot />
  </DropdownMenuItem>
</template>
