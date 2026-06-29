import { describe, expect, it } from 'vitest'
import { WORKERS_PER_ENGINE } from './constants'
import {
  expandEngineWorkers,
  mapApiEngineStatusToUi,
  mapEngineStatusResponse,
  mapEngineToColumn,
  mapEngineUiStatus,
  mergeEngineStatus,
} from './engineStatusMapper'

const liveEngineStatusSample = {
  total: 2,
  available: 2,
  running: 2,
  processing: 0,
  stop: 0,
  worker_active_total: 2,
  worker_online_engines: 2,
  status: 'healthy',
  engines: [
    {
      name: 'engine-1',
      status: 'running',
      available: true,
      worker_status: {
        status: 'online',
        active_count: 1,
      },
    },
    {
      name: 'engine-2',
      status: 'processing',
      available: true,
      worker_status: {
        status: 'online',
        active_count: 1,
      },
    },
  ],
}

const documentStatusSample = {
  clusterStatus: 'idle',
  status: 'idle',
  isRunning: false,
  workerCount: 0,
  activeWorkerCount: 0,
  workers: [],
  queueLength: 3,
  processingCount: 0,
  completedTotal: 10,
  failedTotal: 1,
  processedToday: 2,
  averageProcessingMs: 45000,
  lastActivityAt: '2026-06-29T10:00:00Z',
  recentActivity: [{ id: 'job-1', fileName: 'laporan.pdf', status: 'queued' }],
  source: 'scoring-jobs',
}

describe('mapApiEngineStatusToUi', () => {
  it('memetakan status middleware ke label ramah pengguna', () => {
    expect(mapApiEngineStatusToUi('running')).toBe('idle')
    expect(mapApiEngineStatusToUi('processing')).toBe('working')
    expect(mapApiEngineStatusToUi('stop')).toBe('busy')
    expect(mapApiEngineStatusToUi('stopped')).toBe('busy')
  })
})

describe('mapEngineStatusResponse', () => {
  it('memetakan response live /engine/status ke format UI', () => {
    const mapped = mapEngineStatusResponse(liveEngineStatusSample)

    expect(mapped.healthStatus).toBe('healthy')
    expect(mapped.workerCount).toBe(2)
    expect(mapped.activeWorkerCount).toBe(2)
    expect(mapped.engines).toHaveLength(2)
    expect(mapped.engines[0]).toMatchObject({
      id: 'engine-1',
      name: 'engine-1',
      uiStatus: 'idle',
      activeCount: 1,
      workerCount: WORKERS_PER_ENGINE,
    })
    expect(mapped.engines[1]).toMatchObject({
      id: 'engine-2',
      uiStatus: 'working',
    })
    expect(mapped.engines[0].workers).toHaveLength(WORKERS_PER_ENGINE)
    expect(mapped.workers).toHaveLength(2)
    expect(mapped.source).toBe('engine-status')
  })

  it('mensintesis engine saat response mengirim engines null', () => {
    const mapped = mapEngineStatusResponse({
      total: 2,
      available: 2,
      running: 2,
      processing: 0,
      worker_active_total: 2,
      worker_online_engines: 2,
      status: 'healthy',
      engines: null,
    })

    expect(mapped.engines).toHaveLength(2)
    expect(mapped.engines[0].uiStatus).toBe('idle')
    expect(mapped.workers).toHaveLength(2)
  })

  it('mengembalikan kosong saat engine down tanpa data', () => {
    const mapped = mapEngineStatusResponse({
      total: 0,
      available: 0,
      running: 0,
      processing: 0,
      worker_active_total: 0,
      worker_online_engines: 0,
      status: 'down',
      engines: null,
    })

    expect(mapped.engines).toHaveLength(0)
    expect(mapped.healthStatus).toBe('down')
  })
})

describe('mapEngineUiStatus', () => {
  it('memetakan status per engine ke kode UI', () => {
    expect(
      mapEngineUiStatus({
        status: 'running',
        workerStatus: { status: 'online', activeCount: 1 },
      }),
    ).toBe('idle')

    expect(
      mapEngineUiStatus({
        status: 'processing',
        workerStatus: { status: 'online', activeCount: 1 },
      }),
    ).toBe('working')

    expect(
      mapEngineUiStatus({
        status: 'stop',
        workerStatus: { status: 'online', activeCount: 0 },
      }),
    ).toBe('busy')
  })
})

describe('mergeEngineStatus', () => {
  it('menggabungkan status engine API dengan agregat dokumen', () => {
    const apiStatus = mapEngineStatusResponse(liveEngineStatusSample)
    const merged = mergeEngineStatus(documentStatusSample, apiStatus)

    expect(merged.clusterStatus).toBe('waiting')
    expect(merged.workerCount).toBe(2)
    expect(merged.engines).toHaveLength(2)
    expect(merged.engines[0].workers[0].currentDocument).toBeNull()
  })

  it('menandai cluster bekerja saat ada dokumen diproses', () => {
    const apiStatus = mapEngineStatusResponse(liveEngineStatusSample)
    const merged = mergeEngineStatus(
      {
        ...documentStatusSample,
        queueLength: 0,
        processingCount: 2,
      },
      apiStatus,
    )

    expect(merged.clusterStatus).toBe('working')
    expect(merged.processingCount).toBe(2)
    expect(merged.activeWorkerCount).toBe(2)
    expect(merged.isRunning).toBe(true)
  })
})

describe('expandEngineWorkers', () => {
  it('menampilkan 1 worker per engine sesuai konfigurasi middleware', () => {
    const workers = expandEngineWorkers({
      name: 'engine-1',
      status: 'running',
      workerStatus: { status: 'online', activeCount: 1 },
    })

    expect(workers).toHaveLength(WORKERS_PER_ENGINE)
  })
})

describe('mapEngineToColumn', () => {
  it('membuat kolom engine dengan status siap saat middleware running', () => {
    const column = mapEngineToColumn({
      name: 'engine-1',
      status: 'running',
      available: true,
      workerStatus: { status: 'online', activeCount: 1 },
    })

    expect(column.uiStatus).toBe('idle')
    expect(column.workers).toHaveLength(WORKERS_PER_ENGINE)
  })

  it('membuat kolom engine dengan status sibuk saat middleware stop', () => {
    const column = mapEngineToColumn({
      name: 'engine-1',
      status: 'stop',
      available: false,
      workerStatus: { status: 'offline', activeCount: 0 },
    })

    expect(column.uiStatus).toBe('busy')
  })
})