<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  class: { type: null, required: false },
})
</script>

<template>
  <span
    data-slot="context-menu-shortcut"
    :class="
      cn('text-neutral-500 ml-auto text-xs tracking-widest dark:text-neutral-400', props.class)
    "
  >
    <slot />
  </span>
</template>
