import { getStoredToken } from "../client";
import {
  findMockUserById,
  getMockUserIdFromToken,
  mockUsers,
  toPublicUser,
} from "./authMock";
import { logActivity } from "./activityMock";

const mockTidakDapatDihitung = {
  aspek: "Manajemen",
  bobot: 15,
  skor: 0,
  flag: "Tidak Dapat Dihitung - Data Manajemen Tidak Tersedia",
  catatan:
    "Penilaian aspek manajemen memerlukan data non-keuangan yang tidak ditemukan dalam dokumen.",
  komponen: [
    { nama: "Manajemen Umum", jumlahPertanyaan: 12 },
    { nama: "Kelembagaan", jumlahPertanyaan: 6 },
    { nama: "Manajemen Permodalan", jumlahPertanyaan: 5 },
    { nama: "Manajemen Aktiva", jumlahPertanyaan: 10 },
    { nama: "Manajemen Likuiditas", jumlahPertanyaan: 5 },
  ],
};

export const mockHasilPenilaian = {
  totalSkorParsial: 64.35,
  persentaseParsial: 75.7,
  bobotDapatDihitung: 85,
  predikat: "CUKUP SEHAT",
  tidakDapatDihitung: mockTidakDapatDihitung,
  detail: [
    {
      aspek: "Permodalan",
      komponen: "Rasio Modal Sendiri terhadap Total Asset",
      nilaiRasio: 45.67,
      nilai: 50,
      bobot: 6,
      skor: 3.0,
      persentaseMaks: 50,
      status: "Kuning",
    },
    {
      aspek: "Permodalan",
      komponen: "Rasio Modal Sendiri terhadap Pinjaman Berisiko",
      nilaiRasio: 38.2,
      nilai: 40,
      bobot: 6,
      skor: 2.4,
      persentaseMaks: 40,
      status: "Merah",
    },
    {
      aspek: "Permodalan",
      komponen: "Rasio Kecukupan Modal Sendiri",
      nilaiRasio: 12.5,
      nilai: 80,
      bobot: 3,
      skor: 2.4,
      persentaseMaks: 80,
      status: "Kuning",
    },
    {
      aspek: "Kualitas Aktiva Produktif",
      komponen: "Rasio Volume Pinjaman pada Anggota",
      nilaiRasio: 82.3,
      nilai: 100,
      bobot: 10,
      skor: 10.0,
      persentaseMaks: 100,
      status: "Hijau",
    },
    {
      aspek: "Kualitas Aktiva Produktif",
      komponen: "Rasio Kualitas Aktiva Produktif",
      nilaiRasio: 4.2,
      nilai: 90,
      bobot: 5,
      skor: 4.5,
      persentaseMaks: 90,
      status: "Hijau",
    },
    {
      aspek: "Kualitas Aktiva Produktif",
      komponen: "Rasio Aktiva Produktif Bermasalah",
      nilaiRasio: 3.1,
      nilai: 85,
      bobot: 5,
      skor: 4.25,
      persentaseMaks: 85,
      status: "Hijau",
    },
    {
      aspek: "Kualitas Aktiva Produktif",
      komponen: "Rasio Cadangan Kerugian Pinjaman",
      nilaiRasio: 125.0,
      nilai: 100,
      bobot: 5,
      skor: 5.0,
      persentaseMaks: 100,
      status: "Hijau",
    },
    {
      aspek: "Efisiensi",
      komponen: "Rasio Efisiensi Operasional",
      nilaiRasio: 68.5,
      nilai: 70,
      bobot: 4,
      skor: 2.8,
      persentaseMaks: 70,
      status: "Kuning",
    },
    {
      aspek: "Efisiensi",
      komponen: "Rasio Efisiensi Pembiayaan",
      nilaiRasio: 55.2,
      nilai: 60,
      bobot: 3,
      skor: 1.8,
      persentaseMaks: 60,
      status: "Kuning",
    },
    {
      aspek: "Efisiensi",
      komponen: "Rasio Efisiensi Total",
      nilaiRasio: 72.0,
      nilai: 75,
      bobot: 3,
      skor: 2.25,
      persentaseMaks: 75,
      status: "Kuning",
    },
    {
      aspek: "Likuiditas",
      komponen: "Rasio Kas terhadap Kewajiban Jangka Pendek",
      nilaiRasio: 18.5,
      nilai: 90,
      bobot: 8,
      skor: 7.2,
      persentaseMaks: 90,
      status: "Hijau",
    },
    {
      aspek: "Likuiditas",
      komponen: "Rasio Likuiditas",
      nilaiRasio: 22.3,
      nilai: 85,
      bobot: 7,
      skor: 5.95,
      persentaseMaks: 85,
      status: "Hijau",
    },
    {
      aspek: "Kemandirian dan Pertumbuhan",
      komponen: "Rasio Pertumbuhan Anggota",
      nilaiRasio: 5.2,
      nilai: 70,
      bobot: 4,
      skor: 2.8,
      persentaseMaks: 70,
      status: "Kuning",
    },
    {
      aspek: "Kemandirian dan Pertumbuhan",
      komponen: "Rasio Pertumbuhan Volume Pinjaman",
      nilaiRasio: 8.7,
      nilai: 80,
      bobot: 3,
      skor: 2.4,
      persentaseMaks: 80,
      status: "Kuning",
    },
    {
      aspek: "Kemandirian dan Pertumbuhan",
      komponen: "Rasio Kemandirian Pembiayaan",
      nilaiRasio: 91.5,
      nilai: 95,
      bobot: 3,
      skor: 2.85,
      persentaseMaks: 95,
      status: "Hijau",
    },
    {
      aspek: "Jatidiri Koperasi",
      komponen: "Rasio Partisipasi Modal Anggota",
      nilaiRasio: 42.0,
      nilai: 50,
      bobot: 5,
      skor: 2.5,
      persentaseMaks: 50,
      status: "Kuning",
    },
    {
      aspek: "Jatidiri Koperasi",
      komponen: "Rasio Kepesertaan Anggota",
      nilaiRasio: 35.8,
      nilai: 45,
      bobot: 5,
      skor: 2.25,
      persentaseMaks: 45,
      status: "Merah",
    },
  ],
};

