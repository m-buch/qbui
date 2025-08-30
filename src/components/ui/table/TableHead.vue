<script setup>
import { cn } from "@/lib/utils";

const props = defineProps({
  class: { type: null, required: false },
});
</script>

<template>
  <th
    data-slot="table-head"
    :class="
      cn(
        'text-neutral-500 h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] dark:text-neutral-400',
        props.class,
      )
    "
  >
    <slot />
  </th>
</template>
