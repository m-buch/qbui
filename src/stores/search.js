import { defineStore } from 'pinia'
import { searchApi, torrentsApi } from '@/services/api'
import { toast } from 'vue-sonner'

export const useSearchStore = defineStore('search', {
  state: () => ({
    query: '',
    results: [],
    selected: null,
    sortBy: 'name',
    sortDir: 'desc',
    loading: false,
    hasSearched: false,
    activeSearchId: null,
    pollingInterval: null,
    searchTimeout: null,
  }),

  getters: {
    sortedResults(state) {
      const sorted = [...state.results].sort((a, b) => {
        const aVal = a[state.sortBy]
        const bVal = b[state.sortBy]

        if (typeof aVal === 'string') {
          return state.sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        } else {
          return state.sortDir === 'asc' ? aVal - bVal : bVal - aVal
        }
      })

      return sorted
    },
  },

  actions: {
    setQuery(val) {
      this.query = val
    },

    clearSearch() {
      this.query = ''
      this.results = []
      this.hasSearched = false
      this.stopActiveSearch()
    },

    setSort(field) {
      if (this.sortBy === field) {
        this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortBy = field
        this.sortDir = 'asc'
      }
    },

    select(result) {
      this.selected = result
    },

    async startSearch() {
      if (!this.query.trim()) return
      this.stopActiveSearch()
      this.loading = true
      this.hasSearched = true

      try {
        const { id } = await searchApi.start(this.query)
        this.activeSearchId = id
        this.pollingInterval = setInterval(this.pollResults, 1000)
        await this.pollResults()
      } catch (err) {
        toast.error('Search failed', { description: err.message })
        this.loading = false
      }
    },

    async pollResults() {
      if (!this.activeSearchId) return

      try {
        const statusRaw = await searchApi.status(this.activeSearchId)
        const status = Array.isArray(statusRaw) ? statusRaw[0] : statusRaw

        const { results } = await searchApi.results(this.activeSearchId)

        if (Array.isArray(results)) {
          this.results = results.map((r) => ({
            name: r.fileName,
            size: r.fileSize,
            seeders: r.nbSeeders,
            leechers: r.nbLeechers,
            tracker: r.descrLink ? new URL(r.descrLink).hostname.replace('www.', '') : 'Unknown',
            added: new Date().toISOString(),
            torrentUrl: r.fileUrl,
            magnetUrl: r.fileUrl?.startsWith('magnet:') ? r.fileUrl : null,
            downloading: false,
          }))
        }

        if (results.length > 0) this.loading = false

        if (status.status?.toLowerCase() !== 'running') {
          this.stopPolling()
        }
      } catch (err) {
        toast.error('Failed to fetch search results', { description: err.message })
        this.stopPolling()
      }
    },

    stopPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval)
        this.pollingInterval = null
      }
    },

    async stopActiveSearch() {
      this.stopPolling()
      if (!this.activeSearchId) return

      try {
        await searchApi.stop({ id: this.activeSearchId })
        await searchApi.delete({ id: this.activeSearchId })
      } catch (err) {
        console.error('Error stopping active search:', err)
      }

      this.activeSearchId = null
    },

    debouncedSearch() {
      if (this.searchTimeout) clearTimeout(this.searchTimeout)

      if (!this.query.trim()) {
        this.clearSearch()
        return
      }

      this.searchTimeout = setTimeout(() => {
        this.startSearch()
      }, 750)
    },

    async addTorrent(result) {
      result.downloading = true
      try {
        const formData = new FormData()
        formData.append('urls', result.magnetUrl || result.torrentUrl)
        await torrentsApi.add(formData)
        toast.success('Added torrent', { description: result.name })
      } catch (err) {
        toast.error('Failed to add torrent', { description: err.message })
      } finally {
        result.downloading = false
      }
    },
  },
})