let mockDocuments = [];
let mockNextId = 1;
const mockDocumentFiles = new Map();
const mockDocumentResults = new Map();
let mockProcessedSeeded = false;

function hoursAgo(hours) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function buildMockUploader(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function buildMockResults(overrides = {}) {
  return {
    ...mockHasilPenilaian,
    tidakDapatDihitung: { ...mockTidakDapatDihitung },
    detail: mockHasilPenilaian.detail.map((row) => ({ ...row })),
    ...overrides,
  };
}

export const MOCK_PROCESSING_MS = 5000;
export const MOCK_WORKER_COUNT = 3;
export const MOCK_FAIL_FILENAME_KEYWORD = "fail";

const MOCK_WORKERS = [
  { id: "worker-1", name: "Worker 1" },
  { id: "worker-2", name: "Worker 2" },
  { id: "worker-3", name: "Worker 3" },
];

const workerRuntime = new Map(
  MOCK_WORKERS.map((worker) => [
    worker.id,
    { busy: false, currentDocumentId: null },
  ]),
);

export function getMockDocuments() {
  return mockDocuments;
}

export function isMockEngineRunning() {
  return [...workerRuntime.values()].some((state) => state.busy);
}

export function getMockWorkerSnapshots() {
  return MOCK_WORKERS.map((worker) => {
    const runtime = workerRuntime.get(worker.id);
    const document = runtime.currentDocumentId
      ? mockDocuments.find((doc) => doc.id === runtime.currentDocumentId)
      : null;

    return {
      id: worker.id,
      name: worker.name,
      status: runtime.busy ? "running" : "idle",
      currentDocument: document
        ? {
            id: document.id,
            fileName: document.fileName,
            startedAt: document.processingStartedAt ?? null,
          }
        : null,
    };
  });
}

function getNextQueuedDocument() {
  const queued = mockDocuments
    .filter((doc) => doc.status === "queued")
    .sort((a, b) => {
      const idA = Number.parseInt(a.id.replace("doc-", ""), 10);
      const idB = Number.parseInt(b.id.replace("doc-", ""), 10);
      return idA - idB;
    });

  return queued[0] ?? null;
}

function claimNextQueuedDocument(workerId) {
  const next = getNextQueuedDocument();
  if (!next) return null;

  const startedAt = new Date().toISOString();
  next.status = "processing";
  next.middlewareStatus = "running";
  next.workerId = workerId;
  next.processingStartedAt = startedAt;
  next.updatedAt = startedAt;
  next.progressPercent = 10;
  next.currentTaskType = "scoring";
  return next;
}

function shouldMockProcessingFail(document) {
  return document.fileName.toLowerCase().includes(MOCK_FAIL_FILENAME_KEYWORD);
}

function markDocumentFailed(document, workerId) {
  const failedAt = new Date().toISOString();
  document.status = "failed";
  document.middlewareStatus = "failed";
  document.failedAt = failedAt;
  document.updatedAt = failedAt;
  document.progressPercent = null;
  document.currentTaskType = null;
  document.failureReason =
    "Worker gagal memproses dokumen. Periksa format atau coba upload ulang.";
  document.workerId = workerId;

  const uploader = document.uploadedBy;
  if (uploader) {
    logActivity({
      type: "processing_failed",
      userId: uploader.id,
      userName: uploader.name,
      userEmail: uploader.email,
      userRole: uploader.role,
      documentId: document.id,
      fileName: document.fileName,
      workerId,
      description: `Worker ${workerId} gagal memproses "${document.fileName}"`,
    });
  }
}

function markDocumentDone(document) {
  const completedAt = new Date().toISOString();
  document.status = "done";
  document.middlewareStatus = "completed_success";
  document.completedAt = completedAt;
  document.updatedAt = completedAt;
  document.progressPercent = 100;
  document.currentTaskType = null;
  document.workerId = null;
  document.failureReason = null;
}

async function runWorker(workerId) {
  const runtime = workerRuntime.get(workerId);
  if (!runtime || runtime.busy) return;

  runtime.busy = true;

  try {
    let document = claimNextQueuedDocument(workerId);

    while (document) {
      runtime.currentDocumentId = document.id;
      await new Promise((resolve) => setTimeout(resolve, MOCK_PROCESSING_MS));

      if (shouldMockProcessingFail(document)) {
        markDocumentFailed(document, workerId);
      } else {
        markDocumentDone(document);
      }

      runtime.currentDocumentId = null;
      document = claimNextQueuedDocument(workerId);
    }
  } finally {
    runtime.busy = false;
    runtime.currentDocumentId = null;
    kickMockEngine();
  }
}

function kickMockEngine() {
  for (const worker of MOCK_WORKERS) {
    const runtime = workerRuntime.get(worker.id);
    if (!runtime.busy && getNextQueuedDocument()) {
      void runWorker(worker.id);
    }
  }
}

function sortQueueDocuments(documents) {
  const rank = { processing: 0, queued: 1 };

  return [...documents].sort((a, b) => {
    const rankDiff = (rank[a.status] ?? 2) - (rank[b.status] ?? 2);
    if (rankDiff !== 0) return rankDiff;

    const idA = Number.parseInt(a.id.replace("doc-", ""), 10);
    const idB = Number.parseInt(b.id.replace("doc-", ""), 10);
    return idA - idB;
  });
}

export function filterQueueDocuments(documents) {
  const queue = documents.filter(
    (doc) => doc.status === "queued" || doc.status === "processing",
  );
  return sortQueueDocuments(queue);
}

export function filterFailedDocuments(documents) {
  return [...documents]
    .filter((doc) => doc.status === "failed")
    .sort(
      (a, b) =>
        new Date(b.failedAt ?? b.uploadedAt).getTime() -
        new Date(a.failedAt ?? a.uploadedAt).getTime(),
    );
}

function getProcessedTimestamp(document) {
  return new Date(
    document.completedAt ?? document.failedAt ?? document.uploadedAt,
  ).getTime();
}

export function filterProcessedDocuments(documents) {
  return [...documents]
    .filter((doc) => doc.status === "done" || doc.status === "failed")
    .sort((a, b) => getProcessedTimestamp(b) - getProcessedTimestamp(a));
}

async function simulateUploadProgress(onProgress) {
  const steps = [10, 25, 45, 65, 85, 100];
  for (const progress of steps) {
    onProgress?.(progress);
    await new Promise((resolve) => setTimeout(resolve, 180));
  }
}

function getCurrentMockUser() {
  const token = getStoredToken();
  const userId = getMockUserIdFromToken(token);
  const user = userId ? findMockUserById(userId) : null;
  return user ? toPublicUser(user) : null;
}

function toUploadedBySnapshot(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function getFileExtension(fileName) {
  const dotIndex = fileName.lastIndexOf(".");
  if (dotIndex <= 0) return null;
  return fileName.slice(dotIndex + 1).toLowerCase();
}

function enrichMockDocument(doc, file) {
  const uploadedAt = doc.uploadedAt ?? new Date().toISOString();

  return {
    ...doc,
    fileExtension: getFileExtension(doc.fileName),
    fileId: doc.fileId ?? `file-${doc.id}`,
    mimeType: file?.type || null,
    middlewareStatus: doc.middlewareStatus ?? "waiting",
    createdAt: doc.createdAt ?? uploadedAt,
    updatedAt: doc.updatedAt ?? uploadedAt,
    processingStartedAt: doc.processingStartedAt ?? null,
    completedAt: doc.completedAt ?? null,
    failedAt: doc.failedAt ?? null,
    failureReason: doc.failureReason ?? null,
    progressPercent: doc.progressPercent ?? null,
    currentTaskType: doc.currentTaskType ?? null,
    documentRoute: doc.documentRoute ?? "mock",
    workerId: doc.workerId ?? null,
  };
}

function createMockDocument(file, uploadedBy) {
  const uploadedAt = new Date().toISOString();
  const doc = enrichMockDocument(
    {
      id: `doc-${mockNextId++}`,
      fileName: file.name,
      fileSize: file.size,
      status: "queued",
      uploadedAt,
      uploadedBy,
    },
    file,
  );
  mockDocuments.push(doc);
  mockDocumentFiles.set(doc.id, file);
  return doc;
}

function createSeedProcessedDocument({
  id,
  fileName,
  fileSize,
  mimeType,
  status,
  uploadedAt,
  processingStartedAt,
  completedAt,
  failedAt,
  uploadedBy,
  workerId = null,
  failureReason = null,
  middlewareStatus,
  results = null,
}) {
  const doc = enrichMockDocument(
    {
      id,
      fileName,
      fileSize,
      status,
      uploadedAt,
      createdAt: uploadedAt,
      updatedAt: completedAt ?? failedAt ?? uploadedAt,
      uploadedBy,
      workerId,
      processingStartedAt: processingStartedAt ?? null,
      completedAt: completedAt ?? null,
      failedAt: failedAt ?? null,
      failureReason,
      middlewareStatus,
      progressPercent: status === "done" ? 100 : null,
      currentTaskType: null,
      documentRoute: "mock-seed",
    },
    { type: mimeType },
  );

  mockDocuments.push(doc);

  if (results) {
    mockDocumentResults.set(id, buildMockResults(results));
  }
}

function seedMockProcessedDocuments() {
  if (mockProcessedSeeded) return;
  mockProcessedSeeded = true;

  const admin = buildMockUploader(mockUsers[0]);
  const operator = buildMockUploader(mockUsers[1]);

  createSeedProcessedDocument({
    id: "doc-seed-1",
    fileName: "RAT Koperasi Sejahtera 2024.pdf",
    fileSize: 2_458_880,
    mimeType: "application/pdf",
    status: "done",
    uploadedAt: hoursAgo(8),
    processingStartedAt: hoursAgo(7.8),
    completedAt: hoursAgo(7.5),
    uploadedBy: admin,
    workerId: "worker-1",
    middlewareStatus: "completed_success",
    results: {
      totalSkorParsial: 64.35,
      persentaseParsial: 75.7,
      predikat: "CUKUP SEHAT",
    },
  });

  createSeedProcessedDocument({
    id: "doc-seed-2",
    fileName: "Laporan Keuangan USP 2023.pdf",
    fileSize: 1_843_200,
    mimeType: "application/pdf",
    status: "done",
    uploadedAt: hoursAgo(5),
    processingStartedAt: hoursAgo(4.8),
    completedAt: hoursAgo(4.5),
    uploadedBy: operator,
    workerId: "worker-2",
    middlewareStatus: "completed_success",
    results: {
      totalSkorParsial: 78.9,
      persentaseParsial: 92.8,
      predikat: "SEHAT",
    },
  });

  createSeedProcessedDocument({
    id: "doc-seed-3",
    fileName: "Laporan Audit Internal.pdf",
    fileSize: 1_245_760,
    mimeType: "application/pdf",
    status: "failed",
    uploadedAt: hoursAgo(3),
    processingStartedAt: hoursAgo(2.8),
    failedAt: hoursAgo(2.5),
    uploadedBy: admin,
    workerId: "worker-3",
    middlewareStatus: "failed",
    failureReason:
      "Worker gagal memproses dokumen. Format tidak dikenali atau file rusak.",
  });
}

export async function mockUploadDocument(file, onProgress) {
  await simulateUploadProgress(onProgress);
  const uploader = getCurrentMockUser();
  const uploadedBy = toUploadedBySnapshot(uploader);
  const document = createMockDocument(file, uploadedBy);

  if (uploader) {
    logActivity({
      type: "upload",
      userId: uploader.id,
      userName: uploader.name,
      userEmail: uploader.email,
      userRole: uploader.role,
      documentId: document.id,
      fileName: document.fileName,
      description: `${uploader.name} mengupload "${document.fileName}"`,
    });
  }

  kickMockEngine();
  return { documents: [document], message: "Dokumen berhasil diupload" };
}

export async function mockGetDocuments(status) {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (status === "queue") {
    return filterQueueDocuments(mockDocuments);
  }

  if (status === "done") {
    return mockDocuments.filter((doc) => doc.status === "done");
  }

  if (status === "failed") {
    return filterFailedDocuments(mockDocuments);
  }

  if (status === "processed") {
    return filterProcessedDocuments(mockDocuments);
  }

  return mockDocuments;
}

function releaseWorkerDocument(documentId) {
  for (const runtime of workerRuntime.values()) {
    if (runtime.currentDocumentId === documentId) {
      runtime.currentDocumentId = null;
    }
  }
}

export async function mockCancelDocument(id) {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const index = mockDocuments.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error("Dokumen tidak ditemukan.");
  }

  const doc = mockDocuments[index];
  if (doc.status !== "queued" && doc.status !== "processing") {
    throw new Error("Hanya dokumen dalam antrian yang dapat dihapus.");
  }

  releaseWorkerDocument(id);
  mockDocuments.splice(index, 1);
  mockDocumentFiles.delete(id);
  kickMockEngine();

  return { message: "Dokumen dihapus dari antrian." };
}

function resetMockWorkerRuntime() {
  for (const runtime of workerRuntime.values()) {
    runtime.busy = false;
    runtime.currentDocumentId = null;
  }
}

export async function mockClearAllDocuments() {
  await new Promise((resolve) => setTimeout(resolve, 300));

  mockDocuments.length = 0;
  mockDocumentFiles.clear();
  mockDocumentResults.clear();
  mockNextId = 1;
  resetMockWorkerRuntime();

  return { message: "Semua dokumen berhasil dihapus." };
}

export async function mockFetchDocumentFile(id) {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const file = mockDocumentFiles.get(id);
  if (!file) {
    throw new Error(
      "File tidak tersedia untuk preview. Upload ulang dokumen di sesi ini.",
    );
  }

  return file;
}

export async function mockGetDocumentById(id) {
  await new Promise((resolve) => setTimeout(resolve, 250));
  const doc = mockDocuments.find((item) => item.id === id);
  if (!doc) {
    throw new Error("Dokumen tidak ditemukan.");
  }
  return enrichMockDocument(doc);
}

export async function mockGetDocumentResults(id) {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const doc = mockDocuments.find((item) => item.id === id);
  if (!doc || doc.status !== "done") {
    throw new Error("Hasil penilaian belum tersedia untuk dokumen ini.");
  }
  const results = mockDocumentResults.get(id) ?? buildMockResults();

  return {
    document: doc,
    results: { ...results },
  };
}

seedMockProcessedDocuments();
