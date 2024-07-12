<script setup lang="ts">
import { Label, LabelProps } from "radix-vue";
defineProps<LabelProps>();
</script>

<template>
  <Label
    v-bind="$props"
    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    <slot />
  </Label>
</template>
