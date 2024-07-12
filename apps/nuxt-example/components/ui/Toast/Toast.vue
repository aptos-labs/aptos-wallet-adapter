<script setup lang="ts">
import { ToastRoot } from "radix-vue";

type Variant = "default" | "destructive";

type Props = {
  variant: Variant;
};

const variants = {
  default: "border bg-background text-foreground",
  destructive:
    "destructive group border-destructive bg-destructive text-destructive-foreground",
};

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
});
</script>

<template>
  <ToastRoot :class="variants[props.variant]">
    <slot />
  </ToastRoot>
</template>
