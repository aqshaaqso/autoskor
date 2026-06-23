import { USE_MOCK_DOCUMENTS } from '@/shared/api/config'
import {
  fetchScoringJobsByStatus,
  fetchScoringJobById,
  fetchScoringJobResult,
  uploadScoringJobFile,
  cancelScoringJob,
  clearAllScoringJobs,
  fetchScoringJobFile,
} from '@/shared/api/scoringJobs/scoringJobsApi'
import { mapScoringJobToDocument } from '@/shared/api/scoringJobs/scoringJobsMapper'
import {
  mockUploadDocument,
  mockGetDocuments,
  mockGetDocumentById,
  mockGetDocumentResults,
  mockCancelDocument,
  mockClearAllDocuments,
  mockFetchDocumentFile,
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

export async function getDocumentById(id) {
  if (USE_MOCK_DOCUMENTS) {
    return mockGetDocumentById(id)
  }

  const job = await fetchScoringJobById(id)
  return mapScoringJobToDocument(job)
}

export async function cancelDocument(id) {
  if (USE_MOCK_DOCUMENTS) {
    return mockCancelDocument(id)
  }

  return cancelScoringJob(id)
}

export async function fetchDocumentFile(id) {
  if (USE_MOCK_DOCUMENTS) {
    return mockFetchDocumentFile(id)
  }

  return fetchScoringJobFile(id)
}

export async function clearAllDocuments() {
  if (USE_MOCK_DOCUMENTS) {
    return mockClearAllDocuments()
  }

  return clearAllScoringJobs()
}