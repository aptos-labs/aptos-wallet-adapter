<script setup lang="ts">
type Variant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";
type Size = "default" | "sm" | "lg" | "icon";

type Props = {
  variant?: Variant;
  size?: Size;
};

const variants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline:
    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
};

const sizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
};

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  size: "default",
});
</script>

<template>
  <button
    :class="[
      variants[props.variant],
      sizes[props.size],
      'font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50',
    ]"
  >
    <slot />
  </button>
</template>
