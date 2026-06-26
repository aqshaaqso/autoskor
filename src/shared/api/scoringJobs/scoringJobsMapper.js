import { MIDDLEWARE_STATUS_TO_UI } from './constants'
import {
  getPredikatFromPersentase,
  getStatusFromPersentase,
} from '@/shared/utils/colorGrading'

const INDIKATOR_META = {
  skor_modal_sendiri_total_asset: {
    aspek: 'Permodalan',
    komponen: 'Rasio Modal Sendiri terhadap Total Asset',
  },
  skor_modal_sendiri_pinjaman_berisiko: {
    aspek: 'Permodalan',
    komponen: 'Rasio Modal Sendiri terhadap Pinjaman Berisiko',
  },
  skor_kecukupan_modal_sendiri: {
    aspek: 'Permodalan',
    komponen: 'Rasio Kecukupan Modal Sendiri',
  },
  skor_volume_pinjaman_anggota: {
    aspek: 'Kualitas Aktiva Produktif',
    komponen: 'Rasio Volume Pinjaman pada Anggota',
  },
  skor_kualitas_aktiva_produktif: {
    aspek: 'Kualitas Aktiva Produktif',
    komponen: 'Rasio Kualitas Aktiva Produktif',
  },
  skor_aktiva_produktif_bermasalah: {
    aspek: 'Kualitas Aktiva Produktif',
    komponen: 'Rasio Aktiva Produktif Bermasalah',
  },
  skor_cadangan_kerugian_pinjaman: {
    aspek: 'Kualitas Aktiva Produktif',
    komponen: 'Rasio Cadangan Kerugian Pinjaman',
  },
  skor_cadangan_risiko: {
    aspek: 'Kualitas Aktiva Produktif',
    komponen: 'Rasio Cadangan Risiko',
  },
  skor_modal: {
    aspek: 'Permodalan',
    komponen: 'Rasio Modal Sendiri terhadap Total Asset',
  },
  skor_pinjaman: {
    aspek: 'Kualitas Aktiva Produktif',
    komponen: 'Rasio Volume Pinjaman pada Anggota',
  },
  skor_kecukupan_modal: {
    aspek: 'Permodalan',
    komponen: 'Rasio Kecukupan Modal Sendiri',
  },
  skor_efisiensi_operasi: {
    aspek: 'Efisiensi',
    komponen: 'Rasio Efisiensi Operasional',
  },
  skor_partisipasi_bruto: {
    aspek: 'Efisiensi',
    komponen: 'Rasio Efisiensi Operasional',
  },
  skor_pinjaman_berisiko: {
    aspek: 'Permodalan',
    komponen: 'Rasio Modal Sendiri terhadap Pinjaman Berisiko',
  },
  skor_rentabilitas_aset: {
    aspek: 'Efisiensi',
    komponen: 'Rasio Rentabilitas Aktiva',
  },
  skor_rentabilitas_modal: {
    aspek: 'Permodalan',
    komponen: 'Rasio Rentabilitas Modal',
  },
  skor_efisiensi_pelayanan: {
    aspek: 'Efisiensi',
    komponen: 'Rasio Efisiensi Pelayanan',
  },
  skor_efisiensi_beban_usaha: {
    aspek: 'Efisiensi',
    komponen: 'Rasio Efisiensi Beban Usaha',
  },
  skor_kemandirian_operasional: {
    aspek: 'Kemandirian dan Pertumbuhan',
    komponen: 'Rasio Kemandirian Operasional',
  },
  skor_modal_pinjaman_berisiko: {
    aspek: 'Permodalan',
    komponen: 'Rasio Modal Sendiri terhadap Pinjaman Berisiko',
  },
  skor_promosi_ekonomi_anggota: {
    aspek: 'Kemandirian dan Pertumbuhan',
    komponen: 'Rasio Promosi Ekonomi Anggota',
  },
  skor_risiko_pinjaman_bermasalah: {
    aspek: 'Kualitas Aktiva Produktif',
    komponen: 'Rasio Aktiva Produktif Bermasalah',
  },
  skor_efisiensi_operasional: {
    aspek: 'Efisiensi',
    komponen: 'Rasio Efisiensi Operasional',
  },
  skor_efisiensi_pembiayaan: {
    aspek: 'Efisiensi',
    komponen: 'Rasio Efisiensi Pembiayaan',
  },
  skor_efisiensi_total: {
    aspek: 'Efisiensi',
    komponen: 'Rasio Efisiensi Total',
  },
  skor_kas: {
    aspek: 'Likuiditas',
    komponen: 'Rasio Kas terhadap Kewajiban Jangka Pendek',
  },
  skor_likuiditas: {
    aspek: 'Likuiditas',
    komponen: 'Rasio Likuiditas',
  },
  skor_pertumbuhan_anggota: {
    aspek: 'Kemandirian dan Pertumbuhan',
    komponen: 'Rasio Pertumbuhan Anggota',
  },
  skor_pertumbuhan_volume_pinjaman: {
    aspek: 'Kemandirian dan Pertumbuhan',
    komponen: 'Rasio Pertumbuhan Volume Pinjaman',
  },
  skor_kemandirian_pembiayaan: {
    aspek: 'Kemandirian dan Pertumbuhan',
    komponen: 'Rasio Kemandirian Pembiayaan',
  },
  skor_partisipasi_modal_anggota: {
    aspek: 'Jatidiri Koperasi',
    komponen: 'Rasio Partisipasi Modal Anggota',
  },
  skor_kepesertaan_anggota: {
    aspek: 'Jatidiri Koperasi',
    komponen: 'Rasio Kepesertaan Anggota',
  },
}

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
    processingStartedAt: job.started_at ?? null,
    completedAt: status === 'done' ? job.finished_at ?? null : null,
    failedAt: status === 'failed' ? job.finished_at ?? null : null,
    failureReason: job.error_message ?? null,
    progressPercent: job.progress_percent ?? null,
    currentTaskType: job.current_task_type ?? null,
    documentRoute: job.document_route ?? null,
  }
}

