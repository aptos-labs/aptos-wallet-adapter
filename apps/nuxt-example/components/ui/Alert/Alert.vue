<script setup lang="ts">
type Variant = "default" | "destructive" | "warning";

type Props = {
  variant: Variant;
};

const variants = {
  default: "bg-background text-foreground",
  destructive:
    "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
  warning:
    "border-amber-600/50 text-amber-600 dark:text-amber-300 dark:border-amber-300 [&>svg]:text-amber-600 dark:[&>svg]:text-amber-300",
};

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
});
</script>

<template>
  <div role="alert" :class="variants[props.variant]">
    <slot />
  </div>
</template>
