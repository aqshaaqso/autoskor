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

function buildWorkers(processingDocuments) {
  const workerMap = new Map()

  for (const document of processingDocuments) {
    const workerId = document.workerId ?? `job-${document.id}`
    if (workerMap.has(workerId)) continue

    workerMap.set(workerId, {
      id: workerId,
      name: workerId,
      status: 'running',
      currentDocument: {
        id: document.id,
        fileName: document.fileName,
        startedAt: document.processingStartedAt ?? document.uploadedAt ?? null,
      },
    })
  }

  return [...workerMap.values()]
}

export function mapDocumentsToEngineStatus(documents) {
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

  let clusterStatus = 'idle'
  if (processingDocuments.length > 0) {
    clusterStatus = 'running'
  } else if (queuedDocuments.length > 0) {
    clusterStatus = 'waiting'
  }

  const workers = buildWorkers(processingDocuments)

  return {
    clusterStatus,
    status: clusterStatus,
    isRunning: processingDocuments.length > 0,
    workerCount: workers.length,
    activeWorkerCount: workers.length,
    workers,
    currentDocument: processingDocuments[0]
      ? {
          id: processingDocuments[0].id,
          fileName: processingDocuments[0].fileName,
          startedAt:
            processingDocuments[0].processingStartedAt ??
            processingDocuments[0].uploadedAt ??
            null,
          workerId: processingDocuments[0].workerId ?? null,
        }
      : null,
    queueLength: queuedDocuments.length,
    processingCount: processingDocuments.length,
    completedTotal: doneDocuments.length,
    failedTotal: failedDocuments.length,
    processedToday,
    averageProcessingMs: computeAverageProcessingMs(documents),
    lastActivityAt: recentActivity[0]?.timestamp ?? null,
    recentActivity,
    source: 'scoring-jobs',
  }
}