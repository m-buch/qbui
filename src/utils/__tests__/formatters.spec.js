import { describe, it, expect } from 'vitest'
import {
  formatDuration,
  formatETA,
  formatLimit,
  formatRatio,
  formatSize,
  formatSpeed,
  formatState,
  formatTimestamp,
} from '../formatters'

// formatSize

describe('formatSize', () => {
  it('returns 0 B for falsy or non-numeric values', () => {
    expect(formatSize(undefined)).toBe('0 B')
    expect(formatSize(null)).toBe('0 B')
    expect(formatSize('not-a-number')).toBe('0 B')
  })

  it('formats bytes using binary units with two decimal precision', () => {
    expect(formatSize(0)).toBe('0 B')
    expect(formatSize(1024)).toBe('1 KB')
    expect(formatSize(1536)).toBe('1.5 KB')
    expect(formatSize(1048576)).toBe('1 MB')
  })
})

// formatRatio

describe('formatRatio', () => {
  it('returns N/A for sentinel value -1', () => {
    expect(formatRatio(-1)).toBe('N/A')
  })

  it('defaults to 0.00 for invalid input', () => {
    expect(formatRatio('bad')).toBe('0.00')
    expect(formatRatio(undefined)).toBe('0.00')
  })

  it('formats ratio values to two decimal places', () => {
    expect(formatRatio(1)).toBe('1.00')
    expect(formatRatio(1.236)).toBe('1.24')
  })
})

// formatSpeed

describe('formatSpeed', () => {
  it('returns 0 KB/s for invalid or zero input', () => {
    expect(formatSpeed(undefined)).toBe('0 KB/s')
    expect(formatSpeed(0)).toBe('0 KB/s')
  })

  it('leverages formatSize for valid byte rates', () => {
    expect(formatSpeed(2048)).toBe('2 KB/s')
  })
})

// formatETA

describe('formatETA', () => {
  it('returns infinity symbol for invalid, negative, or extremely large values', () => {
    expect(formatETA(undefined)).toBe('∞')
    expect(formatETA(-5)).toBe('∞')
    expect(formatETA(8640000)).toBe('∞')
  })

  it('formats durations into human readable segments', () => {
    expect(formatETA(59)).toBe('59s')
    expect(formatETA(90)).toBe('1m 30s')
    expect(formatETA(3600)).toBe('1h 0m')
  })
})

// formatDuration

describe('formatDuration', () => {
  it('guards against nullish and invalid inputs', () => {
    expect(formatDuration(null)).toBe('0s')
    expect(formatDuration(undefined)).toBe('0s')
    expect(formatDuration('bad')).toBe('0s')
  })

  it('formats elapsed time with cascading units', () => {
    expect(formatDuration(0)).toBe('0s')
    expect(formatDuration(61)).toBe('1m 1s')
    expect(formatDuration(3661)).toBe('1h 1m')
  })
})

// formatTimestamp

describe('formatTimestamp', () => {
  it('returns empty string when timestamp is falsy', () => {
    expect(formatTimestamp(0)).toBe('')
    expect(formatTimestamp(undefined)).toBe('')
  })

  it('delegates to Date#toLocaleString for defined timestamps', () => {
    const value = 1700000000
    expect(formatTimestamp(value)).toBe(new Date(value * 1000).toLocaleString())
  })
})

// formatLimit

describe('formatLimit', () => {
  it('treats nullish and -1 values as unlimited', () => {
    expect(formatLimit(undefined)).toBe('∞')
    expect(formatLimit(null)).toBe('∞')
    expect(formatLimit(-1)).toBe('∞')
  })

  it('falls back to formatSpeed for numeric limits', () => {
    expect(formatLimit(1024)).toBe('1 KB/s')
  })
})

// formatState

describe('formatState', () => {
  it('maps known states to friendly labels', () => {
    expect(formatState('pausedDL')).toBe('Paused (D)')
    expect(formatState('uploading')).toBe('Seeding')
  })

  it('returns the original state when no mapping exists', () => {
    expect(formatState('customState')).toBe('customState')
  })
})
