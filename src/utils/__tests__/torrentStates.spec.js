import { describe, expect, it } from 'vitest'
import { StateGroups, isInStateGroup } from '../torrentStates'

describe('isInStateGroup', () => {
  it('returns true when the torrent state is within the named group', () => {
    expect(
      isInStateGroup(
        { state: 'downloading' },
        'downloading',
      ),
    ).toBe(true)
  })

  it('returns false when the state is outside the named group', () => {
    expect(
      isInStateGroup(
        { state: 'pausedDL' },
        'seeding',
      ),
    ).toBe(false)
  })

  it('returns false for unknown groups', () => {
    expect(isInStateGroup({ state: 'downloading' }, 'unknown-group')).toBe(false)
  })
})

describe('StateGroups', () => {
  it('exposes expected torrent state buckets', () => {
    expect(StateGroups.downloading).toContain('downloading')
    expect(StateGroups.seeding).toContain('uploading')
    expect(StateGroups.paused).toEqual(['pausedDL', 'pausedUP'])
  })
})
