import { MIDDLEWARE_STATUS_TO_UI } from './constants'
import {
  getPredikatFromPersentase,
  getStatusFromPersentase,
} from '@/shared/utils/colorGrading'
import { getFileExtension } from '@/shared/utils/file'
import { mapExtractedIndicators } from '@/shared/utils/extractedIndicators'
import {
  resolveDetailIndikatorKey,
  SCORING_DETAIL_INDICATORS,
} from '@/shared/constants/scoringDetailIndicators'
import {
  computePersentaseMaks,
  finalizeDetailRows,
  normalizeBobot,
  sumDetailSkor,
} from '@/shared/utils/resultDetail'

function pickFirstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null)
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

  if (job?.started_at && !job?.finished_at) return 'processing'
  if (job?.error_message) return 'failed'
  if (job?.finished_at) return 'done'

  const resultData = job?.result?.result_data
  if (resultData && typeof resultData === 'object' && Object.keys(resultData).length > 0) {
    return 'done'
  }

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
    processingStartedAt:
      pickFirstDefined(job.started_at, job.startedAt, job.waiting_at, job.waitingAt) ??
      null,
    engineProcessingSeconds: pickFirstDefined(
      job.engine_processing_seconds,
      job.engineProcessingSeconds,
    ) ?? null,
    completedAt: status === 'done' ? job.finished_at ?? null : null,
    failedAt: status === 'failed' ? job.finished_at ?? null : null,
    failureReason: job.error_message ?? null,
    progressPercent: job.progress_percent ?? null,
    currentTaskType: job.current_task_type ?? null,
    documentRoute: job.document_route ?? null,
  }
}

function normalizeRowStatus(status, nilai) {
  if (status === 'Hijau' || status === 'Kuning' || status === 'Merah') {
    return status
  }
  if (status === 'terpenuhi') return getStatusFromPersentase(nilai ?? 0)
  if (status === 'tidak_terpenuhi') return 'Merah'
  return getStatusFromPersentase(nilai ?? 0)
}

function normalizeDetailRow(row) {
  if (!row || typeof row !== 'object') return row

  const nilai = row.nilai ?? 0

  return {
    aspek: row.aspek,
    komponen: row.komponen,
    nilaiRasio: pickFirstDefined(row.nilaiRasio, row.nilai_rasio, row.rasio, 0),
    nilai,
    bobot: normalizeBobot(row.bobot),
    skor: row.skor ?? 0,
    persentaseMaks: computePersentaseMaks({
      skor: row.skor,
      bobot: row.bobot,
      persentaseMaks: pickFirstDefined(row.persentaseMaks, row.persentase_maks),
    }),
    status: normalizeRowStatus(row.status, nilai),
  }
}

function normalizeDetailIndikatorKeys(detailIndikator) {
  const normalized = {}

  for (const [rawKey, value] of Object.entries(detailIndikator)) {
    const key = resolveDetailIndikatorKey(rawKey)
    const existing = normalized[key]

    if (
      !existing ||
      Number(value?.skor ?? 0) > Number(existing?.skor ?? 0)
    ) {
      normalized[key] = value
    }
  }

  return normalized
}

function mapDetailIndikatorToRows(detailIndikator) {
  if (!detailIndikator || typeof detailIndikator !== 'object') return []

  const normalizedDetail = normalizeDetailIndikatorKeys(detailIndikator)

  return SCORING_DETAIL_INDICATORS.map(({ key, aspek, komponen }) => {
    const value = normalizedDetail[key]
    const nilai = value?.nilai ?? 0

    return normalizeDetailRow({
      aspek,
      komponen,
      nilaiRasio: value?.rasio ?? 0,
      nilai,
      bobot: value?.bobot ?? 0,
      skor: value?.skor ?? 0,
      persentaseMaks: computePersentaseMaks({
        skor: value?.skor,
        bobot: value?.bobot,
      }),
      status: value?.status,
    })
  })
}

function resolveDetailRows(resultData) {
  const legacyDetail = resultData.detail
  if (Array.isArray(legacyDetail) && legacyDetail.length > 0) {
    return finalizeDetailRows(legacyDetail.map(normalizeDetailRow))
  }

  const detailIndikator = pickFirstDefined(
    resultData.detail_indikator,
    resultData.detailIndikator,
  )

  return mapDetailIndikatorToRows(detailIndikator)
}

function usesDetailIndikatorSource(resultData) {
  const legacyDetail = resultData.detail
  return !(Array.isArray(legacyDetail) && legacyDetail.length > 0)
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

  const bobotDapatDihitung = pickFirstDefined(
    resultData.bobotDapatDihitung,
    resultData.bobot_dapat_dihitung,
    85,
  )

  const detail = resolveDetailRows(resultData)
  const detailSkorSum = sumDetailSkor(detail)
  const fromDetailIndikator = usesDetailIndikatorSource(resultData)

  const totalSkorParsial = fromDetailIndikator && detail.length > 0
    ? detailSkorSum
    : pickFirstDefined(
        resultData.totalSkorParsial,
        resultData.total_skor_parsial,
        resultData.total_skor,
        detailSkorSum,
        0,
      )

  let persentaseParsial = pickFirstDefined(
    resultData.persentaseParsial,
    resultData.persentase_parsial,
  )
  if (
    (persentaseParsial === undefined || persentaseParsial === null) ||
    fromDetailIndikator
  ) {
    persentaseParsial =
      bobotDapatDihitung > 0 ? (totalSkorParsial / bobotDapatDihitung) * 100 : 0
  }

  const predikat =
    pickFirstDefined(resultData.predikat, resultData.keterangan) ??
    getPredikatFromPersentase(persentaseParsial)

  return {
    totalSkorParsial,
    persentaseParsial,
    bobotDapatDihitung,
    predikat,
    tidakDapatDihitung: normalizeTidakDapatDihitung(
      resultData.tidakDapatDihitung ?? resultData.tidak_dapat_dihitung,
    ),
    extractedIndicators: mapExtractedIndicators(
      pickFirstDefined(resultData.raw_extractions, resultData.rawExtractions),
    ),
    detail,
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

