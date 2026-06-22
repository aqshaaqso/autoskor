import { createElement as h } from 'react'

function getDocumentStatusLabel(status) {
  switch (status) {
    case 'queued':
      return 'Menunggu'
    case 'processing':
      return 'Sedang Diproses'
    case 'done':
      return 'Selesai'
    case 'failed':
      return 'Gagal'
    default:
      return status
  }
}

function getDocumentStatusClasses(status) {
  switch (status) {
    case 'queued':
      return 'bg-warning-100 text-warning-700 border-warning-500/30'
    case 'processing':
      return 'bg-primary-100 text-primary-700 border-primary-500/30'
    case 'done':
      return 'bg-success-100 text-success-700 border-success-500/30'
    case 'failed':
      return 'bg-danger-100 text-danger-700 border-danger-500/30'
    default:
      return 'bg-slate-100 text-slate-600 border-slate-300'
  }
}

export function DocumentStatusBadge({ status }) {
  return h(
    'span',
    {
      className: `inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getDocumentStatusClasses(status)}`,
    },
    getDocumentStatusLabel(status),
  )
}