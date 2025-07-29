<template>
  <ScrollArea class="h-full w-full bg-neutral-800/50">
    <div class="p-4 h-full">
      <div v-if="!torrent" class="h-full flex items-center justify-center text-gray-400">
        <div class="flex flex-col items-center gap-2 my-16">
          <p class="text-lg font-semibold">No torrent selected</p>
          <p class="text-sm">Select a torrent to view details</p>
        </div>
      </div>
      <div v-else>
        <TheDetailsTorrents v-if="ui.activePanel === 'torrents'" :torrent="torrent" />
        <TheDetailsSearch v-else-if="ui.activePanel === 'search'" :torrent="torrent" />
      </div>
    </div>
  </ScrollArea>
</template>

<script setup>
import { computed } from 'vue'
import { useTorrentStore } from '@/stores/torrents'
import { useUiStore } from '@/stores/ui'
import { useSearchStore } from '@/stores/search'
import { ScrollArea } from '@/components/ui/scroll-area'

import TheDetailsTorrents from '@/components/TheDetailsTorrents.vue'
import TheDetailsSearch from '@/components/TheDetailsSearch.vue'

const ui = useUiStore()
const torrents = useTorrentStore()
const search = useSearchStore()

const torrent = computed(() => (ui.activePanel === 'search' ? search.selected : torrents.selected))
</script>
