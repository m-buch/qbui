// State group definitions
export const StateGroups = {
  downloading: [
    'downloading',
    'stalledDL',
    'metaDL',
    'pausedDL',
    'queuedDL',
    'checkingDL',
    'forcedDL',
    'allocating',
  ],
  seeding: ['uploading', 'pausedUP', 'queuedUP', 'stalledUP', 'checkingUP', 'forcedUP'],
  error: ['error', 'missingFiles'],
  moving: ['moving'],
  checking: ['checkingDL', 'checkingUP', 'checkingResumeData'],
  unknown: ['unknown'],
  paused: ['pausedDL', 'pausedUP'],
  unpaused: [
    'downloading',
    'stalledDL',
    'metaDL',
    'queuedDL',
    'checkingDL',
    'forcedDL',
    'allocating',
    'uploading',
    'queuedUP',
    'stalledUP',
    'checkingUP',
    'forcedUP',
  ],
}

export function isInStateGroup(torrent, groupName) {
  return Boolean(StateGroups[groupName]?.includes(torrent.state))
}

export const TorrentFilterLabels = {
  all: 'All',
  downloading: 'Downloading',
  seeding: 'Seeding',
  error: 'Error',
  moving: 'Moving',
  checking: 'Checking',
  unknown: 'Unknown',
}
