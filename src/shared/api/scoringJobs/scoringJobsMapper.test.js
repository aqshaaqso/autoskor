import { describe, expect, it } from 'vitest'
import {
  mapMiddlewareStatus,
  mapResultDataToUiResults,
  mapScoringJobToDocument,
} from './scoringJobsMapper'

describe('mapMiddlewareStatus', () => {
  it('memetakan status middleware ke status UI', () => {
    expect(mapMiddlewareStatus({ status: 'waiting' })).toBe('queued')
    expect(mapMiddlewareStatus({ status: 'running' })).toBe('processing')
    expect(mapMiddlewareStatus({ status: 'completed_success' })).toBe('done')
    expect(mapMiddlewareStatus({ status: 'failed' })).toBe('failed')
  })
})

describe('mapScoringJobToDocument', () => {
  it('menormalkan field dokumen dari scoring job', () => {
    const document = mapScoringJobToDocument({
      id: 'job-1',
      status: 'waiting',
      file: {
        original_filename: 'laporan.pdf',
        mime_type: 'application/pdf',
        file_size_bytes: 2048,
      },
      created_at: '2026-01-15T08:00:00Z',
    })

    expect(document.id).toBe('job-1')
    expect(document.status).toBe('queued')
    expect(document.middlewareStatus).toBe('waiting')
    expect(document.fileName).toBe('laporan.pdf')
    expect(document.mimeType).toBe('application/pdf')
    expect(document.fileSize).toBe(2048)
  })

  it('memetakan durasi pemrosesan engine dalam detik', () => {
    const document = mapScoringJobToDocument({
      id: 'job-2',
      status: 'running',
      engine_processing_seconds: 246,
      waiting_at: '2026-06-29T08:39:55.996896Z',
      file: { original_filename: 'laporan.pdf' },
    })

    expect(document.engineProcessingSeconds).toBe(246)
    expect(document.processingStartedAt).toBe('2026-06-29T08:39:55.996896Z')
  })
})

describe('mapResultDataToUiResults', () => {
  it('menampilkan 17 baris indikator sesuai indikatorDetailPenilaian.json', () => {
    const results = mapResultDataToUiResults({
      total_skor: 10,
      detail_indikator: {
        skor_modal: { skor: 1.5, bobot: 0.06, nilai: 25, rasio: 99.9 },
        skor_kas: { skor: 2.5, bobot: 0.1, nilai: 25, rasio: 150 },
      },
    })

    expect(results.detail).toHaveLength(17)
    const modalRow = results.detail.find(
      (row) => row.komponen === 'Rasio Modal Sendiri terhadap Total Asset',
    )
    const kasRow = results.detail.find(
      (row) => row.komponen === 'Rasio Kas terhadap Kewajiban Jangka Pendek',
    )

    expect(modalRow?.skor).toBe(1.5)
    expect(kasRow?.skor).toBe(2.5)
    expect(results.detail.filter((row) => row.skor === 0).length).toBe(15)
  })

  it('memetakan kunci detail_indikator format engine baru', () => {
    const results = mapResultDataToUiResults({
      total_skor: 51.25,
      detail_indikator: {
        permodalan_aset: { skor: 1.5, bobot: 0.06, nilai: 25, rasio: 99.94 },
        likuiditas_kas: { skor: 2.5, bobot: 0.1, nilai: 25, rasio: 151422.4 },
        kualitas_volume_anggota: { skor: 10, bobot: 0.1, nilai: 100, rasio: 100 },
        jatidiri_pea: { skor: 0, bobot: 0.03, nilai: 0, rasio: 0 },
      },
    })

    expect(results.detail).toHaveLength(17)
    expect(
      results.detail.find(
        (row) => row.komponen === 'Rasio Modal Sendiri terhadap Total Asset',
      )?.skor,
    ).toBe(1.5)
    expect(
      results.detail.find(
        (row) => row.komponen === 'Rasio Kas terhadap Kewajiban Jangka Pendek',
      )?.skor,
    ).toBe(2.5)
    expect(
      results.detail.find(
        (row) => row.komponen === 'Rasio Volume Pinjaman pada Anggota',
      )?.skor,
    ).toBe(10)
    expect(results.totalSkorParsial).toBe(14)
  })
})