function normalizeBobot(bobot) {
  const value = Number(bobot ?? 0)
  if (value > 0 && value <= 1) return value * 100
  return value
}

function computePersentaseMaks({ skor, bobot, nilai, persentaseMaks }) {
  if (persentaseMaks !== undefined && persentaseMaks !== null) {
    return persentaseMaks
  }

  const normalizedBobot = normalizeBobot(bobot)
  const numericSkor = Number(skor ?? 0)

  if (normalizedBobot > 0 && Number.isFinite(numericSkor)) {
    return (numericSkor / normalizedBobot) * 100
  }

  return nilai ?? 0
}

function formatIndikatorKey(key) {
  const label = key.replace(/^skor_/, '').replaceAll('_', ' ')
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function getIndikatorMeta(key) {
  const meta = INDIKATOR_META[key]
  if (meta) return meta

  return {
    aspek: 'Penilaian Kesehatan',
    komponen: formatIndikatorKey(key),
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
      nilai,
      persentaseMaks: pickFirstDefined(row.persentaseMaks, row.persentase_maks),
    }),
    status: normalizeRowStatus(row.status, nilai),
  }
}

function mapDetailIndikatorToRows(detailIndikator) {
  if (!detailIndikator || typeof detailIndikator !== 'object') return []

  return Object.entries(detailIndikator).map(([key, value]) => {
    const meta = getIndikatorMeta(key)
    const nilai = value?.nilai ?? 0

    return normalizeDetailRow({
      aspek: meta.aspek,
      komponen: meta.komponen,
      nilaiRasio: value?.rasio ?? 0,
      nilai,
      bobot: value?.bobot ?? 0,
      skor: value?.skor ?? 0,
      persentaseMaks: computePersentaseMaks({
        skor: value?.skor,
        bobot: value?.bobot,
        nilai,
      }),
      status: value?.status,
    })
  })
}

function resolveDetailRows(resultData) {
  const legacyDetail = resultData.detail
  if (Array.isArray(legacyDetail) && legacyDetail.length > 0) {
    return legacyDetail.map(normalizeDetailRow)
  }

  const detailIndikator = pickFirstDefined(
    resultData.detail_indikator,
    resultData.detailIndikator,
  )
  return mapDetailIndikatorToRows(detailIndikator)
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

  const totalSkorParsial = pickFirstDefined(
    resultData.totalSkorParsial,
    resultData.total_skor_parsial,
    resultData.total_skor,
    0,
  )

  let persentaseParsial = pickFirstDefined(
    resultData.persentaseParsial,
    resultData.persentase_parsial,
  )
  if (persentaseParsial === undefined || persentaseParsial === null) {
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
    detail: resolveDetailRows(resultData),
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