import { describe, expect, it } from 'vitest'
import {
  computePersentaseMaks,
  finalizeDetailRows,
  normalizeBobot,
  sumDetailSkor,
} from './resultDetail'

describe('normalizeBobot', () => {
  it('mengalikan bobot desimal 0–1 ke persen', () => {
    expect(normalizeBobot(0.15)).toBe(15)
  })

  it('mempertahankan bobot yang sudah dalam persen', () => {
    expect(normalizeBobot(15)).toBe(15)
  })
})

describe('computePersentaseMaks', () => {
  it('menghitung persentase dari skor dan bobot', () => {
    expect(computePersentaseMaks({ skor: 7.5, bobot: 15 })).toBe(50)
  })

  it('menggunakan persentaseMaks jika sudah ada', () => {
    expect(computePersentaseMaks({ skor: 0, bobot: 15, persentaseMaks: 42.5 })).toBe(42.5)
  })
})

describe('finalizeDetailRows', () => {
  it('mendeduplikasi baris dengan komponen sama dan memilih skor tertinggi', () => {
    const rows = finalizeDetailRows([
      { aspek: 'Likuiditas', komponen: 'Rasio Lancar', skor: 5, bobot: 10 },
      { aspek: 'Likuiditas', komponen: 'Rasio Lancar', skor: 8, bobot: 10 },
    ])

    expect(rows).toHaveLength(1)
    expect(rows[0].skor).toBe(8)
  })
})

describe('sumDetailSkor', () => {
  it('menjumlahkan skor parsial', () => {
    expect(
      sumDetailSkor([
        { skor: 5 },
        { skor: 7.5 },
        { skor: 2 },
      ]),
    ).toBe(14.5)
  })
})