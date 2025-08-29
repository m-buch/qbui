<script setup>
import { cn } from '@/lib/utils'
import { reactiveOmit } from '@vueuse/core'
import { GripVertical } from 'lucide-vue-next'
import { SplitterResizeHandle, useForwardPropsEmits } from 'reka-ui'

const props = defineProps({
  id: { type: String, required: false },
  hitAreaMargins: { type: Object, required: false },
  tabindex: { type: Number, required: false },
  disabled: { type: Boolean, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
  class: { type: null, required: false },
  withHandle: { type: Boolean, required: false },
})
const emits = defineEmits(['dragging'])

const delegatedProps = reactiveOmit(props, 'class', 'withHandle')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <SplitterResizeHandle
    data-slot="resizable-handle"
    v-bind="forwarded"
    :class="
      cn(
        'bg-neutral-200 focus-visible:ring-neutral-950 relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden data-[orientation=vertical]:h-px data-[orientation=vertical]:w-full data-[orientation=vertical]:after:left-0 data-[orientation=vertical]:after:h-1 data-[orientation=vertical]:after:w-full data-[orientation=vertical]:after:-translate-y-1/2 data-[orientation=vertical]:after:translate-x-0 [&[data-orientation=vertical]>div]:rotate-90 dark:bg-neutral-800 dark:focus-visible:ring-neutral-300',
        props.class,
      )
    "
  >
    <template v-if="props.withHandle">
      <div
        class="bg-neutral-200 z-10 flex h-4 w-3 items-center justify-center rounded-xs dark:bg-neutral-700"
      >
        <GripVertical class="size-2.5" />
      </div>
    </template>
  </SplitterResizeHandle>
</template>
