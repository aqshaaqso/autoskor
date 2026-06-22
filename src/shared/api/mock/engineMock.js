import {
  getMockDocuments,
  getMockWorkerSnapshots,
  isMockEngineRunning,
  MOCK_PROCESSING_MS,
  MOCK_WORKER_COUNT,
} from './documentsMock'

function buildMockEngineStatus() {
  const mockDocuments = getMockDocuments()
  const workers = getMockWorkerSnapshots()
  const mockEngineRunning = isMockEngineRunning()

  const processingDocuments = mockDocuments.filter(
    (doc) => doc.status === 'processing',
  )
  const queuedDocuments = mockDocuments.filter((doc) => doc.status === 'queued')
  const doneDocuments = mockDocuments.filter((doc) => doc.status === 'done')
  const failedDocuments = mockDocuments.filter((doc) => doc.status === 'failed')
  const todayKey = new Date().toDateString()

  const processedToday = doneDocuments.filter(
    (doc) =>
      new Date(doc.completedAt ?? doc.uploadedAt).toDateString() === todayKey,
  ).length

  const recentActivity = [...mockDocuments]
    .sort((a, b) => {
      const timeA = new Date(
        a.completedAt ?? a.processingStartedAt ?? a.uploadedAt,
      ).getTime()
      const timeB = new Date(
        b.completedAt ?? b.processingStartedAt ?? b.uploadedAt,
      ).getTime()
      return timeB - timeA
    })
    .slice(0, 8)
    .map((doc) => ({
      id: doc.id,
      fileName: doc.fileName,
      status: doc.status,
      workerId: doc.workerId ?? null,
      timestamp:
        doc.completedAt ?? doc.processingStartedAt ?? doc.uploadedAt,
    }))

  let clusterStatus = 'idle'
  if (mockEngineRunning) {
    clusterStatus = 'running'
  } else if (queuedDocuments.length > 0) {
    clusterStatus = 'waiting'
  }

  const activeWorkerCount = workers.filter(
    (worker) => worker.status === 'running',
  ).length

  return {
    clusterStatus,
    status: clusterStatus,
    isRunning: mockEngineRunning,
    workerCount: MOCK_WORKER_COUNT,
    activeWorkerCount,
    workers,
    currentDocument: processingDocuments[0]
      ? {
          id: processingDocuments[0].id,
          fileName: processingDocuments[0].fileName,
          startedAt: processingDocuments[0].processingStartedAt ?? null,
          workerId: processingDocuments[0].workerId ?? null,
        }
      : null,
    queueLength: queuedDocuments.length,
    processingCount: processingDocuments.length,
    completedTotal: doneDocuments.length,
    failedTotal: failedDocuments.length,
    processedToday,
    averageProcessingMs: MOCK_PROCESSING_MS,
    lastActivityAt: recentActivity[0]?.timestamp ?? null,
    recentActivity,
  }
}

export async function mockGetEngineStatus() {
  await new Promise((resolve) => setTimeout(resolve, 250))
  return buildMockEngineStatus()
}