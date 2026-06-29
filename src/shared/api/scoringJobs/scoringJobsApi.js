import { api } from '@/shared/api/client'
import { DEFAULT_TABLE_PAGE_SIZE } from '@/shared/constants/pagination'
import {
  SCORING_JOBS_LIST_LIMIT,
  UI_FILTER_TO_MIDDLEWARE_STATUS,
} from './constants'
import { filterDocumentsByStatus } from '@/shared/utils/documentFilters'
import {
  mapScoringJobToDocument,
  mapScoringJobToDocumentResult,
} from './scoringJobsMapper'

const MAX_PAGINATED_JOB_FETCH = 10_000

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

export async function fetchAllScoringJobDocuments(options = {}) {
  const { status } = options
  const limit = SCORING_JOBS_LIST_LIMIT
  const collected = []
  let offset = 0

  while (offset < MAX_PAGINATED_JOB_FETCH) {
    const { documents, pagination } = await fetchScoringJobs({
      offset,
      limit,
      status,
    })

    if (documents.length === 0) break

    collected.push(...documents)
    offset += documents.length

    const total = pagination?.total
    if (documents.length < limit) break
    if (typeof total === 'number' && offset >= total) break
  }

  return collected
}

export async function fetchScoringJobsByStatus(status) {
  if (status == null || status === '') {
    const documents = await fetchAllScoringJobDocuments()
    return filterDocumentsByStatus(documents)
  }

  const { documents } = await fetchScoringJobsByStatusPage(status)
  return documents
}

export async function fetchScoringJobsByStatusPage(status, options = {}) {
  const {
    offset = 0,
    limit = DEFAULT_TABLE_PAGE_SIZE,
  } = options
  const middlewareStatus = getMiddlewareStatusQuery(status)

  if (middlewareStatus) {
    return fetchScoringJobs({ status, offset, limit })
  }

  const documents = await fetchAllScoringJobDocuments()
  const filtered = filterDocumentsByStatus(documents, status)

  return {
    documents: filtered.slice(offset, offset + limit),
    pagination: {
      offset,
      limit,
      total: filtered.length,
    },
  }
}

export async function fetchScoringJobById(id) {
  const { data } = await api.get(`/scoring-jobs/${id}`)
  return extractJob(data)
}

export async function fetchScoringJobResult(id) {
  const job = await fetchScoringJobById(id)
  return mapScoringJobToDocumentResult(job)
}

export async function cancelScoringJob(id) {
  const { data } = await api.post(`/scoring-jobs/${id}/cancel`)
  return data
}

const CANCELLABLE_MIDDLEWARE_STATUSES = new Set([
  'uploading',
  'uploaded',
  'waiting',
  'running',
])

function isCancellableDocument(document) {
  if (document.middlewareStatus === 'canceled') return false
  if (CANCELLABLE_MIDDLEWARE_STATUSES.has(document.middlewareStatus)) {
    return true
  }
  return document.status === 'queued' || document.status === 'processing'
}

export async function clearAllScoringJobs() {
  const documents = await fetchAllScoringJobDocuments()
  const cancellable = documents.filter(isCancellableDocument)

  if (cancellable.length === 0) {
    return { cleared: 0, total: documents.length, failed: 0 }
  }

  const outcomes = await Promise.allSettled(
    cancellable.map((document) => cancelScoringJob(document.id)),
  )

  const failed = outcomes.filter((outcome) => outcome.status === 'rejected').length
  const cleared = cancellable.length - failed

  if (cleared === 0) {
    throw new Error('Gagal menghapus dokumen. Mungkin sudah tidak dapat dibatalkan.')
  }

  return { cleared, total: cancellable.length, failed }
}

export async function fetchScoringJobFile(id) {
  const { data } = await api.get(`/scoring-jobs/${id}/file`, {
    params: { disposition: 'inline' },
    responseType: 'blob',
  })
  return data
}

export async function uploadScoringJobFile(file, onProgress) {
  const formData = new FormData()
  formData.append('files', file)

  const { data } = await api.post('/scoring-jobs/upload', formData, {
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