<template>
  <!-- Desktop Layout -->
  <div class="flex flex-col h-screen bg-neutral-900 text-white">
    <!-- Header -->
    <TheHeader />

    <div class="flex flex-1 overflow-hidden">
      <SidebarProvider>
        <TheSidebar />

        <main class="w-full max-h-[calc(100vh-3rem)] flex-1 flex flex-col overflow-hidden">
          <ResizablePanelGroup direction="vertical" class="flex-1 overflow-hidden">
            <!-- Torrent List Panel -->
            <ResizablePanel :default-size="71.5" class="flex flex-col overflow-hidden">
              <ScrollArea class="flex-1 overflow-y-auto relative">
                <TheTorrentPanel v-if="uiStore.isTorrentPanelActive" />
                <TheSearchPanel v-else />
              </ScrollArea>
            </ResizablePanel>

            <!-- Resize Handle -->
            <ResizableHandle
              class="h-2 dark:bg-neutral-700 hover:bg-neutral-600 transition-colors"
            />

            <!-- Torrent Details Panel -->
            <ResizablePanel :min-size="1" :max-size="100" class="flex flex-col overflow-hidden">
              <TheDetails />
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </SidebarProvider>
    </div>
  </div>
</template>

<script setup>
import TheTorrentPanel from '@/components/TheTorrentPanel.vue'
import TheSidebar from '@/components/TheSidebar.vue'
import TheSearchPanel from '@/components/TheSearchPanel.vue'
import TheDetails from '@/components/TheDetails.vue'
import TheHeader from '@/components/TheHeader.vue'
import { SidebarProvider } from '@/components/ui/sidebar'
import { useUiStore } from '@/stores/ui'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'

const uiStore = useUiStore()
</script>
