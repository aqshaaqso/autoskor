import { USE_MOCK } from '@/shared/api/config'
import {
  fetchScoringJobsByStatus,
  fetchScoringJobResult,
  uploadScoringJobFile,
} from '@/shared/api/scoringJobs/scoringJobsApi'
import {
  mockUploadDocument,
  mockGetDocuments,
  mockGetDocumentResults,
  filterQueueDocuments,
  filterFailedDocuments,
  filterProcessedDocuments,
} from '@/shared/api/mock/documentsMock'

export { filterQueueDocuments, filterFailedDocuments, filterProcessedDocuments }

export async function uploadDocument(file, onProgress) {
  if (USE_MOCK) {
    return mockUploadDocument(file, onProgress)
  }

  return uploadScoringJobFile(file, onProgress)
}

export async function getDocuments(status) {
  if (USE_MOCK) {
    return mockGetDocuments(status)
  }

  return fetchScoringJobsByStatus(status)
}

export async function getDocumentResults(id) {
  if (USE_MOCK) {
    return mockGetDocumentResults(id)
  }

  return fetchScoringJobResult(id)
}