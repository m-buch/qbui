<template>
  <Tabs
    v-if="torrent"
    orientation="vertical"
    default-value="general"
    class="flex-col h-full"
  >
    <TabsList
      class="flex-row h-full gap-1 mt-1 ml-4 dark:bg-neutral-800/0 p-0"
    >
      <TabsTrigger
        value="general"
        class="px-2 text-xs text-neutral-300 flex items-center justify-center rounded-b-none dark:bg-neutral-800/30 data-[state=active]:bg-neutral-800/70"
      >
        <InfoIcon class="size-4 text-blue-400" />
        <p>General</p>
      </TabsTrigger>
      <TabsTrigger
        value="trackers"
        class="px-2 text-xs text-neutral-300 flex items-center justify-center rounded-b-none dark:bg-neutral-800/30 data-[state=active]:bg-neutral-800/70"
      >
        <LinkIcon class="size-4 text-blue-400" />
        <p>Trackers</p>
      </TabsTrigger>
      <TabsTrigger
        value="peers"
        class="px-2 text-xs text-neutral-300 flex items-center justify-center rounded-b-none dark:bg-neutral-800/30 data-[state=active]:bg-neutral-800/70"
      >
        <UsersIcon class="size-4 text-blue-400" />
        <p>Peers</p>
      </TabsTrigger>
      <TabsTrigger
        value="webseeds"
        class="px-2 text-xs text-neutral-300 flex items-center justify-center rounded-b-none dark:bg-neutral-800/30 data-[state=active]:bg-neutral-800/70"
      >
        <GlobeIcon class="size-4 text-blue-400" />
        <p>HTTP Sources</p>
      </TabsTrigger>
      <TabsTrigger
        value="files"
        class="px-2 text-xs text-neutral-300 flex items-center justify-center rounded-b-none dark:bg-neutral-800/30 data-[state=active]:bg-neutral-800/70"
      >
        <FolderTreeIcon class="size-4 text-blue-400" />
        <p>Content</p>
      </TabsTrigger>
    </TabsList>

    <!-- General Tab -->
    <TabsContent value="general" class="flex-1 p-4 bg-neutral-800/70">
      <div class="space-y-1">
        <div>
          <h3 class="text-base font-medium leading-tight">{{ torrent.name }}</h3>
          <div class="text-xs text-gray-400 mt-0.5">{{ torrent.hash }}</div>
        </div>

        <div class="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
          <div class="flex flex-col">
            <span class="text-xs text-gray-400">Time Active</span>
            <span>{{ formatDuration(details.properties?.time_elapsed) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400">ETA</span>
            <span>{{ formatETA(torrent.eta) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400">Connections</span>
            <span>
              {{ details.properties?.nb_connections }} (
              {{ details.properties?.nb_connections_limit }} max)
            </span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400">Downloaded</span>
            <span>{{ formatSize(details.properties?.total_downloaded) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400">Uploaded</span>
            <span>{{ formatSize(details.properties?.total_uploaded) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400">Seeds</span>
            <span>{{ torrent.num_seeds }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400">Download Speed</span>
            <span>{{ formatSpeed(torrent.dlspeed) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400">Upload Speed</span>
            <span>{{ formatSpeed(torrent.upspeed) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400">Peers</span>
            <span>{{ torrent.num_leechs }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400">Download Limit</span>
            <span>{{ formatLimit(details.properties?.dl_limit) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400">Upload Limit</span>
            <span>{{ formatLimit(details.properties?.up_limit) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400">Wasted</span>
            <span>{{ formatSize(details.properties?.total_wasted) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400">Share Ratio</span>
            <span>{{ formatRatio(torrent.ratio) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400">Last Seen Complete</span>
            <span>{{ formatTimestamp(details.properties?.last_seen) }}</span>
          </div>
        </div>

        <Separator class="my-2" label="Information" />

        <div class="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
          <div class="flex flex-col">
            <span class="text-xs text-gray-400">Total Size</span>
            <span>{{ formatSize(details.properties?.total_size || torrent.size) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400">Pieces</span>
            <span>
              {{
                details.properties
                  ? `${details.properties.pieces_num} x ${formatSize(details.properties.piece_size)}`
                  : ''
              }}
            </span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400">Created By</span>
            <span>{{ details.properties?.created_by }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400">Added On</span>
            <span>{{ formatTimestamp(torrent.added_on) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400">Completed On</span>
            <span>{{ formatTimestamp(torrent.completion_on) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400">Created On</span>
            <span>{{ formatTimestamp(details.properties?.creation_date) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400">Torrent Hash</span>
            <span class="truncate">{{ torrent.hash }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400">Save Path</span>
            <span class="truncate">{{ details.properties?.save_path }}</span>
          </div>
          <div class="flex flex-col col-span-2">
            <span class="text-xs text-gray-400">Comment</span>
            <span>{{ details.properties?.comment }}</span>
          </div>
        </div>
      </div>
    </TabsContent>

    <!-- Trackers Tab -->
    <TabsContent value="trackers" class="flex-1 p-4 bg-neutral-800/70">
      <Table v-if="details.trackers.length">
        <TableHeader>
          <TableRow class="border-neutral-600">
            <TableHead>URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Peers</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="tr in details.trackers" :key="tr.url" class="border-neutral-600">
            <TableCell class="truncate">{{ tr.url }}</TableCell>
            <TableCell>{{ tr.msg || tr.status }}</TableCell>
            <TableCell>{{ tr.num_peers }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div v-else class="text-sm text-gray-400">No trackers</div>
    </TabsContent>

    <!-- Peers Tab -->
    <TabsContent value="peers" class="flex-1 p-4 bg-neutral-800/70">
      <Table v-if="details.peers.length">
        <TableHeader>
          <TableRow class="border-neutral-600">
            <TableHead>IP</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>DL</TableHead>
            <TableHead>UL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="peer in details.peers" :key="peer.ip" class="border-neutral-600">
            <TableCell>{{ peer.ip }}</TableCell>
            <TableCell>{{ peer.client }}</TableCell>
            <TableCell>{{ Math.round(peer.progress * 100) }}%</TableCell>
            <TableCell>{{ formatSpeed(peer.dl_speed) }}</TableCell>
            <TableCell>{{ formatSpeed(peer.up_speed) }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div v-else class="text-sm text-gray-400">No peers</div>
    </TabsContent>

    <!-- HTTP Sources Tab -->
    <TabsContent value="webseeds" class="flex-1 p-4 bg-neutral-800/70">
      <Table v-if="details.webseeds.length">
        <TableHeader>
          <TableRow class="border-neutral-600">
            <TableHead>URL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="url in details.webseeds" :key="url" class="border-neutral-600">
            <TableCell class="truncate">{{ url }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div v-else class="text-sm text-gray-400">No HTTP sources</div>
    </TabsContent>

    <!-- Content Tab -->
    <TabsContent value="files" class="flex-1 p-4 bg-neutral-800/70">
      <Table v-if="details.files.length">
        <TableHeader>
          <TableRow class="border-neutral-600">
            <TableHead>File</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="file in details.files" :key="file.name" class="border-neutral-600">
            <TableCell class="truncate">{{ file.name }}</TableCell>
            <TableCell>{{ formatSize(file.size) }}</TableCell>
            <TableCell>{{ Math.round(file.progress * 100) }}%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div v-else class="text-sm text-gray-400">No files</div>
    </TabsContent>
  </Tabs>
</template>

<script setup>
import { computed } from 'vue'
import { useTorrentStore } from '@/stores/torrents'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import {
  Info as InfoIcon,
  Link as LinkIcon,
  Users as UsersIcon,
  Globe as GlobeIcon,
  FolderTree as FolderTreeIcon,
} from 'lucide-vue-next'
import {
  formatSize,
  formatSpeed,
  formatETA,
  formatRatio,
  formatDuration,
  formatTimestamp,
  formatLimit
} from '@/utils/formatters'
import {Tooltip, TooltipTrigger, TooltipContent, TooltipProvider} from './ui/tooltip'

defineProps({
  torrent: Object,
})

const torrents = useTorrentStore()
const details = computed(() => torrents.details)

</script>

