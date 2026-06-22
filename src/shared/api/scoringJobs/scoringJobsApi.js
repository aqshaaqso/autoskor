import { api } from '@/shared/api/client'
import {
  SCORING_JOBS_LIST_LIMIT,
  UI_FILTER_TO_MIDDLEWARE_STATUS,
} from './constants'
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

function getMiddlewareStatusQuery(status) {
  if (!status) return undefined
  return UI_FILTER_TO_MIDDLEWARE_STATUS[status]
}

export async function fetchScoringJobs(options = {}) {
  const { offset = 0, limit = SCORING_JOBS_LIST_LIMIT, status } = options
  const middlewareStatus = getMiddlewareStatusQuery(status)

  const params = { offset, limit }
  if (middlewareStatus) {
    params.status = middlewareStatus
  }

  const { data } = await api.get('/scoring-jobs', { params })

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
  const middlewareStatus = getMiddlewareStatusQuery(status)

  if (middlewareStatus) {
    const { documents } = await fetchScoringJobs({ status })
    return documents
  }

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

  const jobs = extractJobList(data)
  const singleJob = extractJob(data)
  const normalizedJobs = jobs.length > 0 ? jobs : singleJob ? [singleJob] : []

  return {
    documents: normalizedJobs.map(mapScoringJobToDocument),
    message: data?.message ?? 'Dokumen berhasil diupload',
    raw: data,
  }
}