const mockTidakDapatDihitung = {
  aspek: 'Manajemen',
  bobot: 15,
  skor: 0,
  flag: 'Tidak Dapat Dihitung - Data Manajemen Tidak Tersedia',
  catatan:
    'Penilaian aspek manajemen memerlukan data non-keuangan yang tidak ditemukan dalam dokumen.',
  komponen: [
    { nama: 'Manajemen Umum', jumlahPertanyaan: 12 },
    { nama: 'Kelembagaan', jumlahPertanyaan: 6 },
    { nama: 'Manajemen Permodalan', jumlahPertanyaan: 5 },
    { nama: 'Manajemen Aktiva', jumlahPertanyaan: 10 },
    { nama: 'Manajemen Likuiditas', jumlahPertanyaan: 5 },
  ],
}

export const mockHasilPenilaian = {
  totalSkorParsial: 64.35,
  persentaseParsial: 75.7,
  bobotDapatDihitung: 85,
  predikat: 'CUKUP SEHAT',
  tidakDapatDihitung: mockTidakDapatDihitung,
  detail: [
    {
      aspek: 'Permodalan',
      komponen: 'Rasio Modal Sendiri terhadap Total Asset',
      nilaiRasio: 45.67,
      nilai: 50,
      bobot: 6,
      skor: 3.0,
      persentaseMaks: 50,
      status: 'Kuning',
    },
    {
      aspek: 'Permodalan',
      komponen: 'Rasio Modal Sendiri terhadap Pinjaman Berisiko',
      nilaiRasio: 38.2,
      nilai: 40,
      bobot: 6,
      skor: 2.4,
      persentaseMaks: 40,
      status: 'Merah',
    },
    {
      aspek: 'Permodalan',
      komponen: 'Rasio Kecukupan Modal Sendiri',
      nilaiRasio: 12.5,
      nilai: 80,
      bobot: 3,
      skor: 2.4,
      persentaseMaks: 80,
      status: 'Kuning',
    },
    {
      aspek: 'Kualitas Aktiva Produktif',
      komponen: 'Rasio Volume Pinjaman pada Anggota',
      nilaiRasio: 82.3,
      nilai: 100,
      bobot: 10,
      skor: 10.0,
      persentaseMaks: 100,
      status: 'Hijau',
    },
    {
      aspek: 'Kualitas Aktiva Produktif',
      komponen: 'Rasio Kualitas Aktiva Produktif',
      nilaiRasio: 4.2,
      nilai: 90,
      bobot: 5,
      skor: 4.5,
      persentaseMaks: 90,
      status: 'Hijau',
    },
    {
      aspek: 'Kualitas Aktiva Produktif',
      komponen: 'Rasio Aktiva Produktif Bermasalah',
      nilaiRasio: 3.1,
      nilai: 85,
      bobot: 5,
      skor: 4.25,
      persentaseMaks: 85,
      status: 'Hijau',
    },
    {
      aspek: 'Kualitas Aktiva Produktif',
      komponen: 'Rasio Cadangan Kerugian Pinjaman',
      nilaiRasio: 125.0,
      nilai: 100,
      bobot: 5,
      skor: 5.0,
      persentaseMaks: 100,
      status: 'Hijau',
    },
    {
      aspek: 'Efisiensi',
      komponen: 'Rasio Efisiensi Operasional',
      nilaiRasio: 68.5,
      nilai: 70,
      bobot: 4,
      skor: 2.8,
      persentaseMaks: 70,
      status: 'Kuning',
    },
    {
      aspek: 'Efisiensi',
      komponen: 'Rasio Efisiensi Pembiayaan',
      nilaiRasio: 55.2,
      nilai: 60,
      bobot: 3,
      skor: 1.8,
      persentaseMaks: 60,
      status: 'Kuning',
    },
    {
      aspek: 'Efisiensi',
      komponen: 'Rasio Efisiensi Total',
      nilaiRasio: 72.0,
      nilai: 75,
      bobot: 3,
      skor: 2.25,
      persentaseMaks: 75,
      status: 'Kuning',
    },
    {
      aspek: 'Likuiditas',
      komponen: 'Rasio Kas terhadap Kewajiban Jangka Pendek',
      nilaiRasio: 18.5,
      nilai: 90,
      bobot: 8,
      skor: 7.2,
      persentaseMaks: 90,
      status: 'Hijau',
    },
    {
      aspek: 'Likuiditas',
      komponen: 'Rasio Likuiditas',
      nilaiRasio: 22.3,
      nilai: 85,
      bobot: 7,
      skor: 5.95,
      persentaseMaks: 85,
      status: 'Hijau',
    },
    {
      aspek: 'Kemandirian dan Pertumbuhan',
      komponen: 'Rasio Pertumbuhan Anggota',
      nilaiRasio: 5.2,
      nilai: 70,
      bobot: 4,
      skor: 2.8,
      persentaseMaks: 70,
      status: 'Kuning',
    },
    {
      aspek: 'Kemandirian dan Pertumbuhan',
      komponen: 'Rasio Pertumbuhan Volume Pinjaman',
      nilaiRasio: 8.7,
      nilai: 80,
      bobot: 3,
      skor: 2.4,
      persentaseMaks: 80,
      status: 'Kuning',
    },
    {
      aspek: 'Kemandirian dan Pertumbuhan',
      komponen: 'Rasio Kemandirian Pembiayaan',
      nilaiRasio: 91.5,
      nilai: 95,
      bobot: 3,
      skor: 2.85,
      persentaseMaks: 95,
      status: 'Hijau',
    },
    {
      aspek: 'Jatidiri Koperasi',
      komponen: 'Rasio Partisipasi Modal Anggota',
      nilaiRasio: 42.0,
      nilai: 50,
      bobot: 5,
      skor: 2.5,
      persentaseMaks: 50,
      status: 'Kuning',
    },
    {
      aspek: 'Jatidiri Koperasi',
      komponen: 'Rasio Kepesertaan Anggota',
      nilaiRasio: 35.8,
      nilai: 45,
      bobot: 5,
      skor: 2.25,
      persentaseMaks: 45,
      status: 'Merah',
    },
  ],
}

