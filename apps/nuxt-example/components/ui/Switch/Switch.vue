<script setup lang="ts">
import {
  SwitchRoot,
  SwitchRootProps,
  SwitchThumb,
  SwitchThumbProps,
  SwitchRootEmits,
} from "radix-vue";

const props = defineProps<{
  switch: SwitchRootProps;
  thumb?: SwitchThumbProps;
}>();

defineEmits<SwitchRootEmits>();
</script>

<template>
  <SwitchRoot
    :checked="props.switch.checked"
    @update:checked="$emit('update:checked', $event)"
    class="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
  >
    <SwitchThumb
      v-bind="props.thumb"
      class="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
    />
  </SwitchRoot>
</template>
