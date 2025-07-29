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
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { Cloud, MoreHorizontal } from 'lucide-vue-next'
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

function openSettings() {
  console.log('Open settings')
  // Implement this
}
</script>
