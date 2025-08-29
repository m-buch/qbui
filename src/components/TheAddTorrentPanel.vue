<template>
  <div class="p-6 bg-neutral-900">
    <div class="flex items-center gap-2 mb-4 px-4 md:px-0">
      <Button
        variant="ghost"
        size="icon"
        class="rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
        @click="ui.setActivePanel('torrents')"
      >
        <ArrowLeft class="size-5" />
      </Button>
      <h2 class="text-xl font-light text-white hidden md:block">Add Torrents</h2>
    </div>
    <div class="px-4 md:px-0">
      <div class="grid md:grid-cols-2 gap-4">
        <div class="space-y-4">
          <div>
            <Label for="links" class="text-neutral-300 text-sm mb-1 block"
              >Magnet links or URLs</Label
            >
            <Textarea
              id="links"
              v-model="links"
              rows="4"
              placeholder="magnet:?xt=urn:btih:..."
              class="resize-y w-full h-48 text-sm text-white dark:placeholder-neutral-500 border dark:border-neutral-800 dark:focus-visible:outline-none dark:focus-visible:ring-[1.5px] dark:focus-visible:ring-blue-500"
            />
          </div>
          <div>
            <Label for="files" class="text-neutral-300 text-sm mb-1 block">Torrent files</Label>
            <div
              ref="dropZoneRef"
              class="border border-dashed rounded-md p-4 text-center cursor-pointer text-neutral-400 text-sm dark:border-neutral-800 dark:bg-neutral-950/50 h-40 flex flex-col items-center justify-center"
              :class="isOverDropZone ? 'border-blue-500 bg-blue-500/10 text-white' : ''"
              @click="openFileDialog"
            >
              <Upload class="size-12 mb-2" />
              <p v-if="files.length === 0">Drag and drop files here</p>
              <p v-else class="text-white">
                {{ files.map((f) => f.name).join(', ') }}
              </p>
              <Button
                type="button"
                variant="outline"
                class="mt-4"
                @click.stop="openFileDialog"
              >Browse</Button>
              <input
                ref="fileInputRef"
                id="files"
                type="file"
                multiple
                class="hidden"
                @change="onFileChange"
              />
            </div>
          </div>
        </div>
        <div class="space-y-4">
          <Label class="text-neutral-300 text-sm mb-1 block"
              >Settings</Label
            >

          <Collapsible v-model:open="limitsOpen">
            <div class="rounded-md border border-neutral-800">
              <div class="flex items-center justify-between px-3 py-2">
                <h3 class="text-sm font-medium text-neutral-200">Limits</h3>
                <CollapsibleTrigger class="p-2">
                  <ChevronDown
                    class="h-4 w-4 text-neutral-400 transition-transform"
                    :class="limitsOpen ? 'rotate-180' : ''"
                  />
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent class="space-y-4 px-3 pb-3">
                <div>
                  <Label for="upLimit" class="text-neutral-300 text-sm mb-1 block"
                    >Upload limit (B/s)</Label
                  >
                  <Input
                    id="upLimit"
                    type="number"
                    v-model="upLimit"
                    placeholder=""
                    class="text-sm text-white dark:placeholder-neutral-500 border dark:border-neutral-800 dark:bg-neutral-950/50"
                  />
                </div>
                <div>
                  <Label for="dlLimit" class="text-neutral-300 text-sm mb-1 block"
                    >Download limit (B/s)</Label
                  >
                  <Input
                    id="dlLimit"
                    type="number"
                    v-model="dlLimit"
                    placeholder=""
                    class="text-sm text-white dark:placeholder-neutral-500 border dark:border-neutral-800 dark:bg-neutral-950/50"
                  />
                </div>
                <div>
                  <Label for="ratioLimit" class="text-neutral-300 text-sm mb-1 block"
                    >Ratio limit</Label
                  >
                  <Input
                    id="ratioLimit"
                    type="number"
                    step="0.1"
                    v-model="ratioLimit"
                    placeholder=""
                    class="text-sm text-white dark:placeholder-neutral-500 border dark:border-neutral-800 dark:bg-neutral-950/50"
                  />
                </div>
                <div>
                  <Label for="seedingTimeLimit" class="text-neutral-300 text-sm mb-1 block"
                    >Seeding time limit (min)</Label
                  >
                  <Input
                    id="seedingTimeLimit"
                    type="number"
                    v-model="seedingTimeLimit"
                    placeholder=""
                    class="text-sm text-white dark:placeholder-neutral-500 border dark:border-neutral-800 dark:bg-neutral-950/50"
                  />
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
          <Collapsible v-model:open="generalOpen">
            <div class="rounded-md border border-neutral-800">
              <div class="flex items-center justify-between px-3 py-2">
                <h3 class="text-sm font-medium text-neutral-200">General</h3>
                <CollapsibleTrigger class="p-2">
                  <ChevronDown
                    class="h-4 w-4 text-neutral-400 transition-transform"
                    :class="generalOpen ? 'rotate-180' : ''"
                  />
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent class="space-y-4 px-3 pb-3">
                <div>
                  <Label for="savePath" class="text-neutral-300 text-sm mb-1 block"
                    >Save path</Label
                  >
                  <Input
                    id="savePath"
                    v-model="savePath"
                    placeholder="/downloads"
                    class="text-sm text-white dark:placeholder-neutral-500 border dark:border-neutral-800 dark:bg-neutral-950/50"
                  />
                </div>
                <div>
                  <Label for="cookie" class="text-neutral-300 text-sm mb-1 block">Cookie</Label>
                  <Input
                    id="cookie"
                    v-model="cookie"
                    placeholder="ui=28979218048197"
                    class="text-sm text-white dark:placeholder-neutral-500 border dark:border-neutral-800 dark:bg-neutral-950/50"
                  />
                </div>
                <div>
                  <Label for="category" class="text-neutral-300 text-sm mb-1 block">Category</Label>
                  <Input
                    id="category"
                    v-model="category"
                    placeholder="movies"
                    class="text-sm text-white dark:placeholder-neutral-500 border dark:border-neutral-800 dark:bg-neutral-950/50"
                  />
                </div>
                <div>
                  <Label for="tags" class="text-neutral-300 text-sm mb-1 block">Tags</Label>
                  <Input
                    id="tags"
                    v-model="tags"
                    placeholder="tag1,tag2"
                    class="text-sm text-white dark:placeholder-neutral-500 border dark:border-neutral-800 dark:bg-neutral-950/50"
                  />
                </div>
                <div>
                  <Label for="rename" class="text-neutral-300 text-sm mb-1 block"
                    >Rename torrent</Label
                  >
                  <Input
                    id="rename"
                    v-model="rename"
                    placeholder="New name"
                    class="text-sm text-white dark:placeholder-neutral-500 border dark:border-neutral-800 dark:bg-neutral-950/50"
                  />
                </div>
                <div>
                  <Label for="rootFolder" class="text-neutral-300 text-sm mb-1 block"
                    >Create root folder</Label
                  >
                  <Select v-model="rootFolder">
                    <SelectTrigger
                      class="w-full text-sm dark:bg-neutral-950/50 border dark:border-neutral-800"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent class="dark:bg-neutral-950 border dark:border-neutral-800">
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label for="autoTMM" class="text-neutral-300 text-sm mb-1 block"
                    >Torrent management mode</Label
                  >
                  <Select v-model="autoTMM">
                    <SelectTrigger
                      class="w-full text-sm dark:bg-neutral-950/50 border dark:border-neutral-800"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent class="dark:bg-neutral-950 border dark:border-neutral-800">
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="true">Automatic</SelectItem>
                      <SelectItem value="false">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

            <div class="">
              <div class="flex items-center justify-between px-3 py-2">
                <h3 class="text-sm font-medium text-neutral-200">Options</h3>
              </div>
              <div class="space-y-4 px-3 pb-3">
                <div class="flex items-center space-x-2">
                  <Checkbox id="sequentialDownload" v-model:checked="sequentialDownload" />
                  <Label for="sequentialDownload" class="text-neutral-300 text-sm"
                    >Sequential download</Label
                  >
                </div>
                <div class="flex items-center space-x-2">
                  <Checkbox id="firstLastPiecePrio" v-model:checked="firstLastPiecePrio" />
                  <Label for="firstLastPiecePrio" class="text-neutral-300 text-sm"
                    >First/Last piece priority</Label
                  >
                </div>
                <div class="flex items-center space-x-2">
                  <Checkbox id="paused" v-model:checked="paused" />
                  <Label for="paused" class="text-neutral-300 text-sm">Add paused</Label>
                </div>
                <div class="flex items-center space-x-2">
                  <Checkbox id="skipChecking" v-model:checked="skipChecking" />
                  <Label for="skipChecking" class="text-neutral-300 text-sm"
                    >Skip hash checking</Label
                  >
                </div>
              </div>
            </div>
        </div>
      </div>
      <div class="flex justify-end pt-4">
        <Button @click="handleSubmit" class="bg-blue-500 hover:bg-blue-600 text-white"
          >Add Torrents</Button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useTorrentStore } from '@/stores/torrents'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { ArrowLeft, ChevronDown, Upload } from 'lucide-vue-next'
