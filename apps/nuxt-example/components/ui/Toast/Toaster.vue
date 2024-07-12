<script setup lang="ts">
import {
  ToastProvider,
  Toast,
  ToastAction,
  ToastClose,
  ToastViewport,
  ToastTitle,
  ToastDescription,
} from "~/components/ui/Toast";
import { useToast } from "~/composables/useToast";

const { toasts } = useToast();
</script>

<template>
  <ToastProvider>
    <Toast
      v-for="{ id, title, action, description } in toasts"
      :key="`${id}-toast`"
    >
      <div class="grid gap-1">
        <template v-if="title">
          <ToastTitle>{{ title }}</ToastTitle>
        </template>
        <template v-if="description">
          <ToastDescription>{{ description }}</ToastDescription>
        </template>
        <template v-if="action">
          <ToastAction :alt-text="">{{ action }} </ToastAction>
        </template>
        <ToastClose />
      </div>
    </Toast>
    <ToastViewport />
  </ToastProvider>
</template>