let mockDocuments = []
let mockNextId = 1

export const MOCK_PROCESSING_MS = 5000
export const MOCK_WORKER_COUNT = 3

const MOCK_WORKERS = [
  { id: 'worker-1', name: 'Worker 1' },
  { id: 'worker-2', name: 'Worker 2' },
  { id: 'worker-3', name: 'Worker 3' },
]

const workerRuntime = new Map(
  MOCK_WORKERS.map((worker) => [
    worker.id,
    { busy: false, currentDocumentId: null },
  ]),
)

export function getMockDocuments() {
  return mockDocuments
}

export function isMockEngineRunning() {
  return [...workerRuntime.values()].some((state) => state.busy)
}

export function getMockWorkerSnapshots() {
  return MOCK_WORKERS.map((worker) => {
    const runtime = workerRuntime.get(worker.id)
    const document = runtime.currentDocumentId
      ? mockDocuments.find((doc) => doc.id === runtime.currentDocumentId)
      : null

    return {
      id: worker.id,
      name: worker.name,
      status: runtime.busy ? 'running' : 'idle',
      currentDocument: document
        ? {
            id: document.id,
            fileName: document.fileName,
            startedAt: document.processingStartedAt ?? null,
          }
        : null,
    }
  })
}

function getNextQueuedDocument() {
  const queued = mockDocuments
    .filter((doc) => doc.status === 'queued')
    .sort((a, b) => {
      const idA = Number.parseInt(a.id.replace('doc-', ''), 10)
      const idB = Number.parseInt(b.id.replace('doc-', ''), 10)
      return idA - idB
    })

  return queued[0] ?? null
}

function claimNextQueuedDocument(workerId) {
  const next = getNextQueuedDocument()
  if (!next) return null

  next.status = 'processing'
  next.workerId = workerId
  next.processingStartedAt = new Date().toISOString()
  return next
}

async function runWorker(workerId) {
  const runtime = workerRuntime.get(workerId)
  if (!runtime || runtime.busy) return

  runtime.busy = true

  try {
    let document = claimNextQueuedDocument(workerId)

    while (document) {
      runtime.currentDocumentId = document.id
      await new Promise((resolve) => setTimeout(resolve, MOCK_PROCESSING_MS))
      document.status = 'done'
      document.completedAt = new Date().toISOString()
      document.workerId = null
      runtime.currentDocumentId = null
      document = claimNextQueuedDocument(workerId)
    }
  } finally {
    runtime.busy = false
    runtime.currentDocumentId = null
    kickMockEngine()
  }
}

function kickMockEngine() {
  for (const worker of MOCK_WORKERS) {
    const runtime = workerRuntime.get(worker.id)
    if (!runtime.busy && getNextQueuedDocument()) {
      void runWorker(worker.id)
    }
  }
}

function sortQueueDocuments(documents) {
  const rank = { processing: 0, queued: 1 }

  return [...documents].sort((a, b) => {
    const rankDiff = (rank[a.status] ?? 2) - (rank[b.status] ?? 2)
    if (rankDiff !== 0) return rankDiff

    const idA = Number.parseInt(a.id.replace('doc-', ''), 10)
    const idB = Number.parseInt(b.id.replace('doc-', ''), 10)
    return idA - idB
  })
}

export function filterQueueDocuments(documents) {
  const queue = documents.filter(
    (doc) => doc.status === 'queued' || doc.status === 'processing',
  )
  return sortQueueDocuments(queue)
}

async function simulateUploadProgress(onProgress) {
  const steps = [10, 25, 45, 65, 85, 100]
  for (const progress of steps) {
    onProgress?.(progress)
    await new Promise((resolve) => setTimeout(resolve, 180))
  }
}

function createMockDocument(file) {
  const doc = {
    id: `doc-${mockNextId++}`,
    fileName: file.name,
    fileSize: file.size,
    status: 'queued',
    uploadedAt: new Date().toISOString(),
  }
  mockDocuments.push(doc)
  return doc
}

export async function mockUploadDocument(file, onProgress) {
  await simulateUploadProgress(onProgress)
  const document = createMockDocument(file)
  kickMockEngine()
  return { documents: [document], message: 'Dokumen berhasil diupload' }
}

export async function mockGetDocuments(status) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  if (status === 'queue') {
    return filterQueueDocuments(mockDocuments)
  }

  if (status === 'done') {
    return mockDocuments.filter((doc) => doc.status === 'done')
  }

  return mockDocuments
}

export async function mockGetDocumentResults(id) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const doc = mockDocuments.find((item) => item.id === id)
  if (!doc || doc.status !== 'done') {
    throw new Error('Hasil penilaian belum tersedia untuk dokumen ini.')
  }
  return {
    document: doc,
    results: { ...mockHasilPenilaian },
  }
}