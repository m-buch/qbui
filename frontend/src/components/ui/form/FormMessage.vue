<script setup>
import { cn } from '@/lib/utils'
import { ErrorMessage } from 'vee-validate'
import { toValue } from 'vue'
import { useFormField } from './useFormField'

const props = defineProps({
  class: { type: null, required: false },
})

const { name, formMessageId } = useFormField()
</script>

<template>
  <ErrorMessage
    :id="formMessageId"
    data-slot="form-message"
    as="p"
    :name="toValue(name)"
    :class="cn('text-neutral-50 text-sm dark:text-neutral-50', props.class)"
  />
</template>
