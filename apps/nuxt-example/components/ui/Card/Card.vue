<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
    <template v-if="$slots.header">
      <CardHeader>
        <slot name="header" />
      </CardHeader>
    </template>
    <template v-if="$slots.content">
      <CardContent>
        <slot name="content" />
      </CardContent>
    </template>
    <template v-if="$slots.footer">
      <slot name="footer" />
    </template>
    <template v-else>
      <slot />
    </template>
  </div>
</template>
