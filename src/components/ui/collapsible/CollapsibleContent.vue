<script setup>
import { cn } from '@/lib/utils'
import { reactiveOmit } from '@vueuse/core'
import { CollapsibleContent, useForwardPropsEmits } from 'reka-ui'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  forceMount: { type: Boolean, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
  class: { type: null, required: false },
})

const emits = defineEmits(['contentFound'])

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <CollapsibleContent
    data-slot="collapsible-content"
    v-bind="{ ...forwarded, ...$attrs }"
    :class="
      cn(
        'overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up',
        props.class,
      )
    "
  >
    <slot />
  </CollapsibleContent>
</template>
