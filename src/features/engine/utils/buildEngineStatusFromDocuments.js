function pickTimestamp(document) {
  return (
    document.completedAt ??
    document.processingStartedAt ??
    document.uploadedAt ??
    null
  )
}

function computeAverageProcessingMs(documents) {
  const durations = documents
    .filter(
      (doc) =>
        doc.status === 'done' &&
        doc.processingStartedAt &&
        doc.completedAt,
    )
    .map((doc) => {
      const started = new Date(doc.processingStartedAt).getTime()
      const finished = new Date(doc.completedAt).getTime()
      return finished - started
    })
    .filter((ms) => Number.isFinite(ms) && ms > 0)

  if (durations.length === 0) return 0

  return Math.round(
    durations.reduce((sum, ms) => sum + ms, 0) / durations.length,
  )
}

function resolveClusterStatus(processingCount, queuedCount, override) {
  if (override !== undefined) return override
  if (processingCount > 0) return 'working'
  if (queuedCount > 0) return 'waiting'
  return 'idle'
}

export function buildEngineStatusFromDocuments(documents, options = {}) {
  const {
    workers: workersOverride,
    isRunning: isRunningOverride,
    workerCount: workerCountOverride,
    activeWorkerCount: activeWorkerCountOverride,
    averageProcessingMs: averageProcessingMsOverride,
    clusterStatus: clusterStatusOverride,
    source,
  } = options

  const queuedDocuments = documents.filter((doc) => doc.status === 'queued')
  const processingDocuments = documents.filter(
    (doc) => doc.status === 'processing',
  )
  const doneDocuments = documents.filter((doc) => doc.status === 'done')
  const failedDocuments = documents.filter((doc) => doc.status === 'failed')

  const todayKey = new Date().toDateString()
  const processedToday = doneDocuments.filter((doc) => {
    const reference = doc.completedAt ?? doc.uploadedAt
    if (!reference) return false
    return new Date(reference).toDateString() === todayKey
  }).length

  const recentActivity = [...documents]
    .sort((a, b) => {
      const timeA = new Date(pickTimestamp(a) ?? 0).getTime()
      const timeB = new Date(pickTimestamp(b) ?? 0).getTime()
      return timeB - timeA
    })
    .slice(0, 8)
    .map((doc) => ({
      id: doc.id,
      fileName: doc.fileName,
      status: doc.status,
      workerId: doc.workerId ?? null,
      timestamp: pickTimestamp(doc),
    }))

  const clusterStatus = resolveClusterStatus(
    processingDocuments.length,
    queuedDocuments.length,
    clusterStatusOverride,
  )

  const workers = workersOverride ?? []
  const isRunning = isRunningOverride ?? processingDocuments.length > 0
  const workerCount = workerCountOverride ?? 0
  const activeWorkerCount = activeWorkerCountOverride ?? 0
  const averageProcessingMs =
    averageProcessingMsOverride ?? computeAverageProcessingMs(documents)

  const currentDocument = processingDocuments[0]
    ? {
        id: processingDocuments[0].id,
        fileName: processingDocuments[0].fileName,
        startedAt:
          processingDocuments[0].processingStartedAt ??
          processingDocuments[0].uploadedAt ??
          null,
        workerId: processingDocuments[0].workerId ?? null,
      }
    : null

  return {
    clusterStatus,
    status: clusterStatus,
    isRunning,
    workerCount,
    activeWorkerCount,
    workers,
    currentDocument,
    queueLength: queuedDocuments.length,
    processingCount: processingDocuments.length,
    completedTotal: doneDocuments.length,
    failedTotal: failedDocuments.length,
    processedToday,
    averageProcessingMs,
    lastActivityAt: recentActivity[0]?.timestamp ?? null,
    recentActivity,
    ...(source ? { source } : {}),
  }
}