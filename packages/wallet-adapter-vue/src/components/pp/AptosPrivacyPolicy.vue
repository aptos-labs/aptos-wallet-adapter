<script setup lang="ts">
import Disclaimer from "./Disclaimer.vue";
import Link from "./Link.vue";
import PoweredBy from "./PoweredBy.vue";

const APTOS_PRIVACY_POLICY_URL = "https://aptoslabs.com/privacy";
</script>

<template>
  <template v-if="$slots.disclaimer || $slots.link || $slots.poweredBy">
    <slot name="disclaimer" />
    <slot name="link" />
    <slot name="poweredBy" />
  </template>
  <template v-else>
    <div :class="$style.aptosPrivacyPolicy" v-bind="$attrs">
      <div>
        <Disclaimer />
        <Link :class="$style.link" :href="APTOS_PRIVACY_POLICY_URL" /><span
          >.</span
        >
      </div>
      <PoweredBy :class="$style.poweredBy" />
    </div>
  </template>
</template>

<style module lang="css">
:root {
  --muted-color: hsl(240 3.8% 46.1%);
  --foreground: hsl(240 10% 3.9%);
}
.aptosPrivacyPolicy {
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: 0.75rem;
  line-height: 1.25rem;
  color: var(--foreground);
}
.link {
  text-underline-offset: 0.25rem;
  text-decoration-line: underline;
  color: var(--muted-color);
}
.poweredBy {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  line-height: 1.25rem;
  color: var(--muted-color);
}
</style>
