<script setup lang="ts">
import {
  WalletInfo,
  AccountInfo,
  NetworkInfo,
} from "@aptos-labs/wallet-adapter-vue";
import { Network } from "@aptos-labs/ts-sdk";

export interface LabelValueGridProps {
  items: Array<{
    label: string;
    subLabel?: string;
    value: unknown;
    href?: string;
    icon?: string;
    alt?: string;
    component?: ReturnType<typeof defineAsyncComponent> | null;
  }>;
  wallet?: WalletInfo | null;
  account?: AccountInfo | null;
  network?: NetworkInfo | null;
  isValidNetworkName?: boolean;
}
const props = defineProps<LabelValueGridProps>();
const { wallet, account, network, isValidNetworkName } = toRefs(props);

function _value(label: string) {
  if (label === "Public key") {
    return account.value?.publicKey.toString();
  }
  if (label === "Address") {
    return account.value?.address;
  }
  if (label === "Network name") {
    return network.value?.name;
  }
  return "Not Present";
}

function isCorrect(label: string) {
  if (label === "Public key") {
    return !!account.value?.publicKey;
  }
  if (label === "Address") {
    return !!account.value?.address;
  }
  if (label === "Network name") {
    return isValidNetworkName.value;
  }
  return false;
}

function expected(label: string) {
  if (label === "Network name") {
    return Object.values<string>(Network).join(", ");
  }
  return "";
}
</script>

<template>
  <div class="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2 break-words">
    <template
      v-for="{ label, subLabel, value, component, href, icon, alt } in items"
    >
      <div class="flex flex-col text-muted-foreground">
        <div>{{ label }}</div>
        <div v-if="subLabel" class="text-xs">{{ subLabel }}</div>
      </div>
      <template v-if="component">
        <component
          :is="component"
          :src="icon"
          :alt="alt"
          :href="href"
          :value="_value(label)"
          :isCorrect="isCorrect(label)"
          :expected="expected(label)"
        />
      </template>
      <template v-else>
        {{ value }}
      </template>
    </template>
  </div>
</template>
