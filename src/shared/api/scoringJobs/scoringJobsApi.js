import { api } from '@/shared/api/client'
import { SCORING_JOBS_LIST_LIMIT } from './constants'
import {
  filterDocumentsByStatus,
  mapScoringJobToDocument,
  mapScoringJobToDocumentResult,
} from './scoringJobsMapper'

function extractJobList(payload) {
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload)) return payload
  return []
}

function extractJob(payload) {
  if (payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    return payload.data
  }
  return payload
}

export async function fetchScoringJobs(options = {}) {
  const { offset = 0, limit = SCORING_JOBS_LIST_LIMIT } = options

  const { data } = await api.get('/scoring-jobs', {
    params: { offset, limit },
  })

  const jobs = extractJobList(data)
  const documents = jobs.map(mapScoringJobToDocument)

  return {
    documents,
    pagination: data?.pagination ?? {
      offset,
      limit,
      total: documents.length,
    },
  }
}

export async function fetchScoringJobsByStatus(status) {
  const { documents } = await fetchScoringJobs()
  return filterDocumentsByStatus(documents, status)
}

export async function fetchScoringJobById(id) {
  const { data } = await api.get(`/scoring-jobs/${id}`)
  return extractJob(data)
}

export async function fetchScoringJobResult(id) {
  const job = await fetchScoringJobById(id)
  return mapScoringJobToDocumentResult(job)
}

export async function uploadScoringJobFile(file, onProgress) {
  const formData = new FormData()
  formData.append('files', file)

  const { data } = await api.post('/scoring-jobs/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (!event.total) return
      const progress = Math.round((event.loaded / event.total) * 100)
      onProgress?.(progress)
    },
  })

  const job = extractJob(data)
  const jobs = Array.isArray(job) ? job : job ? [job] : []

  return {
    documents: jobs.map(mapScoringJobToDocument),
    message: 'Dokumen berhasil diupload',
    raw: data,
  }
}