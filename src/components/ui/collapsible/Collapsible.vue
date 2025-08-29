<script setup>
import { CollapsibleRoot, useForwardPropsEmits } from 'reka-ui'

const props = defineProps({
  open: { type: Boolean, required: false },
  defaultOpen: { type: Boolean, required: false },
  disabled: { type: Boolean, required: false },
  unmountOnHide: { type: Boolean, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
})

const emits = defineEmits(['update:open'])

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <CollapsibleRoot data-slot="collapsible" v-bind="forwarded">
    <slot />
  </CollapsibleRoot>
</template>
