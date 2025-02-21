<script setup lang="ts">
import {
  AdapterWallet,
  APTOS_CONNECT_ACCOUNT_URL,
  isAptosConnectWallet,
  truncateAddress,
} from "@aptos-labs/wallet-adapter-vue";
import { Copy, LogOut, User } from "lucide-vue-next";
import { DialogRoot as Dialog, DialogTrigger } from "radix-vue";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useToast } from "~/components/ui/toast";
import { useNuxtApp } from "#app";
const { $walletAdapter } = useNuxtApp();
const { account, connected, disconnect, wallet, wallets, connect } =
  $walletAdapter || {};

const { toast } = useToast();
const isDialogOpen = ref(false);

function closeDialog() {
  isDialogOpen.value = false;
}

async function copyAddress() {
  if (!account?.value?.address) return;
  try {
    await navigator.clipboard.writeText(account.value.address.toString());
    toast({
      title: "Success",
      description: "Copied wallet address to clipboard.",
    });
  } catch {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to copy wallet address.",
    });
  }
}

async function connectWallet(wallet: AdapterWallet) {
  await connect(wallet.name);
}
</script>

<template>
  <template v-if="connected">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button>
          {{
            account?.ansName ||
            truncateAddress(account?.address?.toString() || "") ||
            "Unknown"
          }}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem @click="copyAddress" class="gap-2">
          <Copy class="h-4 w-4" /> Copy Address
        </DropdownMenuItem>
        <template v-if="wallet && isAptosConnectWallet(wallet)">
          <DropdownMenuItem as-child>
            <a
              :href="APTOS_CONNECT_ACCOUNT_URL"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2"
            >
              <User class="h-4 w-4" /> Account
            </a>
          </DropdownMenuItem>
        </template>
        <DropdownMenuItem @click="disconnect" class="gap-2">
          <LogOut class="h-4 w-4" /> Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </template>
  <template v-else>
    <Dialog class="w-96">
      <DialogTrigger asChild>
        <Button>Connect Wallet</Button>
      </DialogTrigger>
      <ConnectWalletDialog
        v-if="wallets && Array.isArray(wallets)"
        @close="closeDialog"
        @connect="connectWallet"
        :wallets="wallets"
      />
    </Dialog>
  </template>
</template>
