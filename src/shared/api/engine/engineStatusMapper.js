import { EXPECTED_ENGINE_COUNT, WORKERS_PER_ENGINE } from './constants'

function pickFirstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null)
}

function pickPositiveCount(...values) {
  return values.find((value) => typeof value === 'number' && value > 0)
}

function synthesizeEnginesFromTotals(raw) {
  const isHealthy = String(raw?.status ?? '').toLowerCase() === 'healthy'
  const engineCount =
    pickPositiveCount(
      raw?.worker_online_engines,
      raw?.workerOnlineEngines,
      raw?.total,
      raw?.available,
    ) ?? (isHealthy ? EXPECTED_ENGINE_COUNT : 0)

  if (engineCount <= 0) return []

  const activeTotal = pickFirstDefined(
    raw?.worker_active_total,
    raw?.workerActiveTotal,
    0,
  )
  const activePerEngine = activeTotal > 0
    ? Math.ceil(activeTotal / engineCount)
    : 0

  return Array.from({ length: engineCount }, (_, index) => ({
    name: `engine-${index + 1}`,
    status: isHealthy ? 'running' : 'stop',
    available: isHealthy,
    worker_status: {
      status: isHealthy ? 'online' : 'offline',
      active_count: Math.min(WORKERS_PER_ENGINE, activePerEngine),
    },
  }))
}

function resolveRawEngines(raw) {
  if (Array.isArray(raw?.engines) && raw.engines.length > 0) {
    return raw.engines
  }

  return synthesizeEnginesFromTotals(raw)
}

function normalizeEngineEntry(engine) {
  if (!engine || typeof engine !== 'object') return null

  const workerStatus = engine.worker_status ?? engine.workerStatus ?? {}

  return {
    name: engine.name ?? 'engine',
    status: String(engine.status ?? '').toLowerCase(),
    available: Boolean(engine.available),
    workerStatus: {
      status: String(workerStatus.status ?? '').toLowerCase(),
      activeCount: pickFirstDefined(
        workerStatus.active_count,
        workerStatus.activeCount,
        0,
      ),
      totalCount: pickFirstDefined(
        workerStatus.total_count,
        workerStatus.totalCount,
        workerStatus.worker_count,
        workerStatus.workerCount,
      ),
    },
    workers: pickFirstDefined(engine.workers, workerStatus.workers),
  }
}

/** Memetakan status middleware engine → kode UI. */
export function mapApiEngineStatusToUi(apiStatus) {
  switch (String(apiStatus ?? '').toLowerCase()) {
    case 'processing':
      return 'working'
    case 'stop':
    case 'stopped':
      return 'busy'
    case 'running':
      return 'idle'
    default:
      return 'idle'
  }
}

export function mapEngineUiStatus(engine) {
  if (!engine) return 'idle'
  return mapApiEngineStatusToUi(engine.status)
}

/** @deprecated gunakan mapEngineUiStatus */
export function mapWorkerUiStatus(engine) {
  return mapEngineUiStatus(engine)
}

function resolveWorkerCapacity(engine) {
  const rawWorkers = pickFirstDefined(
    engine.workers,
    engine.worker_status?.workers,
    engine.workerStatus?.workers,
  )

  if (Array.isArray(rawWorkers) && rawWorkers.length > 0) {
    return rawWorkers.length
  }

  return pickFirstDefined(
    engine.workerStatus?.totalCount,
    WORKERS_PER_ENGINE,
  )
}

function normalizeWorkerEntry(worker, engineName, index) {
  const slotIndex = pickFirstDefined(worker.slot_index, worker.slotIndex, index + 1)
  const id = pickFirstDefined(worker.id, worker.worker_id, worker.workerId) ??
    `${engineName}-worker-${slotIndex}`
  const name = pickFirstDefined(worker.name, worker.worker_name, worker.workerName) ??
    `Worker ${slotIndex}`

  return {
    id,
    name,
    slotIndex,
    currentDocument: worker.current_document ?? worker.currentDocument ?? null,
  }
}

