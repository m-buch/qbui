<template>
  <div class="p-6 bg-neutral-900">
    <div class="flex items-center gap-2 mb-4 px-4 md:px-0">
      <Button
        variant="ghost"
        size="icon"
        class="rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
        @click="ui.setActivePanel('torrents')"
      >
        <ArrowLeft class="size-5" />
      </Button>
      <h2 class="text-xl font-light text-white hidden md:block">Settings</h2>
    </div>
    <div class="px-4 md:px-0">
      <p class="text-neutral-400 text-sm">Settings coming soon.</p>
    </div>
  </div>
</template>

<script setup>
import { useUiStore } from '@/stores/ui'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-vue-next'

const ui = useUiStore()
</script>
