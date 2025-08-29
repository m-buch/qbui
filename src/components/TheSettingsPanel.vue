<template>
  <div class="p-6 bg-neutral-900">
    <div class="flex items-center gap-1 mb-4 px-4 md:px-0">
      <Button
        variant="ghost"
        size="icon"
        class="rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
        @click="ui.setActivePanel('torrents')"
      >
        <ChevronLeft class="size-6" />
      </Button>
      <h2 class="text-xl font-light text-white hidden md:block">Settings</h2>
    </div>
    <div class="px-4 md:px-0">
      <Tabs v-model="activeTab" class="space-y-4">
        <TabsList>
          <TabsTrigger v-for="cat in settingsSchema" :key="cat.id" :value="cat.id" class="text-neutral-300 hover:bg-neutral-700 data-[state=active]:bg-neutral-700">
            {{ cat.label }}
          </TabsTrigger>
        </TabsList>
        <TabsContent
          v-for="cat in settingsSchema"
          :key="cat.id"
          :value="cat.id"
          class="space-y-4 pt-4"
        >
          <div v-for="setting in cat.settings" :key="setting.key" class="space-y-2">
            <template v-if="setting.type === 'string' || setting.type === 'number'">
              <Label :for="setting.key" class="text-neutral-300 text-sm mb-1 block">
                {{ setting.label }}
              </Label>
              <Input
                :id="setting.key"
                :type="setting.type === 'number' ? 'number' : 'string'"
                v-model="settings.preferences[setting.key]"
                @change="handleSettingChange(setting, settings.preferences[setting.key])"
                class="text-sm text-white dark:placeholder-neutral-500 border dark:border-neutral-800 dark:bg-neutral-950/50 focus-visible:ring-blue-500 focus-visible:ring-[1px]"
              />
            </template>
            <template v-else-if="setting.type === 'bool'">
              <div class="flex items-center space-x-2">
                <Checkbox
                  :id="setting.key"
                  v-model:checked="settings.preferences[setting.key]"
                  @update:checked="(val) => handleSettingChange(setting, val)"
                />
                <Label :for="setting.key" class="text-neutral-300 text-sm">
                  {{ setting.label }}
                </Label>
              </div>
            </template>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useSettingsStore } from '@/stores/settings'
import { settingsSchema } from '@/config/settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ChevronLeft } from 'lucide-vue-next'

const ui = useUiStore()
const settings = useSettingsStore()
const activeTab = ref(settingsSchema[0].id)

const handleSettingChange = (setting, value) => {
  settings.updatePreference(
    setting.key,
    setting.type === 'number' ? Number(value) : value,
  )
}

onMounted(() => {
  settings.fetchPreferences()
})
</script>
