<script setup lang="ts">
const { $walletAdapter } = useNuxtApp();
useAutoConnect($walletAdapter.autoConnect);
const setAutoConnect = (value: boolean) => {
  $walletAdapter.autoConnect.value = value;
};
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Wallet Selection</CardTitle>
      <CardDescription>
        Connect a wallet using the following wallet connect button.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="flex flex-wrap gap-6 pt-6 pb-12 justify-between items-center">
        <div class="flex flex-col gap-4 items-center ml-auto mr-auto">
          <div class="text-sm text-muted-foreground">shadcn/ui</div>
          <WalletSelector />
        </div>
      </div>
      <label class="flex items-center gap-4 cursor-pointer">
        <Switch
          id="auto-connect-switch"
          :checked="$walletAdapter.autoConnect.value"
          @update:checked="setAutoConnect"
        />
        <Label for="auto-connect-switch"> Auto reconnect on page load </Label>
      </label>
    </CardContent>
  </Card>
</template>
