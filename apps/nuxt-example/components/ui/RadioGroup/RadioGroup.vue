<script setup lang="ts">
import {
  RadioGroupRoot,
  RadioGroupRootProps,
  RadioGroupRootEmits,
} from "radix-vue";
const props = defineProps<RadioGroupRootProps>();
defineEmits<RadioGroupRootEmits>();
</script>

<template>
  <RadioGroupRoot v-bind="props" v-on="$listeners" class="grid gap-2">
    <slot />
  </RadioGroupRoot>
</template>
