import { describe, expect, it } from 'vitest'
import {
  getCooperativeGeneralInfo,
  mapExtractedIndicators,
  mergeRawExtractions,
} from './extractedIndicators'

describe('mergeRawExtractions', () => {
  it('menggabungkan entri ekstraksi dan mengisi nilai kosong', () => {
    const merged = mergeRawExtractions([
      { result: { nama_koperasi: 'Koperasi A', tahun_laporan: null } },
      { result: { tahun_laporan: 2024, kota_koperasi: 'Jakarta' } },
    ])

    expect(merged).toEqual({
      nama_koperasi: 'Koperasi A',
      tahun_laporan: 2024,
      kota_koperasi: 'Jakarta',
    })
  })

  it('mengembalikan objek kosong untuk input kosong', () => {
    expect(mergeRawExtractions([])).toEqual({})
    expect(mergeRawExtractions(null)).toEqual({})
  })
})

describe('mapExtractedIndicators', () => {
  it('memetakan field terisi ke item tampilan', () => {
    const mapped = mapExtractedIndicators([
      { result: { nama_koperasi: 'Koperasi B', kota_koperasi: 'Bandung' } },
    ])

    expect(mapped.hasData).toBe(true)
    expect(mapped.metadata.namaKoperasi).toBe('Koperasi B')
    expect(mapped.availableCount).toBeGreaterThan(0)
  })
})

describe('getCooperativeGeneralInfo', () => {
  it('mengambil item informasi umum koperasi', () => {
    const mapped = mapExtractedIndicators([
      {
        result: {
          nama_koperasi: 'Koperasi C',
          kota_koperasi: 'Surabaya',
          tahun_laporan: 2023,
        },
      },
    ])

    const info = getCooperativeGeneralInfo(mapped)
    expect(info.some((item) => item.label === 'Nama Koperasi')).toBe(true)
    expect(info.find((item) => item.label === 'Nama Koperasi')?.displayValue).toBe('Koperasi C')
  })
})