export function expandEngineWorkers(engine) {
  const rawWorkers = pickFirstDefined(
    engine.workers,
    engine.worker_status?.workers,
    engine.workerStatus?.workers,
  )

  if (Array.isArray(rawWorkers) && rawWorkers.length > 0) {
    return rawWorkers.map((worker, index) =>
      normalizeWorkerEntry(worker, engine.name, index),
    )
  }

  const workerCapacity = resolveWorkerCapacity(engine)

  return Array.from({ length: workerCapacity }, (_, index) => ({
    id: `${engine.name}-worker-${index + 1}`,
    name: `Worker ${index + 1}`,
    slotIndex: index + 1,
    currentDocument: null,
  }))
}

export function mapEngineToColumn(engine) {
  const workers = expandEngineWorkers(engine)
  const uiStatus = mapEngineUiStatus(engine)

  return {
    id: engine.name,
    name: engine.name,
    status: engine.status,
    uiStatus,
    available: engine.available,
    workerClusterStatus: engine.workerStatus.status || null,
    activeCount: engine.workerStatus.activeCount,
    workerCount: workers.length,
    workers,
  }
}

export function mapEngineToWorker(engine) {
  const column = mapEngineToColumn(engine)

  return {
    id: column.id,
    name: column.name,
    status: column.uiStatus,
    activeCount: column.activeCount,
    workerCount: column.workerCount,
    available: column.available,
    workers: column.workers,
    currentDocument: null,
  }
}

function flattenEngineWorkers(engines) {
  return engines.flatMap((engine) => engine.workers ?? [])
}

export function mapEngineStatusResponse(raw) {
  const engines = resolveRawEngines(raw)
    .map(normalizeEngineEntry)
    .filter(Boolean)

  const total = pickFirstDefined(raw?.total, engines.length, 0)
  const available = pickFirstDefined(raw?.available, 0)
  const running = pickFirstDefined(raw?.running, 0)
  const processing = pickFirstDefined(raw?.processing, 0)
  const stop = pickFirstDefined(raw?.stop, 0)
  const workerActiveTotal = pickFirstDefined(
    raw?.worker_active_total,
    raw?.workerActiveTotal,
    0,
  )
  const workerOnlineEngines = pickFirstDefined(
    raw?.worker_online_engines,
    raw?.workerOnlineEngines,
    engines.length,
  )

  const engineColumns = engines.map(mapEngineToColumn)
  const workers = flattenEngineWorkers(engineColumns)
  const healthStatus = String(raw?.status ?? '').toLowerCase() || null
  const isRunning = running > 0 || processing > 0
  const totalWorkerSlots = workers.length

  return {
    healthStatus,
    isRunning,
    engines: engineColumns,
    workerCount: totalWorkerSlots || workerActiveTotal,
    activeWorkerCount: workerActiveTotal,
    workers,
    engineTotals: {
      total,
      available,
      running,
      processing,
      stop,
      workerActiveTotal,
      workerOnlineEngines,
      totalWorkerSlots,
    },
    source: 'engine-status',
  }
}

export function mergeEngineStatus(documentStatus, apiStatus) {
  const processingCount = Math.max(
    documentStatus.processingCount ?? 0,
    apiStatus.engineTotals.processing ?? 0,
  )
  const queueLength = documentStatus.queueLength ?? 0

  let clusterStatus = 'idle'
  if (processingCount > 0) {
    clusterStatus = 'working'
  } else if (queueLength > 0) {
    clusterStatus = 'waiting'
  }

  const isRunning =
    processingCount > 0 ||
    queueLength > 0 ||
    apiStatus.isRunning ||
    (apiStatus.engineTotals.running ?? 0) > 0

  const engines = apiStatus.engines
  const workers = flattenEngineWorkers(engines)

  return {
    ...documentStatus,
    clusterStatus,
    status: clusterStatus,
    isRunning,
    workerCount: apiStatus.workerCount,
    activeWorkerCount: apiStatus.activeWorkerCount,
    engines,
    workers,
    processingCount,
    healthStatus: apiStatus.healthStatus,
    engineTotals: apiStatus.engineTotals,
    source: 'engine-status+scoring-jobs',
  }
}