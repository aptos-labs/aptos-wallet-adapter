<script setup lang="ts">
import { DropdownMenuSubTrigger } from "radix-vue";
import { ChevronRight } from "lucide-vue-next";
defineProps({
  inset: Boolean,
});
</script>

<template>
  <DropdownMenuSubTrigger
    class="flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent"
    :class="inset && 'pl-8'"
  >
    <slot />
    <ChevronRight class="ml-auto h-4 w-4" />
  </DropdownMenuSubTrigger>
</template>
