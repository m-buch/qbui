<template>
  <header class="bg-neutral-700/70 h-12 px-4">
    <div class="h-full flex items-center justify-between">
      <!-- Title -->
      <div class="flex items-center">
        <Cloud class="size-5 text-white" />
        <h1 class="text-xl font-medium ml-1">qBittorrent</h1>
        <h1 class="text-xl font-medium ml-1 text-blue-400">WebUI</h1>
      </div>

      <!-- User actions -->
      <div class="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          class="rounded-full cursor-pointer hover:bg-neutral-700"
          :class="ui.isAddActive ? 'bg-neutral-700' : ''"
          @click="ui.setActivePanel(ui.isAddActive ? 'torrents' : 'add')"
        >
          <Plus class="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          class="rounded-full cursor-pointer hover:bg-neutral-700"
          :class="ui.isSearchActive ? 'bg-neutral-700' : ''"
          @click="ui.setActivePanel(ui.isSearchActive ? 'torrents' : 'search')"
        >
          <Search class="size-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="rounded-full cursor-pointer hover:bg-neutral-700"
            >
              <MoreHorizontal class="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            class="w-40 dark:bg-neutral-800/80 dark:backdrop-blur-sm dark:border-neutral-700"
          >
            <DropdownMenuItem @click="openSettings" class="hover:bg-neutral-600">
              Settings
              <DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator class="dark:bg-neutral-700" />
            <DropdownMenuItem @click="auth.logout" class="text-red-400 hover:bg-neutral-600">
              Logout
              <DropdownMenuShortcut>⇧⌘L</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { Cloud, MoreHorizontal, Search, Plus } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const auth = useAuthStore()
const ui = useUiStore()

function openSettings() {
  ui.setActivePanel('settings')
}
</script>