import { useDropZone } from '@vueuse/core'

const ui = useUiStore()
const torrents = useTorrentStore()

const links = ref('')
const files = ref([])
const fileInputRef = ref(null)
const dropZoneRef = ref(null)
const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop(droppedFiles) {
    files.value = Array.from(droppedFiles)
  },
})
const savePath = ref('')
const cookie = ref('')
const category = ref('')
const tags = ref('')
const rename = ref('')
const paused = ref(false)
const skipChecking = ref(false)
const rootFolder = ref('default')
const upLimit = ref('')
const dlLimit = ref('')
const ratioLimit = ref('')
const seedingTimeLimit = ref('')
const autoTMM = ref('default')
const sequentialDownload = ref(false)
const firstLastPiecePrio = ref(false)

const generalOpen = ref(false)
const limitsOpen = ref(true)
const optionsOpen = ref(true)

function onFileChange(e) {
  files.value = Array.from(e.target.files)
}

function openFileDialog() {
  fileInputRef.value?.click()
}

async function handleSubmit() {
  const urlList = links.value
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  await torrents.addTorrents({
    urls: urlList,
    files: files.value,
    options: {
      savepath: savePath.value,
      cookie: cookie.value,
      category: category.value,
      tags: tags.value,
      rename: rename.value,
      paused: paused.value ? 'true' : undefined,
      skip_checking: skipChecking.value ? 'true' : undefined,
      root_folder: rootFolder.value !== 'default' ? rootFolder.value : undefined,
      upLimit: upLimit.value,
      dlLimit: dlLimit.value,
      ratioLimit: ratioLimit.value,
      seedingTimeLimit: seedingTimeLimit.value,
      autoTMM: autoTMM.value !== 'default' ? autoTMM.value : undefined,
      sequentialDownload: sequentialDownload.value ? 'true' : undefined,
      firstLastPiecePrio: firstLastPiecePrio.value ? 'true' : undefined,
    },
  })
  ui.setActivePanel('torrents')
}
</script>
