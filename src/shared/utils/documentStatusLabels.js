/**
 * Label tampilan status dokumen (Bahasa Indonesia).
 * Mapping API ↔ kode internal: `shared/api/middlewareContract.js`
 */

export const UI_DOCUMENT_STATUS_LABELS = {
  queued: "queued",
  processing: "processing",
  done: "done",
  failed: "failed",
  canceled: "canceled",
};

export const MIDDLEWARE_STATUS_LABELS = {
  uploading: "uploading",
  uploaded: "uploaded",
  waiting: "waiting",
  running: "running",
  completed_success: "completed_success",
  failed: "failed",
  canceled: "canceled",
};

export function getUiDocumentStatusLabel(status) {
  return UI_DOCUMENT_STATUS_LABELS[status] ?? status;
}

export function getMiddlewareStatusLabel(status) {
  return MIDDLEWARE_STATUS_LABELS[status] ?? status;
}

export function getUiDocumentStatusBadgeClasses(status) {
  switch (status) {
    case "queued":
      return "bg-warning-100 text-warning-700 border-warning-500/30";
    case "processing":
      return "bg-primary-100 text-primary-700 border-primary-500/30";
    case "done":
      return "bg-success-100 text-success-700 border-success-500/30";
    case "failed":
      return "bg-danger-100 text-danger-700 border-danger-500/30";
    case "canceled":
      return "bg-slate-100 text-slate-600 border-slate-300";
    default:
      return "bg-slate-100 text-slate-600 border-slate-300";
  }
}
