<template>
  <div class="space-y-4">
    <!-- Torrent Name and Hash -->
    <div>
      <h3 class="text-base font-medium leading-tight">{{ torrent.name }}</h3>
      <div class="text-xs text-gray-400 mt-0.5">{{ torrent.hash }}</div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
      <div class="flex flex-col">
        <span class="text-xs text-gray-400">Size</span>
        <span>{{ formatSize(torrent.size) }}</span>
      </div>

      <div class="flex flex-col">
        <span class="text-xs text-gray-400">Progress</span>
        <span>{{ Math.round(torrent.progress * 100) }}%</span>
      </div>

      <div class="flex flex-col">
        <span class="text-xs text-gray-400">Status</span>
        <span>{{ formatState(torrent.state) }}</span>
      </div>

      <div class="flex flex-col">
        <span class="text-xs text-gray-400">Down</span>
        <span>{{ formatSpeed(torrent.dlspeed) }}</span>
      </div>

      <div class="flex flex-col">
        <span class="text-xs text-gray-400">Up</span>
        <span>{{ formatSpeed(torrent.upspeed) }}</span>
      </div>

      <div class="flex flex-col">
        <span class="text-xs text-gray-400">ETA</span>
        <span>{{ formatETA(torrent.eta) }}</span>
      </div>
    </div>

    <!-- Labeled Separator -->
    <Separator class="my-2 mb-4" label="Additional Stats" />

    <!-- Additional Stats Section -->
    <div class="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
      <div class="flex flex-col">
        <span class="text-xs text-gray-400">Ratio</span>
        <span>{{ formatRatio(torrent.ratio) }}</span>
      </div>

      <div class="flex flex-col">
        <span class="text-xs text-gray-400">Seeds</span>
        <span>{{ torrent.num_seeds }}</span>
      </div>

      <div class="flex flex-col">
        <span class="text-xs text-gray-400">Leechers</span>
        <span>{{ torrent.num_leechs }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatSize, formatSpeed, formatETA, formatRatio, formatState } from '@/utils/formatters'
import { Separator } from '@/components/ui/separator'

defineProps({
  torrent: Object,
})
</script>
