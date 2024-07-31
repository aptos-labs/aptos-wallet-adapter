<script setup lang="ts">
interface DisplayValueProps {
  value: string;
  isCorrect: boolean;
  expected?: string;
}
defineProps<DisplayValueProps>();
</script>

<template>
  <div class="flex flex-col gap-2">
    <p
      :class="
        isCorrect
          ? 'text-green-700 dark:text-green-300'
          : 'text-red-600 dark:text-red-400'
      "
    >
      {{ value }}
    </p>
  </div>
  <template v-if="expected && !isCorrect">
    <p class="text-sm">Expected: {{ expected }}</p>
  </template>
</template>
