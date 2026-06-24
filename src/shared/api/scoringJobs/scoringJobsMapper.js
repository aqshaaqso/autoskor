import { MIDDLEWARE_STATUS_TO_UI } from './constants'

function pickFirstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null)
}

function getFileExtension(fileName) {
  if (!fileName || typeof fileName !== 'string') return null
  const dotIndex = fileName.lastIndexOf('.')
  if (dotIndex <= 0) return null
  return fileName.slice(dotIndex + 1).toLowerCase()
}

function normalizeUploadedByUser(rawUser) {
  if (!rawUser || typeof rawUser !== 'object') return null

  const id = pickFirstDefined(rawUser.id, rawUser.user_id, rawUser.userId)
  const name = pickFirstDefined(
    rawUser.name,
    rawUser.full_name,
    rawUser.fullName,
    rawUser.display_name,
    rawUser.displayName,
    rawUser.username,
  )
  const email = pickFirstDefined(rawUser.email, rawUser.user_email, rawUser.userEmail)
  const role = pickFirstDefined(rawUser.role, rawUser.user_role, rawUser.userRole)

  if (!id && !name && !email) return null

  return {
    id: id ?? null,
    name: name ?? email ?? 'Pengguna',
    email: email ?? null,
    role: role ?? null,
  }
}

function normalizeUploadedBy(job) {
  const rawUser = pickFirstDefined(
    job?.uploaded_by,
    job?.uploadedBy,
    job?.created_by,
    job?.createdBy,
    job?.user,
    job?.owner,
    job?.file?.uploaded_by,
    job?.file?.uploadedBy,
    job?.file?.created_by,
    job?.file?.createdBy,
    job?.file?.user,
  )

  const normalized = normalizeUploadedByUser(rawUser)
  if (normalized) return normalized

  const userId = pickFirstDefined(
    job?.uploaded_by_id,
    job?.uploadedById,
    job?.created_by_id,
    job?.createdById,
    job?.user_id,
    job?.userId,
    job?.file?.uploaded_by_id,
    job?.file?.user_id,
  )
  const userName = pickFirstDefined(
    job?.uploaded_by_name,
    job?.uploadedByName,
    job?.created_by_name,
    job?.user_name,
    job?.userName,
    job?.file?.uploaded_by_name,
    job?.file?.user_name,
  )
  const userEmail = pickFirstDefined(
    job?.uploaded_by_email,
    job?.uploadedByEmail,
    job?.created_by_email,
    job?.user_email,
    job?.userEmail,
    job?.file?.uploaded_by_email,
    job?.file?.user_email,
  )

  if (!userId && !userName && !userEmail) return null

  return {
    id: userId ?? null,
    name: userName ?? userEmail ?? 'Pengguna',
    email: userEmail ?? null,
    role: null,
  }
}

export function mapMiddlewareStatus(job) {
  const rawStatus = job?.status?.toLowerCase?.()
  if (rawStatus && MIDDLEWARE_STATUS_TO_UI[rawStatus]) {
    return MIDDLEWARE_STATUS_TO_UI[rawStatus]
  }

  if (job?.error_message) return 'failed'

  const resultData = job?.result?.result_data
  if (resultData && typeof resultData === 'object' && Object.keys(resultData).length > 0) {
    return 'done'
  }

  if (job?.started_at && !job?.finished_at) return 'processing'
  if (job?.finished_at && !job?.error_message) return 'done'

  return 'queued'
}

export function mapScoringJobToDocument(job) {
  const status = mapMiddlewareStatus(job)
  const fileName = job.file?.original_filename ?? 'Dokumen'

  return {
    id: job.id,
    fileName,
    fileExtension: getFileExtension(fileName),
    fileSize: job.file?.file_size_bytes ?? 0,
    fileId: job.file?.id ?? null,
    mimeType:
      pickFirstDefined(job.file?.mime_type, job.file?.content_type) ?? null,
    status,
    middlewareStatus: job.status ?? null,
    uploadedAt:
      pickFirstDefined(job.file?.uploaded_at, job.uploaded_at, job.created_at) ??
      null,
    createdAt: job.created_at ?? null,
    updatedAt: job.updated_at ?? null,
    uploadedBy: normalizeUploadedBy(job),
    workerId: job.engine_job_id ?? null,
    processingStartedAt: job.started_at ?? null,
    completedAt: status === 'done' ? job.finished_at ?? null : null,
    failedAt: status === 'failed' ? job.finished_at ?? null : null,
    failureReason: job.error_message ?? null,
    progressPercent: job.progress_percent ?? null,
    currentTaskType: job.current_task_type ?? null,
    documentRoute: job.document_route ?? null,
  }
}

function normalizeDetailRow(row) {
  if (!row || typeof row !== 'object') return row

  return {
    aspek: row.aspek,
    komponen: row.komponen,
    nilaiRasio: pickFirstDefined(row.nilaiRasio, row.nilai_rasio, 0),
    nilai: row.nilai ?? 0,
    bobot: row.bobot ?? 0,
    skor: row.skor ?? 0,
    persentaseMaks: pickFirstDefined(row.persentaseMaks, row.persentase_maks, 0),
    status: row.status,
  }
}

function normalizeTidakDapatDihitung(data) {
  if (!data || typeof data !== 'object') return null

  return {
    aspek: data.aspek,
    bobot: data.bobot ?? 0,
    skor: data.skor ?? 0,
    flag: data.flag ?? '',
    catatan: data.catatan ?? '',
    komponen: data.komponen ?? [],
  }
}

export function mapResultDataToUiResults(resultData) {
  if (!resultData || typeof resultData !== 'object') {
    throw new Error('Hasil penilaian belum tersedia untuk dokumen ini.')
  }

  return {
    totalSkorParsial: pickFirstDefined(
      resultData.totalSkorParsial,
      resultData.total_skor_parsial,
      0,
    ),
    persentaseParsial: pickFirstDefined(
      resultData.persentaseParsial,
      resultData.persentase_parsial,
      0,
    ),
    bobotDapatDihitung: pickFirstDefined(
      resultData.bobotDapatDihitung,
      resultData.bobot_dapat_dihitung,
      85,
    ),
    predikat: resultData.predikat ?? '',
    tidakDapatDihitung: normalizeTidakDapatDihitung(
      resultData.tidakDapatDihitung ?? resultData.tidak_dapat_dihitung,
    ),
    detail: (resultData.detail ?? []).map(normalizeDetailRow),
  }
}

export function mapScoringJobToDocumentResult(job) {
  const document = mapScoringJobToDocument(job)
  const uiStatus = mapMiddlewareStatus(job)

  if (uiStatus !== 'done') {
    throw new Error('Hasil penilaian belum tersedia untuk dokumen ini.')
  }

  return {
    document,
    results: mapResultDataToUiResults(job.result?.result_data),
  }
}

function isVisibleDocument(doc) {
  return doc.status !== 'canceled' && doc.middlewareStatus !== 'canceled'
}

export function filterDocumentsByStatus(documents, status) {
  const visibleDocuments = documents.filter(isVisibleDocument)

  if (status === 'queue') {
    return visibleDocuments.filter(
      (doc) => doc.status === 'queued' || doc.status === 'processing',
    )
  }

  if (status === 'done') {
    return visibleDocuments.filter((doc) => doc.status === 'done')
  }

  if (status === 'failed') {
    return visibleDocuments.filter((doc) => doc.status === 'failed')
  }

  if (status === 'processed') {
    return visibleDocuments.filter(
      (doc) => doc.status === 'done' || doc.status === 'failed',
    )
  }

  return visibleDocuments
}