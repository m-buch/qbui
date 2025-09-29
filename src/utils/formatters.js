export const formatSize = (bytes) => {
  const value = Number(bytes)
  if (!Number.isFinite(value) || value === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.min(Math.floor(Math.log(value) / Math.log(k)), sizes.length - 1)

  return `${parseFloat((value / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export const formatRatio = (ratio) => {
  if (ratio === -1) return 'N/A'

  const value = Number(ratio)
  if (!Number.isFinite(value)) return '0.00'

  return value.toFixed(2)
}

export const formatSpeed = (bytesPerSec) => {
  const value = Number(bytesPerSec)
  if (!Number.isFinite(value) || value === 0) return '0 KB/s'

  return `${formatSize(value)}/s`
}

export const formatETA = (seconds) => {
  const value = Number(seconds)

  if (!Number.isFinite(value) || value < 0 || value >= 8640000) {
    return '∞'
  }

  const totalSeconds = Math.max(0, Math.floor(value))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const remainingSeconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }

  if (minutes > 0) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
  }

  return `${remainingSeconds}s`
}

export const formatDuration = (seconds) => {
  if (seconds === null || seconds === undefined) return '0s'

  const value = Number(seconds)
  if (!Number.isFinite(value)) return '0s'

  const totalSeconds = Math.max(0, Math.floor(value))
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60

  if (h > 0) {
    return m > 0 ? `${h}h ${m}m` : `${h}h`
  }

  if (m > 0) {
    return s > 0 ? `${m}m ${s}s` : `${m}m`
  }

  return `${s}s`
}

export const formatTimestamp = (ts) => (ts ? new Date(ts * 1000).toLocaleString() : '')

export const formatLimit = (limit) => {
  if (limit === undefined || limit === null || Number(limit) === -1) return '∞'
  return formatSpeed(limit)
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
