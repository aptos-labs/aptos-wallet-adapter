<script setup lang="ts">
interface WalletLinkProps {
  href: string;
}
defineProps<WalletLinkProps>();
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noreferrer"
    class="text-blue-600 dark:text-blue-300"
  >
    {{ href }}
  </a>
</template>
