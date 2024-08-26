<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next';
import { isMainnet } from "@/utils";
const { $walletAdapter } = useNuxtApp();
const { network, connected, account, wallet, changeNetwork } =
  $walletAdapter || {};


</script>

<template>
  <main class="flex flex-col w-full max-w-[1000px] p-6 pb-12 md:px-8 gap-6">
    <div class="flex justify-between gap-6 pb-10">
      <div class="flex flex-col gap-2 md:gap-3">
        <h1 class="text-xl sm:text-3xl font-semibold tracking-tight">
          Aptos Wallet Adapter Tester
          {{ network?.name ? ` — ${network.name}` : "" }}
        </h1>
        <a
          href="https://github.com/aptos-labs/aptos-wallet-adapter/tree/main/apps/nuxt-example"
          target="_blank"
          rel="noreferrer"
          class="text-sm text-muted-foreground underline underline-offset-2 font-medium leading-none"
        >
          Demo App Source Code
        </a>
      </div>
      <ThemeToggle />
    </div>
    <client-only>
      <WalletSelection />
      <template v-if="connected">
        <WalletConnection
          :account="account"
          :network="network"
          :wallet="wallet"
          @changeNetwork="changeNetwork"
        />
        <template v-if="isMainnet(connected, network?.name)">
          <Alert variant="warning">
            <AlertCircle class="w-4 h-4 mr-2" />
            <AlertTitle>Warning</AlertTitle>
            <p>
              You are connected to the mainnet. Please be cautious when
              interacting with the blockchain.
            </p>
          </Alert>
        </template>
        <TransactionParameters />
        <SingleSigner />
        <Sponsor />
        <MultiAgent />
      </template>
    </client-only>
  </main>
</template>
