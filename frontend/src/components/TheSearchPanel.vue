<template>
  <div class="p-6 bg-neutral-900">
    <!-- Search Input -->
    <div
      class="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 px-4 md:px-0"
    >
      <h2 class="text-xl font-light text-white mb-2 md:mb-0 hidden md:block">Search Trackers</h2>

      <div class="relative w-full md:w-64 mt-4 md:mt-0">
        <Search
          class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4 pointer-events-none"
        />

        <Input
          v-model="store.query"
          placeholder="Search across trackers..."
          class="pl-10 pr-10 bg-neutral-800/60 text-white border border-neutral-700 placeholder-neutral-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500"
          @keyup.enter="store.startSearch"
          @input="store.debouncedSearch"
        />

        <Button
          v-if="store.query"
          variant="ghost"
          size="icon"
          class="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
          @click="store.clearSearch"
        >
          <X class="w-4 h-4" />
        </Button>
      </div>
    </div>

    <!-- Results -->
    <div>
      <!-- Table Header -->
      <div
        class="grid grid-cols-12 gap-4 py-2 px-4 border-b border-neutral-700 text-sm text-gray-400"
      >
        <div
          class="col-span-6 flex items-center cursor-pointer hover:text-white"
          @click="store.setSort('name')"
        >
          <span>Name</span>
          <component
            :is="store.sortDir === 'asc' ? ChevronUp : ChevronDown"
            v-if="store.sortBy === 'name'"
            class="ml-1 h-4 w-4"
          />
        </div>
        <div
          class="col-span-2 flex items-center cursor-pointer hover:text-white"
          @click="store.setSort('size')"
        >
          <span>Size</span>
          <component
            :is="store.sortDir === 'asc' ? ChevronUp : ChevronDown"
            v-if="store.sortBy === 'size'"
            class="ml-1 h-4 w-4"
          />
        </div>
        <div
          class="col-span-1 flex items-center cursor-pointer hover:text-white"
          @click="store.setSort('seeders')"
        >
          <span>Seeds</span>
          <component
            :is="store.sortDir === 'asc' ? ChevronUp : ChevronDown"
            v-if="store.sortBy === 'seeders'"
            class="ml-1 h-4 w-4"
          />
        </div>
        <div
          class="col-span-1 flex items-center cursor-pointer hover:text-white"
          @click="store.setSort('leechers')"
        >
          <span>Leechers</span>
          <component
            :is="store.sortDir === 'asc' ? ChevronUp : ChevronDown"
            v-if="store.sortBy === 'leechers'"
            class="ml-1 h-4 w-4"
          />
        </div>
        <div
          class="col-span-2 flex items-center justify-end cursor-pointer hover:text-white"
          @click="store.setSort('tracker')"
        >
          <span>Tracker</span>
          <component
            :is="store.sortDir === 'asc' ? ChevronUp : ChevronDown"
            v-if="store.sortBy === 'tracker'"
            class="ml-1 h-4 w-4"
          />
        </div>
      </div>

      <!-- Results Rows -->
      <ContextMenu v-for="(result, index) in store.sortedResults" :key="index">
        <ContextMenuTrigger as-child>
          <div
            class="hidden md:grid grid-cols-12 gap-4 py-3 px-4 border-b border-neutral-700 cursor-pointer items-center text-sm"
            :class="{
              'bg-blue-500 text-white hover:bg-blue-500': store.selected === result,
              'hover:bg-neutral-800': store.selected !== result,
            }"
            @click="store.select(result)"
            @contextmenu="store.select(result)"
          >
            <div class="col-span-6 truncate text-white">{{ result.name }}</div>
            <div class="col-span-2 text-white">{{ formatSize(result.size) }}</div>
            <div class="col-span-1 text-white">{{ result.seeders }}</div>
            <div class="col-span-1 text-white">{{ result.leechers }}</div>
            <div class="col-span-2 text-right text-white">{{ result.tracker }}</div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent
          class="w-46 dark:bg-neutral-800/80 dark:backdrop-blur-sm dark:border-neutral-700"
        >
          <ContextMenuItem class="hover:bg-blue-500/80" @click="store.addTorrent(result)"
            >Download
            <ContextMenuShortcut>⌘D</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <!-- Loading State -->
      <div
        v-if="store.loading && !store.results.length"
        class="flex items-center justify-center min-h-[300px]"
      >
        <span class="text-neutral-400 text-sm">Loading results...</span>
      </div>

      <!-- No Results -->
      <div
        v-else-if="!store.results.length && store.hasSearched"
        class="flex items-center justify-center min-h-[300px] text-neutral-400 text-sm"
      >
        No results found. Try different search terms.
      </div>

      <!-- Initial Prompt -->
      <div
        v-else-if="!store.hasSearched"
        class="flex items-center justify-center min-h-[300px] text-neutral-400 text-sm"
      >
        Search across multiple trackers.
      </div>
    </div>
  </div>
</template>

<script setup>
import { onUnmounted } from 'vue'
import { useSearchStore } from '@/stores/search'
import { Input } from '@/components/ui/input'
import { formatSize } from '@/utils/formatters'
import { ChevronDown, ChevronUp, Search, X } from 'lucide-vue-next'
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
} from '@/components/ui/context-menu'
import { Button } from '@/components/ui/button'

const store = useSearchStore()

onUnmounted(() => store.stopActiveSearch())
</script>
