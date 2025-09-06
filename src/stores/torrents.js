import { defineStore } from 'pinia'
import { torrentsApi } from '@/services/api'
import { isInStateGroup } from '@/utils/torrentStates'
import { toast } from 'vue-sonner'
import { useAlertDialogConfirm } from '@/composables/useAlertDialogConfirm'

export const useTorrentStore = defineStore('torrents', {
  state: () => ({
    all: [],
    categories: {},
    selected: null,
    details: {
      properties: null,
      trackers: [],
      peers: [],
      webseeds: [],
      files: [],
    },
    searchQuery: '',
    sortBy: 'progress',
    sortDir: 'desc',
    filter: 'all',
    loading: false,
    error: null,
    initialLoadComplete: false,
    pollingInterval: null,
  }),

  getters: {
    filtered(state) {
      let result = [...state.all]

      if (state.filter !== 'all') {
        result = result.filter((t) => {
          if (state.filter === 'downloading') return isInStateGroup(t, 'downloading')
          if (state.filter === 'seeding') return isInStateGroup(t, 'seeding')
          if (state.filter === 'error') return isInStateGroup(t, 'error')
          return t.category === state.filter
        })
      }

      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase()
        result = result.filter((t) => t.name.toLowerCase().includes(q))
      }

      result.sort((a, b) => {
        const aVal = a[state.sortBy]
        const bVal = b[state.sortBy]
        if (typeof aVal === 'string') {
          return state.sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        } else {
          return state.sortDir === 'asc' ? aVal - bVal : bVal - aVal
        }
      })

      return result
    },

    counts(state) {
      return {
        all: state.all.length,
        downloading: state.all.filter((t) => isInStateGroup(t, 'downloading')).length,
        seeding: state.all.filter((t) => isInStateGroup(t, 'seeding')).length,
        error: state.all.filter((t) => isInStateGroup(t, 'error')).length,
      }
    },
    categoryList(state) {
      return Object.values(state.categories)
    },
  },

  actions: {
    async fetchTorrents() {
      try {
        if (!this.initialLoadComplete) this.loading = true
        const data = await torrentsApi.getAll()
        this.all = data
        this.initialLoadComplete = true
        this.error = null
      } catch (err) {
        console.error('Error fetching torrents:', err)
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async addTorrents({ urls = [], files = [], options = {} }) {
      try {
        const formData = new FormData()
        if (urls.length) formData.append('urls', urls.join('\n'))
        files.forEach((file) => formData.append('torrents', file, file.name))
        Object.entries(options).forEach(([key, value]) => {
          if (value !== undefined && value !== '') formData.append(key, value)
        })
        await torrentsApi.add(formData)
        toast.success('Added torrents')
        await this.fetchTorrents()
      } catch (err) {
        toast.error('Failed to add torrents', { description: err.message })
      }
    },

    async pause(torrent) {
      if (!torrent) return
      try {
        await torrentsApi.pause(torrent.hash)
        toast.success('Paused', { description: torrent.name })
        await this.fetchTorrents()
      } catch (err) {
        toast.error('Failed to pause torrent', { description: err.message })
      }
    },

    async resume(torrent) {
      if (!torrent) return
      try {
        await torrentsApi.resume(torrent.hash)
        toast.success('Resumed', { description: torrent.name })
        await this.fetchTorrents()
      } catch (err) {
        toast.error('Failed to resume torrent', { description: err.message })
      }
    },

    async recheck(torrent) {
      if (!torrent) return
      try {
        await torrentsApi.recheck(torrent.hash)
        toast.success('Rechecking', { description: torrent.name })
        await this.fetchTorrents()
      } catch (err) {
        toast.error('Failed to recheck torrent', { description: err.message })
      }
    },

    async delete(torrent) {
      if (!torrent) return
      const dialog = useAlertDialogConfirm()
      const confirmed = await dialog
        .confirm({
          title: 'Delete Torrent',
          description: `Are you sure you want to delete this torrent? The files will remain on disk.`,
          filename: torrent.name,
          confirmText: 'Delete',
          cancelText: 'Cancel',
        })
        .catch(() => false)

      if (!confirmed) return

      try {
        await torrentsApi.delete(torrent.hash, false)
        toast.success('Deleted', { description: torrent.name })
        await this.fetchTorrents()
      } catch (err) {
        toast.error('Failed to delete torrent', { description: err.message })
      }
    },

    async deleteWithFiles(torrent) {
      if (!torrent) return
      const dialog = useAlertDialogConfirm()
      const confirmed = await dialog
        .confirm({
          title: 'Delete Torrent and Files',
          description: `Are you sure you want to delete this torrent and its files? This cannot be undone.`,
          filename: torrent.name,
          confirmText: 'Delete',
          cancelText: 'Cancel',
        })
        .catch(() => false)

      if (!confirmed) return

      try {
        await torrentsApi.delete(torrent.hash, true)
        toast.success('Deleted', { description: torrent.name + ' and its files' })
        await this.fetchTorrents()
      } catch (err) {
        toast.error('Failed to delete torrent', { description: err.message })
      }
    },

    async fetchDetails(hash) {
      if (!hash) return
      try {
        const [properties, trackers, peersData, webseeds, files] = await Promise.all([
          torrentsApi.properties(hash),
          torrentsApi.trackers(hash),
          torrentsApi.peers(hash),
          torrentsApi.webseeds(hash),
          torrentsApi.files(hash),
        ])
        this.details = {
          properties,
          trackers,
          peers: peersData?.peers ? Object.values(peersData.peers) : [],
          webseeds,
          files,
        }
      } catch (err) {
        console.error('Error fetching torrent details:', err)
      }
    },

    async fetchCategories() {
      try {
        const response = await torrentsApi.getCategories()
        this.categories = response || {}
      } catch (err) {
        console.error('Error fetching categories:', err)
        toast.error('Failed to fetch categories', { description: err.message })
      }
    },

    async setCategory({ hashes, category }) {
      if (!hashes?.length) return

      try {
        await torrentsApi.setCategory(hashes.join('|'), category)
        toast.success('Category set', { description: `Set to ${category}` })
        await this.fetchTorrents()
      } catch (err) {
        if (err.response?.status === 409) {
          toast.error('Category does not exist')
        } else {
          toast.error('Failed to set category', { description: err.message })
        }
      }
    },

    async addCategory({ name, savePath }) {
      try {
        await torrentsApi.addCategory(name, savePath)
        toast.success('Category added', { description: name })
        await this.fetchCategories()
      } catch (err) {
        toast.error('Failed to add category', { description: err.message })
      }
    },

    async editCategory({ name, savePath }) {
      try {
        await torrentsApi.editCategory(name, savePath)
        toast.success('Category updated', { description: name })
        await this.fetchCategories()
      } catch (err) {
        toast.error('Failed to edit category', { description: err.message })
      }
    },

    async removeCategories(names) {
      if (!names?.length) return

      try {
        await torrentsApi.removeCategories(names.join('\n'))
        toast.success('Removed categories', { description: names.join(', ') })
        if (names.includes(this.filter)) this.setFilter('all')
        await this.fetchCategories()
      } catch (err) {
        toast.error('Failed to remove categories', { description: err.message })
      }
    },

    selectTorrent(torrent) {
      this.selected = torrent
      if (torrent) this.fetchDetails(torrent.hash)
    },

    clearSelection() {
      this.selected = null
      this.details = {
        properties: null,
        trackers: [],
        peers: [],
        webseeds: [],
        files: [],
      }
    },

    setSearch(query) {
      this.searchQuery = query
    },

    setSort(field) {
      if (this.sortBy === field) {
        this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortBy = field
        this.sortDir = 'asc'
      }
    },

    setFilter(value) {
      this.filter = value
    },

    startPolling() {
      this.stopPolling()
      this.fetchTorrents()
      this.pollingInterval = setInterval(() => this.fetchTorrents(), 5000)
    },

    stopPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval)
        this.pollingInterval = null
      }
    },
  },
})
