<template>
  <div>
    <Toaster position="bottom-right" theme="dark" />
    <div class="p-0 md:p-6">
      <!-- Header with Title and Search -->
      <div
        class="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 px-4 md:px-0"
      >
        <h2 class="text-xl font-light text-white mb-2 md:mb-0 hidden md:block">
          {{ TorrentFilterLabels[store.filter] }}
        </h2>

        <div class="relative w-full md:w-64 mt-4 md:mt-0">
          <Search
            class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4 pointer-events-none"
          />

          <Input
            v-model="store.searchQuery"
            placeholder="Filter torrents..."
            class="pl-10 pr-10 bg-neutral-800/60 text-white border border-neutral-700 placeholder-neutral-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500"
          />

          <Button
            v-if="store.searchQuery"
            variant="ghost"
            size="icon"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            @click="store.setSearch('')"
          >
            <X class="w-4 h-4" />
          </Button>
        </div>
      </div>

      <!-- Table Header -->
      <div
        class="hidden md:grid grid-cols-12 gap-4 py-2 px-4 border-b border-neutral-700 text-sm text-gray-400"
      >
        <div
          class="col-span-5 flex items-center cursor-pointer hover:text-white transition-colors duration-150 justify-start"
          @click="store.setSort('name')"
        >
          <span>Name</span>
          <span v-if="store.sortBy === 'name'" class="ml-1">
            <component :is="store.sortDir === 'asc' ? ChevronUp : ChevronDown" class="w-4 h-4" />
          </span>
        </div>
        <div
          class="col-span-1 cursor-pointer hover:text-white transition-colors duration-150"
          @click="store.setSort('size')"
        >
          <div class="flex items-center">
            <span>Size</span>
            <span v-if="store.sortBy === 'size'" class="ml-1">
              <component :is="store.sortDir === 'asc' ? ChevronUp : ChevronDown" class="w-4 h-4" />
            </span>
          </div>
        </div>
        <div
          class="col-span-2 cursor-pointer hover:text-white transition-colors duration-150"
          @click="store.setSort('progress')"
        >
          <div class="flex items-center">
            <span>Progress</span>
            <span v-if="store.sortBy === 'progress'" class="ml-1">
              <component :is="store.sortDir === 'asc' ? ChevronUp : ChevronDown" class="w-4 h-4" />
            </span>
          </div>
        </div>
        <div
          class="col-span-1 cursor-pointer hover:text-white transition-colors duration-150"
          @click="store.setSort('dlspeed')"
        >
          <div class="flex items-center">
            <span>Speed</span>
            <span v-if="store.sortBy === 'dlspeed'" class="ml-1">
              <component :is="store.sortDir === 'asc' ? ChevronUp : ChevronDown" class="w-4 h-4" />
            </span>
          </div>
        </div>
        <div
          class="col-span-1 cursor-pointer hover:text-white transition-colors duration-150"
          @click="store.setSort('eta')"
        >
          <div class="flex items-center">
            <span>ETA</span>
            <span v-if="store.sortBy === 'eta'" class="ml-1">
              <component :is="store.sortDir === 'asc' ? ChevronUp : ChevronDown" class="w-4 h-4" />
            </span>
          </div>
        </div>
        <div
          class="col-span-1 cursor-pointer hover:text-white transition-colors duration-150"
          @click="store.setSort('num_seeds')"
        >
          <div class="flex items-center">
            <span>Seeds</span>
            <span v-if="store.sortBy === 'num_seeds'" class="ml-1">
              <component :is="store.sortDir === 'asc' ? ChevronUp : ChevronDown" class="w-4 h-4" />
            </span>
          </div>
        </div>
        <div
          class="col-span-1 cursor-pointer hover:text-white transition-colors duration-150 justify-end"
          @click="store.setSort('state')"
        >
          <div class="flex items-center justify-end">
            <span>Status</span>
            <span v-if="store.sortBy === 'state'" class="ml-1">
              <component :is="store.sortDir === 'asc' ? ChevronUp : ChevronDown" class="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>

      <div v-if="store.loading" class="py-8 text-center text-gray-400">Loading torrents...</div>
      <div v-else-if="store.all.length === 0" class="py-8 text-center text-gray-400">
        <p class="text-xl font-semibold">No torrents found</p>
        <p class="text-sm mt-4">Add torrents to get started</p>
      </div>
      <div v-else-if="store.filtered.length === 0" class="py-8 text-center text-gray-400">
        <p class="text-xl font-semibold">No items</p>
        <p class="text-sm mt-4">{{ categoryTitle }} items will appear here.</p>
      </div>
      <div v-else>
        <ContextMenu v-for="torrent in store.filtered" :key="torrent.hash">
          <ContextMenuTrigger as-child>
            <div
              class="hidden md:grid grid-cols-12 gap-4 py-3 px-4 border-b border-neutral-700 cursor-pointer items-center text-sm"
              :class="{
                'bg-blue-500 text-white hover:bg-blue-500': store.selected?.hash === torrent.hash,
                'hover:bg-neutral-800': store.selected?.hash !== torrent.hash,
              }"
              @click="store.selectTorrent(torrent)"
              @contextmenu="store.selectTorrent(torrent)"
            >
              <div class="col-span-5 truncate font-medium">{{ torrent.name }}</div>
              <div class="col-span-1 text-gray-300">{{ formatSize(torrent.size) }}</div>
              <div class="col-span-2">
                <div
                  class="w-full rounded-full h-1.5 mb-1 overflow-hidden"
                  :class="{
                    'bg-blue-700/50': store.selected?.hash === torrent.hash,
                    'bg-neutral-700': store.selected?.hash !== torrent.hash,
                  }"
                >
                  <div
                    class="h-1.5 rounded-full transition-[width] duration-1000 ease-in-out"
                    :class="{
                      'bg-gradient-to-r from-white to-blue-100':
                        store.selected?.hash === torrent.hash,
                      'bg-gradient-to-r from-blue-600 to-blue-400':
                        store.selected?.hash !== torrent.hash,
                    }"
                    :style="{ width: `${torrent.progress * 100}%` }"
                  ></div>
                </div>
              </div>
              <div class="col-span-1 text-gray-300">{{ formatSpeed(torrent.dlspeed) }}</div>
              <div class="col-span-1 text-gray-300">{{ formatETA(torrent.eta) }}</div>
              <div class="col-span-1 text-gray-300">{{ torrent.num_seeds }}</div>
              <div class="col-span-1 flex justify-end text-gray-300">
                {{ formatState(torrent.state) }}
              </div>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent
            class="w-46 dark:bg-neutral-800/80 dark:backdrop-blur-sm dark:border-neutral-700"
          >
            <ContextMenuItem
              class="hover:bg-blue-500/80"
              @click="store.pause(torrent)"
              v-if="isInStateGroup(torrent, 'unpaused')"
              >Pause
              <ContextMenuShortcut>⌘P</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem class="hover:bg-blue-500/80" @click="store.resume(torrent)" v-else
              >Resume
              <ContextMenuShortcut>⌘R</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem class="hover:bg-blue-500/80" @click="store.recheck(torrent)"
              >Force Recheck
              <ContextMenuShortcut>⌘F</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator class="dark:bg-neutral-700" />
            <ContextMenuItem
              class="hover:bg-blue-500/80 text-red-400"
              @click="store.delete(torrent)"
              >Delete
              <ContextMenuShortcut>⌘D</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem
              class="hover:bg-blue-500/80 text-red-400"
              @click="store.deleteWithFiles(torrent)"
              >Delete Files
              <ContextMenuShortcut>⌘X</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useTorrentStore } from '@/stores/torrents'
import { formatSize, formatSpeed, formatETA, formatState } from '@/utils/formatters'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'
import { isInStateGroup } from '@/utils/torrentStates'
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from '@/components/ui/context-menu'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-vue-next'
import { Toaster } from '@/components/ui/sonner'
import { TorrentFilterLabels } from '@/utils/torrentStates'

const store = useTorrentStore()

onMounted(() => {
  store.startPolling()
})

onUnmounted(() => {
  store.stopPolling()
})
</script>