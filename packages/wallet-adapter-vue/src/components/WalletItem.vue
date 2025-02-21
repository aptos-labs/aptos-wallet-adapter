<script setup lang="ts">
import { computed, toRefs } from "vue";
import {
  AdapterWallet,
  WalletReadyState,
  isRedirectable,
  isInstallRequired,
  AdapterNotDetectedWallet,
} from "@aptos-labs/wallet-adapter-core";
import WalletIcon from "./base/WalletIcon.vue";
import WalletName from "./base/WalletName.vue";
import WalletConnectButton from "./base/WalletConnectButton.vue";
import WalletInstallLink from "./base/WalletInstallLink.vue";

interface WalletItemProps {
  wallet: AdapterWallet | AdapterNotDetectedWallet;
}

const props = defineProps<WalletItemProps>();
const emit = defineEmits(["connect"]);

const { wallet } = toRefs(props);

const isWalletReady = computed(() => {
  return wallet.value.readyState === WalletReadyState.Installed;
});

const mobileSupport = computed(() => {
  return "deeplinkProvider" in wallet.value && wallet.value.deeplinkProvider;
});

const isReady = computed(() => {
  return Boolean(
    isWalletReady.value || (isRedirectable() && mobileSupport.value)
  );
});
</script>

<template>
  <template v-if="$slots.default">
    <slot />
  </template>
  <template v-else>
    <div :class="$style.walletItem">
      <div :class="$style.walletName">
        <WalletIcon v-if="isReady" :icon="wallet.icon" :name="wallet.name" />
        <WalletName v-if="isReady" :name="wallet.name" />
      </div>
      <WalletInstallLink
        v-if="isInstallRequired(wallet) && isReady"
        :class="$style.installLink"
        :installLink="wallet.url"
      />
      <WalletConnectButton
        v-else-if="isReady"
        :class="$style.connectButton"
        @connect="emit('connect', wallet)"
      />
    </div>
  </template>
</template>

<style module lang="css">
.walletItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  gap: 1rem;
  border-radius: calc(0.5rem - 2px);
  border-width: 1px;
}
.walletName {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.installLink {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  border-radius: calc(0.5rem - 2px);
  height: 2.25rem;
  font-weight: 500;
  color: inherit;
}
.installLink:hover {
  background-color: hsl(240 5.9% 10%);
}
.connectButton {
  padding: 0.3rem 0.7rem;
  height: auto;
  border-radius: calc(0.5rem - 2px);
  font-size: 16px;
  background-color: hsl(231, 73%, 44%);
  color: white;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02);
  transition: background-color 0.15s ease;
}
.connectButton:hover {
  background-color: hsla(231, 73%, 44%, 0.6);
}
</style>
