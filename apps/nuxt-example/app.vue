<script setup lang="ts">
const { toast } = useToast();
import { registerWallet } from "./utils/standardWallet";

onBeforeMount(() => {
  registerWallet();
});

onMounted(() => {
  toast({
    title: "Welcome",
    description:
      "This is a simple example of how to use Aptos Wallet Adapter with Vue and Nuxt.js.",
  });
});
</script>
<template>
  <NuxtLayout name="default">
    <NuxtPage />
  </NuxtLayout>
</template>
