import { describe, expect, it } from 'vitest'
import {
  mapMiddlewareStatus,
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
})