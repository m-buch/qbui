<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  class: { type: null, required: false },
})
</script>

<template>
  <p
    data-slot="card-description"
    :class="cn('text-neutral-500 text-sm dark:text-neutral-400', props.class)"
  >
    <slot />
  </p>
</template>
