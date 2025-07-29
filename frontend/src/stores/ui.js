import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    activePanel: 'torrents',
  }),
  getters: {
    isSearchActive: (state) => state.activePanel === 'search',
    isTorrentPanelActive: (state) => state.activePanel === 'torrents',
  },
  actions: {
    setActivePanel(panel) {
      this.activePanel = panel
    },
  },
})
