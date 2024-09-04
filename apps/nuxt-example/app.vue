<script setup lang="ts">
import Toaster from "@/components/ui/toast/Toaster.vue";
import { registerWallet } from "./utils/standardWallet";

onBeforeMount(() => {
  registerWallet();
});
</script>
<template>
  <NuxtLayout name="default">
    <NuxtPage />
  </NuxtLayout>
  <Toaster />
</template>
