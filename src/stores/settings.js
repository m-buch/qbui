import { defineStore } from 'pinia'
import { settingsApi } from '@/services/api'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    preferences: {},
  }),
  actions: {
    async fetchPreferences() {
      try {
        this.preferences = await settingsApi.getPreferences()
      } catch (e) {
        console.error('Failed to fetch preferences', e)
      }
    },
    async updatePreference(key, value) {
      try {
        await settingsApi.setPreferences({ [key]: value })
        this.preferences[key] = value
      } catch (e) {
        console.error('Failed to update preference', e)
      }
    },
  },
})
