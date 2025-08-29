<template>
  <div class="space-y-4">
    <!-- Torrent Name -->
    <div>
      <h3 class="text-base font-medium leading-tight">{{ torrent.name }}</h3>
      <div class="text-xs text-gray-400 mt-0.5">{{ torrent.tracker }}</div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
      <div class="flex flex-col">
        <span class="text-xs text-gray-400">Size</span>
        <span>{{ formatSize(torrent.size) }}</span>
      </div>

      <div class="flex flex-col">
        <span class="text-xs text-gray-400">Seeds</span>
        <span>{{ torrent.seeders }}</span>
      </div>

      <div class="flex flex-col">
        <span class="text-xs text-gray-400">Leechers</span>
        <span>{{ torrent.leechers }}</span>
      </div>

      <div class="flex flex-col">
        <span class="text-xs text-gray-400">Added</span>
        <span>{{ new Date(torrent.added).toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatSize } from '@/utils/formatters'

defineProps({
  torrent: Object,
})
</script>
