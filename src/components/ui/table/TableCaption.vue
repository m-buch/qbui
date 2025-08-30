<script setup>
import { cn } from "@/lib/utils";

const props = defineProps({
  class: { type: null, required: false },
});
</script>

<template>
  <caption
    data-slot="table-caption"
    :class="cn('text-neutral-500 mt-4 text-sm dark:text-neutral-400', props.class)"
  >
    <slot />
  </caption>
</template>
