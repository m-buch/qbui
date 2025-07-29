<template>
  <Dialog :open="open" @update:open="(val) => emit('update:open', val)">
    <DialogContent
      class="p-5 sm:max-w-lg dark:bg-neutral-900 dark:border dark:border-neutral-700 text-white"
    >
      <DialogHeader>
        <DialogTitle class="text-white text-md">Add Magnet Links or URLs</DialogTitle>
        <DialogDescription class="text-neutral-400 text-xs">
          Paste one per line. Magnet links, hashes, or torrent URLs are supported.
        </DialogDescription>
      </DialogHeader>

      <Textarea
        v-model="input"
        autofocus
        rows="6"
        placeholder="magnet:?xt=urn:btih:..."
        class="resize-y text-sm text-white dark:placeholder-neutral-500 border dark:border-neutral-800 dark:focus-visible:outline-none dark:focus-visible:ring-[1.5px] dark:focus-visible:ring-blue-500"
      />

      <DialogFooter>
        <Button
          variant="ghost"
          @click="handleCancel"
          class="text-neutral-300 hover:bg-neutral-700/70"
          >Cancel</Button
        >
        <Button @click="handleSubmit" class="bg-blue-500 hover:bg-blue-600 text-white">Add Torrents</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ref, watch } from 'vue'

const props = defineProps({
  open: Boolean,
})
const emit = defineEmits(['update:open', 'submit'])

const input = ref('')

// Reset textarea when opened
watch(
  () => props.open,
  (val) => {
    if (val) input.value = ''
  },
)

const handleSubmit = () => {
  const links = input.value
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  emit('submit', links)
  emit('update:open', false)
}

const handleCancel = () => {
  emit('update:open', false)
}
</script>
