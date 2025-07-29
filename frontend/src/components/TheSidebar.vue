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

      <!-- Search -->
      <SidebarGroup>
        <SidebarGroupLabel class="px-2 pb-1 text-xs font-semibold text-neutral-400 tracking-wide"
          >Download</SidebarGroupLabel
        >
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button
                  @click="ui.setActivePanel('search')"
                  class="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-sm cursor-pointer"
                  :class="{
                    'bg-neutral-700/70 text-white': ui.isSearchActive,
                    'hover:bg-neutral-700/70 text-neutral-300': !ui.isSearchActive,
                  }"
                >
                  <IconSearch class="w-4 h-4 text-blue-400" />
                  <span class="truncate">Search Trackers</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button
                  @click="showAddLinksDialog = true"
                  class="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-sm hover:bg-neutral-700/70 text-neutral-300 cursor-pointer"
                >
                  <IconLink class="w-4 h-4 text-blue-400" />
                  <span class="truncate">Add Links</span>
                </button>

                <AddLinksDialog v-model:open="showAddLinksDialog" @submit="handleLinksSubmit" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <!-- Torrents Group -->
      <SidebarGroup>
        <SidebarGroupLabel class="px-2 pb-1 text-xs font-semibold text-neutral-400 tracking-wide"
          >Torrents</SidebarGroupLabel
        >
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
                  <span class="ml-auto text-xs text-neutral-400 truncate">{{ item.count }}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <!-- Categories Group -->
      <SidebarGroup>
        <SidebarGroupLabel class="px-2 pb-1 text-xs font-semibold text-neutral-400 tracking-wide"
          >Categories</SidebarGroupLabel
        >
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem
              v-for="(category, name) in store.categories"
              :key="name"
            >
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
                  <InboxArrowDownIcon class="w-4 h-4 text-blue-400" />
                  <span class="truncate">{{ name }}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useTorrentStore } from '@/stores/torrents'
import { useUiStore } from '@/stores/ui'
import AddLinksDialog from '@/components/AddLinksDialog.vue'
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
import {
  Inbox as InboxArrowDownIcon,
  ArrowDownToLine as ArrowDownTrayIcon,
  ArrowUp as ArrowUpTrayIcon,
  AlertCircle as ExclamationCircleIcon,
  Search as IconSearch,
  Link as IconLink,
} from 'lucide-vue-next'

const showAddLinksDialog = ref(false)
const store = useTorrentStore()
const ui = useUiStore()

const handleLinksSubmit = (links) => {
  console.log('Submitted links:', links)
  // TODO: Implement this
}

const setFilter = (filter) => {
  if (ui.isSearchActive) ui.setActivePanel('torrents')
  store.setFilter(filter)
}

const setCategoryFilter = (categoryName) => {
  if (ui.isSearchActive) ui.setActivePanel('torrents')
  store.setFilter(categoryName)
}

const torrentMenu = computed(() => [
  {
    key: 'all',
    label: 'All Torrents',
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
