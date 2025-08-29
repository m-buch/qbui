import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { systemApi } from '../services/api'
import { formatSpeed } from '../utils/formatters'

export const useTransferStore = defineStore('transfer', () => {
  const downloadSpeed = ref(0)
  const uploadSpeed = ref(0)

  const downloadHistory = ref(Array(30).fill(0))
  const uploadHistory = ref(Array(30).fill(0))

  const maxHistoryPoints = 30

  const updateDownloadSpeed = (speed) => {
    downloadSpeed.value = speed
    downloadHistory.value.push(speed)
    if (downloadHistory.value.length > maxHistoryPoints) {
      downloadHistory.value.shift()
    }
  }

  const updateUploadSpeed = (speed) => {
    uploadSpeed.value = speed
    uploadHistory.value.push(speed)
    if (uploadHistory.value.length > maxHistoryPoints) {
      uploadHistory.value.shift()
    }
  }

  const fetchTransferInfo = async () => {
    try {
      const data = await systemApi.getInfo()

      if (typeof data.dl_info_speed === 'number') {
        updateDownloadSpeed(data.dl_info_speed)
      }

      if (typeof data.up_info_speed === 'number') {
        updateUploadSpeed(data.up_info_speed)
      }

      return data
    } catch (error) {
      console.error('Error fetching transfer info:', error)
      return null
    }
  }

  const formattedDownloadSpeed = computed(() => {
    return formatSpeed(downloadSpeed.value)
  })

  const formattedUploadSpeed = computed(() => {
    return formatSpeed(uploadSpeed.value)
  })

  const maxDownloadSpeed = computed(() => {
    return Math.max(...downloadHistory.value, 1)
  })

  const maxUploadSpeed = computed(() => {
    return Math.max(...uploadHistory.value, 1)
  })

  return {
    // Download
    downloadSpeed,
    downloadHistory,
    formattedDownloadSpeed,
    maxDownloadSpeed,
    updateDownloadSpeed,

    // Upload
    uploadSpeed,
    uploadHistory,
    formattedUploadSpeed,
    maxUploadSpeed,
    updateUploadSpeed,

    // Common
    fetchTransferInfo,
  }
})
