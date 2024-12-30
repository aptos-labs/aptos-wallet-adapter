<script setup lang="ts">
import {
  AccountInfo,
  NetworkInfo,
  WalletInfo,
  isAptosNetwork,
} from "@aptos-labs/wallet-adapter-vue";
import { Network } from "@aptos-labs/ts-sdk";

const WalletIcon = defineAsyncComponent(
  () => import("~/components/ui/Wallet/WalletIcon.vue")
);
const WalletLink = defineAsyncComponent(
  () => import("~/components/ui/Wallet/WalletLink.vue")
);
const DisplayValue = defineAsyncComponent(
  () => import("~/components/DisplayValue.vue")
);

interface WalletConnectionProps {
  account: AccountInfo | null;
  network: NetworkInfo | null;
  wallet: WalletInfo | null;
}

const props = defineProps<WalletConnectionProps>();
defineEmits(["changeNetwork"]);

const { account, network, wallet } = toRefs(props);

const isValidNetworkName = computed(() => {
  if (isAptosNetwork(network.value)) {
    return Object.values<string | undefined>(Network).includes(
      network.value?.name
    );
  }
  // If the configured network is not an Aptos network, i.e is a custom network
  // we resolve it as a valid network name
  return true;
});

// TODO: Do a proper check for network change support
const isNetworkChangeSupported = computed(() =>
  ["Nightly", "Leap Wallet"].includes(wallet.value?.name ?? "")
);
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Wallet Connection</CardTitle>
    </CardHeader>
    <CardContent class="flex flex-col gap-10 pt-6">
      <div class="flex flex-col gap-6">
        <h4 class="text-lg font-medium">Wallet Details</h4>
        <LabelValueGrid
          :items="[
            {
              label: 'Icon',
              value: 'Not Present',
              icon: wallet?.icon,
              alt: wallet?.name,
              component: wallet?.icon ? WalletIcon : null,
            },
            { label: 'Name', value: wallet.name },
            {
              label: 'URL',
              value: 'Not Present',
              href: wallet?.url,
              component: wallet?.url ? WalletLink : null,
            },
          ]"
          :wallet="wallet"
        />
      </div>
      <div class="flex flex-col gap-6">
        <h4 class="text-lg font-medium">Account Info</h4>
        <LabelValueGrid
          :items="[
            {
              label: 'Address',
              value: account?.address,
              component: DisplayValue,
            },
            {
              label: 'Public key',
              value: 'Not Present',
              component: account?.publicKey.toString() ? DisplayValue : null,
            },
            {
              label: 'ANS name',
              subLabel: '(only if attached)',
              value: account?.ansName ?? 'Not Present',
            },
            {
              label: 'Min keys required',
              subLabel: '(only for multisig)',
              value: account?.minKeysRequired?.toString() ?? 'Not Present',
            },
          ]"
          :account="account"
        />
      </div>
      <div class="flex flex-col gap-6">
        <h4 class="text-lg font-medium">Network Info</h4>
        <LabelValueGrid
          :items="[
            {
              label: 'Network name',
              value: 'Not Present',
              component: DisplayValue,
            },
            {
              label: 'URL',
              value: 'Not Present',
              href: network.url,
              component: network.url ? WalletLink : null,
            },
            {
              label: 'Chain ID',
              value: network.chainId?.toString() ?? 'Not Present',
            },
          ]"
          :network="network"
          :is-valid-network-name="isValidNetworkName"
        />
      </div>
      <div class="flex flex-col gap-6">
        <h4 class="text-lg font-medium">Change Network</h4>
        <RadioGroup
          :modelValue="network.name"
          :orientation="'vertical'"
          class="flex gap-6"
          @update:modelValue="$event"
          :disabled="!isNetworkChangeSupported"
        >
          <div class="flex items-center space-x-2">
            <RadioGroupItem :value="Network.DEVNET" id="devnet-radio" />
            <Label for="devnet-radio">Devnet</Label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroupItem :value="Network.TESTNET" id="testnet-radio" />
            <Label for="testnet-radio">Testnet</Label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroupItem :value="Network.MAINNET" id="mainnet-radio" />
            <Label for="mainnet-radio">Mainnet</Label>
          </div>
        </RadioGroup>
        <div
          v-if="!isNetworkChangeSupported"
          class="text-sm text-red-600 dark:text-red-400"
        >
          * {{ wallet?.name ?? "This wallet" }} does not support network change
          requests
        </div>
      </div>
    </CardContent>
  </Card>
</template>
