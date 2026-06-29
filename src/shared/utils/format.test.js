import { describe, expect, it } from 'vitest'
import { formatProcessingDurationMinutes } from './format'

describe('formatProcessingDurationMinutes', () => {
  it('memformat detik ke menit dengan label Indonesia', () => {
    expect(formatProcessingDurationMinutes(246)).toBe('4,1 menit')
    expect(formatProcessingDurationMinutes(512)).toBe('8,5 menit')
    expect(formatProcessingDurationMinutes(60)).toBe('1 menit')
    expect(formatProcessingDurationMinutes(45)).toBe('< 1 menit')
  })

  it('mengembalikan null untuk nilai kosong', () => {
    expect(formatProcessingDurationMinutes(null)).toBeNull()
    expect(formatProcessingDurationMinutes(0)).toBeNull()
  })
})