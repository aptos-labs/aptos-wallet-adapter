<script setup lang="ts">
defineEmits(["connect"]);
</script>

<template>
  <template v-if="$slots.connectButton">
    <slot name="connectButton" v-on="$listeners" />
  </template>
  <template v-else>
    <button v-bind="$attrs" @click="$emit('connect')">Connect</button>
  </template>
</template>
