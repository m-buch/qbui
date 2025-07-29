export const formatSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export const formatRatio = (ratio) => {
  if (ratio === -1) return 'N/A'
  return ratio.toFixed(2)
}

export const formatSpeed = (bytesPerSec) => {
  if (!bytesPerSec || bytesPerSec === 0) return '0 KB/s'

  return `${formatSize(bytesPerSec)}/s`
}

export const formatETA = (seconds) => {
  if (!seconds || seconds < 0 || seconds >= 8640000) {
    return '∞'
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

export const formatState = (state) => {
  const stateMap = {
    error: 'Error',
    missingFiles: 'Missing Files',
    uploading: 'Seeding',
    pausedUP: 'Paused (S)',
    queuedUP: 'Queued (S)',
    stalledUP: 'Stalled (S)',
    checkingUP: 'Checking (S)',
    forcedUP: 'Seeding (F)',
    allocating: 'Allocating',
    downloading: 'Downloading',
    metaDL: 'Fetching Metadata',
    pausedDL: 'Paused (D)',
    queuedDL: 'Queued (D)',
    stalledDL: 'Stalled (D)',
    checkingDL: 'Checking (D)',
    forcedDL: 'Downloading (F)',
    checkingResumeData: 'Checking (R)',
    moving: 'Moving',
    unknown: 'Unknown',
  }

  return stateMap[state] || state
}
