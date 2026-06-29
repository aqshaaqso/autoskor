import { DEFAULT_TABLE_PAGE_SIZE } from '@/shared/constants/pagination'
import {
  fetchScoringJobsByStatus,
  fetchScoringJobsByStatusPage,
  fetchScoringJobById,
  fetchScoringJobResult,
  uploadScoringJobFile,
  cancelScoringJob,
  clearAllScoringJobs,
  fetchScoringJobFile,
} from '@/shared/api/scoringJobs/scoringJobsApi'
import { mapScoringJobToDocument } from '@/shared/api/scoringJobs/scoringJobsMapper'

export async function uploadDocument(file, onProgress) {
  return uploadScoringJobFile(file, onProgress)
}

export async function getDocuments(status) {
  return fetchScoringJobsByStatus(status)
}

export async function getDocumentList(status, options = {}) {
  const {
    offset = 0,
    limit = DEFAULT_TABLE_PAGE_SIZE,
  } = options

  return fetchScoringJobsByStatusPage(status, { offset, limit })
}

export async function getDocumentResults(id) {
  return fetchScoringJobResult(id)
}

export async function getDocumentById(id) {
  const job = await fetchScoringJobById(id)
  return mapScoringJobToDocument(job)
}

export async function cancelDocument(id) {
  return cancelScoringJob(id)
}

export async function fetchDocumentFile(id) {
  return fetchScoringJobFile(id)
}

export async function clearAllDocuments() {
  return clearAllScoringJobs()
}