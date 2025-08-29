<template>
  <Sidebar
    :defaultOpen="true"
    collapsible="icon"
    class="top-12 max-h-[calc(100vh-3rem)] border-r border-neutral-950 text-white"
  >
    <SidebarContent class="bg-neutral-800 overflow-y-auto gap-0">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <div class="flex justify-end">
                <SidebarTrigger
                  class="p-4 hover:bg-neutral-700/70 text-blue-400 hover:text-blue-400 group cursor-pointer"
                >
                </SidebarTrigger>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <!-- Speed Graph -->
      <SidebarGroup class="group-data-[collapsible=icon]:hidden">
        <SpeedGraph />
      </SidebarGroup>

      <!-- Torrents Group -->
      <Collapsible v-model:open="torrentsOpen">
        <SidebarGroup>
          <div class="flex items-center justify-between">
            <SidebarGroupLabel
              class="px-2 pb-1 text-xs font-semibold text-neutral-400 tracking-wide"
              >Status</SidebarGroupLabel
            >
            <CollapsibleTrigger class="p-2">
              <ChevronDownIcon
                class="h-4 w-4 text-neutral-400 transition-transform"
                :class="torrentsOpen ? 'rotate-180' : ''"
              />
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem v-for="item in torrentMenu" :key="item.key">
                  <SidebarMenuButton asChild>
                    <button
                      @click="setFilter(item.key)"
                      class="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-sm cursor-pointer"
                      :class="
                        item.active
                          ? 'bg-neutral-700/70 text-white'
                          : 'hover:bg-neutral-700/70 text-neutral-300'
                      "
                    >
                      <component :is="item.icon" class="w-4 h-4 text-blue-400" />
                      <span class="truncate">{{ item.label }}</span>
                      <span class="ml-auto text-xs text-neutral-400 truncate">{{
                        item.count
                      }}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>

      <!-- Categories Group -->
      <Collapsible v-model:open="categoriesOpen">
        <SidebarGroup>
          <div class="flex items-center justify-between">
            <SidebarGroupLabel
              class="px-2 pb-1 text-xs font-semibold text-neutral-400 tracking-wide"
              >Categories</SidebarGroupLabel
            >
            <CollapsibleTrigger class="p-2">
              <ChevronDownIcon
                class="h-4 w-4 text-neutral-400 transition-transform"
                :class="categoriesOpen ? 'rotate-180' : ''"
              />
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem v-for="(category, name) in store.categories" :key="name">
                  <ContextMenu>
                    <ContextMenuTrigger asChild>
                      <SidebarMenuButton asChild>
                        <button
                          @click="setCategoryFilter(name)"
                          class="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-sm cursor-pointer"
                          :class="
                            store.filter === name && ui.activePanel === 'torrents'
                              ? 'bg-neutral-700/70 text-white'
                              : 'hover:bg-neutral-700/70 text-neutral-300'
                          "
                        >
                          <FolderOpen class="w-4 h-4 text-blue-400" />
                          <span class="truncate">{{ name }}</span>
                        </button>
                      </SidebarMenuButton>
                    </ContextMenuTrigger>
                    <ContextMenuContent
                      class="w-46 dark:bg-neutral-800/80 dark:backdrop-blur-sm dark:border-neutral-700"
                    >
                      <ContextMenuItem
                        class="hover:bg-blue-500/80 text-red-400"
                        @click="store.removeCategories([name])"
                      >
                        Remove
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    </SidebarContent>
  </Sidebar>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useTorrentStore } from '@/stores/torrents'
import { useUiStore } from '@/stores/ui'
import SpeedGraph from './SpeedGraph.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from '@/components/ui/context-menu'
import {
  Inbox as InboxArrowDownIcon,
  ArrowDownToLine as ArrowDownTrayIcon,
  ArrowUp as ArrowUpTrayIcon,
  AlertCircle as ExclamationCircleIcon,
  ChevronDown as ChevronDownIcon,
  FolderOpen as FolderOpen,
} from 'lucide-vue-next'

const store = useTorrentStore()
const ui = useUiStore()
const torrentsOpen = ref(true)
const categoriesOpen = ref(true)

const setFilter = (filter) => {
  if (ui.isSearchActive || ui.isAddActive) ui.setActivePanel('torrents')
  store.setFilter(filter)
}

const setCategoryFilter = (categoryName) => {
  if (ui.isSearchActive || ui.isAddActive) ui.setActivePanel('torrents')
  store.setFilter(categoryName)
}

const torrentMenu = computed(() => [
  {
    key: 'all',
    label: 'All',
    icon: InboxArrowDownIcon,
    count: store.counts.all,
    active: store.filter === 'all' && ui.activePanel === 'torrents',
  },
  {
    key: 'downloading',
    label: 'Downloading',
    icon: ArrowDownTrayIcon,
    count: store.counts.downloading,
    active: store.filter === 'downloading' && ui.activePanel === 'torrents',
  },
  {
    key: 'seeding',
    label: 'Seeding',
    icon: ArrowUpTrayIcon,
    count: store.counts.seeding,
    active: store.filter === 'seeding' && ui.activePanel === 'torrents',
  },
  {
    key: 'error',
    label: 'Errored',
    icon: ExclamationCircleIcon,
    count: store.counts.error,
    active: store.filter === 'error' && ui.activePanel === 'torrents',
  },
])

onMounted(() => {
  store.fetchCategories()
})
</script>
