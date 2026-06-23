import { USE_MOCK_DOCUMENTS } from '@/shared/api/config'
import {
  fetchScoringJobsByStatus,
  fetchScoringJobResult,
  uploadScoringJobFile,
} from '@/shared/api/scoringJobs/scoringJobsApi'
import {
  mockUploadDocument,
  mockGetDocuments,
  mockGetDocumentResults,
} from '@/shared/api/mock/documentsMock'

export async function uploadDocument(file, onProgress) {
  if (USE_MOCK_DOCUMENTS) {
    return mockUploadDocument(file, onProgress)
  }

  return uploadScoringJobFile(file, onProgress)
}

export async function getDocuments(status) {
  if (USE_MOCK_DOCUMENTS) {
    return mockGetDocuments(status)
  }

  return fetchScoringJobsByStatus(status)
}

export async function getDocumentResults(id) {
  if (USE_MOCK_DOCUMENTS) {
    return mockGetDocumentResults(id)
  }

  return fetchScoringJobResult(id)
}