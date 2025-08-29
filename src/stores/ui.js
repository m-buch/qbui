import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    activePanel: 'torrents',
  }),
  getters: {
    isSearchActive: (state) => state.activePanel === 'search',
    isTorrentPanelActive: (state) => state.activePanel === 'torrents',
    isSettingsActive: (state) => state.activePanel === 'settings',
    isAddActive: (state) => state.activePanel === 'add',
  },
  actions: {
    setActivePanel(panel) {
      this.activePanel = panel
    },
  },
})
