<script setup lang="ts">
import {
  AdapterWallet,
  AdapterNotDetectedWallet,
  WalletItem,
  WalletInstallLink,
  isInstallRequired as _isInstallRequired,
} from "@aptos-labs/wallet-adapter-vue";
import { computed, toRefs } from "vue";

interface Props {
  wallet: AdapterWallet | AdapterNotDetectedWallet;
}

const props = defineProps<Props>();
const { wallet } = toRefs(props);

const emit = defineEmits(["connect", "close"]);

const isInstallRequired = computed(() => {
  return _isInstallRequired(wallet.value);
});

function customConnectHandler() {
  emit("connect", wallet.value);
  emit("close");
}
</script>

<template>
  <WalletItem :wallet="wallet">
    <div
      class="flex items-center justify-between px-4 py-3 gap-4 border rounded-md"
    >
      <div class="flex items-center gap-4">
        <img :src="wallet.icon" :alt="wallet.name" class="h-5 w-5" />
        <span class="text-base font-normal">{{ wallet.name }}</span>
      </div>
      <template v-if="isInstallRequired">
        <WalletInstallLink :installLink="wallet.url" />
      </template>
      <Button v-else size="sm" @click="customConnectHandler">Connect</Button>
    </div>
  </WalletItem>
</template>
