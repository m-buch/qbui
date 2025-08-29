<script setup>
import { cn } from '@/lib/utils'
import { useVModel } from '@vueuse/core'

const props = defineProps({
  class: { type: null, required: false },
  defaultValue: { type: [String, Number], required: false },
  modelValue: { type: [String, Number], required: false },
})

const emits = defineEmits(['update:modelValue'])

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <textarea
    v-model="modelValue"
    data-slot="textarea"
    :class="
      cn(
        props.unstyled
          ? ''
          : 'p-2 rounded-lg dark:bg-neutral-950/50 border dark:border-neutral-700 dark:placeholder:text-neutral-500 focus-visible:border-neutral-950 transition',
        props.class
      )
    "
  />
</template>
