<script setup lang="ts">
import {
  RadioGroupItem,
  RadioGroupItemProps,
  RadioGroupIndicator,
} from "radix-vue";
import { Circle } from "lucide-vue-next";
const props = defineProps<RadioGroupItemProps>();
</script>

<template>
  <RadioGroupItem
    v-bind="props"
    class="aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <RadioGroupIndicator class="flex items-center justify-center">
      <Circle class="h-2.5 w-2.5 fill-current text-current" />
    </RadioGroupIndicator>
  </RadioGroupItem>
</template>
